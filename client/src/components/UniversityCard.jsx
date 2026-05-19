import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Heart, TrendingUp, GitCompare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCompare } from '../context/CompareContext';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80";

const FitRing = ({ score }) => {
  if (score === undefined || score === null) return null;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Great' : score >= 60 ? 'Good' : 'Low';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white"
        style={{ background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.25) 0deg)` }}
      >
        <span className="text-[10px] font-black drop-shadow">{score}</span>
      </div>
      <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">{label}</span>
    </div>
  );
};

const UniversityCard = ({ university, fitScore: fitScoreProp }) => {
  const fitScore = fitScoreProp ?? university.fitScore;
  const { user } = useAuth();
  const { addToast } = useToast();
  const { compareList, toggleCompare } = useCompare();
  const [imgError, setImgError] = React.useState(false);

  const isCompared = compareList.some(u => u._id === university._id);
  const compareDisabled = !isCompared && compareList.length >= 3;

  // Seeded from user data once on mount; managed locally from that point forward.
  // This means the heart state survives parent re-renders, modal open/close
  // cycles, and filter changes — no reload needed.
  const [shortlisted, setShortlisted] = React.useState(() =>
    user?.shortlistedUniversities?.some(item =>
      (typeof item.university === 'string' ? item.university : item.university?._id) === university._id
    ) ?? false
  );

  const displayImage = !imgError && university.images?.[0]
    ? university.images[0]
    : FALLBACK_IMAGE;

  const handleShortlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Please log in to shortlist universities', 'error');
      return;
    }

    setShortlisted(prev => {
      const next = !prev;
      addToast(
        next
          ? `Added ${university.name} to shortlist`
          : `Removed ${university.name} from shortlist`,
        'success'
      );
      return next;
    });
  };

  const tuition = university.financials?.tuitionFee?.international?.min
    ? `$${university.financials.tuitionFee.international.min.toLocaleString()}`
    : university.tuition?.undergraduate
      ? `$${university.tuition.undergraduate.toLocaleString()}`
      : null;

  const rank = university.ranking?.global && university.ranking.global !== 9999
    ? `#${university.ranking.global}`
    : null;

  return (
    <div
      className={`group relative bg-white dark:bg-[#1a1b23] rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${isCompared ? 'border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-400/40 dark:ring-indigo-500/30' : 'border-indigo-50 dark:border-[#2a2b36]'}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-card-lg)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-[#252636] flex-shrink-0">
        <img
          src={displayImage}
          alt={university.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Top bar: rank + shortlist toggle */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {rank && (
            <span className="text-[11px] font-black text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
              {rank} Global
            </span>
          )}
          <button
            onClick={handleShortlist}
            className={`ml-auto w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm border transition-all duration-200 ${
              shortlisted
                ? 'bg-red-500/90 border-red-400 text-white scale-110'
                : 'bg-black/30 border-white/30 text-white/80 hover:bg-red-500/80 hover:border-red-400'
            }`}
            title={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          >
            <Heart size={14} fill={shortlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Bottom of image: name + location + fit ring */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <div className="flex-grow min-w-0 pr-3">
            <h3 className="font-heading font-bold text-white text-base leading-snug line-clamp-2 drop-shadow-sm">
              {university.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-white/70 text-xs">
              <MapPin size={11} />
              {university.city ? `${university.city}, ` : ''}{university.country}
            </div>
          </div>
          {fitScore !== undefined && <FitRing score={fitScore} />}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        {university.academics?.majors?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {university.academics.majors.slice(0, 3).map(m => (
              <span key={m} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                {m}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          {tuition && (
            <div className="bg-slate-50 dark:bg-[#252636] rounded-xl p-2.5 border border-slate-100 dark:border-[#2a2b36]">
              <div className="text-slate-400 dark:text-[#9395a5] mb-0.5">Tuition / yr</div>
              <div className="font-bold text-slate-800 dark:text-[#e8eaf0]">{tuition}</div>
            </div>
          )}
          {university.admissions?.acceptanceRate && (() => {
            const rate = university.admissions.acceptanceRate;
            const tier = rate < 15
              ? { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-900/40', label: 'text-red-400 dark:text-red-500', value: 'text-red-600 dark:text-red-400' }
              : rate <= 40
              ? { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-900/40', label: 'text-amber-400 dark:text-amber-500', value: 'text-amber-600 dark:text-amber-400' }
              : { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/40', label: 'text-emerald-400 dark:text-emerald-500', value: 'text-emerald-600 dark:text-emerald-400' };
            return (
              <div className={`${tier.bg} rounded-xl p-2.5 border ${tier.border}`}>
                <div className={`${tier.label} mb-0.5 flex items-center gap-1`}>
                  <TrendingUp size={10} /> Acceptance
                </div>
                <div className={`font-bold ${tier.value}`}>{rate}%</div>
              </div>
            );
          })()}
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggleCompare({ ...university, fitScore }); }}
            disabled={compareDisabled}
            title={isCompared ? 'Remove from comparison' : compareDisabled ? 'Max 3 universities' : 'Add to compare'}
            className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all duration-200 ${
              isCompared
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : compareDisabled
                ? 'border-slate-200 dark:border-[#2a2b36] bg-slate-50 dark:bg-[#252636] text-slate-300 dark:text-[#5a5b6a] cursor-not-allowed'
                : 'border-slate-200 dark:border-[#2a2b36] bg-slate-50 dark:bg-[#252636] text-slate-500 dark:text-[#9395a5] hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <GitCompare size={15} />
          </button>
          <Link
            to={`/university/${university._id}`}
            className="btn-primary flex-grow text-center text-sm py-2"
          >
            View Details
          </Link>
          {university.contact?.website && (
            <a
              href={university.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border border-slate-200 dark:border-[#2a2b36] bg-slate-50 dark:bg-[#252636] text-slate-500 dark:text-[#9395a5] hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-200"
              title="Visit website"
            >
              <Globe size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
