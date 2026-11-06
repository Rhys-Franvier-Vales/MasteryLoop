import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skillNode: { type: mongoose.Schema.Types.ObjectId, ref: "SkillNode", required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    selected: { type: String, required: true },
    correct: { type: Boolean, required: true },
    quality: { type: Number, required: true },
    xpEarned: { type: Number, default: 0 },
    timeMs: { type: Number, default: null },
  },
  { timestamps: true }
);

attemptSchema.index({ user: 1, skillNode: 1, createdAt: -1 });

export default mongoose.model("Attempt", attemptSchema);
