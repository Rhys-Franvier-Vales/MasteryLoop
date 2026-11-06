import mongoose from "mongoose";

const skillNodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    difficulty: { type: Number, min: 1, max: 3, default: 1 },
    // Direct prerequisites. Because a node can only be practiced once its
    // prerequisites are mastered, the chain is automatically transitive.
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: "SkillNode" }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("SkillNode", skillNodeSchema);
