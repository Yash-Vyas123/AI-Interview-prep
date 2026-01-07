import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Play,
  PlusCircle,
  MessageSquare,
  LogOut,
  RotateCcw,
  Trophy,
  TrendingUp,
  Compass,
  FileText,
  Mic,
  History as HistoryIcon
} from 'lucide-react';
import { getProfile, getQuizHistory, resetQuizHistory } from './api';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('Loading...');
  const [history, setHistory] = useState([]);
  const [showAll, setShowAll] = useState(false);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="section"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-gradient"
      >
        Dashboard
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '24px', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '10px', background: 'var(--primary)', borderRadius: '12px', color: 'white' }}>
            <User size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: '#f8fafc', fontWeight: 600, fontSize: '1.2rem' }}>
              {user?.name}
            </p>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} /> {user?.email} • <Shield size={12} /> {user?.role}
            </p>
          </div>
        </div>
      </motion.div>

      {/* quick stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <DashboardStat label="Total attempts" value={totalAttempts} icon={<HistoryIcon size={18} />} delay={0.2} color="var(--secondary)" />
        <DashboardStat label="Best score" value={bestScore} icon={<Trophy size={18} />} delay={0.3} color="var(--accent-pink)" />
        <DashboardStat label="Average score" value={avgScore} icon={<TrendingUp size={18} />} delay={0.4} color="var(--accent-lime)" />
      </div>

      {/* actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}
      >
        <button
          onClick={() => navigate('/quiz')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Play size={18} fill="currentColor" /> Start Quiz
        </button>

        <button
          onClick={() => navigate('/roadmap')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-pink)' }}
        >
          <Compass size={18} /> My AI Roadmap
        </button>

        <button
          onClick={() => navigate('/resume')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)' }}
        >
          <FileText size={18} /> Scan Resume
        </button>

        <button
          onClick={() => navigate('/interview')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-purple)' }}
        >
          <Mic size={18} /> Mock Interview
        </button>

        <button
          onClick={() => navigate('/analytics')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-blue)' }}
        >
          <TrendingUp size={18} /> Analytics
        </button>

        {user?.role === 'admin' && (
          <>
            <button
              onClick={() => navigate('/admin/questions')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--secondary)' }}
            >
              <PlusCircle size={18} /> Add Question
            </button>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)' }}
              onClick={() => navigate('/admin/feedback')}
            >
              <MessageSquare size={18} /> View Feedback
            </button>
          </>
        )}

        <button
          className="btn-danger"
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <LogOut size={18} /> Logout
        </button>

        <button
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#334155' }}
          onClick={handleResetStats}
        >
          <RotateCcw size={18} /> Reset
        </button>
      </motion.div>

      {/* history */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <HistoryIcon size={22} className="text-gradient" /> Past Attempts
      </motion.h2>

      {history.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ color: '#cbd5f5' }}
        >
          No attempts yet. Start your first quiz!
        </motion.p>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <AnimatePresence>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {attemptsToShow.map((a, idx) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className="quiz-card"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                      {a.score}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f1f5f9' }}>Score: {a.score} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ 10</span></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <Trophy size={16} color={a.score >= 8 ? 'var(--accent-lime)' : 'gray'} opacity={0.5} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {history.length > 5 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
              onClick={() => setShowAll(prev => !prev)}
            >
              {showAll ? 'Show less' : `View all ${history.length} attempts`}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function DashboardStat({ label, value, icon, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, translateY: -2 }}
      className="info-card"
      style={{
        padding: '1.25rem',
        borderRadius: '20px',
        borderLeft: `4px solid ${color}`,
        background: 'rgba(255,255,255,0.02)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
        {value}
      </div>
    </motion.div>
  );
}

export default DashboardPage;
