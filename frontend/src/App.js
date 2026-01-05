import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminQuestionsPage from './pages/AdminQuestionsPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import DashboardPage from './DashboardPage';
import QuizPage from './QuizPage';
import ProtectedRoute from './ProtectedRoute';
import FeedbackPage from './FeedbackPage';
import './App.css';

// NOTE: This App.js seems unused as index.js renders its own routes.
// Updating it to mirror the basic structure just in case.

function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Interview Prep</h1>
      <p>Welcome to your interview prep app.</p>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>Login</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/register" style={{ textDecoration: 'none', color: 'blue' }}>Register</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'blue' }}>Dashboard (Protected)</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/admin/questions" style={{ textDecoration: 'none', color: 'blue' }}>Admin Questions</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function App() {
  return (
    <div>
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
      </Routes>
    </div>
  );
}

export default App;
