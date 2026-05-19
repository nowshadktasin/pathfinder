import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Send, FileText, MessageSquare, X, Clock, UserPlus, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// ── Mock Data ────────────────────────────────────────────────────────
const MOCK_CONSULTANTS = [
  {
    _id: 'c1',
    role: 'consultant',
    profile: { firstName: 'Dr. Aisha', lastName: 'Rahman' },
    email: 'aisha@pathfinder.dev',
  },
  {
    _id: 'c2',
    role: 'consultant',
    profile: { firstName: 'James', lastName: 'Okafor' },
    email: 'james@pathfinder.dev',
  },
  {
    _id: 'c3',
    role: 'consultant',
    profile: { firstName: 'Sarah', lastName: 'Kim' },
    email: 'sarah@pathfinder.dev',
  },
  {
    _id: 'c4',
    role: 'consultant',
    profile: { firstName: 'Prof. Liu', lastName: 'Wei' },
    email: 'liu@pathfinder.dev',
  },
];

const INITIAL_THREADS = {
  c1: [
    {
      _id: 'cm1',
      sender: 'c1',
      content: "Hi Alex! I reviewed your SOP draft -- great improvement from the last version! The opening paragraph is much stronger now.",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      attachments: [],
    },
    {
      _id: 'cm2',
      sender: 'mock_student_001',
      content: "Thank you so much! I followed your advice on the opening hook. Should I also revise the 'why this university' section for MIT?",
      createdAt: new Date(Date.now() - 2 * 86400000 + 600000).toISOString(),
      attachments: [],
    },
    {
      _id: 'cm3',
      sender: 'c1',
      content: "Yes, definitely! For MIT specifically, mention the Media Lab and any faculty whose research aligns with yours. Be very specific -- 'I want to work with Prof. [Name] on [specific project]' is much stronger than generic statements.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      attachments: [],
    },
  ],
  c2: [
    {
      _id: 'cm4',
      sender: 'c2',
      content: "Alex, I reviewed your scholarship application for Chevening. Your leadership section needs more concrete examples -- please add specific outcomes and numbers.",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      attachments: [],
    },
    {
      _id: 'cm5',
      sender: 'mock_student_001',
      content: "Got it! I'll add numbers like 'organized a team of 15' and 'raised $5k in fundraising'. Does that sound good?",
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      attachments: [],
    },
    {
      _id: 'cm6',
      sender: 'c2',
      content: "Perfect approach! Quantified achievements always stand out to scholarship committees. Also highlight any cross-cultural or international experience you have.",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      attachments: [],
    },
  ],
  c3: [],
  c4: [],
};

const AUTO_REPLIES = [
  "That's a great point! Let me review that section more carefully.",
  "Good progress! Once you revise that section, share it with me again.",
  "Absolutely -- that's exactly what top programs want to see. Keep going!",
  "I agree with your approach. Make sure to quantify your achievements wherever possible.",
  "Excellent! This is shaping up very well. The admissions committee will appreciate the specificity.",
  "Yes, that's the right direction. Also consider adding a brief mention of your long-term career goals.",
  "Perfect. I'd also suggest getting a second opinion from a faculty reference on that paragraph.",
];

