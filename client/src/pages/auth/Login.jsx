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
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { AmbientBackground } from '../../components/layout/AmbientBackground';
import { ThemeSwitcher } from '../../components/common/ThemeSwitcher';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

      {/* Clean Academic Grid & Monochromatic Ambient Diffusion */}
      <AmbientBackground />

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Left Side: Institutional highlights */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm"
            style={{
              backgroundColor: 'var(--theme-surface)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
          >
            <Building2 className="w-4 h-4 opacity-75" />
            <span className="text-xs font-semibold tracking-wide">
              University Management System (UMS)
            </span>
          </div>

          <div className="space-y-3">
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display"
              style={{ color: 'var(--theme-text)' }}
            >
              Smart Placement <span className="underline decoration-1 underline-offset-8">Portal</span>
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--theme-text-muted)' }}
            >
              Enterprise campus recruitment and placement automation platform for students, Training & Placement Officers (TPO), and recruiting partners.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              'Direct campus drive registration & eligibility evaluation',
              'Real-time application pipeline tracking & interview scheduling',
              'Automated CGPA cutoffs & academic verification',
              'AI-powered resume alignment & technical preparation modules',
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-xs font-medium"
                style={{ color: 'var(--theme-text)' }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-6 perspective-1000">
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
                  Portal Sign In
                </h2>
                <p
                  className="text-xs"
                  style={{ color: 'var(--theme-text-muted)' }}
                >
                  Authenticate with your official institutional account
                </p>
              </div>
            </div>

            {/* Role Tab Toggle */}
            <div
              className="grid grid-cols-2 gap-1.5 p-1 rounded-xl mb-6 border"
              style={{
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  selectedRole === 'student'
                    ? 'shadow-sm border'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor:
                    selectedRole === 'student'
                      ? 'var(--theme-surface-elevated)'
                      : 'transparent',
                  color: 'var(--theme-text)',
                  borderColor:
                    selectedRole === 'student'
                      ? 'var(--theme-border)'
                      : 'transparent',
                }}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  selectedRole === 'admin'
                    ? 'shadow-sm border'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor:
                    selectedRole === 'admin'
                      ? 'var(--theme-surface-elevated)'
                      : 'transparent',
                  color: 'var(--theme-text)',
                  borderColor:
                    selectedRole === 'admin'
                      ? 'var(--theme-border)'
                      : 'transparent',
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Placement Officer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Institutional Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'admin'
                    ? 'officer@university.edu'
                    : 'student@university.edu'
                }
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
                <label
                  className="flex items-center gap-2 cursor-pointer select-none"
                  style={{ color: 'var(--theme-text-muted)' }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-zinc-500 text-zinc-900 focus:ring-zinc-400"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="font-medium hover:underline"
                  style={{ color: 'var(--theme-text)' }}
                >
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
                Sign In as {selectedRole === 'admin' ? 'Placement Officer' : 'Student'}
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
                Don't have an institutional account?{' '}
                <Link
                  to="/register"
                  className="font-bold underline underline-offset-4"
                  style={{ color: 'var(--theme-text)' }}
                >
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
