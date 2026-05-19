import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockUniversities } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import FitScoreBadge from '../components/FitScoreBadge';
import ComingSoonModal from '../components/ComingSoonModal';
import { MapPin, Globe, DollarSign, Award, BookOpen, Heart, CheckCircle, FileText } from 'lucide-react';

const EXTRA_DETAILS = {
  uni1: {
    description: 'MIT is a world-renowned research university in Cambridge, Massachusetts, known for its cutting-edge research in science, technology, and engineering. Founded in 1861, MIT has produced 97 Nobel laureates and is consistently ranked #1 globally.',
    academics: { majorsOffered: ['Computer Science', 'Engineering', 'Physics', 'Mathematics', 'Biology', 'Economics', 'Architecture'], studentTeacherRatio: '3:1', facultyStrength: 1000 },
    financials: { financialAidAvailable: true },
    campusLife: { campusType: 'Urban Research Campus', facilities: ['Libraries', 'Labs', 'Recreation Center', 'Student Housing', 'Museums', 'Startup Hub'] },
    admissions: { requirements: { minGPA: 3.9, testScores: { sat: { min: 1500 }, toefl: { min: 100 } } }, applicationDeadlines: [{ term: 'Fall 2025', deadline: '2025-01-01' }] },
    testimonials: [{ studentName: 'Rohan Kapoor', major: 'EECS', graduationYear: 2023, rating: 5, testimonial: 'The research opportunities at MIT are unparalleled. I co-authored two papers as an undergrad.' }],
  },
  uni2: {
    description: 'The University of Oxford is the oldest university in the English-speaking world, offering a unique collegiate system and tutorial-based learning across humanities, sciences, and social sciences.',
    academics: { majorsOffered: ['Law', 'Medicine', 'Philosophy', 'Economics', 'History', 'Computer Science', 'Engineering'], studentTeacherRatio: '11:1', facultyStrength: 1800 },
    financials: { financialAidAvailable: true },
    campusLife: { campusType: 'Historic City Campus', facilities: ['Bodleian Library', 'Sports Facilities', 'College Dining', 'Research Centers', 'Student Unions'] },
    admissions: { requirements: { minGPA: 3.8, testScores: { toefl: { min: 110 } } }, applicationDeadlines: [{ term: 'Michaelmas 2025', deadline: '2025-01-22' }] },
    testimonials: [{ studentName: 'Mei Lin', major: 'PPE', graduationYear: 2023, rating: 5, testimonial: 'The tutorial system forces you to think deeply. Best intellectual experience of my life.' }],
  },
  uni3: {
    description: 'The University of Toronto is Canada\'s top-ranked university, a global leader in research and innovation with strong programs in engineering, medicine, and computer science.',
    academics: { majorsOffered: ['Business', 'Computer Science', 'Engineering', 'Health Sciences', 'Law', 'Arts & Sciences'], studentTeacherRatio: '21:1', facultyStrength: 2600 },
    financials: { financialAidAvailable: true },
    campusLife: { campusType: 'Urban Downtown Campus', facilities: ['Libraries', 'Gym', 'Student Housing', 'Innovation Hub', 'Co-op Office'] },
    admissions: { requirements: { minGPA: 3.5, testScores: { toefl: { min: 93 } } }, applicationDeadlines: [{ term: 'Fall 2025', deadline: '2025-04-01' }] },
    testimonials: [{ studentName: 'Ahmed Al-Rashid', major: 'Computer Science', graduationYear: 2024, rating: 5, testimonial: 'The diversity on campus is incredible. I had classmates from 150+ countries and amazing co-op opportunities.' }],
  },
  uni4: {
    description: 'ETH Zurich is one of the world\'s leading universities for natural sciences and technology, with low tuition fees and exceptional research infrastructure in the heart of Europe.',
    academics: { majorsOffered: ['Engineering', 'Architecture', 'Natural Sciences', 'Mathematics', 'Computer Science', 'Management'], studentTeacherRatio: '16:1', facultyStrength: 500 },
    financials: { financialAidAvailable: false },
    campusLife: { campusType: 'City-Integrated Campus', facilities: ['Modern Labs', 'Sports Center', 'Student Housing', 'Innovation Park', 'Language Center'] },
    admissions: { requirements: { minGPA: 3.7, testScores: { toefl: { min: 95 } } }, applicationDeadlines: [{ term: 'Autumn 2025', deadline: '2025-04-30' }] },
    testimonials: [],
  },
  uni5: {
    description: 'NUS is Asia\'s top university, combining the best of Eastern and Western academic traditions with strong industry connections and a vibrant multicultural campus.',
    academics: { majorsOffered: ['Business', 'Computing', 'Medicine', 'Design', 'Engineering', 'Law', 'Arts & Social Sciences'], studentTeacherRatio: '16:1', facultyStrength: 2600 },
    financials: { financialAidAvailable: true },
    campusLife: { campusType: 'Residential Urban Campus', facilities: ['Libraries', 'Recreation Center', 'University Cultural Centre', 'Start-up Lab', 'Hospital'] },
    admissions: { requirements: { minGPA: 3.6, testScores: { toefl: { min: 85 } } }, applicationDeadlines: [{ term: 'AY 2025/2026', deadline: '2025-03-15' }] },
    testimonials: [],
  },
  uni6: {
    description: 'The University of Melbourne is Australia\'s #1 university, known for its research excellence, vibrant campus culture, and strong graduate employability.',
    academics: { majorsOffered: ['Arts', 'Science', 'Commerce', 'Engineering', 'Education', 'Medicine', 'Law'], studentTeacherRatio: '22:1', facultyStrength: 5000 },
    financials: { financialAidAvailable: true },
    campusLife: { campusType: 'Parkland Urban Campus', facilities: ['Libraries', 'Sports Precinct', 'Student Services', 'Student Housing', 'Arts & Culture Centers'] },
    admissions: { requirements: { minGPA: 3.3, testScores: { toefl: { min: 79 } } }, applicationDeadlines: [{ term: 'Semester 1 2025', deadline: '2025-10-31' }] },
    testimonials: [],
  },
};

