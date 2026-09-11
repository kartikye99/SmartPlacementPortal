import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationsDropdown } from '../common/NotificationsDropdown';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

const pageTitles = {
  '/student/dashboard': ['Dashboard', 'Placement overview'],
  '/student/jobs': ['Placement Drives', 'Browse eligible opportunities'],
  '/student/applications': ['Applications', 'Track submitted applications'],
  '/student/practice': ['Coding Practice', 'Company-focused preparation'],
  '/student/resume/builder': ['Resume Builder', 'University resume format'],
  '/student/resume/analyzer': ['Resume Review', 'Check role alignment'],
  '/student/interview': ['Mock Interview', 'Interview preparation'],
  '/student/profile': ['Student Profile', 'Academic and placement details'],
  '/admin/dashboard': ['Dashboard', 'Placement office overview'],
  '/admin/jobs': ['Placement Drives', 'Manage recruitment opportunities'],
  '/admin/applications': ['Applicant Pipeline', 'Review candidate progress'],
};

export const Navbar = ({ onMenuClick }) => {
  const { user, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [title, subtitle] = pageTitles[location.pathname] || ['Placement Portal', 'University Management System'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
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
      className="sticky top-0 z-30 h-16 px-4 md:px-7 flex items-center justify-between"
      style={{ background: 'var(--theme-navbar)', borderBottom: '1px solid var(--theme-border)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md"
          style={{ color: 'var(--theme-text-muted)' }}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="font-sans text-[14px] font-semibold leading-tight truncate" style={{ color: 'var(--theme-text)' }}>{title}</h2>
          <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {isStudent && (
          <button
            type="button"
            onClick={() => navigate('/student/profile')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border text-[12px]"
            style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text-muted)', background: 'var(--theme-surface)' }}
          >
            Readiness <strong style={{ color: 'var(--theme-text)' }}>{user?.readinessScore || 0}%</strong>
          </button>
        )}
        <NotificationsDropdown />
        <ThemeSwitcher />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-2 p-1.5 rounded-md border border-transparent hover:border-[var(--theme-border)]"
            aria-expanded={dropdownOpen}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold" style={{ background: 'var(--theme-accent-soft)', color: 'var(--theme-accent)', border: '1px solid var(--theme-accent-border)' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left max-w-32">
              <span className="block text-[12px] font-semibold leading-none truncate" style={{ color: 'var(--theme-text)' }}>{user?.name || 'My Account'}</span>
              <span className="text-[10px] capitalize" style={{ color: 'var(--theme-text-muted)' }}>{user?.role || 'Guest'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden sm:block" style={{ color: 'var(--theme-text-muted)' }} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-md p-1.5">
              <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--theme-border-subtle)' }}>
                <p className="text-[12px] font-semibold truncate">{user?.name}</p>
                <p className="text-[11px] truncate" style={{ color: 'var(--theme-text-muted)' }}>{user?.email}</p>
              </div>
              {isStudent && (
                <button
                  type="button"
                  onClick={() => { setDropdownOpen(false); navigate('/student/profile'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 mt-1 text-[12px] rounded-md text-left hover:bg-[var(--theme-surface-hover)]"
                >
                  <User className="w-4 h-4" /> My profile
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] rounded-md text-left hover:bg-[var(--danger-soft)]"
                style={{ color: 'var(--danger)' }}
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
