import "./setup.js";
import test from "node:test";
import assert from "node:assert/strict";
import { unlockedIds, buildTree, buildDueQueue } from "../src/services/questService.js";

// arrays -> recursion -> bst ; arrays -> sorting ; dp needs recursion AND bst
const node = (id, title, prerequisites = [], difficulty = 1) => ({ _id: id, title, description: "", difficulty, prerequisites, order: 0 });
const nodes = [
  node("a", "Arrays"),
  node("r", "Recursion", ["a"]),
  node("s", "Sorting", ["a"]),
  node("b", "BST", ["r"]),
  node("d", "DP", ["r", "b"], 3),
];
const progress = (entries) => new Map(Object.entries(entries).map(([k, v]) => [k, { masteryLevel: v.m, attempts: v.n ?? 1, nextReviewDate: v.due ?? new Date("2999-01-01") }]));

test("a fresh learner only has root topics unlocked", () => {
  assert.deepEqual([...unlockedIds(nodes, new Map())], ["a"]);
});

test("topics unlock at the 0.6 threshold, not before", () => {
  assert.deepEqual([...unlockedIds(nodes, progress({ a: { m: 0.59 } }))], ["a"]);
  assert.deepEqual([...unlockedIds(nodes, progress({ a: { m: 0.6 } }))].sort(), ["a", "r", "s"]);
});

test("a topic with several prerequisites needs all of them", () => {
  const p = progress({ a: { m: 1 }, r: { m: 0.9 }, b: { m: 0.2 } });
  assert.ok(!unlockedIds(nodes, p).has("d"));
  const tree = buildTree(nodes, p);
  assert.deepEqual(tree.find((n) => n.id === "d").needs, ["BST"]);
  p.get("b").masteryLevel = 0.7;
  assert.ok(unlockedIds(nodes, p).has("d"));
});

test("due queue: overdue topics weakest-first, then new unlocked topics", () => {
  const past = new Date("2020-01-01");
  const p = progress({ a: { m: 0.9, due: past }, r: { m: 0.3, due: past }, s: { m: 0.7, due: new Date("2999-01-01") } });
  const queue = buildDueQueue(buildTree(nodes, p, new Date("2026-11-10")));
  // r (0.3) before a (0.9); s is not due yet; b is unlocked (r >= ... no: r mastery 0.3 < 0.6) so locked
  assert.deepEqual(queue.map((q) => q.title), ["Recursion", "Arrays"]);
  assert.ok(queue.every((q) => q.isNew === false));
});

test("a brand-new learner is offered the first topic as new", () => {
  const queue = buildDueQueue(buildTree(nodes, new Map()));
  assert.deepEqual(queue.map((q) => [q.title, q.isNew]), [["Arrays", true]]);
});
