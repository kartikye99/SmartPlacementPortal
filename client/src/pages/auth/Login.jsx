import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { AmbientBackground } from '../../components/layout/AmbientBackground';
import { ThemeSwitcher } from '../../components/common/ThemeSwitcher';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { activeTheme } = useTheme();
  const navigate = useNavigate();

  const handleQuickFill = (role) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('student@portal.com');
      setPassword('Password123!');
    } else {
      setEmail('admin@portal.com');
      setPassword('Password123!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-all duration-500"
      style={{
        backgroundColor: 'var(--theme-background)',
        backgroundImage: `url(${activeTheme?.assets?.auth || '/themes/midnight/auth.svg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--theme-text)',
      }}
    >
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeSwitcher />
      </div>

      {/* Living Atmospheric Aurora & Micro-Texture Background */}
      <AmbientBackground />

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Brand highlights */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/35 text-violet-300 shadow-sm shadow-violet-500/10">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-xs font-semibold">
              Intelligent Campus Recruitment
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
              Smart Placement <span className="text-gradient-aurora">Portal</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Empowering students, Training & Placement Officers, and premier recruiters with automated drive tracking, eligibility screening, and real-time skill analytics.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              'One-click application to Tier-1 recruitment drives',
              'Real-time application pipeline tracking & interview alerts',
              'Automated eligibility screening & CGPA cutoffs',
              'Comprehensive placement readiness score & metrics',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ⚡ 1-Click Demo Login
              </span>
              <Badge variant="violet" size="sm">Pre-configured</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedRole === 'student' && email === 'student@portal.com'
                    ? 'bg-gradient-to-r from-violet-600/30 to-purple-600/30 border-violet-500 text-violet-200 shadow-md shadow-violet-500/15'
                    : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-violet-400" />
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedRole === 'admin' && email === 'admin@portal.com'
                    ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/15'
                    : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Demo Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel-elevated rounded-3xl p-8 shadow-2xl border border-white/15 backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 ring-1 ring-white/25">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight font-display">Sign In to Portal</h2>
                <p className="text-xs text-slate-400">Enter your credentials to access your dashboard</p>
              </div>
            </div>

            {/* Role Tab Toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#060810]/80 rounded-xl mb-6 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  handleQuickFill('student');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedRole === 'student'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-600/25 border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  handleQuickFill('admin');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Placement Officer / Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-700 text-violet-500 focus:ring-violet-500" />
                  Remember me
                </label>
                <a href="#" className="text-violet-400 hover:text-violet-300 font-semibold">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full mt-2"
              >
                Sign In as {selectedRole === 'admin' ? 'Officer' : 'Student'}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-violet-400 hover:text-violet-300 font-bold underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
