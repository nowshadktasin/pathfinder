import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, Zap } from 'lucide-react';
import { aiAPI } from '../services/api';
import MarkdownMessage from '../components/MarkdownMessage';

const SUGGESTIONS = [
  "How do I write a standout personal statement?",
  "What GPA do I need for top UK universities?",
  "Compare MIT vs Stanford for Computer Science",
  "What scholarships exist for international students?",
];

const TypingIndicator = () => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm">
      <Bot size={15} />
    </div>
    <div className="bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] px-4 py-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

const AIBrainstorm = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Pathfinder AI. Ask me about essays, university fit, scholarships, or visa requirements — I'm here to guide your journey." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.brainstorm({ messages: updatedMessages });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.content }]);
    } catch (err) {
      const errMsg = err.response?.data?.content || "I'm having trouble connecting to the AI. Please check that the backend server is running and try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  const isInitial = messages.length === 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8 h-[calc(100dvh-80px)] sm:h-[calc(100vh-100px)] flex flex-col">

      {/* Header */}
      <div className="shrink-0 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
              <Bot size={22} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#18191a] rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-[#e4e6eb] flex items-center gap-1.5">
              Pathfinder AI <Sparkles size={16} className="text-indigo-500" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#b0b3b8]">Your personal university application guide</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-full">
            <Zap size={10} /> Powered by Gemini
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-grow bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#3e4042] shadow-sm overflow-hidden flex flex-col">

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-5 space-y-4 bg-slate-50 dark:bg-[#18191a]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
              </div>
              <div className={`max-w-[82%] rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 px-4 py-3 leading-relaxed'
                  : 'bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] rounded-tl-none shadow-sm px-5 py-4'
              }`}>
                {msg.role === 'user'
                  ? msg.content
                  : <MarkdownMessage content={msg.content} />
                }
              </div>
            </div>
          ))}

          {loading && <TypingIndicator />}

          {/* Suggested prompts — only when chat is at initial state */}
          {isInitial && !loading && (
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 dark:text-[#b0b3b8] uppercase tracking-wider mb-2.5">
                Try asking…
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-left text-sm text-slate-600 dark:text-[#b0b3b8] px-4 py-3 bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all duration-150 leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white dark:bg-[#242526] border-t border-slate-200 dark:border-[#3e4042] flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about essays, universities, visas…"
            className="flex-grow rounded-xl border border-slate-200 dark:border-[#3e4042] bg-slate-50 dark:bg-[#3a3b3c] text-slate-900 dark:text-[#e4e6eb] placeholder-slate-400 dark:placeholder-[#b0b3b8] focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-4 py-2.5 outline-none transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIBrainstorm;
