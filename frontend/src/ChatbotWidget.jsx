// ChatbotWidget.jsx
import React, { useState } from "react";
import axios from "axios";
import "./ChatbotWidget.css"; // for styles

const API_BASE_URL = "http://localhost:5000"; // backend URL

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = { from: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      // convert previous messages to history for backend
      const history = messages.map((m) => ({
        role: m.from === "user" ? "user" : "model",
        content: m.text,
      }));

      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/ai/chat`,
        {
          message: currentMessage,
          history,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const botMsg = { from: "bot", text: res.data.reply || "No reply." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error talking to AI. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>AI Coach</span>
          </div>

          <div className="chatbot-body">
            {messages.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                {/* Clean empty state or maybe a subtle icon? Keeping it empty for now as requested */}
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "chatbot-msg " +
                  (m.from === "user"
                    ? "chatbot-msg-user"
                    : "chatbot-msg-bot")
                }
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <p className="chatbot-typing">AI is thinking...</p>
            )}
          </div>

          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              className="chatbot-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
            />
            <button className="chatbot-send-btn" type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        AI CHAT
      </button>
    </div>
  );
}
