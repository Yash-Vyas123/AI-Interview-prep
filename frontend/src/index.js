import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import './App.css';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import QuizPage from './QuizPage';
import AdminQuestionsPage from './AdminQuestionsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginWrapper />} />
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
      <header className="section" style={{ marginBottom: '16px', textAlign: 'left' }}>
        <h2>AI Interview Prep</h2>
      </header>
      <AppRoutes />
    </div>
  </BrowserRouter>
);
