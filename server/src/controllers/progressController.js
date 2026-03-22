import { User } from '../models/User.js';
import { Topic } from '../models/Topic.js';
import { Result } from '../models/Result.js';

export async function getProgress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const totalTopics = await Topic.countDocuments();
    const completed = user.topicProgress.filter((p) => p.completed).length;
    const topicPct = totalTopics ? Math.round((completed / totalTopics) * 1000) / 10 : 0;

    const testCount = await Result.countDocuments({ user: user._id });
    const recent = await Result.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).populate('test', 'title type');

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let wg = user.weeklyGoals.find((w) => new Date(w.weekStart).getTime() === weekStart.getTime());
    if (!wg) {
      user.weeklyGoals.push({
        weekStart,
        label: 'This week',
        targetTopics: 3,
        targetTests: 1,
        completedTopics: 0,
        completedTests: 0,
      });
      await user.save();
      wg = user.weeklyGoals[user.weeklyGoals.length - 1];
    }

    const thisWeekTopics = user.topicProgress.filter(
      (p) => p.completed && p.completedAt && new Date(p.completedAt) >= weekStart
    ).length;
    const thisWeekTests = await Result.countDocuments({
      user: user._id,
      completedAt: { $gte: weekStart },
    });

    res.json({
      success: true,
      progress: {
        topicsCompleted: completed,
        topicsTotal: totalTopics,
        topicProgressPercent: topicPct,
        testsCompleted: testCount,
        recentTests: recent,
        weekly: {
          weekStart,
          targetTopics: wg.targetTopics,
          targetTests: wg.targetTests,
          completedTopics: thisWeekTopics,
          completedTests: thisWeekTests,
        },
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function setWeeklyGoals(req, res, next) {
  try {
    const { targetTopics, targetTests } = req.body;
    const user = await User.findById(req.user._id);
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let wg = user.weeklyGoals.find((w) => new Date(w.weekStart).getTime() === weekStart.getTime());
    if (!wg) {
      user.weeklyGoals.push({
        weekStart,
        label: 'This week',
        targetTopics: 3,
        targetTests: 1,
        completedTopics: 0,
        completedTests: 0,
      });
      wg = user.weeklyGoals[user.weeklyGoals.length - 1];
    }
    if (targetTopics != null) wg.targetTopics = targetTopics;
    if (targetTests != null) wg.targetTests = targetTests;
    await user.save();
    res.json({ success: true, weekly: wg });
  } catch (e) {
    next(e);
  }
}
