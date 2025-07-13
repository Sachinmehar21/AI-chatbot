'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.error ? `Error: ${data.error}` : data.message,
        timestamp: new Date(),
        isError: !!data.error
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date(),
        isError: true
      }]);
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
            <span className="header-title">AI Chatbot</span>
            <span className="header-subtitle">
              by <a href="https://github.com/Sachinmehar21" target="_blank" rel="noopener noreferrer" className="header-link">sachinmehar21</a>
            </span>
          </div>
        </div>
        {/* Removed dropdown arrow */}
      </div>
      {/* Chat messages area */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-message-welcome">
            <img src="/chatbot-logo.png" alt="Chatbot Logo" className="welcome-logo" />
            <div className="welcome-ask">Ask Anything and Everything!</div>
            <h2 className="welcome-title">Your personalized AI chatbot</h2>
            <p className="welcome-subtitle">Created by <a href="https://github.com/Sachinmehar21" target="_blank" rel="noopener noreferrer" className="header-link">sachinmehar21</a></p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`message-row ${message.role === 'user' ? 'user' : 'assistant'}`}> 
            <div className={`message-bubble ${message.role === 'user' ? 'user' : message.isError ? 'error' : 'assistant'}`}> 
              <p>{message.content}</p>
              <p className="timestamp">{message.timestamp.toLocaleTimeString()}</p>
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
      {/* Input area */}
      <form onSubmit={handleSubmit} className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
          className="send-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#232323"/>
            <path d="M12 8v8M12 8l-4 4M12 8l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </button>
        </form>
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          background: #1B202D;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .chat-header {
          background: transparent;
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
          padding: 16px 24px 0 24px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          border-bottom: none;
          border-radius: 0;
          box-shadow: none;
          justify-content: space-between;
        }
        .header-title-group {
          display: flex;
          flex-direction: column;
        }
        .header-title {
          font-size: 1.2rem;
          font-weight: 600;
        }
        .header-subtitle {
          font-size: 0.85rem;
          font-weight: 400;
          color: #bdbdbd;
        }
        .header-link {
          color: #4f8cff;
          text-decoration: underline;
          font-size: 0.85rem;
        }
        .header-link:hover {
          color: #82b1ff;
        }
        .dropdown-arrow {
          font-size: 1rem;
          margin-left: 8px;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          background: #1B202D;
          padding: 24px;
        }
        .empty-message {
          color: #888;
          text-align: center;
          margin-top: 40px;
        }
        .message-row {
          display: flex;
          margin-bottom: 12px;
        }
        .message-row.user {
          justify-content: flex-end;
        }
        .message-row.assistant {
          justify-content: flex-start;
        }
        .message-bubble {
          max-width: 80vw;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 1rem;
          word-break: break-word;
        }
        .message-bubble.user {
          background: #7A8194;
          color: #fff;
          border-bottom-right-radius: 6px;
        }
        .message-bubble.assistant {
          background: #373E4E;
          color: #fff;
          border-bottom-left-radius: 6px;
        }
        .message-bubble.error {
          background: #a00;
          color: #fff;
        }
        .timestamp {
          font-size: 0.7rem;
          color: #aaa;
          margin-top: 6px;
        }
        .chat-input-container {
          display: flex;
          align-items: center;
          background: #232323;
          padding: 12px 16px;
          border-radius: 24px;
          margin: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1rem;
          outline: none;
          padding: 8px;
        }
        .send-btn {
          background: #fff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .send-btn:hover {
          background: #e0e0e0;
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
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          to {
            opacity: 0.3;
            transform: translateY(-8px);
          }
        }
        .empty-message-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin-top: 40px;
          margin-bottom: 40px;
        }
        .welcome-logo {
          width: 160px;
          max-width: 60vw;
          height: auto;
          margin-bottom: 24px;
        }
        .welcome-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #d1d5db;
          margin-bottom: 8px;
        }
        .welcome-subtitle {
          font-size: 1.1rem;
          color: #bdbdbd;
        }
        .welcome-ask {
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 10px;
          margin-top: 10px;
          text-align: center;
          letter-spacing: 0.5px;
        }
        @media (max-width: 600px) {
          .chat-header {
            padding: 8px 8px 0 8px;
          }
          .chat-input-container {
            margin: 8px;
            padding: 8px 8px;
          }
          .chat-messages {
            padding: 8px 4px;
          }
          .welcome-logo {
            width: 150px;
          }
          .welcome-title {
            font-size: 1rem;
          }
          .welcome-subtitle {
            font-size: 0.95rem;
          }
          .empty-message-welcome {
            margin-top: 12px;
            margin-bottom: 12px;
          }
          .chat-input {
            font-size: 1rem;
            padding: 8px 4px;
          }
          .send-btn {
            width: 36px;
            height: 36px;
          }
        }
        .header-content-flex {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-gif {
          height: 64px;
          width: auto;
          margin-right: 4px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
} 