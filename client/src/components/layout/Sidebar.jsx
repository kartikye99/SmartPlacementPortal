import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileCheck,
  Building2,
  Users,
  LogOut,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Code2,
  FileText,
  Mic,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const studentNavItems = [
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Placement Drives', path: '/student/jobs', icon: Briefcase },
  { label: 'Applications', path: '/student/applications', icon: FileCheck },
  { label: 'Coding Practice', path: '/student/practice', icon: Code2 },
  { label: 'Resume Builder', path: '/student/resume/builder', icon: FileText },
  { label: 'Resume Review', path: '/student/resume/analyzer', icon: Sparkles },
  { label: 'Mock Interview', path: '/student/interview', icon: Mic },
  { label: 'Student Profile', path: '/student/profile', icon: User },
];

const adminNavItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Placement Drives', path: '/admin/jobs', icon: Building2 },
  { label: 'Applicant Pipeline', path: '/admin/applications', icon: Users },
];

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, isStudent, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = isStudent ? studentNavItems : adminNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const content = (
    <div
      className="flex flex-col h-full w-[252px] select-none"
      style={{ background: 'var(--theme-sidebar)', color: 'var(--sidebar-text)', borderRight: '1px solid rgba(255,255,255,.08)' }}
    >
      <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-md bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold leading-tight text-white font-sans">Placement Portal</h1>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--sidebar-muted)' }}>University Management System</p>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen?.(false)}
          className="md:hidden ml-auto p-1.5 rounded-md hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 pt-5 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--sidebar-muted)' }}>
          {isAdmin ? 'Placement Office' : 'Student Services'}
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto" aria-label="Primary navigation">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setIsMobileOpen?.(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium border-l-[3px]"
            style={({ isActive }) => ({
              background: isActive ? 'var(--sidebar-hover)' : 'transparent',
              color: isActive ? 'var(--sidebar-active)' : 'var(--sidebar-muted)',
              borderLeftColor: isActive ? 'var(--sidebar-active)' : 'transparent',
            })}
          >
            <Icon className="w-[17px] h-[17px] shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-sm font-semibold shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate">{user?.name || 'Portal User'}</p>
            <p className="text-[11px] truncate flex items-center gap-1" style={{ color: 'var(--sidebar-muted)' }}>
              {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isAdmin ? 'Placement Officer' : user?.rollNumber || 'Student'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-medium hover:bg-white/10"
          style={{ color: 'var(--sidebar-muted)' }}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[252px] overflow-hidden">{content}</aside>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <button
            type="button"
            className="fixed inset-0 bg-slate-950/55"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative z-10 h-full shadow-xl">{content}</aside>
        </div>
      )}
    </>
  );
};
