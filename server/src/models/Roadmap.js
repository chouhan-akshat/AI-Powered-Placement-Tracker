import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    branch: String,
    semester: Number,
    goal: String,
    plan: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
