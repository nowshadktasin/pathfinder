import React from 'react';
import Navbar from './Navbar';
import CompareBar from './CompareBar';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f11] flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <CompareBar />
      <footer className="bg-white dark:bg-[#13141a] border-t border-indigo-50 dark:border-[#1e1f2e] py-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="brand-gradient w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-brand">
                <BookOpen size={16} strokeWidth={2.5} />
              </div>
              <span className="font-heading font-bold text-slate-900 dark:text-[#e8eaf0]">
                Path<span className="gradient-text">Finder</span>
              </span>
              <span className="text-slate-300 dark:text-[#2a2b36] text-sm ml-1">·</span>
              <span className="text-xs text-slate-400 dark:text-[#9395a5]">
                Smart University Guidance
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-[#9395a5]">
              <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</a>
            </div>

            {/* Social + Copyright */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Github,   href: '#' },
                { Icon: Twitter,  href: '#' },
                { Icon: Linkedin, href: '#' },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#2a2b36] text-slate-400 dark:text-[#9395a5] hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
              <span className="text-xs text-slate-400 dark:text-[#9395a5] ml-1">
                © {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
