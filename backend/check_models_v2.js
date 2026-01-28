const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use the official way to list models if available, or just test some newer names
        // Actually, the SDK doesn't always expose a clean listModels without direct REST calls in some versions.
        // Let's try to test gemini-2.0-flash-exp which is usually available now.
        const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-exp', 'gemini-2.0-flash'];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent('hi');
                console.log(`✅ ${m} WORKS`);
                process.exit(0); // If one works, we are good
            } catch (e) {
                console.log(`❌ ${m} FAILED: ${e.message}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

listModels();