const INITIAL_CHATS = [
  {
    user: MOCK_CONSULTANTS[0],
    lastMessage: {
      sender: 'c1',
      content: "Yes, definitely! For MIT specifically, mention the Media Lab...",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  },
  {
    user: MOCK_CONSULTANTS[1],
    lastMessage: {
      sender: 'c2',
      content: "Excellent! This is shaping up very well for Chevening.",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  },
];

// ── Helpers ──────────────────────────────────────────────────────────
const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ── Component ────────────────────────────────────────────────────────
const CollaborationSpace = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();

  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChat, setActiveChat] = useState(null);
  const [allThreads, setAllThreads] = useState(INITIAL_THREADS);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUserId = user?._id || 'mock_student_001';

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) openChat(MOCK_CONSULTANTS.find(c => c._id === userId));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const openChat = (targetUser) => {
    if (!targetUser) return;
    const existing = chats.find(c => c.user._id === targetUser._id);
    if (existing) {
      setActiveChat(existing);
    } else {
      setActiveChat({ user: targetUser, isNew: true });
    }
    setMessages(allThreads[targetUser._id] || []);
  };

  const handleSearch = (val) => {
    setSearchQuery(val);
    if (val.length < 2) { setSearchResults([]); return; }
    const q = val.toLowerCase();
    setSearchResults(
      MOCK_CONSULTANTS.filter(c =>
        `${c.profile.firstName} ${c.profile.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      )
    );
  };

  const startChat = (targetUser) => {
    openChat(targetUser);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const userId = activeChat.user._id;
    const msg = {
      _id: `msg_${Date.now()}`,
      sender: currentUserId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      attachments: [],
    };

    const updatedThread = [...(allThreads[userId] || []), msg];
    setAllThreads(prev => ({ ...prev, [userId]: updatedThread }));
    setMessages(updatedThread);
    setNewMessage('');

    // Update or add sidebar entry
    setChats(prev => {
      const exists = prev.some(c => c.user._id === userId);
      const entry = { user: activeChat.user, lastMessage: msg };
      return exists
        ? prev.map(c => c.user._id === userId ? entry : c)
        : [...prev, entry];
    });
    if (activeChat.isNew) setActiveChat(prev => ({ ...prev, isNew: false }));

    // Simulate consultant typing then auto-reply
    setIsTyping(true);
    const delay = 1800 + Math.random() * 1200;
    setTimeout(() => {
      const autoReply = {
        _id: `msg_auto_${Date.now()}`,
        sender: userId,
        content: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        createdAt: new Date().toISOString(),
        attachments: [],
      };
      const withReply = [...updatedThread, autoReply];
      setAllThreads(prev => ({ ...prev, [userId]: withReply }));
      setMessages(withReply);
      setChats(prev => prev.map(c => c.user._id === userId
        ? { ...c, lastMessage: autoReply }
        : c
      ));
      setIsTyping(false);
    }, delay);
  };

  const handleFileClick = () => {
    addToast('File sharing requires a backend connection — not available in preview mode.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-100px)]">
      <div className="bg-white dark:bg-[#242526] rounded-3xl border border-slate-200 dark:border-[#3e4042] shadow-xl overflow-hidden flex h-full transition-colors duration-300">

        {/* ── Sidebar ── */}
        <div className="w-80 border-r border-slate-100 dark:border-[#3e4042] flex flex-col bg-slate-50/50 dark:bg-[#18191a]/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-[#e4e6eb] flex items-center gap-2">
                <MessageSquare className="text-indigo-600 dark:text-indigo-400" size={24} />
                Discussions
              </h2>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-xl transition-all ${showSearch ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-[#3a3b3c] text-slate-400 dark:text-[#b0b3b8] border border-slate-200 dark:border-[#3e4042] hover:bg-slate-50 dark:hover:bg-[#4e4f50]'}`}
              >
                <Plus size={20} />
              </button>
            </div>

            {showSearch && (
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Find a counselor..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#3a3b3c] border border-slate-200 dark:border-[#3e4042] rounded-xl text-sm text-slate-900 dark:text-[#e4e6eb] focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#242526] border border-slate-100 dark:border-[#3e4042] rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2 space-y-1">
                    {searchResults.map(u => (
                      <button
                        key={u._id}
                        onClick={() => startChat(u)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-[#3a3b3c] rounded-xl transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {u.profile.firstName[0]}{u.profile.lastName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800 dark:text-[#e4e6eb]">{u.profile.firstName} {u.profile.lastName}</div>
                          <div className="text-[10px] text-slate-400 dark:text-[#b0b3b8] capitalize">{u.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
            {chats.length === 0 ? (
              <div className="p-8 text-center bg-white/40 dark:bg-[#3a3b3c]/40 rounded-3xl mx-3 border border-dashed border-slate-200 dark:border-[#3e4042]">
                <div className="w-12 h-12 bg-white dark:bg-[#3a3b3c] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <UserPlus className="text-slate-300 dark:text-[#b0b3b8]" size={24} />
                </div>
                <p className="text-slate-400 dark:text-[#b0b3b8] text-xs font-medium">No discussions yet</p>
                <button onClick={() => setShowSearch(true)} className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  Start a conversation
                </button>
              </div>
            ) : (
              chats.map(chat => (
                <button
                  key={chat.user._id}
                  onClick={() => openChat(chat.user)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                    activeChat?.user?._id === chat.user._id
                      ? 'bg-white dark:bg-[#3a3b3c] shadow-lg border border-slate-100 dark:border-[#3e4042]'
                      : 'hover:bg-white/60 dark:hover:bg-[#3a3b3c]/60'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-inner border-2 border-white dark:border-[#242526]">
                      {chat.user.profile.firstName[0]}{chat.user.profile.lastName[0]}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-sm truncate text-slate-800 dark:text-[#e4e6eb]">
                        {chat.user.profile.firstName} {chat.user.profile.lastName}
                      </span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">
                        {chat.lastMessage ? fmtTime(chat.lastMessage.createdAt) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#b0b3b8] truncate font-medium">
                      {chat.lastMessage?.sender === currentUserId ? 'You: ' : ''}
                      {chat.lastMessage?.content || 'Started a new conversation'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Main Chat ── */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#242526]">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-[#3e4042] flex items-center justify-between bg-white/80 dark:bg-[#242526]/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {activeChat.user.profile.firstName[0]}{activeChat.user.profile.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-[#e4e6eb] tracking-tight">
                      {activeChat.user.profile.firstName} {activeChat.user.profile.lastName}
                    </h3>
                    <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20 dark:bg-[#18191a]">
                {messages.length === 0 && !isTyping ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12">
                    <div className="w-16 h-16 bg-white dark:bg-[#3a3b3c] rounded-3xl flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-[#3e4042]">
                      <SparklesIcon />
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-[#e4e6eb]">No Messages Yet</h4>
                    <p className="text-xs text-slate-400 dark:text-[#b0b3b8] mt-1 max-w-[200px]">
                      Send a hello to start your collaboration journey!
                    </p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender === currentUserId;
                    return (
                      <div key={m._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold mr-3 mt-auto flex-shrink-0">
                            {activeChat.user.profile.firstName[0]}
                          </div>
                        )}
                        <div className="max-w-[70%]">
                          <div className={`rounded-2xl px-5 py-3 text-sm shadow-sm ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-[#3a3b3c] border border-slate-100 dark:border-[#3e4042] text-slate-800 dark:text-[#e4e6eb] rounded-bl-none'
                          }`}>
                            <p className="leading-relaxed font-medium">{m.content}</p>
                          </div>
                          <p className={`text-[9px] text-slate-400 mt-1.5 font-bold tracking-tighter uppercase ${isMe ? 'text-right' : 'text-left'}`}>
                            {fmtTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold mr-3 mt-auto flex-shrink-0">
                      {activeChat.user.profile.firstName[0]}
                    </div>
                    <div className="bg-white dark:bg-[#3a3b3c] border border-slate-100 dark:border-[#3e4042] rounded-2xl rounded-bl-none px-5 py-4">
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 bg-white dark:bg-[#242526] border-t border-slate-100 dark:border-[#3e4042]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="p-3 bg-slate-50 dark:bg-[#3a3b3c] hover:bg-slate-100 dark:hover:bg-[#4e4f50] rounded-2xl text-slate-400 transition-all border border-slate-100 dark:border-[#3e4042]"
                  >
                    <FileText size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Communicate your vision..."
                    className="flex-1 bg-slate-50 dark:bg-[#3a3b3c] border border-slate-100 dark:border-[#3e4042] rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-[#18191a] text-slate-900 dark:text-[#e4e6eb] outline-none transition-all font-medium"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isTyping}
                    className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-30 active:scale-95"
                  >
                    <Send size={24} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50/10 dark:bg-[#18191a]">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-[#3a3b3c] text-indigo-600 dark:text-indigo-400 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-sm ring-8 ring-white dark:ring-[#242526]">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-[#e4e6eb] mb-3 tracking-tight">Collaboration Hub</h3>
              <p className="text-slate-500 dark:text-[#b0b3b8] max-w-sm text-sm font-medium leading-relaxed">
                {user?.role === 'student'
                  ? "Connect with elite counselors to refine your strategy, perfect your essays, and unlock your academic potential."
                  : "Engage with ambitious students to provide critical feedback and guide them through their most important decisions."}
              </p>
              <button
                onClick={() => setShowSearch(true)}
                className="mt-8 px-8 py-4 bg-white dark:bg-[#3a3b3c] border border-slate-200 dark:border-[#3e4042] text-slate-700 dark:text-[#e4e6eb] rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-[#4e4f50] transition-all flex items-center gap-2"
              >
                <Plus size={20} className="text-indigo-600 dark:text-indigo-400" />
                Start New Discussion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = () => (
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
    <path d="m12 3-1.912 5.813a2.01 2.01 0 0 1-1.275 1.275L3 12l5.813 1.912a2.01 2.01 0 0 1 1.275 1.275L12 21l1.912-5.813a2.01 2.01 0 0 1 1.275-1.275L21 12l-5.813-1.912a2.01 2.01 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

export default CollaborationSpace;
