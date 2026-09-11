import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Building2,
  FileText,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { AmbientBackground } from '../../components/layout/AmbientBackground';
import { ThemeSwitcher } from '../../components/common/ThemeSwitcher';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: '',
    cgpa: '8.5',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { activeTheme } = useTheme();
  const navigate = useNavigate();

  const handleQuickFill = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: 'Rohan Sharma',
      email: `rohan.${randomId}@portal.com`,
      password: 'Password123!',
      role: 'student',
      department: 'Computer Science & Engineering',
      rollNumber: `CS2026-${randomId}`,
      cgpa: '9.2',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
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

      <div className="max-w-xl w-full mx-auto relative z-10">
        <div className="glass-panel-elevated rounded-3xl p-8 shadow-2xl border border-white/15 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 ring-1 ring-white/25">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight font-display">Create an Account</h2>
                <p className="text-xs text-slate-400">Join the Smart Placement Portal ecosystem</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/35 hover:bg-violet-500/25 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Fill Sample
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Picker */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    formData.role === 'student'
                      ? 'bg-gradient-to-r from-violet-600/30 to-purple-600/30 border-violet-500 text-violet-200 shadow-md shadow-violet-500/15'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🎓 Student Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    formData.role === 'admin'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/15'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🛡️ Placement Officer / Admin
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rohan Sharma"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Official University Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rohan@university.edu"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-xl bg-[#090d18] border border-white/10 text-slate-100 text-sm px-3.5 py-2.5 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 transition-all"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engg</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Comm</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <Input
                  label="Roll / Registration No"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. CS2026-104"
                  leftIcon={<FileText className="w-4 h-4" />}
                />
              )}
            </div>

            {formData.role === 'student' && (
              <Input
                label="Current CGPA"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="e.g. 8.75"
                leftIcon={<Award className="w-4 h-4" />}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-3"
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-bold underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
