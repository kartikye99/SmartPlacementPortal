import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Award, Building2, FileText, GraduationCap, Lock, Mail, ShieldCheck, User, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { AmbientBackground } from '../../components/layout/AmbientBackground';
import { ThemeSwitcher } from '../../components/common/ThemeSwitcher';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student',
    department: 'Computer Science & Engineering', rollNumber: '', cgpa: '8.0',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const update = (field) => (event) => setFormData((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--theme-background)', color: 'var(--theme-text)' }}>
      <AmbientBackground />
      <header className="relative z-10 h-16 px-5 sm:px-8 flex items-center justify-between border-b" style={{ background: 'var(--theme-navbar)', borderColor: 'var(--theme-border)' }}>
        <Link to="/login" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: 'var(--theme-primary)', color: 'var(--theme-primary-text)' }}><GraduationCap className="w-5 h-5" /></div>
          <div>
            <p className="text-[14px] font-semibold leading-tight">University Placement Portal</p>
            <p className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>Account registration</p>
          </div>
        </Link>
        <ThemeSwitcher />
      </header>

      <main className="relative z-10 py-9 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-[22px] font-semibold tracking-tight">Create portal account</h1>
            <p className="text-[12px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>Enter your official academic or placement office details.</p>
          </div>

          <div className="glass-panel rounded-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <fieldset>
                <legend className="text-[12px] font-semibold mb-2">Account type</legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'student', label: 'Student', icon: UserCheck },
                    { id: 'admin', label: 'Placement Officer', icon: ShieldCheck },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData((current) => ({ ...current, role: id }))}
                      className="py-2.5 rounded-md text-[12px] font-medium flex items-center justify-center gap-2 border"
                      style={{
                        background: formData.role === id ? 'var(--theme-accent-soft)' : 'var(--theme-surface)',
                        color: formData.role === id ? 'var(--theme-accent)' : 'var(--theme-text-muted)',
                        borderColor: formData.role === id ? 'var(--theme-accent-border)' : 'var(--theme-border)',
                      }}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full name" required value={formData.name} onChange={update('name')} placeholder="Enter your full name" leftIcon={<User className="w-4 h-4" />} />
                <Input label="Official email" type="email" autoComplete="email" required value={formData.email} onChange={update('email')} placeholder="name@university.edu" leftIcon={<Mail className="w-4 h-4" />} />
              </div>

              <Input label="Password" type="password" autoComplete="new-password" minLength={6} required value={formData.password} onChange={update('password')} placeholder="Minimum 6 characters" helperText="Use at least 6 characters." leftIcon={<Lock className="w-4 h-4" />} />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="department" className="block text-[12px] font-semibold">Department</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--theme-text-muted)' }} />
                    <select id="department" value={formData.department} onChange={update('department')} className="w-full rounded-md pl-10 pr-3 py-2.5 text-[13px] border focus:outline-none focus:ring-2" style={{ background: 'var(--theme-input-bg)', borderColor: 'var(--theme-input-border)', color: 'var(--theme-text)' }}>
                      <option>Computer Science & Engineering</option>
                      <option>Information Technology</option>
                      <option>Electronics & Communication</option>
                      <option>Electrical Engineering</option>
                      <option>Mechanical Engineering</option>
                      <option>Civil Engineering</option>
                      <option>Training & Placement Cell</option>
                    </select>
                  </div>
                </div>
                <Input label={formData.role === 'student' ? 'Roll / registration number' : 'Employee / admin ID'} required value={formData.rollNumber} onChange={update('rollNumber')} placeholder={formData.role === 'student' ? 'CS2026-001' : 'TPO-001'} leftIcon={<FileText className="w-4 h-4" />} />
              </div>

              {formData.role === 'student' && (
                <Input label="Current CGPA" type="number" step="0.01" min="0" max="10" required value={formData.cgpa} onChange={update('cgpa')} helperText="Enter your cumulative CGPA on a 10-point scale." leftIcon={<Award className="w-4 h-4" />} />
              )}

              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[12px]" style={{ color: 'var(--theme-text-muted)' }}>Already registered? <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--theme-accent)' }}>Sign in</Link></p>
                <Button type="submit" size="lg" isLoading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>Create account</Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
