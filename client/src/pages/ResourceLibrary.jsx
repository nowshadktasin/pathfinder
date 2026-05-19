import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MarkdownMessage from '../components/MarkdownMessage';
import {
  Search, Play, BookOpen, FileText, ExternalLink, Lock, Clock,
  Sparkles, Send, Bot, User as UserIcon, Newspaper, ChevronRight,
  Headphones, Monitor, Calculator, GraduationCap, TrendingUp,
  PenLine, Plane, SlidersHorizontal
} from 'lucide-react';
import { mockResources } from '../services/mockData';
import { aiAPI } from '../services/api';

// ── Category identity system ─────────────────────────────────────────
const CAT = {
  IELTS: {
    gradient: 'linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #2dd4bf 100%)',
    patternCSS: 'radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)',
    patternSize: '20px 20px',
    icon: Headphones,
    sublabel: 'Language Test',
    glow: 'rgba(20,184,166,0.35)',
  },
  TOEFL: {
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #60a5fa 100%)',
    patternCSS: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
    patternSize: '22px 22px',
    icon: Monitor,
    sublabel: 'Language Test',
    glow: 'rgba(59,130,246,0.35)',
  },
  SAT: {
    gradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 60%, #a78bfa 100%)',
    patternCSS: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.06) 8px, rgba(255,255,255,0.06) 9px)',
    patternSize: 'auto',
    icon: Calculator,
    sublabel: 'College Admissions',
    glow: 'rgba(139,92,246,0.35)',
  },
  GRE: {
    gradient: 'linear-gradient(135deg, #312e81 0%, #4f46e5 60%, #818cf8 100%)',
    patternCSS: 'linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%)',
    patternSize: '16px 16px',
    icon: GraduationCap,
    sublabel: 'Graduate Admissions',
    glow: 'rgba(99,102,241,0.35)',
  },
  GMAT: {
    gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 60%, #f59e0b 100%)',
    patternCSS: 'linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px)',
    patternSize: '22px 22px',
    icon: TrendingUp,
    sublabel: 'Business School',
    glow: 'rgba(217,119,6,0.35)',
  },
  Essay: {
    gradient: 'linear-gradient(135deg, #881337 0%, #be185d 60%, #f472b6 100%)',
    patternCSS: 'repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(255,255,255,0.07) 11px, rgba(255,255,255,0.07) 12px)',
    patternSize: 'auto',
    icon: PenLine,
    sublabel: 'Writing & SOP',
    glow: 'rgba(236,72,153,0.35)',
  },
  Visa: {
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #38bdf8 100%)',
    patternCSS: 'radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)',
    patternSize: '16px 16px',
    icon: Plane,
    sublabel: 'Immigration',
    glow: 'rgba(14,165,233,0.35)',
  },
  default: {
    gradient: 'linear-gradient(135deg, #374151, #6b7280)',
    patternCSS: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
    patternSize: '18px 18px',
    icon: BookOpen,
    sublabel: 'Resource',
    glow: 'rgba(107,114,128,0.25)',
  },
};

const TYPE_STYLE = {
  Video:   { dot: '#ef4444', label: 'VIDEO',   icon: Play },
  PDF:     { dot: '#f97316', label: 'PDF',     icon: FileText },
  Article: { dot: '#60a5fa', label: 'ARTICLE', icon: Newspaper },
};


