import React, { useState, useEffect } from 'react';
import { submitFeedback, getProfile } from './api';
import './index.css';

const FeedbackPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'feedback',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Autofill name and email if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            getProfile(token)
                .then((data) => {
                    if (data.user) {
                        setFormData((prev) => ({
                            ...prev,
                            name: data.user.name || '',
                            email: data.user.email || '',
                        }));
                    }
                })
                .catch((err) => console.error('Failed to fetch profile for autofill', err));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const response = await submitFeedback(formData);
            setSuccess(response.message || 'Feedback submitted successfully!');
            setFormData({
                ...formData,
                subject: '',
                message: '',
            });
        } catch (err) {
            setError(err.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="section">
                <h1 className="text-gradient">Feedback & Contact Us</h1>
                <p>We'd love to hear from you! Whether you have a suggestion or found a bug, let us know.</p>

                {success && <div className="mt-3" style={{ color: 'var(--accent-lime)', padding: '1rem', background: 'rgba(163, 230, 53, 0.1)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{success}</div>}
                {error && <div className="error-card mt-3" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="email">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="feedback">General Feedback</option>
                            <option value="problem">Report a Problem</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject of your message"
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us what's on your mind..."
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;
