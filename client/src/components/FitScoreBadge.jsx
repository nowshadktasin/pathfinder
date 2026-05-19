import React from 'react';

const TIERS = [
  {
    min: 80,
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    dot: 'bg-emerald-500',
    label: 'Great Match',
  },
  {
    min: 60,
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/60',
    dot: 'bg-amber-500',
    label: 'Good Match',
  },
  {
    min: 0,
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/60',
    dot: 'bg-red-500',
    label: 'Low Match',
  },
];

const FitScoreBadge = ({ score }) => {
  if (score === undefined || score === null) return null;

  const tier = TIERS.find(t => score >= t.min);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${tier.bg} ${tier.text} ${tier.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tier.dot}`} />
      <span>{score}%</span>
      <span className="opacity-70 font-medium">{tier.label}</span>
    </div>
  );
};

export default FitScoreBadge;
