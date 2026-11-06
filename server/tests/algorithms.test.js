import "./setup.js";
import test from "node:test";
import assert from "node:assert/strict";
import { sm2, updateMastery, qualityFromAnswer } from "../src/services/sm2Engine.js";
import { applyStreak, xpForAttempt, levelFor } from "../src/services/xpService.js";
import { validateRegister, validateProfileUpdate } from "../src/utils/validators.js";

const NOW = new Date("2026-11-10T12:00:00Z");

test("SM-2: first, second and later successful reviews follow 1, 6, then interval x EF", () => {
  const first = sm2({}, 4, NOW);
  assert.equal(first.intervalDays, 1);
  assert.equal(first.repetitions, 1);
  const second = sm2(first, 4, NOW);
  assert.equal(second.intervalDays, 6);
  const third = sm2(second, 4, NOW);
  assert.equal(third.intervalDays, Math.round(6 * second.easeFactor));
});

test("SM-2: ease factor changes match the formula (EF 2.5)", () => {
  assert.equal(sm2({ easeFactor: 2.5 }, 5, NOW).easeFactor, 2.6);
  assert.equal(sm2({ easeFactor: 2.5 }, 4, NOW).easeFactor, 2.5);
  assert.equal(sm2({ easeFactor: 2.5 }, 3, NOW).easeFactor, 2.36);
});

test("SM-2: a failed answer resets repetitions and never drops EF below 1.3", () => {
  const out = sm2({ easeFactor: 1.35, repetitions: 4, intervalDays: 30 }, 0, NOW);
  assert.equal(out.repetitions, 0);
  assert.equal(out.intervalDays, 1);
  assert.equal(out.easeFactor, 1.3);
});

test("SM-2: next review date is interval days after now", () => {
  const out = sm2({}, 5, NOW);
  assert.equal(out.nextReviewDate.toISOString(), "2026-11-11T12:00:00.000Z");
});

test("SM-2: rejects invalid quality", () => {
  assert.throws(() => sm2({}, 6), RangeError);
  assert.throws(() => sm2({}, 2.5), RangeError);
});

test("quality from answer: wrong is 1, fast 5, medium 4, slow 3, unknown time 4", () => {
  assert.equal(qualityFromAnswer({ correct: false, timeMs: 1000 }), 1);
  assert.equal(qualityFromAnswer({ correct: true, timeMs: 5000 }), 5);
  assert.equal(qualityFromAnswer({ correct: true, timeMs: 15000 }), 4);
  assert.equal(qualityFromAnswer({ correct: true, timeMs: 40000 }), 3);
  assert.equal(qualityFromAnswer({ correct: true }), 4);
});

test("mastery rises with good answers and falls after a wrong one", () => {
  let m = 0;
  for (let i = 0; i < 4; i++) m = updateMastery(m, 4);
  assert.ok(m >= 0.8, `expected mastered after 4 good answers, got ${m}`);
  assert.ok(updateMastery(m, 1) < m);
});

test("streak: same day keeps it, next day adds one, a gap resets it", () => {
  const user = { streak: 0, longestStreak: 0, lastPracticeDate: null };
  applyStreak(user, new Date("2026-11-10T06:00:00Z"));
  assert.equal(user.streak, 1);
  applyStreak(user, new Date("2026-11-10T10:00:00Z"));
  assert.equal(user.streak, 1);
  applyStreak(user, new Date("2026-11-11T10:00:00Z"));
  assert.equal(user.streak, 2);
  applyStreak(user, new Date("2026-11-14T10:00:00Z"));
  assert.equal(user.streak, 1);
  assert.equal(user.longestStreak, 2);
});

test("xp and level", () => {
  assert.equal(xpForAttempt({ correct: false, quality: 1, difficulty: 3 }), 0);
  assert.equal(xpForAttempt({ correct: true, quality: 4, difficulty: 2 }), 35);
  assert.equal(xpForAttempt({ correct: true, quality: 5, difficulty: 2 }), 40);
  assert.equal(levelFor(0), 1);
  assert.equal(levelFor(450), 3);
});

test("validators", () => {
  assert.match(validateRegister({ name: "A", email: "a@b.co", password: "12345678" }), /Name/);
  assert.match(validateRegister({ name: "Asha", email: "nope", password: "12345678" }), /email/);
  assert.match(validateRegister({ name: "Asha", email: "a@b.co", password: "short" }), /8 characters/);
  assert.equal(validateRegister({ name: "Asha", email: "a@b.co", password: "12345678" }), null);
  assert.match(validateProfileUpdate({ avatar: "http://x.com/a.png" }), /image/);
  assert.equal(validateProfileUpdate({ name: "Asha", avatar: "data:image/png;base64,AAAA" }), null);
});
