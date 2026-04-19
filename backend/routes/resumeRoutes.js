const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Memory storage for PDF upload
const upload = multer({ storage: multer.memoryStorage() });

// AI Setup
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
 * @desc    Analyze Resume & Generate Interview Questions
 * @route   POST /api/resume/analyze
 * @access  Private
 */
router.post('/analyze', protect, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No resume file uploaded' });
        }

        const { targetRole } = req.body;
        if (!targetRole) {
            return res.status(400).json({ message: 'Target role is required' });
        }

        // 1. Extract Text from PDF
        console.log('📄 Parsing PDF...');
        const buffer = req.file.buffer;
        let resumeText = '';
        try {
            const data = await pdf(buffer);
            resumeText = data.text;
            console.log('✅ PDF Parsed. Length:', resumeText.length);
        } catch (pdfError) {
            console.error('❌ PDF Parse Error:', pdfError);
            return res.status(400).json({ message: `Failed to parse PDF: ${pdfError.message}` });
        }

        if (!resumeText || resumeText.length < 50) {
            return res.status(400).json({ message: 'Could not extract enough text from resume' });
        }

        // 2. AI Analysis Prompt
        const prompt = `
      Act as a Senior Tech Recruiter and Hiring Manager.
      
      Analyze the following resume for the role of: **${targetRole}**.
      
      RESUME TEXT:
      ${resumeText.substring(0, 3000)} ... (truncated if too long)
      
      TASKS:
      1. Calculate a "Match Score" (0-100) based on keywords, experience, and project complexity for the role.
      2. Categorize skills into "Strong", "Moderate", and "Missing" (crucial missing skills for ${targetRole}).
      3. Extract 3 key projects (name, tech stack, 1-sentence description).
      4. Generate 5 interview questions:
         - 2 Technical (Skill-based)
         - 2 Project-based (Specific to their projects)
         - 1 Behavioral (Contextual)
      
      OUTPUT JSON ONLY:
      {
        "matchScore": number,
        "skills": {
          "strong": ["string"],
          "moderate": ["string"],
          "missing": ["string"]
        },
        "projects": [
          { "name": "string", "description": "string", "techStack": ["string"] }
        ],
        "generatedQuestions": [
          { "question": "string", "type": "Technical|Project-based|Behavioral", "context": "string" }
        ]
      }
    `;

        // 3. Generate Content
        console.log('🤖 Sending to Gemini...');
        const result = await model.generateContent({
             contents: [{ role: 'user', parts: [{ text: prompt }] }],
             safetySettings
        });
        const responseText = result.response.text();
        console.log('✅ Gemini Response Received');

        // Improve JSON extraction
        let analysis;
        try {
            const jsonStr = responseText.includes('```json') 
                ? responseText.match(/```json\s*([\s\S]*?)\s*```/)[1]
                : responseText.match(/\{[\s\S]*\}/)[0];
            analysis = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON Parse Error:', responseText);
            throw new Error('AI failed to return valid analysis JSON');
        }

        // 4. Save to DB
        const resumeEntry = await Resume.create({
            user: req.user._id,
            targetRole,
            fileName: req.file.originalname,
            rawText: resumeText,
            ...analysis
        });

        res.json(resumeEntry);

    } catch (error) {
        console.error('Resume analysis error:', error);
        res.status(500).json({ message: 'Analysis failed', error: error.message });
    }
});

/**
 * @desc    Get latest resume analysis
 * @route   GET /api/resume
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
        if (!resume) return res.status(404).json({ message: 'No resume analysis found' });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

