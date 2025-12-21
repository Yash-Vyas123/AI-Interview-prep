import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getQuizHistory } from './api';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('Loading...');
  const [history, setHistory] = useState([]);
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
        setHistory(hist.attempts);
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

  if (message) return <p>{message}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      <button onClick={handleLogout}>Logout</button>
      <button style={{ marginLeft: '8px' }} onClick={() => navigate('/quiz')}>
        Go to Quiz
      </button>
      {user?.role === 'admin' && (
        <button
          style={{ marginLeft: '8px' }}
          onClick={() => navigate('/admin/questions')}
        >
          Admin: Add Question
        </button>
      )}

      <hr />

      <h2>Past Attempts</h2>
      {history.length === 0 && <p>No attempts yet.</p>}
      {history.length > 0 && (
        <ul>
          {history.map(a => (
            <li key={a._id}>
              Score: {a.score} – {new Date(a.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;
