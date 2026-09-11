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
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
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
    cgpa: '8.0',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: 'var(--theme-background)',
        color: 'var(--theme-text)',
      }}
    >
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeSwitcher />
      </div>

      <AmbientBackground />

      <div className="max-w-xl w-full mx-auto relative z-10 perspective-1000">
        <div className="glass-panel-elevated card-3d-hover rounded-3xl p-8 shadow-2xl border backdrop-blur-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md border"
              style={{
                backgroundColor: 'var(--theme-primary)',
                color: 'var(--theme-primary-text)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2
                className="text-xl font-bold tracking-tight font-display"
                style={{ color: 'var(--theme-text)' }}
              >
                Create Account
              </h2>
              <p
                className="text-xs"
                style={{ color: 'var(--theme-text-muted)' }}
              >
                Register as a student candidate or placement administrator
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Picker */}
            <div className="space-y-1.5 text-left">
              <label
                className="block text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--theme-text-muted)' }}
              >
                Account Type
              </label>
              <div
                className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border"
                style={{
                  backgroundColor: 'var(--theme-background)',
                  borderColor: 'var(--theme-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    formData.role === 'student' ? 'shadow-sm border' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor:
                      formData.role === 'student'
                        ? 'var(--theme-surface-elevated)'
                        : 'transparent',
                    color: 'var(--theme-text)',
                    borderColor:
                      formData.role === 'student'
                        ? 'var(--theme-border)'
                        : 'transparent',
                  }}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Student Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    formData.role === 'admin' ? 'shadow-sm border' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor:
                      formData.role === 'admin'
                        ? 'var(--theme-surface-elevated)'
                        : 'transparent',
                    color: 'var(--theme-text)',
                    borderColor:
                      formData.role === 'admin'
                        ? 'var(--theme-border)'
                        : 'transparent',
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Placement Officer
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sameer Swami"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Official University Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="student@university.edu"
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
                <label
                  className="block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--theme-text-muted)' }}
                >
                  Department
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-all border"
                    style={{
                      backgroundColor: 'var(--theme-input-bg)',
                      borderColor: 'var(--theme-input-border)',
                      color: 'var(--theme-text)',
                    }}
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Training & Placement Cell">Training & Placement Cell</option>
                  </select>
                </div>
              </div>

              {formData.role === 'student' ? (
                <Input
                  label="Roll / Registration No."
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. CS2026-001"
                  leftIcon={<FileText className="w-4 h-4" />}
                />
              ) : (
                <Input
                  label="Employee / Admin ID"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. TPO-OFFICER-01"
                  leftIcon={<FileText className="w-4 h-4" />}
                />
              )}
            </div>

            {formData.role === 'student' && (
              <Input
                label="Current Cumulative CGPA (Scale of 10.0)"
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="8.5"
                leftIcon={<Award className="w-4 h-4" />}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Complete Registration
            </Button>
          </form>

          <div
            className="mt-6 pt-5 border-t text-center"
            style={{ borderColor: 'var(--theme-border-subtle)' }}
          >
            <p
              className="text-xs"
              style={{ color: 'var(--theme-text-muted)' }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold underline underline-offset-4"
                style={{ color: 'var(--theme-text)' }}
              >
                Sign in to Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
