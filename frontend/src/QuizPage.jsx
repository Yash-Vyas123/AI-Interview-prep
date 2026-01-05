import React, { useState, useEffect } from 'react';
import { startQuiz, submitQuiz, getFeedback, getProfile, deleteQuestion } from './api';
import ReactMarkdown from 'react-markdown';

function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [scoreMsg, setScoreMsg] = useState('');
  const [feedbacks, setFeedbacks] = useState({});
  const [results, setResults] = useState([]);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [quizMode, setQuizMode] = useState('mixed'); // mixed, mcq, open

  // NEW: user-selectable timer (minutes)
  const [timerMinutes, setTimerMinutes] = useState(5); // default 5 min
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // NEW: Track current user for ownership check
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Fetch profile to get user ID
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await getProfile(token);
          setCurrentUserId(user._id);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    }
    fetchUser();
  }, []);

  async function handleStartQuiz() {
    try {
      const token = localStorage.getItem('token');
      const data = await startQuiz(token, {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        count: 5,
        quizMode,
      });

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions found for the selected options.');
      }

      setQuizQuestions(data.questions);
      setAnswers({});
      setScoreMsg('');
      setFeedbacks({});
      setResults([]);
      setAiError('');

      // use selected minutes instead of fixed 300s
      setTimeLeft(timerMinutes * 60);
      setTimerRunning(true);
    } catch (err) {
      setScoreMsg(err.message);
    }
  }


  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      if (quizQuestions.length > 0) {
        handleSubmitQuiz();
      }
      return;
    }

    const id = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timerRunning, timeLeft, quizQuestions]);

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function handleStopQuiz() {
    if (!window.confirm("Are you sure you want to stop the quiz? All progress will be lost.")) return;
    setQuizQuestions([]);
    setAnswers({});
    setScoreMsg('');
    setFeedbacks({});
    setResults([]);
    setAiError('');
    setTimerRunning(false);
    setTimeLeft(0);
  }

  function handleChangeAnswer(qId, value) {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }

  async function handleSubmitQuiz() {
    try {
      const token = localStorage.getItem('token');

      setAiLoading(true);
      setAiError('');
      setFeedbacks({});
      setTimerRunning(false);

      const payload = quizQuestions.map(q => ({
        questionId: q._id,
        userAnswer: answers[q._id] || '',
      }));
      const data = await submitQuiz(token, payload);
      setScoreMsg(`Your score: ${data.score}`);
      setResults(data.results || []);

      const newFeedbacks = {};
      for (const q of quizQuestions) {
        const userAnswer = answers[q._id] || '';
        if (!userAnswer) continue;

        try {
          const fb = await getFeedback(token, {
            questionText: q.text,
            userAnswer,
            questionType: q.type || 'DSA',
            options: q.options && q.options.length > 0 ? q.options : null,
          });
          newFeedbacks[q._id] = fb.feedback;
        } catch (err) {
          newFeedbacks[q._id] = 'AI feedback failed for this question.';
          console.error('AI feedback error for question', q._id, err);
        }
      }
      setFeedbacks(newFeedbacks);
    } catch (err) {
      setScoreMsg(err.message);
      setAiError('AI feedback failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const token = localStorage.getItem('token');
      await deleteQuestion(token, questionId);

      // Remove from UI
      setQuizQuestions(prev => prev.filter(q => q._id !== questionId));

      // Optional: Show success logic or just let it disappear
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const submitDisabled =
    aiLoading || quizQuestions.length === 0 || (!timerRunning && !timeLeft);

  return (
    <div className="section">
      <h1>Quiz</h1>

      {/* Filters row */}
      <div
        className="mt-3"
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}
          >
            Topic
          </label>
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
          >
            <option value="">All</option>
            <option value="DSA">DSA</option>
            <option value="DBMS">DBMS</option>
            <option value="OOPS">OOPS</option>
            <option value="Web Development">Web Development</option>
          </select>
        </div>

        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}
          >
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* NEW: Timer selector */}
        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}
          >
            Timer
          </label>
          <select
            value={timerMinutes}
            onChange={e => setTimerMinutes(Number(e.target.value))}
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={20}>20 minutes</option>
          </select>
        </div>

        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}
          >
            Quiz Mode
          </label>
          <select
            value={quizMode}
            onChange={e => setQuizMode(e.target.value)}
          >
            <option value="mixed">Mixed</option>
            <option value="mcq">Multiple Choice (MCQ)</option>
            <option value="open">Open-ended (Text)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={handleStartQuiz}>Start Quiz</button>
        {quizQuestions.length > 0 && (
          <button
            onClick={handleStopQuiz}
            style={{ backgroundColor: '#dc2626', border: '1px solid #b91c1c' }}
          >
            Stop Quiz
          </button>
        )}
      </div>

      {/* ERROR / STATUS MESSAGES (Always visible) */}
      {scoreMsg && (
        <div className="quiz-card mt-3">
          <strong>{scoreMsg}</strong>
        </div>
      )}
      {aiError && (
        <div className="quiz-card mt-3 error-card">{aiError}</div>
      )}

      {quizQuestions.length > 0 && (
        <div className="mt-3">
          {/* Timer display */}
          <div className="quiz-card info-card">
            <h3>Time left: {formatTime(timeLeft)}</h3>
          </div>

          <h3>Questions</h3>

          {quizQuestions.map(q => (
            <div key={q._id} className="quiz-card" style={{ position: 'relative' }}>
              {/* Delete Button for Owner */}
              {currentUserId && q.createdBy === currentUserId && (
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#ef4444',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                  }}
                  title="Delete this question"
                >
                  Delete
                </button>
              )}

              {/* Metadata row */}
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#e5e7eb',
                  marginBottom: '4px',
                  paddingRight: '60px' // Make space for delete button
                }}
              >
                {q.tags && (
                  <span>
                    {Array.isArray(q.tags) ? q.tags.join(', ') : q.tags}
                  </span>
                )}
                {q.difficulty && (
                  <span style={{ marginLeft: '8px' }}>
                    • Difficulty: {q.difficulty}
                  </span>
                )}
              </div>

              <h4>{q.text}</h4>

              {q.options && q.options.length > 0 ? (
                <div className="mt-2">
                  {q.options.map((opt, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`q-${q._id}`}
                          value={opt}
                          checked={answers[q._id] === opt}
                          onChange={e => handleChangeAnswer(q._id, e.target.value)}
                          disabled={!timerRunning && !timeLeft}
                          style={{ marginRight: '8px', width: 'auto' }}
                        />
                        {opt}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Your answer"
                  value={answers[q._id] || ''}
                  onChange={e => handleChangeAnswer(q._id, e.target.value)}
                  disabled={!timerRunning && !timeLeft}
                />
              )}

              {feedbacks[q._id] && (
                <div className="mt-3 bg-blue-50 border rounded">
                  <strong>Feedback:</strong>
                  <ReactMarkdown>{feedbacks[q._id]}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}

          <button onClick={handleSubmitQuiz} disabled={submitDisabled}>
            {aiLoading ? 'Getting AI feedback...' : 'Submit Quiz'}
          </button>

          {/* Results section */}
          {results.length > 0 && (
            <div className="quiz-card mt-3">
              <h4>Question results</h4>
              <ul>
                {results.map(r => (
                  <li key={r.questionId}>
                    {r.correct ? '✅ Correct' : '❌ Incorrect'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizPage;
