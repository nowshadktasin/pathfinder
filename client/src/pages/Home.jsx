import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityCard from '../components/UniversityCard';
import UniversitySearch from '../components/UniversitySearch';
import { Search, Users, ArrowRight, Star, CheckCircle, Brain, BookOpen, Calendar, Trophy, Globe, TrendingUp, GraduationCap, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockUniversities, mockTestimonials } from '../services/mockData';

const STATS = [
  { label: 'Universities Listed', value: '1,200+', Icon: Globe },
  { label: 'Students Helped', value: '48,000+', Icon: GraduationCap },
  { label: 'Scholarships Tracked', value: '3,500+', Icon: Award },
  { label: 'Success Rate', value: '94%', Icon: TrendingUp },
];

const StatCard = ({ stat }) => (
  <div className="text-center p-6">
    <div className="flex justify-center mb-2">
      <stat.Icon size={32} className="text-blue-200" />
    </div>
    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
    <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
  </div>
);

const StepCard = ({ number, icon: Icon, title, description, color }) => (
  <div className="flex flex-col items-center text-center group">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={28} className="text-white" />
    </div>
    <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Step {number}</div>
    <h3 className="font-bold text-lg text-slate-900 dark:text-[#e4e6eb] mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-[#b0b3b8] text-sm leading-relaxed max-w-xs">{description}</p>
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white dark:bg-[#242526] p-6 rounded-2xl border border-slate-100 dark:border-[#3e4042] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
    <div className="flex items-center gap-1 text-amber-400">
      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
    </div>
    <p className="text-slate-600 dark:text-[#b0b3b8] text-sm leading-relaxed italic flex-grow">"{testimonial.quote}"</p>
    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-[#3e4042]">
      <div className={`w-10 h-10 ${testimonial.color} rounded-full flex items-center justify-center text-white text-xs font-black`}>
        {testimonial.avatar}
      </div>
      <div>
        <div className="font-semibold text-sm text-slate-900 dark:text-[#e4e6eb]">{testimonial.name}</div>
        <div className="text-xs text-slate-500 dark:text-[#b0b3b8]">{testimonial.university} · {testimonial.intake}</div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading, then show mock data
    const timer = setTimeout(() => {
      setUniversities(mockUniversities);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <div className="space-y-0 pb-0 bg-slate-50 dark:bg-[#18191a] transition-colors duration-300">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950 py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm text-blue-100 rounded-full text-xs font-bold tracking-wide uppercase mb-6 border border-white/20">
            <Trophy size={12} /> Trusted by 48,000+ students worldwide
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight animate-fade-in">
            Find Your Dream <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
              University with AI
            </span>
          </h1>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed">
            Discover universities that match your academic profile, budget, and preferences — powered by our AI Fit Score engine.
          </p>

          <div className="animate-slide-up flex flex-col items-center gap-6">
            <UniversitySearch />
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
              {['No account required', 'AI Fit Score', '1,200+ universities'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-blue-300" /> {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate('/welcome')}
              className="text-blue-200 hover:text-white text-sm font-medium underline flex items-center gap-2 transition-colors"
            >
              <Users size={16} /> Are you a Counselor? Join our Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#242526]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp size={12} /> Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#e4e6eb]">How PathFinder Works</h2>
            <p className="text-slate-500 dark:text-[#b0b3b8] mt-3 max-w-xl mx-auto">From discovery to acceptance — we guide every step of your university journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
            {/* connector line on desktop */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900" />
            <StepCard number={1} icon={Search} title="Build Your Profile" description="Enter your GPA, test scores, budget, and preferred countries to create your student profile." color="bg-blue-500" />
            <StepCard number={2} icon={Brain} title="Get AI Fit Scores" description="Our AI analyzes your profile against 1,200+ universities and generates a personalized compatibility score." color="bg-indigo-500" />
            <StepCard number={3} icon={BookOpen} title="Manage Applications" description="Shortlist universities, track your application status, and get auto-generated document checklists." color="bg-purple-500" />
            <StepCard number={4} icon={Calendar} title="Book Expert Help" description="Schedule 1-on-1 consultation sessions with verified counselors to review your essays and applications." color="bg-pink-500" />
          </div>
        </div>
      </section>

      {/* ── Featured Universities ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#18191a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Globe size={12} /> Top Ranked
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#e4e6eb]">Featured Universities</h2>
              <p className="text-slate-500 dark:text-[#b0b3b8] mt-1">World-class institutions matched to your profile</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#242526] rounded-xl h-72 animate-pulse border border-slate-100 dark:border-[#3e4042]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {universities.map(uni => (
                <UniversityCard key={uni._id} university={uni} fitScore={uni.fitScore} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <button onClick={() => navigate('/search')} className="btn-primary inline-flex items-center gap-2">
              Browse All Universities <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#242526]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Star size={12} fill="currentColor" /> Student Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#e4e6eb]">Students Who Made It</h2>
            <p className="text-slate-500 dark:text-[#b0b3b8] mt-3 max-w-lg mx-auto">Real stories from students who used PathFinder to land their dream university.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#18191a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#e4e6eb]">Everything You Need</h2>
            <p className="text-slate-500 dark:text-[#b0b3b8] mt-2">A complete toolkit for your university application journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Search, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', title: 'Smart Search', desc: 'Filter by tuition, ranking, location, and major to find exactly what fits you.' },
              { icon: Brain, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', title: 'AI Fit Score', desc: 'Get a personalized compatibility score — academic, financial, and cultural fit combined.' },
              { icon: Users, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', title: 'Expert Consultations', desc: 'Book sessions with verified counselors who specialize in your target countries.' },
              { icon: Calendar, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', title: 'Application Timeline', desc: 'Auto-generated deadlines and milestones for every university you apply to.' },
              { icon: BookOpen, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400', title: 'Resource Library', desc: 'Access notes, practice tests, YouTube links, and study plans organized by subject.' },
              { icon: Trophy, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', title: 'Scholarship Matching', desc: 'AI recommends scholarships based on your profile and highlights eligibility.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white dark:bg-[#242526] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-[#3e4042] hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-[#e4e6eb]">{title}</h3>
                <p className="text-slate-500 dark:text-[#b0b3b8] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Find Your University?</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">Join 48,000+ students who found their perfect match. Create your free profile in 2 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 group"
            >
              Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/search')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 border border-white/30 transition-colors"
            >
              Browse Universities
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 dark:bg-[#0d0d0e] text-slate-400 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg text-white">
              <BookOpen size={18} />
            </div>
            <span className="text-white font-bold text-lg">PathFinder</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} PathFinder Global. Built for students, by students.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
