import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import FitScoreBadge from '../components/FitScoreBadge';
import ComingSoonModal from '../components/ComingSoonModal';
import {
  Trash2, MapPin, BarChart3, ChevronRight, Sparkles, Activity, Award,
  GraduationCap, BookOpen, Calendar, Bell, TrendingUp, Target, ArrowRight, Zap, Radio
} from 'lucide-react';
import { mockShortlist, mockUniversities } from '../services/mockData';
import { useToast } from '../context/ToastContext';

const FALLBACK = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80';

const UniImage = ({ src, alt }) => {
  const [err, setErr] = useState(false);
  const imgSrc = err || !src ? FALLBACK : src;
  return (
    <div className="relative h-44 bg-slate-200 dark:bg-[#252636] flex-shrink-0 overflow-hidden">
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setErr(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
    </div>
  );
};

const STATUS_COLORS = {
  Accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Waitlisted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'In Progress': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Not Started': 'bg-slate-100 text-slate-600 dark:bg-[#3a3b3c] dark:text-[#e4e6eb]',
};

const STATUS_BORDER = {
  Accepted: 'border-l-green-500',
  Rejected: 'border-l-red-400',
  Submitted: 'border-l-blue-500',
  Waitlisted: 'border-l-amber-500',
  'In Progress': 'border-l-indigo-500',
  'Not Started': 'border-l-slate-300 dark:border-l-slate-600',
};

const PIPELINE_STAGES = [
  { status: 'Accepted',    color: 'bg-green-500',                             label: 'Accepted' },
  { status: 'Submitted',   color: 'bg-blue-500',                              label: 'Submitted' },
  { status: 'In Progress', color: 'bg-indigo-500',                            label: 'In Progress' },
  { status: 'Waitlisted',  color: 'bg-amber-500',                             label: 'Waitlisted' },
  { status: 'Not Started', color: 'bg-slate-300 dark:bg-slate-600',           label: 'Not Started' },
];

const QUICK_LINKS = [
  {
    to: '/ai-brainstorm', icon: Sparkles, label: 'AI Brainstorm', sub: 'Chat & plan',
    gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-900/20 dark:to-purple-900/20',
    accent: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-100 dark:border-violet-900/30',
    iconBg: 'bg-white dark:bg-[#242526] text-violet-600 dark:text-violet-400',
  },
  {
    to: '/resources', icon: BookOpen, label: 'Resources', sub: 'Guides & tips',
    gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-900/20 dark:to-cyan-900/20',
    accent: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/30',
    iconBg: 'bg-white dark:bg-[#242526] text-blue-600 dark:text-blue-400',
  },
  {
    to: '/consultation', icon: Calendar, label: 'Book Session', sub: 'Talk to experts',
    gradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-900/20 dark:to-green-900/20',
    accent: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    iconBg: 'bg-white dark:bg-[#242526] text-emerald-600 dark:text-emerald-400',
  },
  {
    to: '/notifications', icon: Bell, label: 'Notifications', sub: 'Stay updated',
    gradient: 'from-orange-500/10 to-amber-500/10 dark:from-orange-900/20 dark:to-amber-900/20',
    accent: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-900/30',
    iconBg: 'bg-white dark:bg-[#242526] text-orange-600 dark:text-orange-400',
  },
];

// Universities not in the initial mock shortlist — used for live-update drip
const LIVE_POOL = mockUniversities.slice(3).map(uni => ({
  university: uni,
  fitScore: uni.fitScore,
  applicationStatus: 'Not Started',
}));

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const rawShortlist = user?.shortlistedUniversities?.filter(item => item.university) || [];
  const [shortlist, setShortlist] = useState(rawShortlist.length > 0 ? rawShortlist : mockShortlist);
  const usingMock = rawShortlist.length === 0;

  const [liveCount, setLiveCount] = useState(0);
  const [newlyAddedIds, setNewlyAddedIds] = useState(new Set());
  const livePoolRef = useRef(0);
  const [comingSoonUni, setComingSoonUni] = useState(null);

  useEffect(() => {
    if (!usingMock) return;
    const timer = setInterval(() => {
      const poolEntry = LIVE_POOL[livePoolRef.current % LIVE_POOL.length];
      livePoolRef.current += 1;
      const liveId = `live-${Date.now()}`;
      const incoming = {
        ...poolEntry,
        university: { ...poolEntry.university, _id: liveId },
      };
      setShortlist(prev => [incoming, ...prev]);
      setNewlyAddedIds(prev => new Set([...prev, liveId]));
      setLiveCount(c => c + 1);
      setTimeout(() => {
        setNewlyAddedIds(prev => {
          const next = new Set(prev);
          next.delete(liveId);
          return next;
        });
      }, 900);
    }, 10000);
    return () => clearInterval(timer);
  }, [usingMock]);

  const handleRemove = (uniId) => {
    if (!window.confirm('Remove from shortlist?')) return;
    if (usingMock) {
      setShortlist(prev => prev.filter(item => item.university._id !== uniId));
      addToast('Removed from shortlist', 'success');
    }
  };

  const handleStatusChange = (uniId, newStatus) => {
    if (usingMock) {
      setShortlist(prev => prev.map(item =>
        item.university._id === uniId ? { ...item, applicationStatus: newStatus } : item
      ));
      addToast('Status updated', 'success');
    }
  };

  if (!user) return <div className="p-10 text-center text-slate-500 dark:text-[#b0b3b8]">Please login</div>;

  const activeApps = shortlist.filter(u => u.applicationStatus !== 'Not Started').length;
  const acceptedCount = shortlist.filter(u => u.applicationStatus === 'Accepted').length;
  const avgFitScore = shortlist.length > 0
    ? Math.round(shortlist.reduce((acc, u) => acc + (u.fitScore || 0), 0) / shortlist.length)
    : 0;

  const statusCounts = shortlist.reduce((acc, u) => {
    acc[u.applicationStatus] = (acc[u.applicationStatus] || 0) + 1;
    return acc;
  }, {});
  const pipelineTotal = shortlist.length || 1;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#18191a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Hero Greeting */}
        <div className="relative mb-8 bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] rounded-2xl overflow-hidden shadow-sm">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-100/60 dark:bg-indigo-900/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-100/50 dark:bg-purple-900/10 rounded-full blur-2xl" />
          </div>
          <div className="relative px-6 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="section-label mb-2">Application Tracker</div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Welcome back,{' '}
                <span className="gradient-text">{user.profile?.firstName || 'Student'}</span>
              </h1>
              <p className="text-slate-500 dark:text-[#b0b3b8] mt-1 text-sm flex items-center gap-2 flex-wrap">
                {today} · Your journey continues
                {liveCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 animate-pop">
                    <Radio size={10} className="animate-pulse" /> {liveCount} update{liveCount !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            <Link to="/search" className="btn-primary flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Sparkles size={16} /> Discover Universities
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: GraduationCap, label: 'Shortlisted',   value: shortlist.length,  sub: 'universities',    accent: 'border-t-blue-500',    iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
            { icon: Activity,      label: 'Active Apps',   value: activeApps,         sub: 'in progress',     accent: 'border-t-indigo-500',  iconBg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
            { icon: Award,         label: 'Avg Fit Score', value: `${avgFitScore}%`,  sub: 'profile match',   accent: 'border-t-emerald-500', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
            { icon: Target,        label: 'Accepted',      value: acceptedCount,      sub: 'offers received', accent: 'border-t-amber-500',   iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
          ].map(({ icon: Icon, label, value, sub, accent, iconBg }) => (
            <div key={label} className={`bg-white dark:bg-[#242526] rounded-xl border border-slate-200 dark:border-[#3e4042] border-t-2 ${accent} p-5 shadow-sm`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${iconBg}`}><Icon size={17} /></div>
                <TrendingUp size={13} className="text-slate-300 dark:text-slate-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-0.5">{value}</div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider">{label}</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {QUICK_LINKS.map(({ to, icon: Icon, label, sub, gradient, accent, border, iconBg }) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${gradient} border ${border} hover:shadow-md transition-all duration-200`}
            >
              <div className={`p-2.5 rounded-xl shadow-sm shrink-0 ${iconBg}`}>
                <Icon size={17} />
              </div>
              <div className="min-w-0 flex-grow">
                <div className={`text-sm font-bold ${accent}`}>{label}</div>
                <div className="text-[11px] text-slate-500 dark:text-[#b0b3b8] truncate">{sub}</div>
              </div>
              <ArrowRight size={13} className={`shrink-0 ${accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150`} />
            </Link>
          ))}
        </div>

        {/* Shortlisted Universities */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#e4e6eb] flex items-center gap-2">
              Shortlisted Universities
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold px-2.5 py-0.5 rounded-full">
                {shortlist.length}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              {liveCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 animate-pop">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  +{liveCount} live
                </span>
              )}
              {usingMock && (
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  Preview Mode
                </span>
              )}
            </div>
          </div>

          {shortlist.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortlist.map((item) => {
                const uni = item.university;
                const statusBorder = STATUS_BORDER[item.applicationStatus] || STATUS_BORDER['Not Started'];
                return (
                  <div
                    key={uni._id}
                    className={`group bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] border-l-4 ${statusBorder} rounded-2xl overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300 flex flex-col ${newlyAddedIds.has(uni._id) ? 'animate-slide-down ring-2 ring-emerald-400/50 ring-offset-2 dark:ring-offset-[#18191a]' : ''}`}
                  >
                    <div className="relative flex-shrink-0">
                      <UniImage src={uni.images?.[0]} alt={uni.name} />
                      <div className="absolute top-3 right-3">
                        <FitScoreBadge score={item.fitScore} />
                      </div>
                      <button
                        onClick={() => handleRemove(uni._id)}
                        className="absolute top-3 left-3 bg-white/90 dark:bg-[#242526]/90 p-1.5 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-white text-sm line-clamp-1 drop-shadow">{uni.name}</h3>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-500 dark:text-[#b0b3b8]">
                        <MapPin size={12} />
                        {uni.city}, {uni.country}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="bg-slate-50 dark:bg-[#35363a] p-2.5 rounded-lg border border-slate-200 dark:border-[#4a4b50]">
                          <div className="text-slate-400 dark:text-[#a0a2b0] text-[10px] uppercase tracking-wider font-semibold mb-0.5">Rank</div>
                          <div className="font-black text-slate-800 dark:text-white text-sm">#{uni.ranking?.global || 'N/A'}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#35363a] p-2.5 rounded-lg border border-slate-200 dark:border-[#4a4b50]">
                          <div className="text-slate-400 dark:text-[#a0a2b0] text-[10px] uppercase tracking-wider font-semibold mb-0.5">Tuition</div>
                          <div className="font-black text-slate-800 dark:text-white text-sm truncate">
                            {uni.financials?.tuitionFee?.international?.currency}{uni.financials?.tuitionFee?.international?.min?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-[#3e4042] flex justify-between items-center gap-2">
                        <select
                          value={item.applicationStatus || 'Not Started'}
                          onChange={(e) => handleStatusChange(uni._id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-1 focus:ring-blue-500 flex-grow ${STATUS_COLORS[item.applicationStatus] || STATUS_COLORS['Not Started']}`}
                        >
                          {['Not Started', 'In Progress', 'Submitted', 'Accepted', 'Rejected', 'Waitlisted'].map(s => (
                            <option key={s} value={s} className="dark:bg-[#242526]">{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setComingSoonUni(uni.name)}
                          className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline whitespace-nowrap flex items-center gap-0.5"
                        >
                          Manage <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#242526] rounded-2xl border border-dashed border-slate-300 dark:border-[#3e4042]">
              <GraduationCap size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="font-bold text-slate-700 dark:text-[#e4e6eb] mb-1">No universities shortlisted yet</p>
              <p className="text-slate-500 dark:text-[#b0b3b8] text-sm mb-5">Search and shortlist universities to start tracking your applications.</p>
              <Link to="/search" className="btn-primary inline-flex items-center gap-2">
                <Sparkles size={16} /> Find Universities
              </Link>
            </div>
          )}
        </section>

        {/* Bottom Row: Pipeline + Premium */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Application Pipeline */}
          <div className="md:col-span-2 bg-white dark:bg-[#242526] p-6 rounded-2xl border border-slate-200 dark:border-[#3e4042] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#e4e6eb]">Application Pipeline</h2>
                <p className="text-xs text-slate-500 dark:text-[#b0b3b8]">Breakdown by status</p>
              </div>
              <Link to="/analytics" className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">
                Analytics <ChevronRight size={15} />
              </Link>
            </div>
            <div className="space-y-3.5">
              {PIPELINE_STAGES.map(({ status, color, label }) => {
                const count = statusCounts[status] || 0;
                const pct = Math.round((count / pipelineTotal) * 100);
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600 dark:text-[#b0b3b8]">{label}</span>
                      <span className="font-black text-slate-800 dark:text-[#e4e6eb]">{count} <span className="font-normal text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-[#3e4042] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premium / Status Card */}
          {!user.isPremium ? (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl"><Zap size={18} /></div>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-200">Upgrade</span>
                </div>
                <h3 className="text-xl font-extrabold mb-2 leading-snug">Unlock Premium Features</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">AI predictions, deep analytics, unlimited shortlisting, and expert consultation priority.</p>
              </div>
              <Link
                to="/payment"
                className="mt-5 bg-white text-indigo-700 font-black text-sm text-center py-3 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles size={15} /> Upgrade Now
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400"><Award size={18} /></div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Premium Active</span>
                </div>
                <h3 className="text-lg font-extrabold text-emerald-800 dark:text-emerald-300 mb-1">Full Access Unlocked</h3>
                <p className="text-emerald-600 dark:text-emerald-500 text-sm">All elite features are available on your account.</p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                Member since {new Date(user.premiumSince).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

      </div>

      {comingSoonUni && (
        <ComingSoonModal
          uniName={comingSoonUni}
          onClose={() => setComingSoonUni(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
