import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
    TrendingUp, Activity, Target, Award, Clock,
    ChevronRight, BookOpen, GraduationCap, BarChart2, Search
} from 'lucide-react';

const PREVIEW_FEATURES = [
    { icon: <TrendingUp size={18} />, label: 'Fit Score Trends', desc: 'Track how well universities match your profile over time' },
    { icon: <Target size={18} />, label: 'Application Pipeline', desc: 'Monitor your progress across all shortlisted universities' },
    { icon: <BookOpen size={18} />, label: 'Resource Activity', desc: 'See which preparation areas you\'re focusing on most' },
];

const EmptyState = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-[#18191a] flex flex-col transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 dark:text-[#e4e6eb] tracking-tight">Personal Analytics</h1>
                <p className="text-slate-500 dark:text-[#b0b3b8] font-medium">Data-driven insights for your academic journey</p>
            </div>

            <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center mb-6">
                    <BarChart2 size={36} className="text-indigo-400 dark:text-indigo-500" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-[#e4e6eb] mb-3">No Analytics Yet</h2>
                <p className="text-slate-500 dark:text-[#b0b3b8] text-base max-w-md mb-10 leading-relaxed">
                    Shortlist universities to unlock your personalized dashboard — fit scores, application pipeline, and preparation trends.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 w-full max-w-2xl">
                    {PREVIEW_FEATURES.map(f => (
                        <div key={f.label} className="bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] rounded-2xl p-5 text-left opacity-60 select-none">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-3">
                                {f.icon}
                            </div>
                            <div className="font-bold text-slate-800 dark:text-[#e4e6eb] text-sm mb-1">{f.label}</div>
                            <div className="text-xs text-slate-500 dark:text-[#b0b3b8] leading-relaxed">{f.desc}</div>
                        </div>
                    ))}
                </div>

                <Link to="/search" className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
                    <Search size={16} /> Explore Universities
                </Link>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-3">Shortlist a few universities to get started</p>
            </div>
        </div>
    </div>
);

const Analytics = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const hasShortlisted = (user?.shortlistedUniversities?.length ?? 0) > 0;

    useEffect(() => {
        if (!hasShortlisted) {
            setLoading(false);
            return;
        }
        const t = setTimeout(() => {
            setData({
                avgFitScore: 83,
                isPremium: false,
                nextDeadline: '2025-11-05T00:00:00.000Z',
                appProgress: {
                    'Not Started': 2,
                    'In Progress': 3,
                    'Submitted': 1,
                    'Accepted': 0,
                    'Rejected': 0,
                },
                engagement: {
                    IELTS: 14,
                    TOEFL: 8,
                    SAT: 5,
                    GRE: 11,
                    Essay: 9,
                    Visa: 3,
                },
                scoreTrends: [
                    { date: '2024-09-01', score: 68 },
                    { date: '2024-10-01', score: 72 },
                    { date: '2024-11-01', score: 76 },
                    { date: '2024-12-01', score: 80 },
                    { date: '2025-01-01', score: 83 },
                    { date: '2025-02-01', score: 83 },
                ],
            });
            setLoading(false);
        }, 500);
        return () => clearTimeout(t);
    }, [hasShortlisted]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#18191a] flex flex-col transition-colors">
            <div className="flex-grow flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-indigo-200 dark:bg-indigo-900/50 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        </div>
    );

    if (!hasShortlisted || !data) return <EmptyState />;

    // Prepare App Progress Data for Pie Chart
    const appProgressData = Object.entries(data.appProgress).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Prepare Engagement Data for Bar Chart
    const engagementData = Object.entries(data.engagement).map(([name, value]) => ({ name, value }));

    // Prepare Score Trends for Line Chart
    const scoreTrends = data.scoreTrends || [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#18191a] flex flex-col transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-[#e4e6eb] tracking-tight">Personal Analytics</h1>
                        <p className="text-slate-500 dark:text-[#b0b3b8] font-medium">Data-driven insights for your academic journey</p>
                    </div>
                    {data.isPremium && (
                        <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none">
                            < Award size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">Premium Access</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={<TrendingUp className="text-blue-600 dark:text-blue-400" />} title="Avg Fit Score" value={`${data.avgFitScore || 0}%`} trend="Based on shortlist" />
                    <StatCard icon={<Activity className="text-indigo-600 dark:text-indigo-400" />} title="Resource Activity" value={Object.values(data.engagement).reduce((a, b) => a + b, 0)} trend="Total clicks" />
                    <StatCard icon={<Target className="text-green-600 dark:text-green-400" />} title="Applications" value={Object.values(data.appProgress).reduce((a, b) => a + b, 0)} trend="Shortlisted" />
                    <StatCard
                        icon={<Clock className="text-orange-600 dark:text-orange-400" />}
                        title="Next Deadline"
                        value={data.nextDeadline ? new Date(data.nextDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'None'}
                        trend={data.nextDeadline ? `${Math.ceil((new Date(data.nextDeadline) - new Date()) / (1000 * 60 * 60 * 24))} days left` : 'No deadlines set'}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Application Progress */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#242526] p-8 rounded-3xl border border-slate-200 dark:border-[#3e4042] shadow-sm transition-colors duration-300">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-[#e4e6eb] mb-6 flex items-center gap-2">
                            <GraduationCap className="text-slate-400 dark:text-slate-500" /> Application Pipeline
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Object.entries(data.appProgress).map(([name, count]) => ({ name, count }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" strokeOpacity={0.2} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#fff', color: '#000' }}
                                    />
                                    <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-white dark:bg-[#242526] p-8 rounded-3xl border border-slate-200 dark:border-[#3e4042] shadow-sm transition-colors duration-300">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-[#e4e6eb] mb-6 flex items-center gap-2">
                            <Target className="text-slate-400 dark:text-slate-500" /> Status Split
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={appProgressData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {appProgressData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {appProgressData.length > 0 ? appProgressData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-slate-600 dark:text-[#b0b3b8]">{entry.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-800 dark:text-[#e4e6eb]">{entry.value}</span>
                                </div>
                            )) : <div className="text-center text-slate-400 text-sm mt-10">No applications yet.</div>}
                        </div>
                    </div>

                    {/* Test Score Trends */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#242526] p-8 rounded-3xl border border-slate-200 dark:border-[#3e4042] shadow-sm transition-colors duration-300">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-[#e4e6eb] mb-6 flex items-center gap-2">
                            <TrendingUp className="text-slate-400 dark:text-slate-500" /> Preparation Readiness
                        </h2>
                        <div className="h-80">
                            {scoreTrends.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={scoreTrends}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" strokeOpacity={0.2} />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none' }}
                                        />
                                        <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 italic">No score history recorded yet. Add scores in your profile to track trends.</div>
                            )}
                        </div>
                    </div>

                    {/* Engagement */}
                    <div className="bg-white dark:bg-[#242526] p-8 rounded-3xl border border-slate-200 dark:border-[#3e4042] shadow-sm transition-colors duration-300">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-[#e4e6eb] mb-6 flex items-center gap-2">
                            <BookOpen className="text-slate-400 dark:text-slate-500" /> Resource Focus
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={engagementData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={70} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {!data.isPremium && (
                    <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-700 p-6 sm:p-8 rounded-3xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-indigo-100 dark:shadow-none">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold mb-2">Unlock Advanced Insights</h2>
                            <p className="text-indigo-100 opacity-90 max-w-md text-sm sm:text-base">Get percentile rankings, university-specific score predictors, and personalized study roadmaps with Premium.</p>
                        </div>
                        <button onClick={() => window.location.href = '/payment'} className="w-full md:w-auto bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                            Upgrade Now <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, trend }) => (
    <div className="bg-white dark:bg-[#242526] p-6 rounded-3xl border border-slate-200 dark:border-[#3e4042] shadow-sm hover:shadow-md transition-all duration-300">
        <div className="bg-slate-50 dark:bg-[#323436] w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors">
            {icon}
        </div>
        <div className="text-slate-500 dark:text-[#b0b3b8] text-sm font-bold uppercase tracking-wider mb-1">{title}</div>
        <div className="text-2xl font-black text-slate-900 dark:text-[#e4e6eb] mb-1">{value}</div>
        <div className="text-xs font-medium text-slate-400 dark:text-slate-500">{trend}</div>
    </div>
);

export default Analytics;
