// The scheduling brain of Mastery Loop. Pure functions only: no database, no Express.
// That keeps the algorithm easy to test and easy to explain.
import { round } from "../utils/helpers.js";

export const MIN_EASE = 1.3;
export const DEFAULT_EASE = 2.5;
const DAY_MS = 24 * 60 * 60 * 1000;

// Turn "was it right, and how fast" into the 0-5 quality score SM-2 expects.
export function qualityFromAnswer({ correct, timeMs }) {
  if (!correct) return 1;
  if (typeof timeMs !== "number" || timeMs <= 0) return 4;
  if (timeMs <= 8000) return 5;
  if (timeMs <= 20000) return 4;
  return 3;
}

// SuperMemo SM-2. Takes the current schedule state plus this answer's quality (0-5)
// and returns the next state.
export function sm2({ easeFactor = DEFAULT_EASE, repetitions = 0, intervalDays = 0 } = {}, quality, now = new Date()) {
  if (!Number.isInteger(quality) || quality < 0 || quality > 5) {
    throw new RangeError("quality must be an integer from 0 to 5");
  }

  let nextRepetitions;
  let nextInterval;

  if (quality >= 3) {
    if (repetitions === 0) nextInterval = 1;
    else if (repetitions === 1) nextInterval = 6;
    else nextInterval = Math.round(intervalDays * easeFactor);
    nextRepetitions = repetitions + 1;
  } else {
    nextRepetitions = 0; // forgotten: start the sequence again
    nextInterval = 1;
  }

  const delta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  const nextEase = Math.max(MIN_EASE, round(easeFactor + delta, 2));

  return {
    easeFactor: nextEase,
    repetitions: nextRepetitions,
    intervalDays: nextInterval,
    nextReviewDate: new Date(now.getTime() + nextInterval * DAY_MS),
  };
}

// Mastery is the 0-1 value shown on the skill tree. A good answer closes part of the
// gap to 1 (better answers close more); a wrong answer loses 40%.
export function updateMastery(mastery, quality) {
  if (quality >= 3) {
    const gain = 0.3 + 0.05 * (quality - 3);
    return round(mastery + (1 - mastery) * gain, 3);
  }
  return round(mastery * 0.6, 3);
}
