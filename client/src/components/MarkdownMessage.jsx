import React from 'react';

const parseInline = (text) => {
  const parts = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0, k = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={k++} className="font-semibold text-slate-900 dark:text-white">{m[1]}</strong>);
    else       parts.push(<em key={k++} className="italic text-slate-700 dark:text-[#d0d2e0]">{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const MarkdownMessage = ({ content, compact = false }) => {
  const lines = (content || '').split('\n');
  const output = [];
  let olItems = [], ulItems = [];

  const flushOl = () => {
    if (!olItems.length) return;
    output.push(
      <ol key={output.length} className={`space-y-2 ${compact ? 'my-2' : 'my-3'}`}>
        {olItems.map((t, i) => (
          <li key={i} className="flex gap-2.5 leading-relaxed">
            <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-slate-700 dark:text-[#e4e6eb]">{parseInline(t)}</span>
          </li>
        ))}
      </ol>
    );
    olItems = [];
  };

  const flushUl = () => {
    if (!ulItems.length) return;
    output.push(
      <ul key={output.length} className={`space-y-1.5 pl-1 ${compact ? 'my-1.5' : 'my-2.5'}`}>
        {ulItems.map((t, i) => (
          <li key={i} className="flex gap-2.5 leading-relaxed">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 mt-2" />
            <span className="text-slate-700 dark:text-[#e4e6eb]">{parseInline(t)}</span>
          </li>
        ))}
      </ul>
    );
    ulItems = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (/^#{1,3} /.test(line)) {
      flushOl(); flushUl();
      const level = line.match(/^(#+)/)[1].length;
      const text  = line.replace(/^#+\s/, '');
      const cls   = level <= 2
        ? 'font-extrabold text-slate-900 dark:text-white mt-3 mb-0.5 border-b border-slate-100 dark:border-[#3e4042] pb-1'
        : 'font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px] mt-3 mb-0.5';
      output.push(<p key={output.length} className={cls}>{parseInline(text)}</p>);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      flushUl();
      olItems.push(line.replace(/^\d+\.\s/, ''));
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      flushOl();
      ulItems.push(line.replace(/^[-*]\s/, ''));
      continue;
    }

    flushOl(); flushUl();
    if (!line.trim()) continue;

    output.push(
      <p key={output.length} className="leading-relaxed text-slate-700 dark:text-[#e4e6eb]">
        {parseInline(line)}
      </p>
    );
  }
  flushOl(); flushUl();

  return <div className={`space-y-1 ${compact ? 'text-xs' : 'text-sm'}`}>{output}</div>;
};

export default MarkdownMessage;
