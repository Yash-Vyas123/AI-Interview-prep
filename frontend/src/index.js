import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import './index.css';
import './App.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import DashboardPage from './DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import QuizPage from './QuizPage';
import AdminQuestionsPage from './AdminQuestionsPage';
import ProfilePage from './ProfilePage';   // NEW
import FeedbackPage from './FeedbackPage';
import AdminFeedbackPage from './AdminFeedbackPage';
import RoadmapPage from './RoadmapPage';
import ResumePage from './ResumePage';
import MockInterviewPage from './MockInterviewPage';
import AnalyticsPage from './AnalyticsPage';
import AdminDashboardPage from './AdminDashboardPage';
import MentorDashboardPage from './MentorDashboardPage';
import HeaderUserMenu from './HeaderUserMenu';
import ChatbotWidget from './ChatbotWidget';   // adjust path if needed

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginWrapper />} />
      <Route path="/login" element={<LoginWrapper />} />
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
      <Route
        path="/admin/questions"
        element={
          <ProtectedRoute>
            <AdminQuestionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"          // NEW route
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <FeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <ProtectedRoute>
            <AdminFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <RoadmapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <ResumePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <MockInterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={['mentor', 'admin']}>
            <MentorDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  return <LoginPage onSuccess={() => navigate('/dashboard')} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <div className="app-container">
      <header className="app-header">
        <h2 className="app-header-title">AI Interview Prep</h2>
        <HeaderUserMenu />   {/* NEW avatar + menu on right */}
      </header>

      {/* GLOBAL AI CHATBOT, visible on all pages */}
      <ChatbotWidget />

      <AppRoutes />

      <footer className="app-footer">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          Thanks for visiting and happy coding! <Heart size={16} fill="var(--accent-pink)" color="var(--accent-pink)" />
        </motion.p>
        <p className="app-footer-copy">
          &copy; {new Date().getFullYear()} AI Interview Prep. All rights reserved.
        </p>
        <div className="app-footer-links">
          <a href="/roadmap" className="app-footer-link">AI Roadmap</a>
          <a href="/feedback" className="app-footer-link">Feedback</a>
          <a href="#" className="app-footer-link">Terms</a>
          <a href="#" className="app-footer-link">Privacy</a>
        </div>
      </footer>
    </div>
  </BrowserRouter>
);
