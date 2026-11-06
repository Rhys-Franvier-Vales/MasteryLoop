import mongoose from "mongoose";
import { DEFAULT_EASE } from "../services/sm2Engine.js";

// One document per (user, skill node): that user's scheduling state for that topic.
const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skillNode: { type: mongoose.Schema.Types.ObjectId, ref: "SkillNode", required: true },
    easeFactor: { type: Number, default: DEFAULT_EASE },
    repetitions: { type: Number, default: 0 },
    intervalDays: { type: Number, default: 0 },
    nextReviewDate: { type: Date, default: Date.now },
    masteryLevel: { type: Number, default: 0, min: 0, max: 1 },
    lastQuality: { type: Number, default: null },
    attempts: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userProgressSchema.index({ user: 1, skillNode: 1 }, { unique: true });
userProgressSchema.index({ user: 1, nextReviewDate: 1 }); // powers "what is due today"

export default mongoose.model("UserProgress", userProgressSchema);
