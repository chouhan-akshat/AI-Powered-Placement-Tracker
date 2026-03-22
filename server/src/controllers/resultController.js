import { Result } from '../models/Result.js';

export async function myResults(req, res, next) {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('test', 'title type durationMinutes')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, results });
  } catch (e) {
    next(e);
  }
}

export async function leaderboard(req, res, next) {
  try {
    const { testId } = req.query;
    const match = testId ? { test: testId } : {};
    const agg = await Result.aggregate([
      { $match: match },
      { $sort: { percentage: -1, createdAt: 1 } },
      {
        $group: {
          _id: '$user',
          bestPercentage: { $first: '$percentage' },
          bestScore: { $first: '$score' },
          at: { $first: '$createdAt' },
        },
      },
      { $sort: { bestPercentage: -1 } },
      { $limit: 20 },
    ]);
    const User = (await import('../models/User.js')).User;
    const users = await User.find({ _id: { $in: agg.map((a) => a._id) } }).select('name email');
    const byId = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
    const rows = agg.map((row, i) => ({
      rank: i + 1,
      user: byId[row._id.toString()] || { name: 'User' },
      bestPercentage: row.bestPercentage,
      bestScore: row.bestScore,
    }));
    res.json({ success: true, leaderboard: rows });
  } catch (e) {
    next(e);
  }
}
