const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Gemini SDK [web:110]

const router = express.Router();

// Create Gemini client using env key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Good options (pick one)

const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });


 // fast, cheap [web:16]

// Debug once (safe)
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing');
} else {
  console.log('✅ GEMINI_API_KEY loaded');
}

// POST /api/ai/feedback
router.post('/feedback', protect, async (req, res) => {
  try {
    const { questionText, userAnswer, questionType } = req.body;

    if (!questionText || !userAnswer) {
      return res.status(400).json({
        message: 'questionText and userAnswer are required',
      });
    }

  const prompt = `
You are a professional interview coach.

Question Type: ${questionType || 'DSA / Behavioral'}
Question: ${questionText}
Candidate Answer: ${userAnswer}

Return feedback in Markdown with **exactly** this structure:

**Overall**
- One short sentence

**Strengths**
- 2–3 bullet points

**Improvements**
- 2–3 bullet points

Keep total under 120 words.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const feedback = response.text().trim();

    if (!feedback) {
      return res.status(500).json({
        message: 'Empty response from AI',
      });
    }

    res.status(200).json({ feedback });
  } catch (error) {
    console.error('❌ Gemini feedback error:', error);
    res.status(500).json({
      message: 'AI feedback failed',
      error: error.message || 'Unknown error',
    });
  }
});

module.exports = router;
