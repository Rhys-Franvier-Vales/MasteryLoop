import mongoose from "mongoose";
import UserProgress from "../models/UserProgress.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import { asyncHandler, HttpError } from "../utils/helpers.js";
import { loadNodes, loadProgressMap, unlockedIds, pickQuestion } from "../services/questService.js";
import { qualityFromAnswer, sm2, updateMastery } from "../services/sm2Engine.js";
import { xpForAttempt, applyStreak } from "../services/xpService.js";

const { isValidObjectId } = mongoose;

// GET /api/attempts/question/:nodeId  ->  one question for the practice page.
export const getQuestion = asyncHandler(async (req, res) => {
  const { nodeId } = req.params;
  if (!isValidObjectId(nodeId)) throw new HttpError(400, "Invalid topic id.");

  const [nodes, progress] = await Promise.all([loadNodes(), loadProgressMap(req.user._id)]);
  const node = nodes.find((n) => String(n._id) === nodeId);
  if (!node) throw new HttpError(404, "Topic not found.");
  if (!unlockedIds(nodes, progress).has(nodeId)) throw new HttpError(403, "This topic is still locked.");

  const question = await pickQuestion(req.user._id, nodeId);
  if (!question) throw new HttpError(404, "No questions for this topic yet.");

  res.json({ node: { id: node._id, title: node.title, difficulty: node.difficulty }, question });
});

// POST /api/attempts  ->  grade the answer, run SM-2, award XP, update the streak.
export const submitAttempt = asyncHandler(async (req, res) => {
  const { nodeId, questionId, selected, timeMs } = req.body;
  if (!isValidObjectId(nodeId) || !isValidObjectId(questionId)) throw new HttpError(400, "Invalid topic or question id.");
  if (typeof selected !== "string" || !selected) throw new HttpError(400, "Pick an answer first.");

  const [nodes, progressMap] = await Promise.all([loadNodes(), loadProgressMap(req.user._id)]);
  const node = nodes.find((n) => String(n._id) === nodeId);
  if (!node) throw new HttpError(404, "Topic not found.");

  const unlockedBefore = unlockedIds(nodes, progressMap);
  if (!unlockedBefore.has(nodeId)) throw new HttpError(403, "This topic is still locked.");

  const question = await Question.findOne({ _id: questionId, skillNode: nodeId });
  if (!question) throw new HttpError(404, "Question not found for this topic.");

  // 1. Grade
  const correct = selected === question.answer;
  const quality = qualityFromAnswer({ correct, timeMs: typeof timeMs === "number" ? timeMs : undefined });

  // 2. Reschedule this topic with SM-2 and update its mastery
  const progress = progressMap.get(nodeId) || new UserProgress({ user: req.user._id, skillNode: nodeId });
  const next = sm2(progress, quality);
  progress.easeFactor = next.easeFactor;
  progress.repetitions = next.repetitions;
  progress.intervalDays = next.intervalDays;
  progress.nextReviewDate = next.nextReviewDate;
  progress.masteryLevel = updateMastery(progress.masteryLevel, quality);
  progress.lastQuality = quality;
  progress.attempts += 1;
  if (correct) progress.correctCount += 1;
  await progress.save();
  progressMap.set(nodeId, progress);

  // 3. Did this unlock anything new?
  const unlockedAfter = unlockedIds(nodes, progressMap);
  const newlyUnlocked = nodes.filter((n) => unlockedAfter.has(String(n._id)) && !unlockedBefore.has(String(n._id))).map((n) => n.title);

  // 4. XP and streak
  const xpEarned = xpForAttempt({ correct, quality, difficulty: node.difficulty });
  req.user.xp += xpEarned;
  applyStreak(req.user);
  await req.user.save();

  await Attempt.create({
    user: req.user._id,
    skillNode: nodeId,
    question: question._id,
    selected,
    correct,
    quality,
    xpEarned,
    timeMs: typeof timeMs === "number" ? timeMs : null,
  });

  res.json({
    correct,
    correctAnswer: question.answer,
    explanation: question.explanation,
    quality,
    xpEarned,
    masteryLevel: progress.masteryLevel,
    intervalDays: progress.intervalDays,
    nextReviewDate: progress.nextReviewDate,
    newlyUnlocked,
    user: req.user.toPublic(),
  });
});
