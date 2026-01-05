const API_URL = 'http://localhost:5000';

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// register function added

export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

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

export async function startQuiz(token, body) {
  const res = await fetch(`${API_URL}/api/quizzes/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to start quiz');
  return res.json();
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

export async function getFeedback(token, { questionText, userAnswer, questionType, options }) {
  const res = await fetch(`${API_URL}/api/ai/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questionText, userAnswer, questionType, options }),
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


export async function updateProfile(token, profileData) {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Profile update failed');
  return data;
}



export async function resetQuizHistory(token) {
  const res = await fetch(`${API_URL}/api/quizzes/history`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Reset history failed');
  return data;
}
export async function deleteQuestion(token, id) {
  const res = await fetch(`${API_URL}/api/questions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delete question failed');
  return data;
}

export async function submitFeedback(feedbackData) {
  const res = await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Feedback submission failed');
  return data;
}

export async function getFeedbacks(token) {
  const res = await fetch(`${API_URL}/api/feedback`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch feedback');
  return data;
}

export async function replyToFeedback(token, id, message) {
  const res = await fetch(`${API_URL}/api/feedback/${id}/reply`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add reply');
  return data;
}

