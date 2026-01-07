import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, getProfile } from './api';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        // Basic Client-side Validation
        if (!name || !email || !password || !confirmPassword) {
            setMessage('All fields are required');
            return;
        }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const data = await register(name, email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            setMessage('Registration successful! Redirecting...');

            // Verification fetch
            try {
                await getProfile(data.token);
            } catch (err) {
                console.warn('Profile fetch after register failed', err);
            }

            // Redirect to dashboard after short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (err) {
            console.error('Registration error:', err);
            setMessage(err.message || 'Registration failed');
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">
                    Join us to master your interview preparation.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label className="auth-label">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group" style={{ position: 'relative' }}>
                        <label className="auth-label">Password</label>
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
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <p style={{ marginTop: 8, color: message.includes('successful') ? '#4ade80' : '#f87171', textAlign: 'center' }}>
                            {message}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                Creating Account...
                            </div>
                        ) : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                    Already have an account? <Link to="/login" style={{ color: '#0ea5e9' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
