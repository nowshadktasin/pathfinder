import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LogOut, User, BookOpen, Sun, Moon, Menu, X,
  LayoutDashboard, Search, GraduationCap, Sparkles, Calendar, Bell
} from 'lucide-react';
import Notifications from './Notifications';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      className={`nav-link ${active ? 'active text-brand-600 dark:text-brand-400' : ''}`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, icon: Icon, label, onClose }) => {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      onClick={onClose}
      className={`flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 min-h-[48px] ${
        active
          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
          : 'text-slate-700 dark:text-[#9395a5] hover:bg-slate-50 dark:hover:bg-[#1e1f2e] hover:text-slate-900 dark:hover:text-[#e8eaf0]'
      }`}
    >
      {Icon && (
        <Icon
          size={17}
          className={active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-[#5a5b70]'}
        />
      )}
      {label}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className={`glass sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[62px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" onClick={close}>
              <div className="brand-gradient w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-brand transition-all duration-300 group-hover:scale-105 group-hover:shadow-brand-lg">
                <BookOpen size={18} strokeWidth={2.5} />
              </div>
              <span className="font-heading font-800 text-xl tracking-tight text-slate-900 dark:text-[#e8eaf0] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Path<span className="gradient-text">Finder</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-5">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-[#2a2b36] bg-white dark:bg-[#1a1b23] text-slate-500 dark:text-[#9395a5] hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 shadow-sm"
                title="Toggle theme"
              >
                {theme === 'dark'
                  ? <Sun size={16} className="text-amber-400" />
                  : <Moon size={16} />}
              </button>

              {user ? (
                <>
                  {user.role === 'student' && (
                    <div className="flex items-center gap-4">
                      <NavLink to="/dashboard">Dashboard</NavLink>
                      <NavLink to="/search">Search</NavLink>
                      <NavLink to="/scholarships">Scholarships</NavLink>
                      <NavLink to="/resources">Resources</NavLink>
                      <NavLink to="/ai-brainstorm">AI Tools</NavLink>
                      <NavLink to="/consultation">Consult</NavLink>
                    </div>
                  )}
                  {user.role === 'consultant' && (
                    <div className="flex items-center gap-4">
                      <NavLink to="/consultant/dashboard">Dashboard</NavLink>
                      <NavLink to="/collaboration">Collab</NavLink>
                    </div>
                  )}
                  {(user.role === 'admin' || user.role === 'superuser') && (
                    <NavLink to="/admin">
                      <span className="text-red-500 dark:text-red-400">Admin</span>
                    </NavLink>
                  )}

                  <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-[#2a2b36]">
                    <Notifications />

                    <div className="hidden lg:flex flex-col items-end leading-none">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Welcome</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-[#e8eaf0] font-heading">
                        {user.profile?.firstName}
                        {user.isPremium && (
                          <span className="ml-1.5 text-[9px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">PRO</span>
                        )}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white text-sm font-bold shadow-brand hover:shadow-brand-lg hover:scale-105 transition-all duration-200"
                      title="My Profile"
                    >
                      {user.profile?.firstName?.[0] || <User size={16} />}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-[#2a2b36] bg-white dark:bg-[#1a1b23] text-slate-400 dark:text-[#9395a5] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 transition-all duration-200 shadow-sm"
                      title="Logout"
                    >
                      <LogOut size={15} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/scholarships" className="nav-link">Scholarships</Link>
                  <Link to="/resources" className="nav-link">Resources</Link>
                  <Link to="/login" className="nav-link">Sign in</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: right-side actions + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              {user && <Notifications />}
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-[#2a2b36] bg-white dark:bg-[#1a1b23] text-slate-600 dark:text-[#9395a5] transition-colors"
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-[#1a1b23] border-t border-slate-100 dark:border-[#2a2b36] animate-slide-down">

            {/* User info header */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 dark:border-[#2a2b36]">
                <div className="w-11 h-11 rounded-xl brand-gradient flex items-center justify-center text-white font-bold shadow-brand flex-shrink-0">
                  {user.profile?.firstName?.[0] || <User size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-[#e8eaf0] flex items-center gap-1.5 truncate">
                    {user.profile?.firstName} {user.profile?.lastName}
                    {user.isPremium && (
                      <span className="text-[9px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter flex-shrink-0">PRO</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-[#5a5b70] truncate">{user.email}</div>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="px-3 py-3">
              {user ? (
                <>
                  {user.role === 'student' && (
                    <>
                      <MobileNavLink to="/dashboard"    icon={LayoutDashboard} label="Dashboard"    onClose={close} />
                      <MobileNavLink to="/search"       icon={Search}          label="Search"       onClose={close} />
                      <MobileNavLink to="/scholarships" icon={GraduationCap}   label="Scholarships" onClose={close} />
                      <MobileNavLink to="/resources"    icon={BookOpen}        label="Resources"    onClose={close} />
                      <MobileNavLink to="/ai-brainstorm" icon={Sparkles}       label="AI Tools"     onClose={close} />
                      <MobileNavLink to="/consultation" icon={Calendar}        label="Consultation" onClose={close} />
                      <MobileNavLink to="/notifications" icon={Bell}           label="Notifications" onClose={close} />
                      <MobileNavLink to="/profile"      icon={User}            label="My Profile"   onClose={close} />
                    </>
                  )}
                  {user.role === 'consultant' && (
                    <>
                      <MobileNavLink to="/consultant/dashboard" icon={LayoutDashboard} label="Dashboard" onClose={close} />
                      <MobileNavLink to="/collaboration" icon={BookOpen} label="Collaboration" onClose={close} />
                    </>
                  )}

                  {/* Bottom actions */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#2a2b36] grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { toggleTheme(); }}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-600 dark:text-[#9395a5] bg-slate-50 dark:bg-[#1e1f2e] rounded-xl min-h-[48px]"
                    >
                      {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
                      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl min-h-[48px]"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink to="/scholarships" icon={GraduationCap} label="Scholarships" onClose={close} />
                  <MobileNavLink to="/resources"    icon={BookOpen}      label="Resources"    onClose={close} />
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#2a2b36] flex flex-col gap-2">
                    <Link to="/login" onClick={close} className="flex items-center justify-center py-3 text-sm font-semibold text-slate-700 dark:text-[#e8eaf0] min-h-[48px]">
                      Sign in
                    </Link>
                    <Link to="/register" onClick={close} className="btn-primary w-full text-center min-h-[48px]">
                      Get Started
                    </Link>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-500 dark:text-[#9395a5] min-h-[48px]"
                    >
                      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop — closes menu on outside tap */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 top-[62px] z-40 bg-black/20 dark:bg-black/40"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