// ── ResourceCard ─────────────────────────────────────────────────────
const ResourceCard = ({ resource, isPremiumUser, index }) => {
  const cat = CAT[resource.category] || CAT.default;
  const CatIcon = cat.icon;
  const typeSt = TYPE_STYLE[resource.type] || TYPE_STYLE.Article;
  const TypeIcon = typeSt.icon;
  const locked = resource.isPremium && !isPremiumUser;

  return (
    <a
      href={locked ? '/payment' : resource.url}
      target={locked ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 no-underline ${locked ? 'cursor-default' : 'cursor-pointer'}`}
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.06)',
        animationDelay: `${index * 40}ms`,
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        if (!locked) {
          e.currentTarget.style.boxShadow = `0 12px 35px rgba(0,0,0,0.14), 0 0 0 1px rgba(255,255,255,0.06), 0 0 40px ${cat.glow}`;
          e.currentTarget.style.transform = 'translateY(-3px)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* ── Poster Header ── */}
      <div
        className="relative h-44 overflow-hidden flex-shrink-0"
        style={{ background: cat.gradient }}
      >
        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: cat.patternCSS,
            backgroundSize: cat.patternSize !== 'auto' ? cat.patternSize : undefined,
          }}
        />

        {/* Typographic watermark — large clipped category name */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
          <span
            style={{
              position: 'absolute',
              right: '-8px',
              bottom: '-14px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 900,
              fontSize: resource.category.length <= 3 ? '8.5rem' : resource.category.length <= 4 ? '6.5rem' : '4.2rem',
              lineHeight: 1,
              color: 'rgba(255,255,255,0.09)',
              letterSpacing: '-0.07em',
              transform: 'rotate(-4deg)',
            }}
          >
            {resource.category}
          </span>
        </div>

        {/* Subject icon — centered frosted glass pill */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'rgba(255,255,255,0.16)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <CatIcon size={26} color="rgba(255,255,255,0.95)" />
          </div>
        </div>

        {/* Type badge — top-right */}
        <div className="absolute top-3 right-3">
          <span
            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.35)',
              color: typeSt.dot,
              border: `1px solid ${typeSt.dot}40`,
              backdropFilter: 'blur(6px)',
            }}
          >
            {resource.type === 'Video' && (
              <Play size={7} fill={typeSt.dot} color={typeSt.dot} />
            )}
            {resource.type === 'PDF' && (
              <FileText size={7} color={typeSt.dot} />
            )}
            {resource.type === 'Article' && (
              <Newspaper size={7} color={typeSt.dot} />
            )}
            {typeSt.label}
          </span>
        </div>

        {/* Category badge — bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.30)',
              color: 'rgba(255,255,255,0.90)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {cat.sublabel}
          </span>
        </div>

        {/* Lock overlay */}
        {locked && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              <Lock size={18} className="text-white" />
            </div>
            <span className="text-white text-[10px] font-black uppercase tracking-widest">Premium</span>
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="p-4 flex flex-col flex-grow bg-white dark:bg-[#1a1b23] border border-t-0 border-slate-100 dark:border-[#2a2b36] rounded-b-2xl">
        <h3 className="font-heading font-bold text-slate-900 dark:text-[#e8eaf0] text-[13px] leading-snug mb-1.5 line-clamp-2 group-hover:text-opacity-80 transition-colors">
          {resource.title}
        </h3>
        <p className="text-slate-500 dark:text-[#9395a5] text-[11px] leading-relaxed mb-3 line-clamp-3 flex-grow">
          {resource.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {resource.duration && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-[#9395a5] bg-slate-50 dark:bg-[#252636] px-2 py-0.5 rounded-full border border-slate-100 dark:border-[#2a2b36]">
              <Clock size={9} /> {resource.duration}
            </span>
          )}
          {resource.tags?.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: cat.gradient,
                color: 'rgba(255,255,255,0.92)',
                fontSize: '9.5px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        {locked ? (
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <Lock size={10} className="text-amber-500" />
            <span className="text-amber-500">Unlock with Premium</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-bold group/cta">
            <span
              style={{
                background: cat.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Access Material
            </span>
            <ExternalLink
              size={10}
              className="text-slate-400 dark:text-[#9395a5] transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
            />
          </div>
        )}
      </div>
    </a>
  );
};

// ── AI Study Pal Chat ────────────────────────────────────────────────
const StudyPalChat = () => {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: "Hi! I'm your Study Pal. Ask me anything about IELTS, TOEFL, SAT, GRE, GMAT, essays, or visa applications.",
  }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll only within the chat box — never move the page scroll position
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;
    const userMsg = input.trim();
    const updatedMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(updatedMessages);
    setInput('');
    setThinking(true);
    try {
      const apiMessages = updatedMessages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text,
      }));
      const response = await aiAPI.brainstorm({ messages: apiMessages });
      setMessages(prev => [...prev, { role: 'bot', text: response.data.content }]);
    } catch (err) {
      const errText = err.response?.data?.content || "I'm having trouble connecting to the AI. Please try again shortly.";
      setMessages(prev => [...prev, { role: 'bot', text: errText }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-72">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-3 pr-1 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-6 h-6 brand-gradient rounded-full flex items-center justify-center flex-shrink-0 mb-0.5">
                <Bot size={12} className="text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl ${
              msg.role === 'user'
                ? 'brand-gradient text-white rounded-br-sm px-3.5 py-2.5 text-xs leading-relaxed'
                : 'bg-slate-100 dark:bg-[#252636] rounded-bl-sm px-4 py-3'
            }`}>
              {msg.role === 'user'
                ? msg.text
                : <MarkdownMessage content={msg.text} compact />
              }
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 bg-slate-200 dark:bg-[#3a3b3c] rounded-full flex items-center justify-center flex-shrink-0 mb-0.5">
                <UserIcon size={12} className="text-slate-500 dark:text-[#9395a5]" />
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 brand-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={12} className="text-white" />
            </div>
            <div className="bg-slate-100 dark:bg-[#252636] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about IELTS tips, visa steps, SOP writing..."
          className="input-field text-sm flex-grow"
          disabled={thinking}
        />
        <button
          type="submit"
          disabled={thinking || !input.trim()}
          className="btn-primary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────
const ResourceLibrary = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const categories = ['All', 'IELTS', 'TOEFL', 'SAT', 'GRE', 'GMAT', 'Essay', 'Visa'];
  const types = ['All', 'Video', 'PDF', 'Article'];

  const filtered = useMemo(() => {
    return mockResources.filter(r => {
      const matchCat  = category === 'All' || r.category === category;
      const matchType = typeFilter === 'All' || r.type === typeFilter;
      const matchQ    = !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchType && matchQ;
    });
  }, [category, searchQuery, typeFilter]);

  const counts = useMemo(() => {
    const c = { All: mockResources.length };
    categories.slice(1).forEach(cat => {
      c[cat] = mockResources.filter(r => r.category === cat).length;
    });
    return c;
  }, []);

  const typeCounts = useMemo(() => ({
    All:     mockResources.length,
    Video:   mockResources.filter(r => r.type === 'Video').length,
    PDF:     mockResources.filter(r => r.type === 'PDF').length,
    Article: mockResources.filter(r => r.type === 'Article').length,
  }), []);

  const activeCat = CAT[category] || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f11] transition-colors duration-300">

      {/* ── Hero ── */}
      <div
        className="relative px-4 py-16 text-center overflow-hidden"
        style={{
          background: activeCat
            ? activeCat.gradient
            : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #818cf8 100%)',
          transition: 'background 0.5s ease',
        }}
      >
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50/30 dark:from-[#0f0f11]/40 to-transparent pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 text-white/90 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20 backdrop-blur-sm">
            <BookOpen size={11} /> {mockResources.length} Curated Resources
          </div>
          <h1 className="font-heading text-4xl font-black text-white mb-3 tracking-tight">
            Resource Library
          </h1>
          <p className="text-white/75 text-base leading-relaxed">
            Expert-curated materials for tests, essays, and visa applications
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-grow">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9395a5]" />
            <input
              type="text"
              placeholder="Search resources, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field pl-10 text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <SlidersHorizontal size={14} className="text-slate-400 dark:text-[#9395a5] flex-shrink-0" />
            {types.map(t => {
              const isActive = typeFilter === t;
              const TypeIcon = t === 'Video' ? Play : t === 'PDF' ? FileText : t === 'Article' ? Newspaper : BookOpen;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'brand-gradient text-white border-brand-600 shadow-brand'
                      : 'bg-white dark:bg-[#1a1b23] text-slate-600 dark:text-[#9395a5] border-slate-200 dark:border-[#2a2b36] hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
                >
                  <TypeIcon size={11} />
                  {t}
                  <span className={`text-[10px] opacity-70 ${isActive ? '' : ''}`}>({typeCounts[t]})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div
          className="bg-white dark:bg-[#1a1b23] rounded-2xl border border-slate-100 dark:border-[#2a2b36] p-2.5 mb-8 flex gap-1.5 overflow-x-auto"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {categories.map(cat => {
            const isActive = category === cat;
            const catCfg = CAT[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-slate-600 dark:text-[#9395a5] hover:text-slate-900 dark:hover:text-[#e8eaf0] hover:bg-slate-50 dark:hover:bg-[#252636]'
                }`}
                style={isActive && catCfg ? {
                  background: catCfg.gradient,
                } : isActive ? {
                  background: 'var(--brand-gradient, linear-gradient(135deg, #4f46e5, #6366f1))',
                } : {}}
              >
                {catCfg && isActive && <catCfg.icon size={13} />}
                {cat}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-[#252636] text-slate-500 dark:text-[#9395a5]'}`}>
                  {counts[cat] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Results header ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500 dark:text-[#9395a5]">
            Showing{' '}
            <span className="font-bold text-slate-800 dark:text-[#e8eaf0]">{filtered.length}</span>
            {' '}resources
            {category !== 'All' && (
              <>
                {' '}in{' '}
                <span
                  className="font-bold"
                  style={{
                    background: (CAT[category] || CAT.default).gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {category}
                </span>
              </>
            )}
          </p>
          {(searchQuery || category !== 'All' || typeFilter !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setCategory('All'); setTypeFilter('All'); }}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Resource Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
            {filtered.map((r, idx) => (
              <ResourceCard key={r._id} resource={r} isPremiumUser={user?.isPremium} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#1a1b23] rounded-2xl border border-dashed border-slate-200 dark:border-[#2a2b36] mb-14">
            <BookOpen size={40} className="mx-auto mb-3 text-slate-300 dark:text-[#3a3b3c]" />
            <p className="font-semibold text-slate-700 dark:text-[#e8eaf0] mb-1">No resources found</p>
            <p className="text-sm text-slate-400 dark:text-[#9395a5] mb-4">Try a different category or search term</p>
            <button
              onClick={() => { setSearchQuery(''); setCategory('All'); setTypeFilter('All'); }}
              className="btn-primary text-sm py-2 px-5"
            >
              Show All Resources
            </button>
          </div>
        )}

        {/* ── Study Pal ── */}
        <div
          className="bg-white dark:bg-[#1a1b23] rounded-2xl border border-indigo-50 dark:border-[#2a2b36] p-6 relative overflow-hidden"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-50 dark:bg-brand-900/10 rounded-full -mr-36 -mt-36 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-64 flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-brand">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-slate-900 dark:text-[#e8eaf0] text-lg">Study Pal</h2>
                  <p className="text-xs text-slate-400 dark:text-[#9395a5]">AI-powered study assistant</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-[#9395a5] leading-relaxed mb-4">
                Ask about test strategies, visa steps, SOP tips, or scholarship advice — get instant guidance.
              </p>
              <div className="space-y-2">
                {['IELTS Band 9 tips', 'How to write an SOP?', 'F-1 visa checklist'].map(s => (
                  <div
                    key={s}
                    className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-3 py-2 rounded-xl border border-brand-100 dark:border-brand-900/40 cursor-default select-none"
                  >
                    <ChevronRight size={11} /> {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-grow w-full bg-slate-50 dark:bg-[#13141a] rounded-2xl border border-slate-100 dark:border-[#2a2b36] p-4">
              <StudyPalChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;
