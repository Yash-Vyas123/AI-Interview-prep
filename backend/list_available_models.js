const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const axios = require('axios');

async function listModels() {
    try {
        const key = process.env.GEMINI_API_KEY;
        console.log(`Using key: ${key.substring(0, 5)}...`);
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        console.log('Available Models:');
        response.data.models.forEach(m => {
            console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
        });
    } catch (err) {
        if (err.response) {
            console.error(`Error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
        } else {
            console.error(err.message);
        }
    }
}

listModels();
