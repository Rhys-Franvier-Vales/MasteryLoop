import bcrypt from "bcryptjs";
import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";
import SkillNode from "../models/SkillNode.js";
import { GAME } from "../config/env.js";
import { asyncHandler, HttpError } from "../utils/helpers.js";
import { validateProfileUpdate } from "../utils/validators.js";
import { levelFor } from "../services/xpService.js";

// Numbers for the dashboard stat cards.
export const getStats = asyncHandler(async (req, res) => {
  const [totalNodes, mastered] = await Promise.all([
    SkillNode.countDocuments(),
    UserProgress.countDocuments({ user: req.user._id, masteryLevel: { $gte: GAME.masteredThreshold } }),
  ]);

  const { xp, streak, longestStreak } = req.user;
  res.json({ xp, level: levelFor(xp), streak, longestStreak, mastered, totalNodes });
});

export const updateMe = asyncHandler(async (req, res) => {
  const problem = validateProfileUpdate(req.body);
  if (problem) throw new HttpError(400, problem);

  const { name, email, avatar, password, currentPassword } = req.body;
  const user = await User.findById(req.user._id).select("+passwordHash");

  if (password) {
    // Changing a password needs the current one, so a stolen session cannot lock the owner out.
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new HttpError(400, "Your current password is incorrect.");
    }
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  if (name !== undefined) user.name = name.trim();
  if (avatar !== undefined) user.avatar = avatar;
  if (email !== undefined) {
    const next = email.trim().toLowerCase();
    if (next !== user.email && (await User.exists({ email: next }))) {
      throw new HttpError(409, "An account with that email already exists.");
    }
    user.email = next;
  }

  await user.save();
  res.json({ user: user.toPublic() });
});
