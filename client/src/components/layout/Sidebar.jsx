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
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, isStudent, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const studentNavItems = [
    { label: 'Overview Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { label: 'Browse Jobs & Drives', path: '/student/jobs', icon: <Briefcase className="w-4.5 h-4.5" /> },
    { label: 'Coding Practice Arena', path: '/student/practice', icon: <Code2 className="w-4.5 h-4.5" /> },
    { label: 'College Resume Builder', path: '/student/resume/builder', icon: <FileText className="w-4.5 h-4.5" /> },
    { label: 'AI Resume Analyzer', path: '/student/resume/analyzer', icon: <Sparkles className="w-4.5 h-4.5" /> },
    { label: 'AI Mock Interview', path: '/student/interview', icon: <Mic className="w-4.5 h-4.5" /> },
    { label: 'Track Applications', path: '/student/applications', icon: <FileCheck className="w-4.5 h-4.5" /> },
    { label: 'Student Profile', path: '/student/profile', icon: <User className="w-4.5 h-4.5" /> },
  ];

  const adminNavItems = [
    { label: 'Executive Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { label: 'Jobs & Drives Manager', path: '/admin/jobs', icon: <Building2 className="w-4.5 h-4.5" /> },
    { label: 'Applicant Pipeline', path: '/admin/applications', icon: <Users className="w-4.5 h-4.5" /> },
  ];

  const navItems = isStudent ? studentNavItems : adminNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const content = (
    <div 
      className="flex flex-col h-full backdrop-blur-2xl w-64 p-5 select-none shadow-2xl transition-colors duration-400"
      style={{
        backgroundColor: 'var(--theme-sidebar)',
        borderRight: '1px solid var(--theme-border)',
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ring-1 ring-white/25"
          style={{
            background: 'var(--theme-gradient)',
            boxShadow: 'var(--theme-glow)',
          }}
        >
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 font-display">
            SmartPortal
            <span 
              className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
              style={{
                backgroundColor: 'var(--theme-badge-bg)',
                color: 'var(--theme-badge-text)',
                borderColor: 'var(--theme-badge-border)',
              }}
            >
              v2.5
            </span>
          </h1>
          <p className="text-[11px] font-medium" style={{ color: 'var(--theme-text-muted)' }}>Placement & Career Hub</p>
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-1 mb-5">
        <div 
          className="flex items-center justify-between p-2.5 rounded-xl border backdrop-blur-md"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border-subtle)',
          }}
        >
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sparkles className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
            )}
            <span className="text-xs font-semibold capitalize" style={{ color: 'var(--theme-text)' }}>
              {user?.role || 'Guest'} Portal
            </span>
          </div>
          <Badge
            variant={isAdmin ? 'success' : 'violet'}
            size="sm"
            dot
          >
            {isAdmin ? 'TPO Cell' : 'Active'}
          </Badge>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-text-muted)' }}>
          Navigation
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen?.(false)}
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'var(--theme-gradient)',
                    color: 'var(--theme-primary-text)',
                    boxShadow: 'var(--theme-glow)',
                    borderColor: 'var(--theme-border-glow)',
                  }
                : {
                    color: 'var(--theme-text-muted)',
                  }
            }
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? 'border-white/20'
                  : 'border-transparent hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}

        {/* Quick Hub Badges */}
        <div className="pt-5 px-1">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Live Ecosystem
          </p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="flex items-center gap-2 text-slate-300 text-[11px]">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Drives Active
              </span>
              <span className="text-[11px] font-bold text-rose-300">14 Live</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="flex items-center gap-2 text-slate-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Questions Bank
              </span>
              <span className="text-[11px] font-bold text-emerald-300">38 Curated</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Snippet & Logout Footer */}
      <div className="pt-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500/20 via-purple-500/20 to-rose-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@portal.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:flex shrink-0 h-screen sticky top-0">{content}</aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setIsMobileOpen(false)}
          />
          <div 
            className="relative z-10 w-64 h-full shadow-2xl animate-in slide-in-from-left duration-200"
            style={{ backgroundColor: 'var(--theme-sidebar)' }}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
