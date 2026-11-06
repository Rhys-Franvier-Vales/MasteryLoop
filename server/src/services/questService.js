// Builds the skill tree and the daily review queue from nodes + a user's progress.
import mongoose from "mongoose";
import SkillNode from "../models/SkillNode.js";
import UserProgress from "../models/UserProgress.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import { GAME } from "../config/env.js";
import { xpForAttempt } from "./xpService.js";

const idOf = (x) => String(x);

export async function loadNodes() {
  return SkillNode.find().sort({ order: 1 }).lean();
}

export async function loadProgressMap(userId) {
  const docs = await UserProgress.find({ user: userId });
  return new Map(docs.map((p) => [idOf(p.skillNode), p]));
}

const masteryOf = (progressMap, nodeId) => progressMap.get(idOf(nodeId))?.masteryLevel ?? 0;

// A node is unlocked when every prerequisite has reached the unlock threshold.
export function unlockedIds(nodes, progressMap) {
  const set = new Set();
  for (const n of nodes) {
    const open = n.prerequisites.every((p) => masteryOf(progressMap, p) >= GAME.unlockThreshold);
    if (open) set.add(idOf(n._id));
  }
  return set;
}

export function buildTree(nodes, progressMap, now = new Date()) {
  const titleById = new Map(nodes.map((n) => [idOf(n._id), n.title]));
  const unlocked = unlockedIds(nodes, progressMap);

  return nodes.map((n) => {
    const progress = progressMap.get(idOf(n._id));
    const isUnlocked = unlocked.has(idOf(n._id));
    return {
      id: n._id,
      title: n.title,
      description: n.description,
      difficulty: n.difficulty,
      mastery: progress?.masteryLevel ?? 0,
      unlocked: isUnlocked,
      needs: isUnlocked
        ? []
        : n.prerequisites
            .filter((p) => masteryOf(progressMap, p) < GAME.unlockThreshold)
            .map((p) => titleById.get(idOf(p))),
      attempts: progress?.attempts ?? 0,
      nextReviewDate: progress?.nextReviewDate ?? null,
      due: Boolean(isUnlocked && progress && progress.nextReviewDate <= now),
    };
  });
}

// The "ready to review" list: topics whose review date has arrived (weakest first),
// then unlocked topics the learner has not started yet.
export function buildDueQueue(tree, limit = 10) {
  const toQuest = (n, isNew) => ({
    nodeId: n.id,
    title: n.title,
    difficulty: n.difficulty,
    strength: n.mastery,
    isNew,
    xp: xpForAttempt({ correct: true, quality: 4, difficulty: n.difficulty }),
    nextReviewDate: n.nextReviewDate,
  });

  const due = tree.filter((n) => n.due).sort((a, b) => a.mastery - b.mastery).map((n) => toQuest(n, false));
  const fresh = tree.filter((n) => n.unlocked && n.attempts === 0).map((n) => toQuest(n, true));
  return [...due, ...fresh].slice(0, limit);
}

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Random question for a node, avoiding the one the user answered last when possible.
export async function pickQuestion(userId, nodeId) {
  const total = await Question.countDocuments({ skillNode: nodeId });
  if (total === 0) return null;

  const last = await Attempt.findOne({ user: userId, skillNode: nodeId }).sort({ createdAt: -1 });
  const filter = { skillNode: new mongoose.Types.ObjectId(nodeId) };
  if (last && total > 1) filter._id = { $ne: last.question };

  const [picked] = await Question.aggregate([{ $match: filter }, { $sample: { size: 1 } }]);
  if (!picked) return null;

  return { id: picked._id, text: picked.text, options: shuffle(picked.options) }; // answer is never sent
}
