import React, { useEffect } from 'react';
import { X, Clock, Rocket } from 'lucide-react';

const ComingSoonModal = ({ uniName, onClose }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative bg-white dark:bg-[#242526] rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-slate-200 dark:border-[#3e4042] animate-pop"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-all"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-5 border border-indigo-100 dark:border-indigo-900/50">
          <Clock size={26} className="text-indigo-500 dark:text-indigo-400" />
        </div>

        <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#e4e6eb] text-center mb-2">
          Coming Soon
        </h2>

        <p className="text-slate-500 dark:text-[#b0b3b8] text-sm text-center leading-relaxed mb-6">
          The application manager for{' '}
          <span className="font-semibold text-slate-800 dark:text-[#e4e6eb]">
            {uniName}
          </span>{' '}
          is under development. You'll be able to track documents, deadlines, and submit directly from Pathfinder.
        </p>

        <div className="space-y-2.5">
          <button
            onClick={onClose}
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
          >
            <Rocket size={14} /> Got it
          </button>
          <button
            onClick={onClose}
            className="w-full text-sm text-slate-400 dark:text-[#9395a5] hover:text-slate-600 dark:hover:text-[#e4e6eb] transition-colors py-1"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
