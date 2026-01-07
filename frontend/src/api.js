// frontend/src/api.js

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";


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
  const res = await fetch(`${API_URL}/api/auth/profile`, {
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


export async function generateRoadmap(token, { targetRole, experienceLevel }) {
  const res = await fetch(`${API_URL}/api/roadmap/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetRole, experienceLevel }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Roadmap generation failed");
  return data;
}

export async function getRoadmap(token) {
  const res = await fetch(`${API_URL}/api/roadmap`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch roadmap");
  return data;
}

export async function toggleRoadmapTopic(token, { weekIndex, topicId }) {
  const res = await fetch(`${API_URL}/api/roadmap/toggle-topic`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ weekIndex, topicId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to toggle topic");
  return data;
}

export async function analyzeResume(token, formData) {
  const res = await fetch(`${API_URL}/api/resume/analyze`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type is inferred for FormData
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Resume analysis failed");
  return data;
}

export async function getResumeAnalysis(token) {
  const res = await fetch(`${API_URL}/api/resume`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
}

export async function startInterview(token, { jobRole, topic, difficulty }) {
  const res = await fetch(`${API_URL}/api/interview/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobRole, topic, difficulty }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to start interview');
  return data; // { interviewId, question }
}

export async function submitAnswer(token, interviewId, userAnswer) {
  const res = await fetch(`${API_URL}/api/interview/${interviewId}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userAnswer }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit answer');
  return data; // { feedback, nextQuestion }
}

export async function endInterview(token, interviewId) {
  const res = await fetch(`${API_URL}/api/interview/${interviewId}/end`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to end interview');
  return data; // { summary }
}

export async function getAnalytics(token) {
  const res = await fetch(`${API_URL}/api/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch analytics');
  return data; // { timeline, mastery, insights, stats }
}
