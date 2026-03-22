import { Test } from '../models/Test.js';
import { Topic } from '../models/Topic.js';

export async function createTest(req, res, next) {
  try {
    const { title, type, durationMinutes, questions } = req.body;
    if (!title || !type || !Array.isArray(questions) || !questions.length) {
      return res.status(400).json({ success: false, message: 'title, type, questions[] required' });
    }
    const test = await Test.create({ title, type, durationMinutes: durationMinutes ?? 15, questions });
    res.status(201).json({ success: true, test });
  } catch (e) {
    next(e);
  }
}

export async function updateTest(req, res, next) {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, test });
  } catch (e) {
    next(e);
  }
}

export async function createTopic(req, res, next) {
  try {
    const payload = req.body;
    if (!payload.slug || !payload.title || !payload.category) {
      return res.status(400).json({ success: false, message: 'slug, title, category required' });
    }
    const topic = await Topic.create(payload);
    res.status(201).json({ success: true, topic });
  } catch (e) {
    next(e);
  }
}

export async function updateTopic(req, res, next) {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, topic });
  } catch (e) {
    next(e);
  }
}

export async function listAllTests(_req, res, next) {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json({ success: true, tests });
  } catch (e) {
    next(e);
  }
}
