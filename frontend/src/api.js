const API_URL = 'http://localhost:5000';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Profile failed');
  return data;
}

export async function startQuiz(token, { topic, difficulty, count }) {
  const res = await fetch(`${API_URL}/api/quizzes/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ topic, difficulty, count }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Quiz start failed');
  return data; // { questions: [...] }
}

export async function submitQuiz(token, answers) {
  const res = await fetch(`${API_URL}/api/quizzes/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }), // [{questionId, userAnswer}]
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Quiz submit failed');
  return data; // { score, attemptId }
}

export async function getFeedback(token, { questionText, userAnswer, questionType }) {
  const res = await fetch(`${API_URL}/api/ai/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questionText, userAnswer, questionType }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Feedback failed');
  return data; // { feedback }
}

export async function getQuizHistory(token) {
  const res = await fetch(`${API_URL}/api/quizzes/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'History failed');
  return data; // { attempts: [...] }
}

export async function createQuestion(token, payload) {
  const res = await fetch(`${API_URL}/api/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Create question failed');
  return data;
}


