import React, { useState } from 'react';
import {
  Star, CheckCircle2, Video, X, Shield,
  CreditCard, Calendar, Users, Loader2, Sparkles
} from 'lucide-react';

// ── Mock data ─────────────────────────────────────────────────────────
const MOCK_EXPERTS = [
  {
    _id: 'e1',
    name: 'Dr. Aisha Rahman',
    role: 'Senior Admissions Counselor',
    specialty: 'UK & USA Universities',
    bio: 'Former admissions officer at UCL with 12 years guiding students to Oxbridge and Ivy League programs.',
    rating: 4.9, sessions: 342, price: 500,
    tags: ['Oxbridge', 'Ivy League', 'SOP Writing'],
    gradient: 'linear-gradient(135deg,#0d9488,#34d399)',
    ring: '#0d9488', initials: 'AR', available: true, nextSlot: 'Tomorrow, 10 AM',
  },
  {
    _id: 'e2',
    name: 'Prof. James Okafor',
    role: 'MBA & Business Expert',
    specialty: 'Business & Management',
    bio: 'Wharton MBA graduate helping students craft compelling business school narratives and prepare for interviews.',
    rating: 4.8, sessions: 289, price: 600,
    tags: ['MBA', 'GMAT', 'Interviews'],
    gradient: 'linear-gradient(135deg,#4f46e5,#818cf8)',
    ring: '#4f46e5', initials: 'JO', available: true, nextSlot: 'Today, 3 PM',
  },
  {
    _id: 'e3',
    name: 'Sarah Kim',
    role: 'Visa & Immigration Specialist',
    specialty: 'F-1, Tier-4 & Study Permits',
    bio: 'Licensed immigration consultant with 98% visa approval rate across 8 countries and 3 continents.',
    rating: 4.9, sessions: 415, price: 450,
    tags: ['F-1 Visa', 'Tier-4', 'PGWP Canada'],
    gradient: 'linear-gradient(135deg,#d97706,#fbbf24)',
    ring: '#d97706', initials: 'SK', available: true, nextSlot: 'Tomorrow, 2 PM',
  },
  {
    _id: 'e4',
    name: 'Dr. Marcus Chen',
    role: 'STEM Programs Specialist',
    specialty: 'Engineering & Computer Science',
    bio: 'MIT PhD specializing in research statements for STEM graduate programs. Published author in IEEE.',
    rating: 4.7, sessions: 198, price: 550,
    tags: ['MIT/Stanford', 'Research SOP', 'GRE Quant'],
    gradient: 'linear-gradient(135deg,#0284c7,#38bdf8)',
    ring: '#0284c7', initials: 'MC', available: false, nextSlot: 'Next Monday',
  },
  {
    _id: 'e5',
    name: 'Priya Sharma',
    role: 'Scholarship Specialist',
    specialty: 'Fully Funded Programs',
    bio: 'Chevening & Gates Cambridge alumna. Has helped students secure over $2M in fully funded scholarships.',
    rating: 4.8, sessions: 267, price: 500,
    tags: ['Chevening', 'Fulbright', 'DAAD'],
    gradient: 'linear-gradient(135deg,#be185d,#f472b6)',
    ring: '#be185d', initials: 'PS', available: true, nextSlot: 'Today, 5 PM',
  },
];

const INITIAL_SESSIONS = [
  {
    _id: 's1',
    expertName: 'Dr. Aisha Rahman',
    expertInitials: 'AR',
    expertGradient: 'linear-gradient(135deg,#0d9488,#34d399)',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    topic: 'SOP Review — UCL Masters Application',
    status: 'Scheduled',
    meetingLink: '#',
    amount: 500,
  },
];

