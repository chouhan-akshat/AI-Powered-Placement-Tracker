import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    type: { type: String, enum: ['youtube', 'blog', 'course', 'doc'], default: 'blog' },
  },
  { _id: false }
);

const topicSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['dsa', 'core', 'aptitude', 'project', 'system_design'],
      required: true,
    },
    semesterHint: { type: Number, min: 1, max: 8 },
    branchTags: [{ type: String }],
    description: String,
    resources: [resourceSchema],
    practiceLinks: [{ title: String, url: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Topic = mongoose.model('Topic', topicSchema);
