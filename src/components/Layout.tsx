import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, BookOpen, Activity, Terminal, BrainCircuit, Home } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Concepts', path: '/concepts', icon: BookOpen },
    { name: 'Simulations', path: '/simulations', icon: Activity },
    { name: 'Playground', path: '/playground', icon: Terminal },
    { name: 'Quiz', path: '/quiz', icon: BrainCircuit },
  ];

  return (
    <div className={cn("min-h-screen transition-colors duration-300 flex flex-col", 
      theme === 'dark' ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900")}>
      {/* <ParticleBackground /> */}
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 text-brand dark:text-brand-light">
                <span className="bg-brand text-white p-1 rounded-lg text-xs px-2 py-1 shadow-md">SSP</span>
                <span className="hidden sm:inline">Secondary Storage Protocol</span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                          location.pathname === item.path
                            ? "bg-brand text-white shadow-lg shadow-brand/20"
                            : "text-slate-600 dark:text-slate-400 hover:bg-brand/20 dark:hover:bg-brand/10 hover:text-brand-700 dark:hover:text-brand"
                        )}
                      >
                    <item.icon size={16} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                id="theme-toggle"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 transition-colors",
                      location.pathname === item.path
                        ? "bg-brand text-slate-900"
                        : "text-slate-600 dark:text-slate-400 hover:bg-brand/10"
                    )}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-16 bg-white/30 dark:bg-slate-950/30 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-brand-700 dark:text-brand-light">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              System Operational
            </div>
            
            <div className="space-y-2">
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                © 2026 Secondary Storage Protocol
              </p>
              <div className="space-y-1">
                <p className="font-black text-xs uppercase tracking-tighter flex items-center justify-center gap-2">
                  <span className="text-slate-400 font-medium low-case italic tracking-normal">Built by</span>
                  <span className="text-slate-700 dark:text-slate-400 font-black">Swapnika krishna Jakka</span>
                </p>
                <p className="font-black text-xs uppercase tracking-tighter flex items-center justify-center gap-2">
                  <span className="text-slate-400 font-medium low-case italic tracking-normal">Academic Direction</span>
                  <span className="text-slate-700 dark:text-slate-400 font-black">Prof. Mr. P. Venkata Rajulu</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
