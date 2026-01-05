import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getQuizHistory, resetQuizHistory } from './api';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('Loading...');
  const [history, setHistory] = useState([]);
  const [showAll, setShowAll] = useState(false);   // NEW
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token, please login again.');
      return;
    }

    async function fetchUserAndHistory() {
      try {
        const data = await getProfile(token);
        setUser(data.user);
        setMessage('');

        const hist = await getQuizHistory(token);
        setHistory(hist.attempts || []);
      } catch (err) {
        setMessage(err.message);
      }
    }

    fetchUserAndHistory();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  async function handleResetStats() {
    if (!window.confirm('Are you sure you want to reset all your statistics? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await resetQuizHistory(token);
      setHistory([]);
      alert('Statistics reset successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to reset statistics');
    }
  }

  if (message) {
    return (
      <div className="section">
        <p>{message}</p>
      </div>
    );
  }

  // simple stats
  const totalAttempts = history.length;
  const bestScore = totalAttempts
    ? Math.max(...history.map(a => a.score || 0))
    : 0;
  const avgScore = totalAttempts
    ? Math.round(
      history.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts
    )
    : 0;

  // show only last 5 by default
  const attemptsToShow = showAll ? history : history.slice(0, 5);

  return (
    <div className="section">
      <h1>Dashboard</h1>

      <p style={{ marginBottom: '8px', color: '#e5e7eb' }}>
        Welcome back, <strong>{user?.name}</strong>
      </p>
      <p style={{ marginBottom: '16px', color: '#cbd5f5', fontSize: '14px' }}>
        Email: {user?.email} • Role: {user?.role}
      </p>

      {/* quick stats row */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <DashboardStat label="Total attempts" value={totalAttempts} />
        <DashboardStat label="Best score" value={bestScore} />
        <DashboardStat label="Average score" value={avgScore} />
      </div>

      {/* actions */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/quiz')}>Start Quiz</button>

        {user?.role === 'admin' && (
          <button
            style={{ marginLeft: '8px' }}
            onClick={() => navigate('/admin/questions')}
          >
            Admin: Add Question
          </button>
        )}
        {user?.role === 'admin' && (
          <button
            style={{ marginLeft: '8px', backgroundColor: '#8b5cf6' }}
            onClick={() => navigate('/admin/feedback')}
          >
            Admin: View Feedback
          </button>
        )}
        <button
          className="btn-danger"
          style={{ marginLeft: '8px' }}
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          style={{ marginLeft: '8px', backgroundColor: '#6c757d' }}
          onClick={handleResetStats}
        >
          Reset
        </button>
      </div>

      {/* history */}
      <h2 style={{ marginTop: '8px' }}>Past Attempts</h2>
      {history.length === 0 && (
        <p style={{ color: '#cbd5f5' }}>No attempts yet. Start your first quiz!</p>
      )}

      {history.length > 0 && (
        <>
          <ul style={{ paddingLeft: '18px' }}>
            {attemptsToShow.map(a => (
              <li key={a._id} style={{ marginBottom: '4px', color: '#e5e7eb' }}>
                Score: {a.score} – {new Date(a.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>

          {history.length > 5 && (
            <button
              style={{ marginTop: '8px' }}
              onClick={() => setShowAll(prev => !prev)}
            >
              {showAll ? 'Show less' : 'View all attempts'}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function DashboardStat({ label, value }) {
  return (
    <div
      className="info-card"
      style={{
        flex: '1 1 120px',
        minWidth: '120px',
        padding: '12px 14px',
        borderRadius: '16px',
        marginBottom: '8px',
      }}
    >
      <div style={{ fontSize: '12px', color: '#cbd5f5', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 700, color: '#f9fafb' }}>
        {value}
      </div>
    </div>
  );
}

export default DashboardPage;