// ── Sessions list sub-component ───────────────────────────────────────
const SessionsList = ({ sessions, setSessions }) => (
  <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#3e4042] overflow-hidden shadow-sm">
    <div className="px-5 py-4 border-b border-slate-100 dark:border-[#3e4042]">
      <h3 className="font-bold text-slate-900 dark:text-[#e4e6eb]">My Sessions</h3>
    </div>
    {sessions.length === 0 ? (
      <div className="p-8 text-center">
        <Calendar size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-[#b0b3b8]">No sessions scheduled yet.</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Select an expert and book your first session.</p>
      </div>
    ) : (
      <div className="divide-y divide-slate-100 dark:divide-[#3e4042]">
        {sessions.map(sess => (
          <div key={sess._id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: sess.expertGradient || 'linear-gradient(135deg,#4f46e5,#818cf8)' }}>
                {sess.expertInitials || sess.expertName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-[#e4e6eb] truncate">{sess.expertName}</p>
                <p className="text-xs text-slate-500 dark:text-[#b0b3b8] truncate">{sess.topic}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {new Date(sess.date).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${
                sess.status === 'Scheduled'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-[#3a3b3c] dark:text-slate-400'
              }`}>
                {sess.status}
              </span>
            </div>
            {sess.status === 'Scheduled' && (
              <div className="mt-3 flex gap-2 ml-12">
                {sess.meetingLink && (
                  <a href={sess.meetingLink}
                    className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
                    <Video size={12} /> Join
                  </a>
                )}
                <button
                  onClick={() => setSessions(prev => prev.map(s => s._id === sess._id ? { ...s, status: 'Cancelled' } : s))}
                  className="btn-secondary py-1.5 px-3 text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── Main component ────────────────────────────────────────────────────
const Consultation = () => {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [topic, setTopic] = useState('General Guidance');
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', cvv: '', expiry: '', mobileNumber: '' });
  const [booking, setBooking] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  const generateSlots = () => {
    const base = new Date(selectedDate + 'T00:00:00');
    const now = new Date();
    return Array.from({ length: 9 }, (_, i) => {
      const t = new Date(base);
      t.setHours(9 + i, 0, 0, 0);
      return { time: t, iso: t.toISOString(), label: `${9 + i}:00`, available: now < t };
    });
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!selectedExpert) return;
    if (!selectedSlot) { alert('Please select a time slot.'); return; }
    setBookingDone(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);
    await new Promise(r => setTimeout(r, 1800));
    setSessions(prev => [...prev, {
      _id: `s${Date.now()}`,
      expertName: selectedExpert.name,
      expertInitials: selectedExpert.initials,
      expertGradient: selectedExpert.gradient,
      date: selectedSlot,
      topic,
      status: 'Scheduled',
      meetingLink: '#',
      amount: selectedExpert.price,
    }]);
    setBooking(false);
    setBookingDone(true);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    if (bookingDone) { setSelectedSlot(null); setTopic('General Guidance'); }
    setBookingDone(false);
  };

  const slots = selectedExpert ? generateSlots() : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#18191a] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Page Header ─────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Consultation Services
            </h1>
            <p className="text-slate-500 dark:text-[#b0b3b8] mt-1">
              Book a private 1-on-1 session with world-class advisors
            </p>
          </div>
          {/* Stats pills */}
          <div className="flex items-center gap-3">
            {[
              { label: '5 Experts', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' },
              { label: '4.8★ Rating', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
              { label: '1,511 Sessions', color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
            ].map(({ label, color }) => (
              <span key={label} className={`hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-full ${color}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Main Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Expert cards */}
          <div className="lg:col-span-7">
            <h2 className="text-base font-bold text-slate-700 dark:text-[#b0b3b8] uppercase tracking-wider mb-4">
              Choose Your Expert
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_EXPERTS.map((expert) => {
                const active = selectedExpert?._id === expert._id;
                return (
                  <div key={expert._id}
                    className={`bg-white dark:bg-[#242526] rounded-2xl p-5 border-2 transition-all duration-200 ${
                      expert.available ? 'cursor-pointer hover:-translate-y-0.5' : 'opacity-60 cursor-not-allowed'
                    }`}
                    style={{
                      borderColor: active ? expert.ring : 'transparent',
                      boxShadow: active
                        ? `0 0 0 3px ${expert.ring}18, 0 4px 20px ${expert.ring}20`
                        : '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(79,70,229,0.06)',
                    }}
                    onClick={() => { if (!expert.available) return; setSelectedExpert(expert); setSelectedSlot(null); }}>

                    {/* Avatar + name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: expert.gradient }}>
                          {expert.initials}
                        </div>
                        {expert.available && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-[#242526] rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-[#e4e6eb] leading-tight">{expert.name}</p>
                            <p className="text-xs text-slate-500 dark:text-[#b0b3b8] mt-0.5">{expert.role}</p>
                          </div>
                          {active && <CheckCircle2 size={15} style={{ color: expert.ring }} className="shrink-0 mt-0.5" />}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} fill="#D97706" color="#D97706" />
                          <span className="text-xs font-bold text-amber-600">{expert.rating}</span>
                          <span className="text-xs text-slate-400 dark:text-[#b0b3b8]">· {expert.sessions} sessions</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-[#b0b3b8] leading-relaxed mb-3 line-clamp-2">{expert.bio}</p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {expert.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-[#3a3b3c] text-slate-600 dark:text-[#b0b3b8]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#3e4042]">
                      <div>
                        <span className="text-base font-extrabold text-slate-900 dark:text-[#e4e6eb]">৳{expert.price}</span>
                        <span className="text-xs text-slate-400 dark:text-[#b0b3b8]"> /session</span>
                      </div>
                      {expert.available
                        ? <span className="text-xs font-semibold text-green-600 dark:text-green-400">Next: {expert.nextSlot}</span>
                        : <span className="text-xs text-slate-400">Unavailable</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sessions on mobile */}
            <div className="mt-6 lg:hidden">
              <SessionsList sessions={sessions} setSessions={setSessions} />
            </div>
          </div>

          {/* RIGHT: Booking panel + sessions */}
          <div className="lg:col-span-5 space-y-4">

            {/* Booking card */}
            <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#3e4042] overflow-hidden shadow-sm sticky top-4">

              {selectedExpert ? (
                <>
                  {/* Selected expert mini-header */}
                  <div className="p-4 border-b border-slate-100 dark:border-[#3e4042] bg-slate-50 dark:bg-[#1e1f2e]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: selectedExpert.gradient }}>
                        {selectedExpert.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-[#e4e6eb] truncate">{selectedExpert.name}</p>
                        <p className="text-xs text-slate-500 dark:text-[#b0b3b8]">{selectedExpert.specialty} · ৳{selectedExpert.price}/hr</p>
                      </div>
                      <button onClick={() => { setSelectedExpert(null); setSelectedSlot(null); }}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-auto">
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleBook} className="p-5 space-y-5">
                    {/* Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider mb-2">
                        Select Date
                      </label>
                      <input type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                        className="input-field"
                      />
                    </div>

                    {/* Time slots */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider mb-2">
                        Time Slot (1 Hour)
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {slots.map((slot, idx) => {
                          const sel = selectedSlot === slot.iso;
                          return (
                            <button key={idx} type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot(slot.iso)}
                              className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                                sel
                                  ? 'text-white border-transparent shadow-brand'
                                  : slot.available
                                    ? 'bg-white dark:bg-[#1e1f2e] border-slate-200 dark:border-[#3e4042] text-slate-700 dark:text-[#e4e6eb] hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                                    : 'bg-slate-50 dark:bg-[#18191a] border-slate-100 dark:border-[#2a2b36] text-slate-300 dark:text-slate-600 cursor-not-allowed'
                              }`}
                              style={sel ? { background: selectedExpert.gradient } : {}}>
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                      {selectedSlot && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">
                          ✓ {new Date(selectedSlot).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>

                    {/* Topic */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider mb-2">
                        Session Topic
                      </label>
                      <input type="text" value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. SOP Review, University Shortlisting..."
                        className="input-field"
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 text-sm justify-center">
                      Proceed to Payment · ৳{selectedExpert.price}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <Shield size={11} />
                      <span>Secure · Full refund if cancelled 24h before</span>
                    </div>
                  </form>
                </>
              ) : (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <p className="font-bold text-slate-700 dark:text-[#e4e6eb] mb-1">Select an Expert</p>
                  <p className="text-xs text-slate-500 dark:text-[#b0b3b8] leading-relaxed">
                    Choose a counselor from the list to see available time slots and book your session.
                  </p>
                </div>
              )}
            </div>

            {/* Sessions — desktop */}
            <div className="hidden lg:block">
              <SessionsList sessions={sessions} setSessions={setSessions} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment Modal ──────────────────────────────────── */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#242526] rounded-2xl w-full max-w-md border border-slate-200 dark:border-[#3e4042] overflow-hidden animate-pop"
            style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>

            {bookingDone ? (
              /* Success */
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={36} className="text-green-500" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-[#e4e6eb] mb-2">
                  Session Booked!
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#b0b3b8] mb-1">
                  Your session with <strong className="text-slate-700 dark:text-[#e4e6eb]">{selectedExpert?.name}</strong> is confirmed.
                </p>
                {selectedSlot && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                    {new Date(selectedSlot).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-left mb-6 border border-green-100 dark:border-green-900/30">
                  <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400 font-medium">
                    <Video size={13} />
                    A meeting link will be emailed to you 1 hour before the session.
                  </div>
                </div>
                <button onClick={closeModal} className="btn-primary w-full py-3 justify-center">
                  View My Sessions
                </button>
              </div>
            ) : (
              /* Payment form */
              <>
                <div className="px-5 py-4 border-b border-slate-100 dark:border-[#3e4042] flex items-center justify-between bg-slate-50 dark:bg-[#1e1f2e]">
                  <h3 className="font-extrabold text-slate-900 dark:text-[#e4e6eb]">Confirm Payment</h3>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-[#e4e6eb] transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Booking summary */}
                <div className="mx-5 mt-5 rounded-xl p-4 text-white"
                  style={{ background: selectedExpert?.gradient || 'linear-gradient(135deg,#4f46e5,#818cf8)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {selectedExpert?.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-tight">{selectedExpert?.name}</p>
                      <p className="text-xs opacity-80 mt-0.5 truncate">{topic}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-black">৳{selectedExpert?.price}</p>
                      <p className="text-xs opacity-75">1 hr session</p>
                    </div>
                  </div>
                  {selectedSlot && (
                    <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-1.5 text-xs opacity-80">
                      <Calendar size={11} />
                      {new Date(selectedSlot).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                <form onSubmit={handlePaymentSubmit} className="p-5 space-y-4">
                  {/* Method tabs */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider mb-2">
                      Payment Method
                    </label>
                    <div className="flex gap-2">
                      {['Card', 'bKash', 'Nagad'].map(m => (
                        <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            paymentMethod === m
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                              : 'border-slate-200 dark:border-[#3e4042] text-slate-600 dark:text-[#b0b3b8] hover:bg-slate-50 dark:hover:bg-[#3a3b3c]'
                          }`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'Card' ? (
                    <div className="space-y-2.5">
                      <div className="relative">
                        <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Card number" maxLength={19}
                          value={paymentDetails.cardNumber}
                          onChange={e => setPaymentDetails(p => ({ ...p, cardNumber: e.target.value }))}
                          className="input-field pl-9" />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <input type="text" placeholder="MM/YY" maxLength={5}
                          value={paymentDetails.expiry}
                          onChange={e => setPaymentDetails(p => ({ ...p, expiry: e.target.value }))}
                          className="input-field" />
                        <input type="text" placeholder="CVV" maxLength={3}
                          value={paymentDetails.cvv}
                          onChange={e => setPaymentDetails(p => ({ ...p, cvv: e.target.value }))}
                          className="input-field" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl text-xs font-medium border"
                        style={{
                          background: paymentMethod === 'bKash' ? '#fdf2f8' : '#f0fdf4',
                          color: paymentMethod === 'bKash' ? '#9d174d' : '#14532d',
                          borderColor: paymentMethod === 'bKash' ? '#fbcfe8' : '#bbf7d0',
                        }}>
                        Send <strong>৳{selectedExpert?.price}</strong> to{' '}
                        <strong>{paymentMethod === 'bKash' ? '01700-000000' : '01800-000000'}</strong> via {paymentMethod}
                      </div>
                      <input type="tel" placeholder="Your mobile number"
                        value={paymentDetails.mobileNumber}
                        onChange={e => setPaymentDetails(p => ({ ...p, mobileNumber: e.target.value }))}
                        className="input-field" />
                      <input type="text" placeholder="Transaction ID"
                        onChange={e => setPaymentDetails(p => ({ ...p, transactionId: e.target.value }))}
                        className="input-field" />
                    </div>
                  )}

                  <button type="submit" disabled={booking}
                    className="btn-primary w-full py-3 text-sm justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {booking
                      ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
                      : <>Confirm &amp; Pay ৳{selectedExpert?.price}</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
