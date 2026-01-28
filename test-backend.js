const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    try {
        // 1. Register User     
        console.log('Testing Registration...');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'user'
        });
        console.log('Registration Success:', regRes.data.role === 'user');

        // 2. Login User
        console.log('Testing Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: regRes.data.email,
            password: 'password123'
        });
        console.log('Login Success:', loginRes.data.token ? true : false);

        // 3. Register Admin
        console.log('Testing Admin Registration...');
        const adminRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Admin',
            email: `admin${Date.now()}@example.com`,
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin Registration Success:', adminRes.data.role === 'admin');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testAuth();
