import { GAME } from "../config/env.js";

export const levelFor = (xp) => Math.floor(xp / GAME.xpPerLevel) + 1;

// Harder topics and sharper recall earn more.
export function xpForAttempt({ correct, quality, difficulty = 1 }) {
  if (!correct) return 0;
  return 15 + 10 * difficulty + (quality === 5 ? 5 : 0);
}

const dayIndex = (date) => Math.floor((date.getTime() + GAME.tzOffsetMinutes * 60000) / 86400000);

// Updates the user's streak in place. Same day: unchanged. Next day: +1. Gap: back to 1.
export function applyStreak(user, now = new Date()) {
  const last = user.lastPracticeDate ? dayIndex(new Date(user.lastPracticeDate)) : null;
  const today = dayIndex(now);

  if (last === today) return user;
  user.streak = last === today - 1 ? user.streak + 1 : 1;
  user.longestStreak = Math.max(user.longestStreak || 0, user.streak);
  user.lastPracticeDate = now;
  return user;
}
