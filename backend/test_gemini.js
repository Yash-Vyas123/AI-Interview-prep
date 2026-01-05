const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY is missing in .env');
        return;
    }
    console.log('✅ GEMINI_API_KEY found');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelName = 'gemini-flash-latest';
    console.log(`Testing model: ${modelName}`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = 'Hello, answer with "Success" if you can hear me.';
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('✅ Success! Response:', text);
    } catch (error) {
        console.error('❌ Error with ' + modelName + ':', error.message);
    }
}

testGemini();
