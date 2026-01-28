const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function listModels() {
    try {
        const key = process.env.GEMINI_API_KEY;
        console.log(`Using key: ${key.substring(0, 5)}...`);
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await res.json();

        if (data.error) {
            console.error(`Error ${data.error.code}: ${data.error.message}`);
            return;
        }

        console.log('Available Models:');
        data.models.forEach(m => {
            console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
        });
    } catch (err) {
        console.error(err.message);
    }
}

listModels();
