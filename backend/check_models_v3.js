const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-pro-latest'];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent('hi');
                console.log(`✅ ${m} WORKS`);
            } catch (e) {
                console.log(`❌ ${m} FAILED: ${e.message}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

listModels();
