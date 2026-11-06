import mongoose from "mongoose";
import { levelFor } from "../services/xpService.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    avatar: { type: String, default: "" },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastPracticeDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// What the client is allowed to see. Never includes the password hash.
userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    xp: this.xp,
    level: levelFor(this.xp),
    streak: this.streak,
    longestStreak: this.longestStreak,
  };
};

export default mongoose.model("User", userSchema);