const UniversityDetails = () => {
    const { id } = useParams();
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shortlisted, setShortlisted] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const t = setTimeout(() => {
            const base = mockUniversities.find(u => u._id === id);
            if (base) {
                const extra = EXTRA_DETAILS[id] || {};
                setUniversity({ ...base, ...extra });
            }
            setLoading(false);
        }, 300);
        return () => clearTimeout(t);
    }, [id]);

    useEffect(() => {
        if (user?.shortlistedUniversities) {
            setShortlisted(user.shortlistedUniversities.some(item =>
                item.university && (item.university._id === id || item.university === id)
            ));
        }
    }, [user, id]);

    const fitScore = university?.fitScore || null;

    const handleShortlist = () => {
        if (!user) return alert('Please login to shortlist');
        setShortlisted(true);
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!university) return <div className="p-10 text-center">University not found</div>;

    return (
        <div className="bg-slate-50 dark:bg-[#18191a] min-h-screen pb-12 transition-colors duration-300">
            {/* Header / Hero */}
            <div className="bg-white dark:bg-[#242526] border-b border-slate-200 dark:border-[#3e4042] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-[#e4e6eb]">{university.name}</h1>
                            <div className="flex items-center gap-4 mt-2 text-slate-600 dark:text-[#b0b3b8]">
                                <span className="flex items-center gap-1"><MapPin size={18} /> {university.city}, {university.country}</span>
                                <span className="flex items-center gap-1"><Award size={18} /> Global Rank: #{university.ranking?.global}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {user && <FitScoreBadge score={fitScore} />}
                            <button
                                onClick={handleShortlist}
                                disabled={shortlisted}
                                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${shortlisted
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                                    }`}
                            >
                                {shortlisted ? <><CheckCircle size={18} /> Shortlisted</> : <><Heart size={18} /> Shortlist</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-[#242526] rounded-xl shadow-sm p-6 border border-slate-100 dark:border-[#3e4042]">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-[#e4e6eb]">About</h2>
                        <p className="text-slate-600 dark:text-[#b0b3b8] leading-relaxed">{university.description}</p>
                    </section>

                    <section className="bg-white dark:bg-[#242526] rounded-xl shadow-sm p-6 border border-slate-100 dark:border-[#3e4042]">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-[#e4e6eb]">Academics</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-[#e4e6eb] mb-2">Majors Offered</h3>
                                <div className="flex flex-wrap gap-2">
                                    {university.academics?.majorsOffered?.map(major => (
                                        <span key={major} className="px-3 py-1 bg-slate-100 dark:bg-[#3a3b3c] text-slate-600 dark:text-[#e4e6eb] rounded-full text-sm border border-transparent dark:border-[#3e4042]">
                                            {major}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-[#e4e6eb] mb-2">Key Stats</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-[#b0b3b8]">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Student/Teacher Ratio: <span className="text-slate-900 dark:text-[#e4e6eb] font-medium">{university.academics?.studentTeacherRatio}</span></li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Faculty Strength: <span className="text-slate-900 dark:text-[#e4e6eb] font-medium">{university.academics?.facultyStrength}</span></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-[#242526] rounded-xl shadow-sm p-6 border border-slate-100 dark:border-[#3e4042]">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-[#e4e6eb]">Admissions</h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-[#e4e6eb] mb-2">Requirements</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-[#b0b3b8] list-disc pl-4 marker:text-blue-500">
                                    <li>Min GPA: <span className="font-medium text-slate-900 dark:text-[#e4e6eb]">{university.admissions?.requirements?.minGPA}</span></li>
                                    <li>Acceptance Rate: <span className="font-medium text-slate-900 dark:text-[#e4e6eb]">{university.admissions?.acceptanceRate}%</span></li>
                                    {university.admissions?.requirements?.testScores?.sat?.min && (
                                        <li>SAT: <span className="font-medium text-slate-900 dark:text-[#e4e6eb]">{university.admissions.requirements.testScores.sat.min}+</span></li>
                                    )}
                                    {university.admissions?.requirements?.testScores?.toefl?.min && (
                                        <li>TOEFL: <span className="font-medium text-slate-900 dark:text-[#e4e6eb]">{university.admissions.requirements.testScores.toefl.min}+</span></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {university.testimonials && university.testimonials.length > 0 && (
                        <section className="bg-white dark:bg-[#242526] rounded-xl shadow-sm p-6 border border-slate-100 dark:border-[#3e4042]">
                            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-[#e4e6eb]">Student Testimonials</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {university.testimonials.map((t, index) => (
                                    <div key={index} className="bg-slate-50 dark:bg-[#3a3b3c] p-4 rounded-lg border border-slate-100 dark:border-transparent">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-[#e4e6eb]">{t.studentName}</p>
                                                <p className="text-xs text-slate-500 dark:text-[#b0b3b8]">{t.major}, Class of {t.graduationYear}</p>
                                            </div>
                                            <div className="flex text-yellow-500 text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < t.rating ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-[#b0b3b8] italic">"{t.testimonial}"</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#242526] rounded-xl shadow-sm p-6 border border-slate-100 dark:border-[#3e4042]">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-[#e4e6eb]">
                            <DollarSign className="text-green-600 dark:text-green-500" /> Financials
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-[#b0b3b8]">International Tuition</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-[#e4e6eb]">
                                    {university.financials?.tuitionFee?.international?.currency} {university.financials?.tuitionFee?.international?.min?.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-[#b0b3b8]">Financial Aid</p>
                                <p className="font-medium text-slate-900 dark:text-[#e4e6eb]">
                                    {university.financials?.financialAidAvailable ? "Available" : "Not Available"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#242526] rounded-xl shadow-sm p-6 border border-slate-100 dark:border-[#3e4042]">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-[#e4e6eb]">
                            <Globe className="text-blue-600 dark:text-blue-500" /> Campus Life
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-[#b0b3b8]">Type</p>
                                <p className="font-medium text-slate-900 dark:text-[#e4e6eb]">{university.campusLife?.campusType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-[#b0b3b8]">Facilities</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {university.campusLife?.facilities?.map(f => (
                                        <span key={f} className="text-xs bg-slate-100 dark:bg-[#3a3b3c] px-2 py-1 rounded text-slate-600 dark:text-[#e4e6eb] border border-transparent dark:border-[#3e4042]">{f}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Apply CTA */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={18} />
                            <h3 className="font-extrabold text-base">Start Application</h3>
                        </div>
                        <p className="text-indigo-200 text-sm leading-relaxed mb-4">
                            Track your documents, deadlines, and submit your application — all in one place.
                        </p>
                        <button
                            onClick={() => setShowComingSoon(true)}
                            className="w-full bg-white text-indigo-700 font-extrabold text-sm py-2.5 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all shadow-sm"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {showComingSoon && (
                <ComingSoonModal
                    uniName={university.name}
                    onClose={() => setShowComingSoon(false)}
                />
            )}
        </div>
    );
};

export default UniversityDetails;
