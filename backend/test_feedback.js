const fetch = require('node-fetch');

async function testFeedback() {
    const feedbackData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        category: 'feedback',
        message: 'This is a test message from the verification script.',
    };

    try {
        const response = await fetch('http://localhost:5000/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Feedback submission test passed!');
            console.log('Response:', data);
        } else {
            console.error('❌ Feedback submission test failed!');
            console.error('Error:', data);
        }
    } catch (err) {
        console.error('❌ Error during feedback submission test:', err.message);
    }
}

testFeedback();
