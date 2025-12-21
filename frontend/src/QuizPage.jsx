import React, { useState, useEffect } from 'react';
import { startQuiz, submitQuiz, getFeedback } from './api';
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

  // NEW: timer state — e.g. 300 seconds = 5 minutes
  const QUIZ_DURATION = 300;
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timerRunning, setTimerRunning] = useState(false);

  // Start quiz + timer
  async function handleStartQuiz() {
    try {
      const token = localStorage.getItem('token');
      const data = await startQuiz(token, {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        count: 5,
      });

      setQuizQuestions(data.questions);
      setAnswers({});
      setScoreMsg('');
      setFeedbacks({});
      setResults([]);
      setAiError('');

      // reset and start timer
      setTimeLeft(QUIZ_DURATION);
      setTimerRunning(true);
    } catch (err) {
      setScoreMsg(err.message);
    }
  }

  // Timer effect
  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      // auto-submit when time is up
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

  function handleChangeAnswer(qId, value) {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }

  async function handleSubmitQuiz() {
    try {
      const token = localStorage.getItem('token');

      setAiLoading(true);
      setAiError('');
      setFeedbacks({});
      setTimerRunning(false); // stop timer on manual submit

      // submit quiz and get score
      const payload = quizQuestions.map(q => ({
        questionId: q._id,
        userAnswer: answers[q._id] || '',
      }));
      const data = await submitQuiz(token, payload);
      setScoreMsg(`Your score: ${data.score}`);
      setResults(data.results || []);

      // fetch AI feedback for answered questions
      const newFeedbacks = {};
      for (const q of quizQuestions) {
        const userAnswer = answers[q._id] || '';
        if (!userAnswer) continue;

        try {
          const fb = await getFeedback(token, {
            questionText: q.text,
            userAnswer,
            questionType: q.type || 'DSA',
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

  return (
    <div className="section">
      <h1>Quiz</h1>

      {/* Filters row */}
      <div
        className="mt-3"
        style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}
      >
        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}
          >
            Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">All</option>
            <option value="DSA">DSA</option>
            <option value="System Design">System Design</option>
            <option value="ML">ML</option>
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
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <button onClick={handleStartQuiz}>Start Quiz</button>

      {quizQuestions.length > 0 && (
        <div className="mt-3">
          {/* Timer display */}
          <div className="quiz-card">
            <h3>Time left: {formatTime(timeLeft)}</h3>
          </div>

          <h3>Questions:</h3>
          {quizQuestions.map(q => (
  <div key={q._id} className="quiz-card">
    {/* Metadata row */}
    <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '4px' }}>
      {q.tags && (
        <span>{q.tags}</span>  // or q.topic if your field name is different
      )}
      {q.difficulty && (
        <span style={{ marginLeft: '8px' }}>
          • Difficulty: {q.difficulty}
        </span>
      )}
    </div>

    <h4>{q.text}</h4>
    <input
      type="text"
      placeholder="Your answer"
      value={answers[q._id] || ''}
      onChange={e => handleChangeAnswer(q._id, e.target.value)}
      disabled={!timerRunning && !aiLoading}
    />

    {feedbacks[q._id] && (
      <div className="mt-3 bg-blue-50 border rounded">
        <strong>Feedback:</strong>
        <ReactMarkdown>{feedbacks[q._id]}</ReactMarkdown>
      </div>
    )}
  </div>
))}


          <button
            onClick={handleSubmitQuiz}
            disabled={aiLoading || !timerRunning}
          >
            {aiLoading ? 'Getting AI feedback...' : 'Submit Quiz'}
          </button>

          {scoreMsg && (
            <div className="quiz-card mt-3">
              <strong>{scoreMsg}</strong>
            </div>
          )}

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

          {aiError && (
            <div className="quiz-card mt-3 error-card">
              {aiError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizPage;
