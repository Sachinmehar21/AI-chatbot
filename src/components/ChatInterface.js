'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  // Handle iOS keyboard
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const keyboardH = windowHeight - viewportHeight;
        setKeyboardHeight(keyboardH > 0 ? keyboardH : 0);
        scrollToBottom();
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, []);

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
      {/* Input area - fixed at bottom */}
      <div className="input-wrapper" style={{ bottom: keyboardHeight }}>
        <form onSubmit={handleSubmit} className="chat-input-container">
          <input
            ref={inputRef}
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
      </div>
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          height: -webkit-fill-available;
          background: #1B202D;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }
        .chat-header {
          background: #1B202D;
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
          padding: calc(env(safe-area-inset-top, 0px) + 8px) calc(env(safe-area-inset-right, 0px) + 16px) 8px calc(env(safe-area-inset-left, 0px) + 16px);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          z-index: 10;
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
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          background: #1B202D;
          padding: 16px;
          padding-left: calc(env(safe-area-inset-left, 0px) + 16px);
          padding-right: calc(env(safe-area-inset-right, 0px) + 16px);
          padding-bottom: 90px;
          -webkit-overflow-scrolling: touch;
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
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 1rem;
          word-break: break-word;
          white-space: pre-wrap;
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
        .message-bubble p {
          margin: 0;
        }
        .timestamp {
          font-size: 0.7rem;
          color: #aaa;
          margin-top: 6px;
        }
        .input-wrapper {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: #1B202D;
          padding: 8px 16px;
          padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
          padding-left: calc(env(safe-area-inset-left, 0px) + 16px);
          padding-right: calc(env(safe-area-inset-right, 0px) + 16px);
          z-index: 100;
          transition: bottom 0.1s ease-out;
        }
        .chat-input-container {
          display: flex;
          align-items: center;
          background: #2A2A2A;
          padding: 8px 12px;
          border-radius: 24px;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
        }
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 16px;
          outline: none;
          padding: 8px;
          min-height: 24px;
        }
        .send-btn {
          background: #fff;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          flex-shrink: 0;
        }
        .send-btn:hover {
          background: #e0e0e0;
        }
        .send-btn:active {
          transform: scale(0.95);
        }
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px 0;
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
          padding: 40px 20px;
        }
        .welcome-logo {
          width: 140px;
          max-width: 50vw;
          height: auto;
          margin-bottom: 24px;
        }
        .welcome-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #d1d5db;
          margin: 0 0 8px 0;
        }
        .welcome-subtitle {
          font-size: 1rem;
          color: #bdbdbd;
          margin: 0;
        }
        .welcome-ask {
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 10px;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .header-content-flex {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-gif {
          height: 50px;
          width: auto;
          border-radius: 10px;
        }
        @media (max-width: 600px) {
          .chat-header {
            padding: calc(env(safe-area-inset-top, 0px) + 6px) calc(env(safe-area-inset-right, 0px) + 12px) 6px calc(env(safe-area-inset-left, 0px) + 12px);
          }
          .chat-messages {
            padding: 12px;
            padding-left: calc(env(safe-area-inset-left, 0px) + 12px);
            padding-right: calc(env(safe-area-inset-right, 0px) + 12px);
            padding-bottom: 80px;
          }
          .input-wrapper {
            padding: 8px 12px;
            padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 8px);
            padding-left: calc(env(safe-area-inset-left, 0px) + 12px);
            padding-right: calc(env(safe-area-inset-right, 0px) + 12px);
          }
          .welcome-ask {
            font-size: 1.5rem;
          }
          .welcome-logo {
            width: 120px;
          }
          .header-gif {
            height: 44px;
          }
        }
      `}</style>
    </div>
  );
} 
