import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  TrendingUp,
  UserCheck,
  Building,
  AlertCircle,
  FileCheck,
  Award,
  Code2,
  FileText,
  Target,
  Brain,
  Zap,
  ChevronRight,
  AlertTriangle,
  Mic,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CircularProgress, ProgressBar } from '../../components/common/Progress';
import { Modal } from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/Skeleton';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { activeTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [appliedDrives, setAppliedDrives] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/stats');
        if (res.success) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error('Failed to load student stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleApplyDrive = async (drive) => {
    try {
      const res = await api.post(`/jobs/${drive.id}/apply`);
      if (res.success) {
        toast.success(`Application submitted for ${drive.company}!`);
        setAppliedDrives((prev) => ({ ...prev, [drive.id]: true }));
        setSelectedDrive(null);
      } else {
        toast.error(res.message || 'Failed to apply');
      }
    } catch (err) {
      toast.error('Application submission failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 rounded-3xl animate-pulse" style={{ backgroundColor: 'var(--theme-surface)' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const drives = statsData?.activeDrives || [];
  const schedules = statsData?.upcomingSchedules || [];

  return (
    <div className="space-y-8 text-left">
      {/* ===================================================================
          HERO SECTION: Inspiring Career AI Artwork + Placement Index
          =================================================================== */}
      <div 
        className="relative overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all duration-500"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          boxShadow: 'var(--theme-shadow), var(--theme-glow)',
        }}
      >
        {/* Background Artwork with Theme-Aware Gradient Mask */}
        <div className="absolute inset-0 z-0 opacity-45 overflow-hidden transition-all duration-700">
          <img
            key={activeTheme?.id || 'midnight'}
            src={activeTheme?.assets?.hero || '/themes/midnight/hero.svg'}
            alt={`${activeTheme?.name || 'Theme'} Hero Artwork`}
            className="w-full h-full object-cover object-center scale-105 transform hover:scale-100 transition-all duration-1000 ease-out animate-in fade-in"
          />
          <div 
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: 'linear-gradient(to right, var(--theme-background) 0%, color-mix(in srgb, var(--theme-background) 80%, transparent) 55%, transparent 100%)'
            }}
          />
          <div 
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: 'linear-gradient(to top, var(--theme-background) 0%, transparent 60%, color-mix(in srgb, var(--theme-background) 40%, transparent) 100%)'
            }}
          />
        </div>

        {/* Dynamic Ambient Glow Orbs */}
        <div 
          className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700" 
          style={{ background: 'var(--theme-glow-1)' }}
        />
        <div 
          className="absolute left-1/3 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700" 
          style={{ background: 'var(--theme-glow-2)' }}
        />

        <div className="relative z-10 p-6 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/35 text-fuchsia-300 text-xs font-bold shadow-sm shadow-fuchsia-500/10">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
                <span>AI Career Intelligence Active</span>
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                • Batch of 2026 Campus Drive
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-display leading-tight">
              Ready to Accelerate Your Placement,{' '}
              <span className="text-gradient-aurora">{user?.name || 'Candidate'}</span>?
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {user?.department} • Roll No:{' '}
              <span className="text-slate-100 font-semibold">{user?.rollNumber || 'CS2026-089'}</span> • Current
              Academic CGPA: <span className="text-emerald-400 font-bold">{user?.cgpa || 8.8}</span>
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="ai"
                size="sm"
                onClick={() => navigate('/student/prepare/job-003')}
                leftIcon={<Sparkles className="w-4 h-4 text-fuchsia-200" />}
              >
                Prepare with AI
              </Button>
              <Button
                variant="jobs"
                size="sm"
                onClick={() => navigate('/student/jobs')}
                leftIcon={<Briefcase className="w-4 h-4" />}
              >
                Explore Drives ({drives.length})
              </Button>
              <Button
                variant="resume"
                size="sm"
                onClick={() => navigate('/student/resume/builder')}
                leftIcon={<FileText className="w-4 h-4" />}
              >
                Resume Editor
              </Button>
              <Button
                variant="interview"
                size="sm"
                onClick={() => navigate('/student/interview')}
                leftIcon={<Mic className="w-4 h-4" />}
              >
                Mock Interview
              </Button>
            </div>
          </div>

          {/* Elevated Circular Readiness Metric Card */}
          <div 
            className="flex items-center gap-6 p-5 rounded-3xl border shrink-0 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 transition-all duration-400"
            style={{
              backgroundColor: 'var(--theme-surface-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <CircularProgress
              value={user?.readinessScore || 90}
              size={110}
              strokeWidth={9}
              label="Readiness"
              gradient="aurora"
            />
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Placement Index
              </span>
              <p className="text-base font-extrabold text-white">Tier-1 Qualified</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Eligible for 25+ LPA</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-0.5">Top 12% in CS Cohort</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          CORE CLARITY SECTION:
          1. What jobs can I apply for?
          2. What should I prepare?
          3. What do I need to improve?
          =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: What jobs can I apply for? (Indigo + Violet) */}
        <Card area="jobs" hover className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <Badge variant="jobs" dot>Drives Open</Badge>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">What jobs can I apply for?</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {drives.length > 0
                ? `${drives.length} recruitment drive${drives.length > 1 ? 's' : ''} currently open for applications.`
                : 'Browse campus drives matching your academic credentials and branch.'}
            </p>

            <div className="mt-4 space-y-2.5">
              {drives.length > 0 ? (
                drives.slice(0, 3).map((j, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{j.company}</span>
                      <span className="text-[11px] text-slate-400">{j.role}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">{j.ctc}</span>
                      <span className="text-[10px] text-rose-300">Closes {j.deadline}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-400">
                  No active recruitment drives posted at this moment.
                </div>
              )}
            </div>
          </div>

          <Button
            variant="jobs"
            size="sm"
            className="w-full font-bold"
            onClick={() => navigate('/student/jobs')}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Apply to Matching Drives
          </Button>
        </Card>

        {/* Card 2: What should I prepare? */}
        <Card area="ai" hover className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300">
                <Brain className="w-5 h-5" />
              </div>
              <Badge variant="ai" dot>AI Intelligence</Badge>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">What should I prepare?</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Curated preparation roadmaps generated from company Job Descriptions and technical interview data.
            </p>

            <div className="mt-4 space-y-2.5">
              <div
                onClick={() => navigate(drives.length > 0 ? `/student/prepare/${drives[0].id}` : '/student/practice')}
                className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/25 hover:border-purple-500/50 cursor-pointer transition-all text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-white block">Job Description Intelligence</span>
                    <span className="text-[11px] text-purple-300">Targeted Keyword & Tech Stack Alignment</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </div>

              <div
                onClick={() => navigate('/student/practice')}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-white block">Algorithmic Coding Arena</span>
                    <span className="text-[11px] text-slate-400">Curated Technical Interview Challenges</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => navigate('/student/interview')}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-300 font-bold">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-white block">Live Voice Mock Simulator</span>
                    <span className="text-[11px] text-slate-400">Adaptive AI Technical Follow-ups</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <Button
            variant="ai"
            size="sm"
            className="w-full font-bold"
            onClick={() => navigate(drives.length > 0 ? `/student/prepare/${drives[0].id}` : '/student/practice')}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Launch AI Workspace
          </Button>
        </Card>

        {/* Card 3: What do I need to improve? */}
        <Card area="deadline" hover className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300">
                <Target className="w-5 h-5" />
              </div>
              <Badge variant="deadline" dot>Remediation</Badge>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">What do I need to improve?</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Weakness Engine continuously flags skill gaps based on your mock interview and test submissions.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
                <Target className="w-6 h-6 text-slate-400 mx-auto mb-1.5 opacity-60" />
                <p className="text-xs font-semibold text-slate-200">No Weakness Anomalies Detected</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Complete a technical mock interview or code evaluation to generate AI diagnostic benchmarks.</p>
              </div>
            </div>
          </div>

          <Button
            variant="resume"
            size="sm"
            className="w-full font-bold"
            onClick={() => navigate('/student/interview')}
            leftIcon={<Mic className="w-4 h-4" />}
          >
            Start Technical Mock
          </Button>
        </Card>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card area="deadline" hover className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md shadow-rose-500/15 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Drives</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{drives.length}</h3>
            <span className="text-[11px] text-rose-300 font-medium">{drives.length > 0 ? `${drives.length} open drives` : 'No open drives'}</span>
          </div>
        </Card>

        <Card area="jobs" hover className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md shadow-indigo-500/15 shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</p>
            <h3 className="text-2xl font-black text-white mt-0.5">
              {(statsData?.appliedDrives || 0) + Object.keys(appliedDrives).length}
            </h3>
            <span className="text-[11px] text-indigo-300 font-medium">Submitted applications</span>
          </div>
        </Card>

        <Card area="progress" hover className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/15 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Shortlisted</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{statsData?.shortlistedDrives || 0}</h3>
            <span className="text-[11px] text-cyan-300 font-medium">Progressing in pipeline</span>
          </div>
        </Card>

        <Card area="interview" hover className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-md shadow-pink-500/15 shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Readiness</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{user?.readinessScore || 0}%</h3>
            <span className="text-[11px] text-pink-300 font-medium">Profile benchmark</span>
          </div>
        </Card>
      </div>

      {/* APPLICATION PIPELINE MILESTONE TRACKER */}
      <Card area="jobs">
        <CardHeader>
          <div>
            <CardTitle>Application Pipeline Tracker</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              {drives.length > 0 ? (
                <>Active drive tracking for: <span className="font-bold text-white">{drives[0].company} — {drives[0].role}</span></>
              ) : (
                'Track your recruitment and interview milestones in real-time.'
              )}
            </p>
          </div>
          <Badge variant="jobs" dot>{statsData?.appliedDrives > 0 ? 'Pipeline Active' : 'No Active Applications'}</Badge>
        </CardHeader>
        <CardContent>
          {statsData?.appliedDrives > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {[
                { stage: '1. Applied', status: 'completed', date: 'Submitted' },
                { stage: '2. Online Test', status: statsData?.shortlistedDrives > 0 ? 'completed' : 'current', date: 'Assessment' },
                { stage: '3. Tech Round 1', status: statsData?.pendingInterviews > 0 ? 'current' : 'pending', date: 'Technical' },
                { stage: '4. Tech Round 2', status: 'pending', date: 'Advanced' },
                { stage: '5. HR & Offer', status: statsData?.offersReceived > 0 ? 'completed' : 'pending', date: 'Final' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    step.status === 'completed'
                      ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300'
                      : step.status === 'current'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/30 border-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold">{step.stage}</span>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : step.status === 'current' ? (
                      <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <p className="text-[11px] opacity-80">{step.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl bg-slate-900/30 border border-white/5">
              <FileCheck className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-slate-300">No applications currently in progress</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Apply to on-campus placement drives to track your application milestones from initial submission to final offer.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ACTIVE DRIVES & UPCOMING ROUNDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Drives */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Active Recruitment Drives</h3>
              <p className="text-xs text-slate-400">Direct on-campus corporate listings</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="jobs" size="sm">Drives Open</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/jobs')}
              >
                Browse All Drives
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {drives.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center">
                <Briefcase className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
                <h4 className="text-sm font-bold text-white">No Active Recruitment Drives</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  There are currently no active placement drives published. Drives published by the placement cell will appear here.
                </p>
                <Button variant="jobs" size="sm" onClick={() => navigate('/student/jobs')}>
                  Explore Placement Portal
                </Button>
              </div>
            ) : (
              drives.map((drive) => {
                const isApplied =
                  appliedDrives[drive.id] ||
                  drive.status === 'Applied' ||
                  drive.status === 'Shortlisted' ||
                  drive.status === 'Interviewing';
                return (
                  <div
                    key={drive.id}
                    className="glass-panel card-area-jobs p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-300 text-lg shrink-0">
                        {drive.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{drive.company}</h4>
                          <Badge
                            variant={isApplied ? 'success' : 'jobs'}
                            size="sm"
                          >
                            {appliedDrives[drive.id] ? 'Applied' : drive.status}
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-indigo-300 mt-0.5">{drive.role}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-bold text-emerald-400">
                            <Award className="w-3.5 h-3.5" />
                            {drive.ctc}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {drive.location}
                          </span>
                          <span className="flex items-center gap-1 text-rose-300">
                            <Clock className="w-3.5 h-3.5" />
                            Deadline: {drive.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <Button
                        variant="ai"
                        size="sm"
                        onClick={() => navigate(`/student/prepare/${drive.id}`)}
                        leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                      >
                        Prepare with AI
                      </Button>
                      <Button
                        variant={isApplied ? 'secondary' : 'jobs'}
                        size="sm"
                        onClick={() => setSelectedDrive(drive)}
                      >
                        {isApplied ? 'View Details' : 'Apply Now'}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Schedules & Deadlines */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-white tracking-tight">Upcoming Rounds</h3>
              <Badge variant="deadline" size="sm">Confirmed</Badge>
            </div>
            <p className="text-xs text-slate-400 mb-4">Confirmed assessment slots</p>
            <div className="space-y-3">
              {schedules.length === 0 ? (
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center">
                  <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-300">No Interview Rounds Scheduled</p>
                  <p className="text-[11px] text-slate-400 mt-1">Confirmed interview and assessment slots will appear here once shortlisted.</p>
                </div>
              ) : (
                schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 card-area-deadline"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{schedule.company}</span>
                      <Badge variant="warning" size="sm">Upcoming</Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-300">{schedule.round}</p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        {schedule.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {schedule.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>TPO Advisory Notice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mandatory mock technical interviews are scheduled this Friday in Lab 4. Ensure your GitHub projects and profile details are up to date!
            </p>
          </div>
        </div>
      </div>

      {/* Drive Details & Apply Modal */}
      {selectedDrive && (
        <Modal
          isOpen={!!selectedDrive}
          onClose={() => setSelectedDrive(null)}
          title={`${selectedDrive.company} — ${selectedDrive.role}`}
          description={`Campus Placement Drive • Batch of 2026`}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDrive(null)}>
                Close
              </Button>
              <Button
                variant={appliedDrives[selectedDrive.id] ? 'secondary' : 'jobs'}
                size="sm"
                disabled={appliedDrives[selectedDrive.id]}
                onClick={() => handleApplyDrive(selectedDrive)}
              >
                {appliedDrives[selectedDrive.id] ? 'Already Applied' : 'Submit Application'}
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Compensation (CTC)</span>
                <span className="text-emerald-400 font-extrabold text-sm">{selectedDrive.ctc}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Locations</span>
                <span className="text-white font-medium">{selectedDrive.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Eligibility</span>
                <span className="text-indigo-300 font-semibold">{selectedDrive.eligibility}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Registration Deadline</span>
                <span className="text-rose-400 font-semibold">{selectedDrive.deadline}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Responsibilities & Scope
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Design and develop scalable microservices, participate in architectural reviews, and collaborate with cross-functional engineering teams.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Required Skillsets
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {['Data Structures & Algorithms', 'System Design', 'React / Modern JS', 'Node.js / Python', 'SQL / NoSQL'].map((skill, i) => (
                  <Badge key={i} variant="neutral" size="sm">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
