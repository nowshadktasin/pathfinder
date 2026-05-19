import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, CheckCheck, Clock, GraduationCap, Calendar, MessageSquare, AlertCircle, Info, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockNotifications } from '../services/mockData';

// Pool of notifications drip-fed to simulate live activity
const INCOMING_POOL = [
  {
    title: 'Essay Review Ready',
    message: 'Your SOP draft has been reviewed by an expert. Check your consultation session for detailed feedback.',
    type: 'Message',
    relatedLink: '/consultation',
  },
  {
    title: 'New Scholarship Alert',
    message: 'Gates Cambridge Scholarship deadline is in 12 days — review your eligibility now.',
    type: 'Scholarship',
    relatedLink: '/scholarships',
  },
  {
    title: 'Profile Strength Improved',
    message: 'Your profile is 85% complete. Add IELTS scores to unlock better university matches.',
    type: 'System',
    relatedLink: '/profile',
  },
  {
    title: 'Application Deadline Reminder',
    message: 'University of Toronto deadline is 30 days away. Start your application now.',
    type: 'Deadline',
    relatedLink: '/dashboard',
  },
];

const TYPE_CONFIG = {
  Deadline:    { icon: Clock,         color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  Scholarship: { icon: GraduationCap, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  Booking:     { icon: Calendar,      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  Application: { icon: BookOpen,      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  System:      { icon: Info,          color: 'bg-slate-100 dark:bg-[#3a3b3c] text-slate-600 dark:text-slate-400' },
  Message:     { icon: MessageSquare, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  Alert:       { icon: AlertCircle,   color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const Notifications = () => {
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState(() =>
    mockNotifications.map(n => ({ ...n }))
  );
  const { user } = useAuth();
  const poolIndexRef = useRef(0);
  const panelRef = useRef(null);

  // Drip-feed new mock notifications every 25 seconds
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      const next = INCOMING_POOL[poolIndexRef.current % INCOMING_POOL.length];
      poolIndexRef.current += 1;
      const incoming = {
        ...next,
        _id: `live-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [incoming, ...prev]);
    }, 25000);
    return () => clearInterval(timer);
  }, [user]);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!show) return;
    const onMouseDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShow(false);
    };
    const onKeyDown = (e) => { if (e.key === 'Escape') setShow(false); };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [show]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setShow(o => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-[#2a2b36] bg-white dark:bg-[#1a1b23] text-slate-500 dark:text-[#9395a5] hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 shadow-sm"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 shadow-sm animate-pop">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {show && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1a1b23] rounded-2xl border border-slate-200 dark:border-[#2a2b36] shadow-2xl z-50 overflow-hidden animate-pop">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#2a2b36]">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-[#e8eaf0]">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={11} /> Mark all read
                </button>
              )}
              <button
                onClick={() => setShow(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-[#2a2b36]">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400 dark:text-[#5a5b70]">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 8).map(n => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.System;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      !n.isRead
                        ? 'bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-[#1e1f2e]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-semibold leading-snug ${!n.isRead ? 'text-slate-900 dark:text-[#e8eaf0]' : 'text-slate-600 dark:text-[#9395a5]'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-[#9395a5] mt-0.5 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-[#5a5b70] mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-[#2a2b36] bg-slate-50 dark:bg-[#13141a]">
            <Link
              to="/notifications"
              onClick={() => setShow(false)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
