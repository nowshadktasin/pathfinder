import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, BookOpen, GraduationCap, Calendar, MessageSquare, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { mockNotifications } from '../services/mockData';

const TYPE_CONFIG = {
  Deadline: { icon: Clock, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  Scholarship: { icon: GraduationCap, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  Booking: { icon: Calendar, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  Application: { icon: BookOpen, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  System: { icon: Info, color: 'bg-slate-100 dark:bg-[#3a3b3c] text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
  Message: { icon: MessageSquare, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
  Alert: { icon: AlertCircle, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const groupByDate = (notifs) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const groups = { Today: [], Yesterday: [], Earlier: [] };
    notifs.forEach(n => {
      const d = new Date(n.createdAt); d.setHours(0, 0, 0, 0);
      if (d.getTime() === today.getTime()) groups.Today.push(n);
      else if (d.getTime() === yesterday.getTime()) groups.Yesterday.push(n);
      else groups.Earlier.push(n);
    });
    return groups;
  };

  const groups = groupByDate(filtered);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#18191a] transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Bell size={22} />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#e4e6eb]">Notifications</h1>
              <p className="text-sm text-slate-500 dark:text-[#b0b3b8]">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-lg min-h-[40px]"
            >
              <CheckCheck size={16} /> <span className="hidden xs:inline">Mark all read</span><span className="xs:hidden">Mark read</span>
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#3e4042] p-1 rounded-xl w-fit mb-6 shadow-sm">
          {['all', 'unread', 'read'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${filter === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-[#b0b3b8] hover:text-slate-700 dark:hover:text-[#e4e6eb]'}`}
            >
              {tab}
              {tab === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-black px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification Groups */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#242526] rounded-2xl border border-dashed border-slate-200 dark:border-[#3e4042]">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-400 opacity-50" />
            <p className="font-semibold text-slate-700 dark:text-[#e4e6eb]">You're all caught up!</p>
            <p className="text-slate-500 dark:text-[#b0b3b8] text-sm mt-1">No {filter !== 'all' ? filter : ''} notifications.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([label, notifs]) => {
              if (notifs.length === 0) return null;
              return (
                <div key={label}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black text-slate-500 dark:text-[#b0b3b8] uppercase tracking-widest">{label}</span>
                    <div className="flex-grow h-px bg-slate-200 dark:bg-[#3e4042]" />
                  </div>
                  <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#3e4042] overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-[#3e4042]">
                    {notifs.map(n => {
                      const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.System;
                      const Icon = cfg.icon;
                      return (
                        <div
                          key={n._id}
                          className={`flex gap-4 p-4 transition-colors ${!n.isRead ? 'bg-indigo-50/40 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-[#3a3b3c]'}`}
                        >
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${cfg.color}`}>
                            <Icon size={18} />
                          </div>

                          {/* Content */}
                          <div className="flex-grow min-w-0">
                            <div className="flex flex-wrap justify-between items-start gap-x-2 gap-y-0.5 mb-0.5">
                              <h3 className={`text-sm font-semibold leading-snug ${!n.isRead ? 'text-slate-900 dark:text-[#e4e6eb]' : 'text-slate-700 dark:text-[#b0b3b8]'}`}>
                                {n.title}
                              </h3>
                              <span className="text-[11px] text-slate-400 dark:text-[#6a6b6c] whitespace-nowrap flex-shrink-0">{timeAgo(n.createdAt)}</span>
                            </div>
                            <p className="text-slate-500 dark:text-[#b0b3b8] text-sm leading-relaxed mb-2">{n.message}</p>
                            <div className="flex items-center gap-3">
                              {n.relatedLink && (
                                <Link to={n.relatedLink} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                                  View Details →
                                </Link>
                              )}
                              {!n.isRead && (
                                <button onClick={() => markAsRead(n._id)} className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Unread dot */}
                          {!n.isRead && (
                            <div className={`w-2 h-2 ${cfg.dot} rounded-full flex-shrink-0 mt-2`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
