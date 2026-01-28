const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // There isn't a direct listModels in the genAI instance sometimes in older versions, 
        // but we can try to use the fetch API or just test a few common names.
        const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.0-pro'];
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
