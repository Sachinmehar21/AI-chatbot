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
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
      {/* Top Header */}
      <header className="w-full bg-gray-950 border-b border-gray-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-md mx-auto flex flex-col items-center py-3 px-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">AI Chatbot</h1>
          <a
            href="https://github.com/Sachinmehar21"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-indigo-400 hover:underline mt-1"
          >
            Made by <span className="font-semibold">sachinmehar21</span>
          </a>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-1 sm:px-3 py-2 sm:py-4 space-y-3 sm:space-y-4 max-w-md mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-10 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-700 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">Welcome to Gemini Chatbot!</h3>
            <p className="text-gray-400 max-w-xs mx-auto text-xs sm:text-sm">Ask me anything! I'm here to help with questions, coding, writing, analysis, and more.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80vw] sm:max-w-xs md:max-w-md px-3 py-2 rounded-xl break-words text-sm sm:text-base ${
              message.role === 'user' ? 'bg-indigo-700 text-white' :
              message.isError ? 'bg-red-900 text-red-200' :
              'bg-gray-800 text-gray-100 border border-gray-700'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-[10px] sm:text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>{message.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 border border-gray-700 px-3 py-2 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-900 border-t border-gray-800 px-1 sm:px-3 py-3 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent text-base sm:text-lg"
            disabled={isLoading}
            autoComplete="off"
            style={{ minHeight: 44 }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-lg font-medium hover:from-indigo-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base sm:text-lg"
            style={{ minHeight: 44 }}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 