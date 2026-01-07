const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Interview = require('../models/Interview');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

/**
 * @desc    Start a new Mock Interview Session
 * @route   POST /api/interview/start
 * @access  Private
 */
router.post('/start', protect, async (req, res) => {
    try {
        const { jobRole, topic, difficulty } = req.body;

        // Create session
        const interview = await Interview.create({
            user: req.user._id,
            jobRole,
            topic,
            difficulty,
            status: 'active',
            conversation: [],
        });

        // Generate first question
        const prompt = `
      You are an expert technical interviewer for a ${jobRole} role.
      The candidate wants to practice: ${topic}.
      Difficulty Level: ${difficulty}.
      
      Start by asking the first interview question.
      It should be a relevant conceptual or introductory question.
      Keep it professional but encouraging.
      
      Output ONLY the question text.
    `;

        const result = await model.generateContent(prompt);
        const question = result.response.text();

        // Save system prompt (optional) & AI question
        interview.conversation.push({
            role: 'ai',
            content: question,
        });
        await interview.save();

        res.json({ interviewId: interview._id, question });
    } catch (error) {
        console.error('Start interview error:', error);
        res.status(500).json({ message: 'Failed to start interview' });
    }
});

/**
 * @desc    Submit Answer & Get Feedback + Next Question
 * @route   POST /api/interview/:id/answer
 * @access  Private
 */
router.post('/:id/answer', protect, async (req, res) => {
    try {
        const { userAnswer } = req.body;
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Add user answer to history
        interview.conversation.push({ role: 'user', content: userAnswer });

        // AI Context Construction
        // We send last few exchanges to maintain context
        const historyContext = interview.conversation
            .slice(-6) // Last 3 turns
            .map((msg) => `${msg.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
            .join('\n');

        const prompt = `
      Act as a Technical Interviewer.
      Current Context:
      ${historyContext}
      
      Candidate's Last Answer: "${userAnswer}"
      
      Task:
      1. Evaluate the answer (Confidence, Communication, Accuracy) out of 100.
      2. Provide brief, constructive feedback tips.
      3. Ask the NEXT follow-up question.
      
      Output JSON ONLY:
      {
        "feedback": {
          "confidenceScore": 85,
          "communicationScore": 90,
          "accuracyScore": 80,
          "tips": ["Good explanation", "Speak likely slower"]
        },
        "nextQuestion": "Now, can you explain..."
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) throw new Error('Invalid AI response');
        const aiData = JSON.parse(jsonMatch[0]);

        // Update conversation with user feedback and new AI question
        // 1. Update user message with feedback scores
        const userMsgIndex = interview.conversation.length - 1;
        interview.conversation[userMsgIndex].feedback = aiData.feedback;

        // 2. Add AI next question
        interview.conversation.push({
            role: 'ai',
            content: aiData.nextQuestion,
        });

        await interview.save();

        res.json(aiData);
    } catch (error) {
        console.error('Answer submission error:', error);
        res.status(500).json({ message: 'Failed to process answer', error: error.message });
    }
});

/**
 * @desc    End Interview & Generate Report
 * @route   POST /api/interview/:id/end
 * @access  Private
 */
router.post('/:id/end', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) return res.status(404).json({ message: 'Interview not found' });

        // Generate Final Report
        const transcript = interview.conversation
            .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n');

        const prompt = `
      Generate a final interview report based on this transcript:
      ${transcript}
      
      Output JSON ONLY:
      {
        "overallScore": 85,
        "feedback": "Strong technical skills...",
        "strengths": ["React hooks", "System design"],
        "weaknesses": ["Database indexing"],
        "actionPlan": ["Study B-Trees", "Practice mock mocks"]
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) throw new Error('Invalid AI report');
        const report = JSON.parse(jsonMatch[0]);

        interview.status = 'completed';
        interview.summary = report;
        await interview.save();

        res.json(interview);
    } catch (error) {
        console.error('End interview error:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
});

module.exports = router;
