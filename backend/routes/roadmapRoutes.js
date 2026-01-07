const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Roadmap = require('../models/Roadmap');
const QuizAttempt = require('../models/QuizAttempt');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

/**
 * @desc    Generate or regenerate a personalized interview roadmap
 * @route   POST /api/roadmap/generate
 * @access  Private
 */
router.post('/generate', protect, async (req, res) => {
    try {
        const { targetRole, experienceLevel } = req.body;

        if (!targetRole || !experienceLevel) {
            return res.status(400).json({ message: 'targetRole and experienceLevel are required' });
        }

        // 1. Fetch user quiz history with populated questions
        const history = await QuizAttempt.find({ user: req.user._id })
            .populate('answers.question')
            .sort({ createdAt: -1 });

        // 2. Extract performance data for AI
        const performanceData = history.flatMap(attempt =>
            attempt.answers.map(ans => ({
                topic: ans.question?.topic || 'General',
                isCorrect: ans.isCorrect,
                text: ans.question?.text || ''
            }))
        );

        // 3. Build AI Prompt
        const prompt = `
      You are an expert AI Career Coach. Generate a highly personalized 4-week interview preparation roadmap for a ${experienceLevel} ${targetRole}.
      
      User Performance Data:
      ${performanceData.length > 0 ? JSON.stringify(performanceData.slice(0, 50)) : "No history available. Generate a strong baseline roadmap."}
      
      Requirements:
      1. Identify weak topics based on wrong answers in history.
      2. Prioritize weak topics in the first 2 weeks.
      3. Provide a readiness score (0-100) based on history.
      4. Output MUST be valid JSON.
      
      JSON Structure:
      {
        "weakAreas": ["Topic A", "Topic B"],
        "readinessScore": 75,
        "weeklyRoadmap": [
          {
            "week": 1,
            "topics": [
              { "title": "Topic Name", "description": "Short study plan", "priority": "High/Medium/Low" }
            ]
          }
        ]
      }
    `;

        // 4. Call Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean JSON response (sometimes Gemini adds markdown blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('AI failed to return valid JSON');

        const roadmapData = JSON.parse(jsonMatch[0]);

        // 5. Update or Create Roadmap
        let roadmap = await Roadmap.findOne({ user: req.user._id, status: 'active' });

        if (roadmap) {
            roadmap.targetRole = targetRole;
            roadmap.experienceLevel = experienceLevel;
            roadmap.weakAreas = roadmapData.weakAreas;
            roadmap.readinessScore = roadmapData.readinessScore;
            roadmap.weeklyRoadmap = roadmapData.weeklyRoadmap;
        } else {
            roadmap = new Roadmap({
                user: req.user._id,
                targetRole,
                experienceLevel,
                ...roadmapData
            });
        }

        await roadmap.save();
        res.json(roadmap);

    } catch (error) {
        console.error('Roadmap generation error:', error);
        res.status(500).json({ message: 'Failed to generate roadmap', error: error.message });
    }
});

/**
 * @desc    Get the current active roadmap
 * @route   GET /api/roadmap
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ user: req.user._id, status: 'active' });
        if (!roadmap) {
            return res.status(404).json({ message: 'No active roadmap found' });
        }
        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @desc    Toggle topic completion status
 * @route   PATCH /api/roadmap/toggle-topic
 * @access  Private
 */
router.patch('/toggle-topic', protect, async (req, res) => {
    try {
        const { topicId, weekIndex } = req.body;
        const roadmap = await Roadmap.findOne({ user: req.user._id, status: 'active' });

        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        const week = roadmap.weeklyRoadmap[weekIndex];
        if (!week) return res.status(400).json({ message: 'Invalid week' });

        const topic = week.topics.id(topicId);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        topic.completed = !topic.completed;
        await roadmap.save();

        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
