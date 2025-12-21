import React, { useState } from 'react';
import { login, getProfile } from './api';

function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      setMessage('Login successful');

      if (onSuccess) onSuccess(); // redirect to /dashboard from index.js

      const profile = await getProfile(data.token);
      console.log('Profile:', profile);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <h1>AI Interview Prep - Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginPage;
