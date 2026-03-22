import { Topic } from '../models/Topic.js';
import { User } from '../models/User.js';

export async function listTopics(req, res, next) {
  try {
    const { category } = req.query;
    const q = category ? { category } : {};
    const topics = await Topic.find(q).sort({ order: 1, title: 1 });
    res.json({ success: true, topics });
  } catch (e) {
    next(e);
  }
}

export async function getTopic(req, res, next) {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, topic });
  } catch (e) {
    next(e);
  }
}

export async function markTopicComplete(req, res, next) {
  try {
    const { topicId, completed } = req.body;
    if (!topicId) {
      return res.status(400).json({ success: false, message: 'topicId required' });
    }
    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });

    const user = await User.findById(req.user._id);
    const idx = user.topicProgress.findIndex((p) => p.topic.toString() === topicId);
    const done = completed !== false;
    if (idx >= 0) {
      user.topicProgress[idx].completed = done;
      user.topicProgress[idx].completedAt = done ? new Date() : undefined;
    } else {
      user.topicProgress.push({ topic: topicId, completed: done, completedAt: done ? new Date() : undefined });
    }
    await user.save();
    res.json({ success: true, topicProgress: user.topicProgress });
  } catch (e) {
    next(e);
  }
}
