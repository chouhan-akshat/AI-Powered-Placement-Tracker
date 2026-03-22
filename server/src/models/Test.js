import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true, min: 0 },
    explanation: String,
  },
  { _id: true }
);

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['aptitude', 'technical'], required: true },
    durationMinutes: { type: Number, default: 15 },
    questions: [questionSchema],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Test = mongoose.model('Test', testSchema);
