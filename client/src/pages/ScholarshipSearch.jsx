import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, GraduationCap, Clock, Tag, Sparkles, ExternalLink, BookOpen, Globe, Trophy, X, CheckCircle } from 'lucide-react';
import { mockScholarships } from '../services/mockData';

const TYPE_STYLES = {
  Merit: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50',
  'Need-Based': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50',
  Research: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50',
  Sports: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50',
};

const COUNTRY_FLAGS = {
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
  Germany: '🇩🇪',
  Global: '🌍',
};

const COUNTRY_ACCENTS = {
  'United Kingdom': {
    border: 'border-l-indigo-500',
    pill: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50',
  },
  'United States': {
    border: 'border-l-blue-500',
    pill: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50',
  },
  Canada: {
    border: 'border-l-red-500',
    pill: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50',
  },
  Australia: {
    border: 'border-l-amber-500',
    pill: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50',
  },
  Germany: {
    border: 'border-l-slate-600',
    pill: 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600/50',
  },
  Global: {
    border: 'border-l-violet-500',
    pill: 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50',
  },
};

const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/* ── Scholarship Detail Modal ── */
const ScholarshipModal = ({ sch, onClose }) => {
  const [applied, setApplied] = useState(false);
  const days = daysUntil(sch.deadline);
  const isExpired = days < 0;
  const isUrgent = days >= 0 && days <= 14;
  const accent = COUNTRY_ACCENTS[sch.country] || COUNTRY_ACCENTS['Global'];

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#242526] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className={`border-l-4 ${accent.border} px-6 pt-6 pb-5 border-b border-slate-100 dark:border-[#3e4042]`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              {sch.isMatch && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                  <Sparkles size={9} /> Smart Match
                </span>
              )}
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#e4e6eb] leading-snug">{sch.name}</h2>
              <p className="text-sm text-slate-500 dark:text-[#b0b3b8] mt-0.5">{sch.provider}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#3a3b3c] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Amount + Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 text-center">
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Award</div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">${sch.amount?.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-600/70 dark:text-emerald-500 font-medium">per year</div>
            </div>
            <div className={`rounded-xl p-4 text-center border ${
              isExpired
                ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
                : isUrgent
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40'
            }`}>
              <div className="text-[10px] font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider mb-1">Deadline</div>
              <div className="text-sm font-black text-slate-800 dark:text-[#e4e6eb]">
                {new Date(sch.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className={`text-[11px] font-bold mt-0.5 ${
                isExpired ? 'text-slate-400' : isUrgent ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
              }`}>
                {isExpired ? 'Deadline passed' : isUrgent ? `Only ${days} days left!` : `${days} days left`}
              </div>
            </div>
          </div>

          {/* Country + type + tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${accent.pill}`}>
              {COUNTRY_FLAGS[sch.country] || '🌍'} {sch.country}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${TYPE_STYLES[sch.type] || 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
              {sch.type}
            </span>
            {sch.tags?.map(tag => (
              <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40 flex items-center gap-1">
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider mb-1.5">About</div>
            <p className="text-sm text-slate-700 dark:text-[#b0b3b8] leading-relaxed">{sch.description}</p>
          </div>

          {/* Eligibility */}
          <div className="bg-slate-50 dark:bg-[#3a3b3c] border border-slate-100 dark:border-[#3e4042] rounded-xl px-4 py-3.5">
            <div className="text-xs font-bold text-slate-700 dark:text-[#e4e6eb] flex items-center gap-1.5 mb-1.5">
              <GraduationCap size={12} /> Eligibility Requirements
            </div>
            <p className="text-sm text-slate-600 dark:text-[#b0b3b8] leading-relaxed">{sch.criteria}</p>
          </div>

          {/* Applied success state */}
          {applied && (
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl px-4 py-3">
              <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Interest Registered!</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">Visit the provider's official portal to complete your application.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-[#3e4042] text-sm font-semibold text-slate-600 dark:text-[#b0b3b8] hover:bg-slate-50 dark:hover:bg-[#3a3b3c] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setApplied(true)}
              disabled={applied || isExpired}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                applied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isExpired
                  ? 'bg-slate-100 dark:bg-[#3a3b3c] text-slate-400 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {applied ? (
                <><CheckCircle size={14} /> Applied!</>
              ) : (
                <><ExternalLink size={14} /> {isExpired ? 'Deadline Passed' : 'Apply Now'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Scholarship Card ── */
const ScholarshipCard = ({ sch, onApply }) => {
  const days = daysUntil(sch.deadline);
  const isExpired = days < 0;
  const isUrgent = days >= 0 && days <= 14;
  const isWarning = days > 14 && days <= 30;
  const accent = COUNTRY_ACCENTS[sch.country] || COUNTRY_ACCENTS['Global'];

  return (
    <div className={`group bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] border-l-4 ${accent.border} rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${isExpired ? 'opacity-60 grayscale pointer-events-none select-none' : 'hover:-translate-y-0.5 hover:shadow-xl dark:hover:shadow-black/30'}`}>

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-3.5 flex-grow">

        {/* Name + Amount */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 flex-grow min-w-0">
            {sch.isMatch && (
              <span className="relative inline-flex items-center gap-1.5 w-fit text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <span className="absolute -left-0.5 -top-0.5 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-75"></span>
                <Sparkles size={9} /> Smart Match
              </span>
            )}
            <h3 className="font-bold text-[15px] text-slate-900 dark:text-[#e4e6eb] leading-snug">{sch.name}</h3>
          </div>

          <div className="flex-shrink-0 text-right bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl px-3 py-2 min-w-[88px]">
            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Award</div>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 leading-tight">
              ${sch.amount?.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600/70 dark:text-emerald-500 font-medium">per year</div>
          </div>
        </div>

        {/* Country + Provider */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${accent.pill}`}>
            {COUNTRY_FLAGS[sch.country] || '🌍'} {sch.country}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#b0b3b8] truncate">{sch.provider}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-[#b0b3b8] leading-relaxed line-clamp-2">{sch.description}</p>

        {/* Eligibility */}
        <div className="bg-slate-50 dark:bg-[#3a3b3c] border border-slate-100 dark:border-[#3e4042] rounded-xl px-3.5 py-2.5 text-xs text-slate-600 dark:text-[#b0b3b8] leading-relaxed">
          <span className="font-bold text-slate-700 dark:text-[#e4e6eb] flex items-center gap-1 mb-1">
            <GraduationCap size={11} /> Eligibility
          </span>
          {sch.criteria}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${TYPE_STYLES[sch.type] || 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
            {sch.type}
          </span>
          {sch.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40 flex items-center gap-1">
              <Tag size={9} /> {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-[#1e1f20] border-t border-slate-100 dark:border-[#3e4042] flex justify-between items-center">
        <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg ${
          isExpired
            ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500'
            : isUrgent
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40'
            : isWarning
            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40'
        }`}>
          <Clock size={11} />
          {isExpired
            ? 'Deadline passed'
            : isUrgent
            ? `Only ${days}d left!`
            : isWarning
            ? `${days} days left`
            : `Due ${new Date(sch.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        </div>

        {!isExpired && (
          <button
            onClick={() => onApply(sch)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group/btn"
          >
            Apply Now
            <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform duration-150" />
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Page ── */
const ScholarshipSearch = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({ country: 'All', type: 'All', search: '' });
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const filtered = useMemo(() => {
    return mockScholarships.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.provider.toLowerCase().includes(filters.search.toLowerCase());
      const matchCountry = filters.country === 'All' || s.country === filters.country;
      const matchType = filters.type === 'All' || s.type === filters.type;
      return matchSearch && matchCountry && matchType;
    });
  }, [filters]);

  const matches = mockScholarships.filter(s => s.isMatch);
  const display = activeTab === 'all' ? filtered : matches;

  const stats = [
    { icon: BookOpen, label: 'Total Listed', value: mockScholarships.length, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
    { icon: Sparkles, label: 'Your Matches', value: matches.length, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
    { icon: Globe, label: 'Countries', value: [...new Set(mockScholarships.map(s => s.country))].length, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
    { icon: Trophy, label: 'Fully Funded', value: mockScholarships.filter(s => s.tags?.includes('Fully Funded')).length, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#18191a] transition-colors duration-300">

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-purple-100 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            <GraduationCap size={12} /> Scholarship Finder
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Find Your Scholarship</h1>
          <p className="text-purple-100 text-base sm:text-lg">Discover financial aid opportunities matched to your profile.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] rounded-xl p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-[#e4e6eb]">{value}</div>
                <div className="text-xs text-slate-500 dark:text-[#b0b3b8]">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-[#3a3b3c] p-1 rounded-xl w-fit mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-[#242526] text-slate-900 dark:text-[#e4e6eb] shadow-sm' : 'text-slate-500 dark:text-[#b0b3b8] hover:text-slate-700 dark:hover:text-[#e4e6eb]'}`}
          >
            All Scholarships
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'matches' ? 'bg-white dark:bg-[#242526] text-slate-900 dark:text-[#e4e6eb] shadow-sm' : 'text-slate-500 dark:text-[#b0b3b8] hover:text-slate-700 dark:hover:text-[#e4e6eb]'}`}
          >
            <Sparkles size={14} />
            Smart Matches
            {matches.length > 0 && (
              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                {matches.length}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'all' && (
          <div className="bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
            <div className="flex-grow relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search scholarships or providers..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#3a3b3c] border border-slate-200 dark:border-[#3e4042] text-slate-900 dark:text-[#e4e6eb] placeholder-slate-400 dark:placeholder-[#b0b3b8] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-colors"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <select
              className="px-4 py-2.5 bg-slate-50 dark:bg-[#3a3b3c] border border-slate-200 dark:border-[#3e4042] text-slate-700 dark:text-[#e4e6eb] rounded-lg outline-none cursor-pointer text-sm"
              value={filters.country}
              onChange={e => setFilters({ ...filters, country: e.target.value })}
            >
              <option value="All">All Countries</option>
              <option value="United States">🇺🇸 USA</option>
              <option value="United Kingdom">🇬🇧 UK</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="Germany">🇩🇪 Germany</option>
            </select>
            <select
              className="px-4 py-2.5 bg-slate-50 dark:bg-[#3a3b3c] border border-slate-200 dark:border-[#3e4042] text-slate-700 dark:text-[#e4e6eb] rounded-lg outline-none cursor-pointer text-sm"
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="All">All Types</option>
              <option value="Merit">Merit</option>
              <option value="Need-Based">Need-Based</option>
              <option value="Research">Research</option>
              <option value="Sports">Sports</option>
            </select>
            {(filters.search || filters.country !== 'All' || filters.type !== 'All') && (
              <button
                onClick={() => setFilters({ country: 'All', type: 'All', search: '' })}
                className="text-xs text-slate-500 dark:text-[#b0b3b8] hover:text-red-500 font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Login prompt for Matches tab */}
        {activeTab === 'matches' && !user && (
          <div className="text-center py-16 bg-white dark:bg-[#242526] rounded-2xl border border-dashed border-slate-300 dark:border-[#3e4042] mb-6">
            <GraduationCap size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="font-bold text-slate-700 dark:text-[#e4e6eb] mb-2">Smart Matching Requires a Profile</h3>
            <p className="text-slate-500 dark:text-[#b0b3b8] text-sm mb-4">Sign in to see scholarships matched to your GPA, country, and test scores.</p>
            <a href="/login" className="btn-primary inline-block">Sign In to Match</a>
          </div>
        )}

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {display.map(sch => (
            <ScholarshipCard key={sch._id} sch={sch} onApply={setSelectedScholarship} />
          ))}
          {display.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-500 dark:text-[#b0b3b8]">
              <Search size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No scholarships match your filters.</p>
              <button onClick={() => setFilters({ country: 'All', type: 'All', search: '' })} className="text-blue-500 text-sm mt-2 hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Scholarship detail modal */}
      {selectedScholarship && (
        <ScholarshipModal
          sch={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </div>
  );
};

export default ScholarshipSearch;
