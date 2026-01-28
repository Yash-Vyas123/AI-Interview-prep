const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModel() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const result = await model.generateContent('hi');
        console.log('✅ gemini-flash-latest WORKS');
        console.log('Response:', result.response.text());
    } catch (err) {
        console.error('❌ gemini-flash-latest FAILED:', err.message);
    }
}

testModel();
