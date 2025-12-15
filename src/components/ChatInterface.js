'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message || 'No response',
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error getting response',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content-flex">
          <img src="/astro-bot.gif" alt="Astro Bot" className="header-gif" />
          <div className="header-title-group">
            <span className="header-title">AI-Based Omni Agent</span>
            <span className="header-subtitle">
              Multi-purpose intelligent assistant <br />
              git repo:{' '}
              <a
                href="https://github.com/Sachinmehar21"
                target="_blank"
                rel="noopener noreferrer"
                className="header-link"
              >
                here
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-message-welcome">
            <img
              src="/chatbot-logo.png"
              alt="Chatbot Logo"
              className="welcome-logo"
            />
            <div className="welcome-ask">AI-Based Omni Agent</div>
            <h2 className="welcome-title">
              One AI for research, coding, writing & academics
            </h2>
            <p className="welcome-subtitle">
              Gemini-powered intelligent assistant
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-row ${
              msg.role === 'user' ? 'user' : 'assistant'
            }`}
          >
            <div
              className={`message-bubble ${
                msg.role === 'user'
                  ? 'user'
                  : msg.isError
                  ? 'error'
                  : 'assistant'
              }`}
            >
              <p>{msg.content}</p>
              <p className="timestamp">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-row assistant">
            <div className="message-bubble assistant">
              <div className="typing-indicator">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for research, code, writing, or help..."
          className="chat-input"
          disabled={isLoading}
        />
        <button className="send-btn" disabled={!input.trim() || isLoading}>
          Send
        </button>
      </form>

      {/* CSS */}
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          background: #1b202d;
        }
        .chat-header {
          padding: 16px 24px 0;
          color: #fff;
        }
        .header-content-flex {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .header-gif {
          height: 64px;
          border-radius: 12px;
        }
        .header-title {
          font-size: 1.2rem;
          font-weight: 600;
        }
        .header-subtitle {
          font-size: 0.85rem;
          color: #bdbdbd;
        }
        .header-link {
          color: #4f8cff;
        }
        .chat-messages {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }
        .message-row {
          display: flex;
          margin-bottom: 12px;
        }
        .message-row.user {
          justify-content: flex-end;
        }
        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 80%;
        }
        .message-bubble.user {
          background: #7a8194;
        }
        .message-bubble.assistant {
          background: #373e4e;
        }
        .message-bubble.error {
          background: #a00;
        }
        .timestamp {
          font-size: 0.7rem;
          color: #aaa;
          margin-top: 4px;
        }
        .chat-input-container {
          display: flex;
          margin: 16px;
          background: #232323;
          border-radius: 24px;
          padding: 12px;
        }
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          outline: none;
        }
        .send-btn {
          background: #fff;
          border: none;
          padding: 0 16px;
          border-radius: 20px;
        }
        .typing-indicator {
          display: flex;
          gap: 4px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #888;
          border-radius: 50%;
          animation: bounce 1s infinite alternate;
        }
        @keyframes bounce {
          to {
            transform: translateY(-6px);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}