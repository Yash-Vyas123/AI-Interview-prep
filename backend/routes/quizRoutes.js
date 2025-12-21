const express = require('express');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/quizzes/start
// POST /api/quizzes/start
router.post('/start', protect, async (req, res) => {
  try {
    let { topic, difficulty, count } = req.body;

    // fallback defaults
    count = Number(count) || 5;

    // Build dynamic filter
    const query = {};
    if (topic && topic !== '') {
      // your schema uses `tags` for topic
      query.tags = topic; // e.g. "DSA", "System Design", "ML"
    }
    if (difficulty && difficulty !== '') {
      query.difficulty = difficulty; // e.g. "easy" | "medium" | "hard"
    }

    // Fetch questions that match filters
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: count } } // randomize selection
    ]);

    res.json({ questions });
  } catch (err) {
    console.error('Quiz start error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/quizzes/submit
router.post('/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // [{questionId, userAnswer}]
    let score = 0;

    const detailedAnswers = [];
    const results = [];

    for (const a of answers) {
      const q = await Question.findById(a.questionId);
      if (!q) continue;

      const isCorrect = q.correctAnswer === a.userAnswer;
      if (isCorrect) score += 1;

      detailedAnswers.push({
        question: a.questionId,
        userAnswer: a.userAnswer,
        isCorrect,
      });

      // for frontend results list
      results.push({
        questionId: q._id,
        correct: isCorrect,
        correctAnswer: q.correctAnswer,
        userAnswer: a.userAnswer,
      });
    }

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      questions: answers.map(a => a.questionId),
      answers: detailedAnswers,
      score,
    });

    res.json({
      score,
      attemptId: attempt._id,
      results,
    });
  } catch (err) {
    console.error('Quiz submit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/quizzes/history  (current user's attempts)
router.get('/history', protect, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ attempts });
  } catch (err) {
    console.error('Quiz history error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
