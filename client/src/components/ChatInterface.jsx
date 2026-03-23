import { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';

export default function ChatInterface({ documentId, documentText, language }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'anonymous' },
        body: JSON.stringify({
          documentId,
          message: userMessage,
          language
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    } catch (err) {
      // Fallback: simulate response when backend is not connected
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'd be happy to help answer your question about this document. However, the backend server is not currently connected. Please ensure the server is running on port 5000.\n\nNote: This is AI-generated analysis, not official legal advice. Please consult a qualified lawyer for important legal decisions.`
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fade-in-up bg-card rounded-2xl border border-border overflow-hidden" style={{ animationDelay: '0.7s' }}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <span className="text-accent">💬</span>
        <h3 className="text-white font-semibold text-sm">Ask about this document</h3>
      </div>

      {/* Messages area */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-text-secondary text-sm">Ask any question about this document</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                'Can they fire me without notice?',
                'Is the penalty clause fair?',
                'What should I negotiate?'
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); }}
                  className="px-3 py-1.5 rounded-full text-xs bg-secondary border border-border text-text-secondary hover:text-white hover:border-accent transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-2xl rounded-tl-sm max-w-xs">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-2 border border-border focus-within:border-accent transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this document..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-text-secondary outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg bg-accent hover:bg-accent-hover text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
