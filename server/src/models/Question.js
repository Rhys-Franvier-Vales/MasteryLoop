import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    skillNode: { type: mongoose.Schema.Types.ObjectId, ref: "SkillNode", required: true, index: true },
    text: { type: String, required: true },
    options: {
      type: [String],
      validate: [(v) => v.length >= 2, "A question needs at least 2 options"],
    },
    answer: { type: String, required: true }, // must equal one of the options
    explanation: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
