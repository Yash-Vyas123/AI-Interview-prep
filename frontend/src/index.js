import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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
        <p className="app-footer-copy">
          &copy; {new Date().getFullYear()} AI Interview Prep. All rights reserved.
        </p>
        <div className="app-footer-links">
          <a href="/feedback" className="app-footer-link">Feedback</a>
          <a href="#" className="app-footer-link">Terms</a>
          <a href="#" className="app-footer-link">Privacy</a>
        </div>
      </footer>
    </div>
  </BrowserRouter>
);
