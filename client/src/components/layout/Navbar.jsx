import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { NotificationsDropdown } from '../common/NotificationsDropdown';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

export const Navbar = ({ onMenuClick }) => {
  const { user, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header 
      className="sticky top-0 z-30 h-16 backdrop-blur-2xl px-4 md:px-8 flex items-center justify-between shadow-lg shadow-black/20 transition-all"
      style={{
        backgroundColor: 'var(--theme-navbar)',
        borderBottom: '1px solid var(--theme-border)',
      }}
    >
      {/* Left side: Hamburger & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drives, companies, roles..."
            className="w-full rounded-xl pl-9 pr-3.5 py-1.5 text-xs placeholder:text-[var(--theme-text-muted)] focus:outline-none focus:ring-2 transition-all shadow-inner shadow-black/40"
            style={{
              backgroundColor: 'var(--theme-input-bg)',
              borderColor: 'var(--theme-input-border)',
              borderWidth: '1px',
              color: 'var(--theme-text)',
            }}
          />
        </div>
      </div>

      {/* Right side: Readiness badge, notifications & profile */}
      <div className="flex items-center gap-3">
        {isStudent && (
          <div
            onClick={() => navigate('/student/profile')}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-rose-500/10 border border-violet-500/30 hover:border-violet-500/60 hover:shadow-lg hover:shadow-violet-500/15 cursor-pointer transition-all"
            title="View profile & readiness score"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span className="text-xs font-semibold text-violet-200">
              Readiness: <strong className="text-white font-black">{user?.readinessScore || 85}%</strong>
            </span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-violet-500/25 ring-1 ring-white/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-slate-200 leading-none">
                {user?.name || 'My Account'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium capitalize">
                {user?.role || 'Guest'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl border border-white/15 p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <div className="mt-1.5">
                  <Badge variant={user?.role === 'admin' ? 'success' : 'violet'} size="sm">
                    {user?.role === 'admin' ? 'Placement Officer' : 'Student Candidate'}
                  </Badge>
                </div>
              </div>

              <div className="py-1">
                {isStudent && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/student/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-violet-400" />
                    My Profile & Resume
                  </button>
                )}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
