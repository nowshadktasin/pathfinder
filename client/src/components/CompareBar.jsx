import React, { useState, useEffect } from 'react';
import { X, GitCompare, ChevronRight, Trophy, DollarSign, TrendingUp, Star, BookOpen } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

const extractMetrics = (uni) => ({
  rank:       uni.ranking?.global && uni.ranking.global !== 9999 ? uni.ranking.global : null,
  tuition:    uni.financials?.tuitionFee?.international?.min ?? uni.tuition?.undergraduate ?? null,
  acceptance: uni.admissions?.acceptanceRate ?? null,
  fitScore:   uni.fitScore ?? null,
  majors:     uni.academics?.majors?.slice(0, 3) ?? [],
});

const METRIC_ROWS = [
  { key: 'rank',       label: 'Global Rank',   Icon: Trophy,     iconColor: 'text-amber-500'   },
  { key: 'tuition',    label: 'Tuition / yr',  Icon: DollarSign, iconColor: 'text-emerald-500' },
  { key: 'acceptance', label: 'Acceptance',    Icon: TrendingUp, iconColor: 'text-blue-500'    },
  { key: 'fitScore',   label: 'Fit Score',     Icon: Star,       iconColor: 'text-indigo-500'  },
  { key: 'majors',     label: 'Top Majors',    Icon: BookOpen,   iconColor: 'text-purple-500'  },
];

/* ── Compare Modal ── */
const CompareModal = ({ onClose }) => {
  const { compareList, clearCompare } = useCompare();
  const metrics = compareList.map(extractMetrics);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const validRanks    = metrics.map(m => m.rank).filter(Boolean);
  const validTuitions = metrics.map(m => m.tuition).filter(Boolean);
  const validFits     = metrics.map(m => m.fitScore).filter(v => v !== null);
  const bestRank    = validRanks.length    ? Math.min(...validRanks)    : null;
  const bestTuition = validTuitions.length ? Math.min(...validTuitions) : null;
  const bestFit     = validFits.length     ? Math.max(...validFits)     : null;

  const isBestCell = (key, m) =>
    (key === 'rank'     && m.rank     !== null && m.rank     === bestRank)    ||
    (key === 'tuition'  && m.tuition  !== null && m.tuition  === bestTuition) ||
    (key === 'fitScore' && m.fitScore !== null && m.fitScore === bestFit);

  const renderCell = (key, m) => {
    switch (key) {
      case 'rank': {
        const best = m.rank !== null && m.rank === bestRank;
        return m.rank
          ? <div>
              <span className={`font-black text-xl ${best ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-[#e8eaf0]'}`}>#{m.rank}</span>
              {best && <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Best</div>}
            </div>
          : <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>;
      }
      case 'tuition': {
        const best = m.tuition !== null && m.tuition === bestTuition;
        return m.tuition
          ? <div>
              <span className={`font-black text-xl ${best ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-[#e8eaf0]'}`}>${m.tuition.toLocaleString()}</span>
              {best && <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Lowest</div>}
            </div>
          : <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>;
      }
      case 'acceptance': {
        const r = m.acceptance;
        const color = r === null ? '' : r < 15 ? 'text-red-600 dark:text-red-400' : r <= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
        return r !== null
          ? <span className={`font-black text-xl ${color}`}>{r}%</span>
          : <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>;
      }
      case 'fitScore': {
        const best = m.fitScore !== null && m.fitScore === bestFit;
        return m.fitScore !== null
          ? <div>
              <div>
                <span className={`font-black text-xl ${best ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-[#e8eaf0]'}`}>{m.fitScore}</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs">/100</span>
              </div>
              {best && <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Best Match</div>}
            </div>
          : <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>;
      }
      case 'majors':
        return m.majors.length
          ? <div className="flex flex-wrap gap-1 justify-center">
              {m.majors.map(maj => (
                <span key={maj} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                  {maj}
                </span>
              ))}
            </div>
          : <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-[#1a1b23] w-full sm:rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] flex flex-col animate-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 sm:rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2 text-white">
            <GitCompare size={18} />
            <h2 className="font-bold text-base">University Comparison</h2>
            <span className="text-indigo-200 text-sm">· {compareList.length} selected</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-grow">
          <table className="w-full border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#2a2b36]">
                <th className="sticky left-0 z-10 w-36 p-4 text-left text-[11px] font-black text-slate-400 dark:text-[#9395a5] uppercase tracking-widest bg-slate-50 dark:bg-[#13141a] border-r border-slate-200 dark:border-[#2a2b36]">
                  Metric
                </th>
                {compareList.map(uni => (
                  <th key={uni._id} className="p-4 text-center min-w-[180px] bg-white dark:bg-[#1a1b23]">
                    <div className="font-bold text-sm text-slate-900 dark:text-[#e8eaf0] leading-snug">{uni.name}</div>
                    <div className="text-xs text-slate-400 dark:text-[#9395a5] mt-0.5 font-normal">
                      {uni.city ? `${uni.city}, ` : ''}{uni.country}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRIC_ROWS.map(({ key, label, Icon, iconColor }, rowIdx) => (
                <tr key={key} className={rowIdx < METRIC_ROWS.length - 1 ? 'border-b border-slate-100 dark:border-[#2a2b36]' : ''}>
                  <td className="sticky left-0 z-10 p-4 bg-slate-50 dark:bg-[#13141a] border-r border-slate-200 dark:border-[#2a2b36]">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#9395a5] whitespace-nowrap`}>
                      <Icon size={11} className={iconColor} />
                      {label}
                    </div>
                  </td>
                  {metrics.map((m, colIdx) => (
                    <td
                      key={colIdx}
                      className={`p-4 text-center ${isBestCell(key, m) ? 'bg-emerald-50/70 dark:bg-emerald-900/10' : 'bg-white dark:bg-[#1a1b23]'}`}
                    >
                      {renderCell(key, m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-[#2a2b36] bg-slate-50 dark:bg-[#13141a] flex justify-between items-center flex-shrink-0 sm:rounded-b-2xl">
          <button
            onClick={() => { clearCompare(); onClose(); }}
            className="text-xs font-semibold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
          <button onClick={onClose} className="btn-primary text-sm py-2 px-5">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Sticky Compare Bar ── */
const CompareBar = () => {
  const { compareList, clearCompare } = useCompare();
  const [modalOpen, setModalOpen] = useState(false);

  if (compareList.length < 2) return null;

  return (
    <>
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto animate-slide-up bg-slate-900 dark:bg-[#0f0f14] border border-slate-700 dark:border-[#2a2b36] rounded-2xl shadow-2xl px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {compareList.map(uni => (
              <span
                key={uni._id}
                className="text-xs font-semibold text-white/90 bg-white/10 px-2.5 py-1 rounded-full max-w-[130px] truncate"
              >
                {uni.name}
              </span>
            ))}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            Compare {compareList.length} universities <ChevronRight size={14} />
          </button>

          <button
            onClick={clearCompare}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors flex-shrink-0"
            title="Clear comparison"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {modalOpen && <CompareModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default CompareBar;
