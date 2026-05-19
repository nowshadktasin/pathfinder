import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import UniversityCard from '../components/UniversityCard';
import { useAuth } from '../context/AuthContext';
import { Filter, X, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { mockUniversities } from '../services/mockData';

const Search = () => {
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const [filters, setFilters] = useState({
        search: searchParams.get('q') || '',
        country: '',
        maxTuition: '',
        maxRanking: '',
        major: ''
    });

    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(20);

    // Simulate a brief load then show mock data
    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(t);
    }, [filters]);

    // Sync URL ?q= param into search filter
    useEffect(() => {
        setFilters(prev => ({ ...prev, search: searchParams.get('q') || '' }));
    }, [searchParams]);

    const filtered = useMemo(() => {
        return mockUniversities.filter(uni => {
            const q = filters.search.toLowerCase();
            const matchSearch = !q ||
                uni.name.toLowerCase().includes(q) ||
                uni.city?.toLowerCase().includes(q) ||
                uni.country?.toLowerCase().includes(q);

            const matchCountry = !filters.country ||
                uni.country?.toLowerCase().includes(filters.country.toLowerCase());

            const matchMajor = !filters.major ||
                uni.academics?.majors?.some(m =>
                    m.toLowerCase().includes(filters.major.toLowerCase())
                );

            // maxRanking = N → show only universities ranked 1 through N (lower number = better rank)
            const matchRanking = !filters.maxRanking ||
                (uni.ranking?.global && uni.ranking.global <= Number(filters.maxRanking));

            const matchTuition = !filters.maxTuition ||
                (uni.financials?.tuitionFee?.international?.min &&
                    uni.financials.tuitionFee.international.min <= Number(filters.maxTuition));

            return matchSearch && matchCountry && matchMajor && matchRanking && matchTuition;
        });
    }, [filters]);

    const visible = filtered.slice(0, visibleCount);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setVisibleCount(20);
    };

    const clearFilters = () => {
        setFilters({ search: '', country: '', maxTuition: '', maxRanking: '', major: '' });
        setVisibleCount(20);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f11] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-[#e8eaf0]">
                            Discover Universities
                        </h1>
                        <p className="text-slate-500 dark:text-[#9395a5] text-sm mt-1">
                            {loading ? 'Searching…' : `${filtered.length} universities found`}
                            {user && ' · with your Fit Score'}
                        </p>
                    </div>
                    <button
                        className="md:hidden flex items-center gap-2 btn-secondary text-sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="w-5 h-5 flex items-center justify-center bg-brand-600 text-white text-[10px] font-black rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-7">

                    {/* Filters Sidebar */}
                    <div className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="bg-white dark:bg-[#1a1b23] rounded-2xl border border-indigo-50 dark:border-[#2a2b36] p-5 sticky top-20"
                            style={{ boxShadow: 'var(--shadow-card)' }}>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="font-heading font-bold text-slate-800 dark:text-[#e8eaf0] flex items-center gap-2">
                                    <Filter size={16} className="text-brand-600 dark:text-brand-400" />
                                    Filters
                                </h2>
                                <div className="flex items-center gap-2">
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                    {showFilters && (
                                        <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'University Name', name: 'search', placeholder: 'Keyword...', type: 'text' },
                                    { label: 'Country', name: 'country', placeholder: 'e.g. USA', type: 'text' },
                                    { label: 'Major / Field', name: 'major', placeholder: 'e.g. Computer Science', type: 'text' },
                                    { label: 'Top N Ranking', name: 'maxRanking', placeholder: 'e.g. 50 → shows top 50', type: 'number' },
                                    { label: 'Max Tuition ($)', name: 'maxTuition', placeholder: 'e.g. 50000', type: 'number' },
                                ].map(({ label, name, placeholder, type }) => (
                                    <div key={name}>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-[#9395a5] uppercase tracking-wider mb-1.5">
                                            {label}
                                        </label>
                                        <div className="relative">
                                            {name === 'search' && (
                                                <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9395a5]" />
                                            )}
                                            <input
                                                type={type}
                                                name={name}
                                                value={filters[name]}
                                                onChange={handleFilterChange}
                                                className={`input-field text-sm ${name === 'search' ? 'pl-8' : ''}`}
                                                placeholder={placeholder}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick country chips */}
                            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-[#2a2b36]">
                                <p className="text-xs font-semibold text-slate-400 dark:text-[#9395a5] uppercase tracking-wider mb-2">Quick Select</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setFilters(prev => ({ ...prev, country: prev.country === c ? '' : c }))}
                                            className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all duration-150 ${
                                                filters.country === c
                                                    ? 'bg-brand-600 text-white border-brand-600 shadow-brand'
                                                    : 'bg-slate-50 dark:bg-[#252636] text-slate-600 dark:text-[#9395a5] border-slate-200 dark:border-[#2a2b36] hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400'
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="skeleton rounded-2xl h-80" />
                                ))}
                            </div>
                        ) : visible.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {visible.map(uni => (
                                        <UniversityCard
                                            key={uni._id}
                                            university={uni}
                                            fitScore={uni.fitScore}
                                        />
                                    ))}
                                </div>

                                {visibleCount < filtered.length && (
                                    <div className="flex justify-center mt-10">
                                        <button
                                            onClick={() => setVisibleCount(prev => prev + 20)}
                                            className="btn-secondary px-8 py-2.5"
                                        >
                                            Load More ({filtered.length - visibleCount} remaining)
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-24 bg-white dark:bg-[#1a1b23] rounded-2xl border border-dashed border-slate-200 dark:border-[#2a2b36]">
                                <SearchIcon size={40} className="mx-auto mb-4 text-slate-300 dark:text-[#3a3b46]" />
                                <p className="font-semibold text-slate-700 dark:text-[#e8eaf0] mb-1">No universities match your filters</p>
                                <p className="text-slate-400 dark:text-[#9395a5] text-sm mb-4">Try broadening your search criteria</p>
                                <button onClick={clearFilters} className="btn-primary text-sm py-2 px-5">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
