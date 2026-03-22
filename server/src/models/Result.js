import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionId: mongoose.Schema.Types.ObjectId,
    selectedIndex: Number,
    correct: Boolean,
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    durationSeconds: Number,
    answers: [answerSchema],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resultSchema.index({ user: 1, test: 1, createdAt: -1 });

export const Result = mongoose.model('Result', resultSchema);
