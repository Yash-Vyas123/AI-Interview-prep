const express = require('express');
const Question = require('../models/Question');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'questions route working' });
});

// POST /api/questions  (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { text, type, topic, company, difficulty, options, correctAnswer } =
      req.body;

    if (!text || !type || !topic) {
      return res.status(400).json({ message: 'text, type, topic required' });
    }

    const question = await Question.create({
      text,
      type,
      topic,
      company,
      difficulty,
      options,
      correctAnswer
    });

    res.status(201).json(question);
  } catch (err) {
    console.error('Create question error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/questions  (all users)
router.get('/', protect, async (req, res) => {
  try {
    const { type, topic, difficulty } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
