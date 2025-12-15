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

    setMessages(prev => [
      ...prev,
      { role: 'user', content: input, timestamp: new Date() },
    ]);

    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message || 'No response',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${error.message}`,
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
              Multi-purpose intelligent assistant
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role}`}>
            <div className={`message-bubble ${m.role}`}>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for research, code, writing, or help..."
          className="chat-input"
        />
        <button type="submit" disabled={isLoading} className="send-btn">
          Send
        </button>
      </form>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          background: #1b202d;
          color: #fff;
        }
        .chat-header {
          padding: 16px;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        .message-row.user {
          justify-content: flex-end;
          display: flex;
        }
        .message-row.assistant {
          justify-content: flex-start;
          display: flex;
        }
        .message-bubble {
          max-width: 70%;
          padding: 12px;
          border-radius: 12px;
        }
        .message-bubble.user {
          background: #7a8194;
        }
        .message-bubble.assistant {
          background: #373e4e;
        }
        .chat-input-container {
          display: flex;
          padding: 12px;
          background: #232323;
        }
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
        }
        .send-btn {
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
}