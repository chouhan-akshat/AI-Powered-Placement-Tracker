import { Test } from '../models/Test.js';
import { Result } from '../models/Result.js';

export async function listTests(req, res, next) {
  try {
    const tests = await Test.find({ active: true }).select('-questions.correctIndex -questions.explanation');
    res.json({ success: true, tests });
  } catch (e) {
    next(e);
  }
}

export async function getTest(req, res, next) {
  try {
    const test = await Test.findById(req.params.id).select('-questions.correctIndex -questions.explanation');
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, test });
  } catch (e) {
    next(e);
  }
}

export async function submitTest(req, res, next) {
  try {
    const { answers, durationSeconds } = req.body;
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers array required' });
    }

    let score = 0;
    const detailed = [];
    test.questions.forEach((q, i) => {
      const selected = answers[i];
      const correct = selected === q.correctIndex;
      if (correct) score += 1;
      detailed.push({
        questionId: q._id,
        selectedIndex: selected,
        correct,
      });
    });
    const total = test.questions.length;
    const percentage = total ? Math.round((score / total) * 1000) / 10 : 0;

    const result = await Result.create({
      user: req.user._id,
      test: test._id,
      score,
      total,
      percentage,
      durationSeconds,
      answers: detailed,
    });

    res.json({
      success: true,
      result: {
        id: result._id,
        score,
        total,
        percentage,
        answers: detailed.map((a, i) => ({
          ...a,
          correctIndex: test.questions[i].correctIndex,
          explanation: test.questions[i].explanation,
        })),
      },
    });
  } catch (e) {
    next(e);
  }
}
