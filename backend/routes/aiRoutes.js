const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const router = express.Router();

// Create Gemini client using env key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-1.5-flash for better reliability and speed
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: 'You are an AI interview coach for an AI Interview Prep web app. Help with DSA, web development, and interview preparation. Be concise, give hints first, and keep responses friendly.'
});

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Debug once (safe)
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing');
} else {
  console.log('✅ GEMINI_API_KEY loaded for AI Routes');
}

/**
 * POST /api/ai/feedback
 * Provides feedback on a specific interview question and answer
 */
router.post('/feedback', protect, async (req, res) => {
  try {
    const { questionText, userAnswer, questionType, options } = req.body;

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

${options ? `This is a Multiple Choice Question. The available options were: ${options.join(', ')}.` : ''}

Return feedback in Markdown with **exactly** this structure:

**Overall**
- One short sentence (mention if the answer is correct or not if it's MCQ)

**Explanation**
- Provide a detailed explanation of the correct answer. ${options ? 'Explain why the chosen option is correct and why others are incorrect.' : ''}

**Strengths**
- 1–2 bullet points about the candidate's logic

**Improvements**
- 1–2 bullet points for future reference

Keep total under 150 words.
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      safetySettings,
    });
    
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
    const isQuotaError = error.message?.includes('429') || error.status === 429;
    res.status(isQuotaError ? 429 : 500).json({
      message: isQuotaError ? 'AI Quota exceeded. Please try again in a few minutes.' : 'AI feedback failed',
      error: error.message || 'Unknown error',
    });
  }
});

/**
 * POST /api/ai/chat
 * For global chatbot widget with multi-turn conversation
 */
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Build alternating history for Gemini
    // Ensure roles are strictly 'user' -> 'model' -> 'user'...
    const contents = [];
    
    history.forEach((m, index) => {
      const role = m.role || (m.from === 'user' ? 'user' : 'model');
      // Simple validation: avoid consecutive same roles
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        // Skip or fix: for now we skip to keep it simple and valid
        return;
      }
      contents.push({
        role: role,
        parts: [{ text: m.content || m.text }],
      });
    });

    // Add current message (must be 'user' and must follow 'model' or be first)
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      // If last was user, we can't add another user. 
      // This shouldn't happen with valid history, but let's be safe.
      // We can just append the text to the last user message or skip.
      contents[contents.length - 1].parts[0].text += "\n" + message;
    } else {
      contents.push({ role: 'user', parts: [{ text: message }] });
    }

    const result = await model.generateContent({ 
      contents,
      safetySettings,
    });
    
    const reply = result.response.text().trim();

    if (!reply) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('❌ Gemini chat error:', error);
    const isQuotaError = error.message?.includes('429') || error.status === 429;
    res.status(isQuotaError ? 429 : 500).json({
      error: isQuotaError ? 'AI Quota exceeded. Please try again later.' : 'AI chat failed',
      details: error.message || 'Unknown error',
    });
  }
});

module.exports = router;

