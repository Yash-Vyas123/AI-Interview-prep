import React, { useState } from 'react';
import { createQuestion } from './api';

function AdminQuestionsPage() {
  const [text, setText] = useState('');
  const [type, setType] = useState('DSA');
  const [difficulty, setDifficulty] = useState('easy');
  const [tags, setTags] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await createQuestion(token, {
        text,
        type,
        difficulty,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        correctAnswer,
      });
      setMessage('Question created successfully');
      setText('');
      setTags('');
      setCorrectAnswer('');
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <h1>Admin – Add Question</h1>
      <form onSubmit={handleSubmit}>
        <div className="section">
          <label>Question text</label><br />
          <textarea
            rows="3"
            cols="60"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>

        <div className="section">
          <label>Type</label><br />
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="DSA">DSA</option>
            <option value="behavioral">Behavioral</option>
          </select>
        </div>

        <div className="section">
          <label>Difficulty</label><br />
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="section">
          <label>Tags (comma separated)</label><br />
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <div className="section">
          <label>Correct answer</label><br />
          <input
            type="text"
            value={correctAnswer}
            onChange={e => setCorrectAnswer(e.target.value)}
          />
        </div>

        <button type="submit">Create Question</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminQuestionsPage;
