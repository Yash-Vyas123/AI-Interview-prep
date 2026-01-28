const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModel() {
    const modelName = 'gemini-2.0-flash-lite';
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('hi');
        console.log(`✅ ${modelName} WORKS`);
        console.log('Response:', result.response.text());
    } catch (err) {
        console.error(`❌ ${modelName} FAILED:`, err.message);
    }
}

testModel();
