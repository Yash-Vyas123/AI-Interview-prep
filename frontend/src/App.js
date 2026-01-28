import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminQuestionsPage from './pages/AdminQuestionsPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import DashboardPage from './DashboardPage';
import QuizPage from './QuizPage';
import ProtectedRoute from './ProtectedRoute';
import FeedbackPage from './FeedbackPage';
import ResumePage from './ResumePage';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Rocket, ShieldCheck, LayoutDashboard, Settings } from 'lucide-react';
import './App.css';

// NOTE: This App.js seems unused as index.js renders its own routes.
// Updating it to mirror the basic structure just in case.

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="app-container"
      style={{ textAlign: 'center', paddingTop: '10vh' }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
          <TypeAnimation
            sequence={[
              'Master DSA',
              2000,
              'Ape Behavioral Prep',
              2000,
              'Crush Technicals',
              2000,
              'Prepfolio AI',
              5000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-gradient"
          />
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Your Gen-Z powered career companion. Level up your interview game with AI-driven insights and real-time feedback.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {[
          { to: "/login", text: "Login", icon: <Rocket size={20} />, color: 'var(--primary)' },
          { to: "/register", text: "Register", icon: <ShieldCheck size={20} />, color: 'var(--secondary)' },
          { to: "/dashboard", text: "Dashboard", icon: <LayoutDashboard size={20} />, color: 'var(--accent-pink)' },
          { to: "/admin/questions", text: "Admin", icon: <Settings size={20} />, color: 'var(--accent-lime)' },
        ].map((item, index) => (
          <motion.div
            key={item.to}
            whileHover={{ scale: 1.05, translateY: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <Link to={item.to} style={{ textDecoration: 'none' }}>
              <div className="glass-panel" style={{
                padding: '1.5rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                borderBottom: `3px solid ${item.color}`
              }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <span style={{ fontWeight: 600, color: 'white' }}>{item.text}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}


function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/questions" element={<AdminQuestionsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}


export default App;
