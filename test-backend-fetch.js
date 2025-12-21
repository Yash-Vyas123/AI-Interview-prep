const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    try {
        // 1. Register User
        console.log('Testing Registration...');
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                role: 'user'
            })
        });
        const regData = await regRes.json();
        console.log('Registration Status:', regRes.status);
        console.log('Registration Success:', regData.role === 'user');

        // 2. Login User
        console.log('Testing Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: regData.email,
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Success:', loginData.token ? true : false);

        // 3. Register Admin
        console.log('Testing Admin Registration...');
        const adminRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Admin',
                email: `admin${Date.now()}@example.com`,
                password: 'password123',
                role: 'admin'
            })
        });
        const adminData = await adminRes.json();
        console.log('Admin Registration Status:', adminRes.status);
        console.log('Admin Registration Success:', adminData.role === 'admin');

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testAuth();
