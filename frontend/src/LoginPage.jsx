import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login, getProfile } from './api';

function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setMessage('Login successful');

      if (onSuccess) onSuccess(); // redirect to /dashboard from index.js

      const profile = await getProfile(data.token);
      console.log('Profile:', profile);
    } catch (err) {
      setMessage(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="auth-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <LogIn className="text-gradient" /> Welcome Back
          </h1>
          <p className="auth-subtitle">
            Log in to practice DSA & behavioral interviews with AI-powered feedback.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="auth-input-group"
          >
            <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="auth-input-group"
            style={{ position: 'relative' }}
          >
            <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={14} /> Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                width: 'auto',
                height: 'auto',
                boxShadow: 'none',
                marginTop: 0,
                color: '#94a3b8'
              }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          {message && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: 8, color: message === 'Login successful' ? '#4ade80' : '#f87171', textAlign: 'center' }}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                Logging in...
              </div>
            ) : 'Login'}
          </motion.button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8' }}
        >
          Don't have an account? <Link to="/register" style={{ color: '#0ea5e9', fontWeight: '500' }}>Register</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
