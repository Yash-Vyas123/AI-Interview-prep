const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const Interview = require('../models/Interview');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
});

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

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

        const result = await model.generateContent({
             contents: [{ role: 'user', parts: [{ text: prompt }] }],
             generationConfig: { responseMimeType: "text/plain" } // Override for this specific prompt
        });
        const question = result.response.text().trim();

        // Save system prompt (optional) & AI question
        interview.conversation.push({
            role: 'ai',
            content: question,
        });
        await interview.save();

        res.json({ interviewId: interview._id, question });
    } catch (error) {
        console.error('Start interview error:', error);
        const isQuotaError = error.message?.includes('429');
        res.status(isQuotaError ? 429 : 500).json({
            message: isQuotaError ? 'AI Quota exceeded. Please try again later.' : 'Failed to start interview',
            error: error.message
        });
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
        const historyContext = interview.conversation
            .slice(-6) 
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
          "confidenceScore": number,
          "communicationScore": number,
          "accuracyScore": number,
          "tips": ["tip1", "tip2"]
        },
        "nextQuestion": "string"
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        let aiData;
        try {
            // Robust JSON extraction
            const jsonStr = responseText.includes('```json') 
                ? responseText.match(/```json\s*([\s\S]*?)\s*```/)[1]
                : responseText.match(/\{[\s\S]*\}/)[0];
            aiData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON Parse Error:', responseText);
            throw new Error('AI failed to provide valid feedback structure');
        }

        // Update conversation
        const userMsgIndex = interview.conversation.length - 1;
        interview.conversation[userMsgIndex].feedback = aiData.feedback;

        interview.conversation.push({
            role: 'ai',
            content: aiData.nextQuestion,
        });

        await interview.save();
        res.json(aiData);
    } catch (error) {
        console.error('Answer submission error:', error);
        const isQuotaError = error.message?.includes('429');
        res.status(isQuotaError ? 429 : 500).json({
            message: isQuotaError ? 'AI Quota exceeded. Please try again later.' : 'Failed to process answer',
            error: error.message
        });
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

        const transcript = interview.conversation
            .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n');

        const prompt = `
      Generate a final interview report based on this transcript:
      ${transcript}
      
      Output JSON ONLY:
      {
        "overallScore": number,
        "feedback": "string",
        "strengths": ["string"],
        "weaknesses": ["string"],
        "actionPlan": ["string"]
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        let report;
        try {
            const jsonStr = responseText.includes('```json') 
                ? responseText.match(/```json\s*([\s\S]*?)\s*```/)[1]
                : responseText.match(/\{[\s\S]*\}/)[0];
            report = JSON.parse(jsonStr);
        } catch (parseError) {
            throw new Error('AI failed to generate report JSON');
        }

        interview.status = 'completed';
        interview.summary = report;
        await interview.save();

        res.json(interview);
    } catch (error) {
        console.error('End interview error:', error);
        const isQuotaError = error.message?.includes('429');
        res.status(isQuotaError ? 429 : 500).json({
            message: isQuotaError ? 'AI Quota exceeded while generating report.' : 'Failed to generate report',
            error: error.message
        });
    }
});

module.exports = router;

