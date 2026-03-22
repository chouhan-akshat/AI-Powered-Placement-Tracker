import { Roadmap } from '../models/Roadmap.js';
import { buildRoadmapPlan } from '../services/roadmapGenerator.js';
import { User } from '../models/User.js';

export async function getMyRoadmap(req, res, next) {
  try {
    let doc = await Roadmap.findOne({ user: req.user._id });
    if (!doc) {
      const user = await User.findById(req.user._id);
      const plan = buildRoadmapPlan({
        branch: user.branch,
        semester: user.semester,
        goal: user.goal,
        goalDetail: user.goalDetail,
      });
      doc = await Roadmap.create({
        user: user._id,
        branch: user.branch,
        semester: user.semester,
        goal: user.goal,
        plan,
      });
    }
    res.json({ success: true, roadmap: doc });
  } catch (e) {
    next(e);
  }
}

export async function regenerateRoadmap(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const plan = buildRoadmapPlan({
      branch: user.branch,
      semester: user.semester,
      goal: user.goal,
      goalDetail: user.goalDetail,
    });
    const doc = await Roadmap.findOneAndUpdate(
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
      { new: true, upsert: true }
    );
    res.json({ success: true, roadmap: doc });
  } catch (e) {
    next(e);
  }
}
