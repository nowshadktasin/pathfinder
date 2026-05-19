import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f11] flex flex-col items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100 dark:bg-brand-950 rounded-full blur-3xl opacity-40 -mr-40 -mt-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-100 dark:bg-violet-950 rounded-full blur-3xl opacity-30 -ml-40 -mb-40 pointer-events-none" />

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">
                {/* Left — Branding */}
                <div className="space-y-8 animate-fade-in">
                    <div className="section-label">
                        <Zap size={12} />
                        Next-Gen Admissions Platform
                    </div>
                    <h1 className="font-heading text-5xl lg:text-[4.5rem] font-black text-slate-900 dark:text-[#e8eaf0] leading-[1.08] tracking-tight">
                        Shape Your <br />
                        <span className="gradient-text">Global Future.</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-[#9395a5] max-w-md leading-relaxed">
                        The world's most advanced platform for university discovery, AI-powered applications, and verified expert mentorship.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {[
                            { icon: Globe, label: '1,200+ Universities', color: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20' },
                            { icon: ShieldCheck, label: 'Verified Consultants', color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20' },
                        ].map(({ icon: Icon, label, color }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${color} shadow-sm`}>
                                    <Icon size={18} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-[#c5c8d6]">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — Portal Cards */}
                <div className="grid grid-cols-1 gap-5 animate-slide-up">
                    {/* Student Card */}
                    <div
                        onClick={() => navigate('/login?role=student')}
                        className="group bg-white dark:bg-[#1a1b23] p-7 rounded-2xl border border-indigo-100 dark:border-[#2a2b36] cursor-pointer relative overflow-hidden transition-all duration-300"
                        style={{ boxShadow: 'var(--shadow-card)' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-lg)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex gap-5">
                            <div className="w-14 h-14 brand-gradient rounded-2xl flex items-center justify-center text-white shadow-brand flex-shrink-0">
                                <GraduationCap size={28} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-center mb-1.5">
                                    <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-[#e8eaf0]">Student Portal</h2>
                                    <ArrowRight className="text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" size={20} />
                                </div>
                                <p className="text-slate-500 dark:text-[#9395a5] text-sm leading-relaxed mb-3">
                                    Find dream universities, get AI Fit Scores, and manage applications end-to-end.
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {['Fit Score', 'AI Essays', 'Tracker'].map(t => (
                                        <span key={t} className="text-[10px] font-bold bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40 px-2 py-0.5 rounded-full">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consultant Card */}
                    <div
                        onClick={() => navigate('/login?role=consultant')}
                        className="group bg-white dark:bg-[#1a1b23] p-7 rounded-2xl border border-violet-100 dark:border-[#2a2b36] cursor-pointer relative overflow-hidden transition-all duration-300"
                        style={{ boxShadow: 'var(--shadow-card)' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card-lg)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex gap-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-300/40 dark:shadow-violet-900/40 flex-shrink-0">
                                <Users size={28} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-center mb-1.5">
                                    <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-[#e8eaf0]">Consultant Portal</h2>
                                    <ArrowRight className="text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all" size={20} />
                                </div>
                                <p className="text-slate-500 dark:text-[#9395a5] text-sm leading-relaxed mb-3">
                                    Guide students, review documents, manage bookings and provide expert feedback.
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {['Collaboration', 'Bookings', 'Analytics'].map(t => (
                                        <span key={t} className="text-[10px] font-bold bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/40 px-2 py-0.5 rounded-full">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer note */}
            <div className="mt-16 text-slate-400 dark:text-[#9395a5] text-sm font-medium animate-fade-in">
                &copy; {new Date().getFullYear()} PathFinder Global &nbsp;·&nbsp; Built for students, by students.
            </div>
        </div>
    );
};

export default Welcome;
