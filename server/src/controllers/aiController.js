import { mentorChat, mockInterviewTurn, analyzeResume } from '../services/geminiService.js';
import { User } from '../models/User.js';

export async function mentor(req, res, next) {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ success: false, message: 'messages[] required' });
    }
    const user = await User.findById(req.user._id).select('name branch semester goal goalDetail');
    const userContext = {
      name: user.name,
      branch: user.branch,
      semester: user.semester,
      goal: user.goal,
      goalDetail: user.goalDetail,
    };
    const reply = await mentorChat({ messages, userContext });
    res.json({ success: true, reply });
  } catch (e) {
    next(e);
  }
}

export async function mockInterview(req, res, next) {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'messages[] required' });
    }
    const user = await User.findById(req.user._id).select('name branch semester goal');
    const userProfile = {
      name: user.name,
      branch: user.branch,
      semester: user.semester,
      goal: user.goal,
    };
    const reply = await mockInterviewTurn({ history: messages, userProfile });
    res.json({ success: true, reply });
  } catch (e) {
    next(e);
  }
}

export async function resumeAnalyze(req, res, next) {
  try {
    const { text } = req.body;
    const full = await User.findById(req.user._id).select('resumeText');
    const content = text || full?.resumeText;
    if (!content || typeof content !== 'string' || content.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Provide resume text (min 50 chars) in body or save resume in profile',
      });
    }
    const analysis = await analyzeResume(content);
    res.json({ success: true, analysis });
  } catch (e) {
    next(e);
  }
}
