import mongoose from 'mongoose';

const topicProgressSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date,
  },
  { _id: false }
);

const weeklyGoalSchema = new mongoose.Schema(
  {
    weekStart: { type: Date, required: true },
    label: String,
    targetTopics: { type: Number, default: 3 },
    targetTests: { type: Number, default: 1 },
    completedTopics: { type: Number, default: 0 },
    completedTests: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    branch: { type: String, default: 'CSE' },
    semester: { type: Number, default: 5, min: 1, max: 8 },
    goal: {
      type: String,
      enum: ['service', 'product', 'specific_role', 'general'],
      default: 'general',
    },
    goalDetail: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    topicProgress: [topicProgressSchema],
    weeklyGoals: [weeklyGoalSchema],
    resumeText: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
