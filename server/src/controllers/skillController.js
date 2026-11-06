import { asyncHandler } from "../utils/helpers.js";
import { loadNodes, loadProgressMap, buildTree, buildDueQueue } from "../services/questService.js";

// The full skill tree with this user's mastery and lock state on every node.
export const getTree = asyncHandler(async (req, res) => {
  const [nodes, progress] = await Promise.all([loadNodes(), loadProgressMap(req.user._id)]);
  res.json({ nodes: buildTree(nodes, progress) });
});

// Topics ready to review now, weakest first, then new unlocked topics.
export const getDue = asyncHandler(async (req, res) => {
  const [nodes, progress] = await Promise.all([loadNodes(), loadProgressMap(req.user._id)]);
  res.json({ quests: buildDueQueue(buildTree(nodes, progress)) });
});
