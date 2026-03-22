import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { Roadmap } from '../models/Roadmap.js';
import { buildRoadmapPlan } from '../services/roadmapGenerator.js';

function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function signup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', details: errors.array() });
    }
    const { name, email, password, branch, semester, goal, goalDetail } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      branch: branch || 'CSE',
      semester: semester ?? 5,
      goal: goal || 'general',
      goalDetail: goalDetail || '',
    });
    const plan = buildRoadmapPlan({
      branch: user.branch,
      semester: user.semester,
      goal: user.goal,
      goalDetail: user.goalDetail,
    });
    await Roadmap.create({ user: user._id, branch: user.branch, semester: user.semester, goal: user.goal, plan });

    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        goal: user.goal,
        goalDetail: user.goalDetail,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', details: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        goal: user.goal,
        goalDetail: user.goalDetail,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('topicProgress.topic', 'title slug category');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        goal: user.goal,
        goalDetail: user.goalDetail,
        role: user.role,
        topicProgress: user.topicProgress,
        weeklyGoals: user.weeklyGoals,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, branch, semester, goal, goalDetail, resumeText } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name != null) user.name = name;
    if (branch != null) user.branch = branch;
    if (semester != null) user.semester = semester;
    if (goal != null) user.goal = goal;
    if (goalDetail != null) user.goalDetail = goalDetail;
    if (resumeText != null) user.resumeText = resumeText;

    await user.save();

    const roadmapChanged =
      branch != null || semester != null || goal != null || goalDetail != null;
    if (roadmapChanged) {
      const plan = buildRoadmapPlan({
        branch: user.branch,
        semester: user.semester,
        goal: user.goal,
        goalDetail: user.goalDetail,
      });
      await Roadmap.findOneAndUpdate(
        { user: user._id },
        {
          $set: {
            branch: user.branch,
            semester: user.semester,
            goal: user.goal,
            plan,
          },
          $inc: { version: 1 },
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        semester: user.semester,
        goal: user.goal,
        goalDetail: user.goalDetail,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
}
