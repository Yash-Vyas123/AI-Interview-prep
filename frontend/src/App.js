import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminQuestionsPage from './pages/AdminQuestionsPage';
// App.js
import './App.css';

function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Interview Prep</h1>
      <p>Welcome to your interview prep app.</p>
      <Link to="/admin/questions">Go to Admin Questions</Link>
    </div>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage />} />
      </Routes>
    </div>
  );
}

export default App;
