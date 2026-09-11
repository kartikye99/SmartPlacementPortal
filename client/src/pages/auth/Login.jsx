import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap, Lock, Mail, ShieldCheck, UserCheck } from 'lucide-react';
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen relative flex flex-col" style={{ background: 'var(--theme-background)', color: 'var(--theme-text)' }}>
      <AmbientBackground />
      <header className="relative z-10 h-16 px-5 sm:px-8 flex items-center justify-between border-b" style={{ background: 'var(--theme-navbar)', borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: 'var(--theme-primary)', color: 'var(--theme-primary-text)' }}>
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-semibold leading-tight">University Placement Portal</p>
            <p className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>Training & Placement Office</p>
          </div>
        </div>
        <ThemeSwitcher />
      </header>

      <main className="relative z-10 flex-1 flex items-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-[1fr_440px] border rounded-lg overflow-hidden" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)', boxShadow: 'var(--theme-shadow)' }}>
          <section className="hidden lg:flex flex-col justify-between p-10 min-h-[570px]" style={{ background: 'var(--theme-sidebar)', color: 'var(--sidebar-text)' }}>
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--sidebar-muted)' }}>
                <Building2 className="w-4 h-4" /> University Management System
              </div>
              <h1 className="mt-8 text-[30px] leading-tight font-semibold max-w-md">Campus placement services in one secure workspace.</h1>
              <p className="mt-4 text-[13px] leading-6 max-w-md" style={{ color: 'var(--sidebar-muted)' }}>
                Access placement drives, application records, preparation resources, and interview schedules using your institutional account.
              </p>
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="text-[12px] font-medium">Smart Placement Portal</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--sidebar-muted)' }}>For students and authorized placement staff</p>
            </div>
          </section>

          <section className="p-6 sm:p-9">
            <div className="mb-7">
              <h2 className="text-[22px] font-semibold tracking-tight">Sign in</h2>
              <p className="text-[12px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>Use your registered email and password.</p>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-md mb-6" style={{ background: 'var(--theme-background-secondary)' }} aria-label="Account type">
              {[
                { id: 'student', label: 'Student', icon: UserCheck },
                { id: 'admin', label: 'Placement Officer', icon: ShieldCheck },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedRole(id)}
                  className="py-2 rounded text-[12px] font-medium flex items-center justify-center gap-2 border"
                  style={{
                    background: selectedRole === id ? 'var(--theme-surface)' : 'transparent',
                    color: selectedRole === id ? 'var(--theme-text)' : 'var(--theme-text-muted)',
                    borderColor: selectedRole === id ? 'var(--theme-border)' : 'transparent',
                    boxShadow: selectedRole === id ? '0 1px 2px rgba(0,0,0,.04)' : 'none',
                  }}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Institutional email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={selectedRole === 'admin' ? 'officer@university.edu' : 'student@university.edu'} leftIcon={<Mail className="w-4 h-4" />} />
              <Input label="Password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" leftIcon={<Lock className="w-4 h-4" />} />
              <div className="flex items-center justify-between text-[12px] pt-1">
                <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--theme-text-muted)' }}>
                  <input type="checkbox" className="rounded" /> Keep me signed in
                </label>
                <button type="button" className="font-medium hover:underline" style={{ color: 'var(--theme-accent)' }}>Forgot password?</button>
              </div>
              <Button type="submit" size="lg" isLoading={loading} rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full">
                Sign in
              </Button>
            </form>

            <div className="mt-7 pt-5 border-t text-center" style={{ borderColor: 'var(--theme-border-subtle)' }}>
              <p className="text-[12px]" style={{ color: 'var(--theme-text-muted)' }}>
                New to the portal? <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--theme-accent)' }}>Create an account</Link>
              </p>
            </div>
          </section>
        </div>
      </main>
      <footer className="relative z-10 text-center text-[11px] py-4" style={{ color: 'var(--theme-text-faint)' }}>Authorized institutional use only</footer>
    </div>
  );
};
