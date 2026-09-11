import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  Download,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Sparkles,
  Layers,
  Brain,
  AlertTriangle,
  FileCheck,
  FileText,
  Mic,
  ChevronRight,
  ExternalLink,
  Code2,
  ArrowRight,
  UserCheck,
  Target,
  BarChart3,
  Calendar,
  X,
  Printer,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar, CircularProgress } from '../../components/common/Progress';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/Skeleton';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { activeTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  // Core Data
  const [intelData, setIntelData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedReadinessTier, setSelectedReadinessTier] = useState('all');

  // Student 360 Deep-Dive State
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeDossierTab, setActiveDossierTab] = useState('overview'); // overview | applications | resume | interviews | weaknesses | preparation

  // Active Analytics Tab
  const [analyticsView, setAnalyticsView] = useState('funnel'); // funnel | companies | timeline | weaknesses | readiness

  useEffect(() => {
    const fetchAdminIntelligence = async () => {
      try {
        setLoading(true);
        const [intelRes, studentsRes] = await Promise.all([
          api.get('/admin/intelligence'),
          api.get('/admin/students'),
        ]);

        if (intelRes?.success) {
          setIntelData(intelRes);
        }
        if (studentsRes?.students) {
          setStudents(studentsRes.students);
        }
      } catch (err) {
        console.error('Failed to load admin intelligence:', err);
        toast.error('Failed to load real-time intelligence data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminIntelligence();
  }, []);

  // Fetch Student 360 Deep Dive
  const handleOpenStudentDossier = async (studentId) => {
    setSelectedStudentId(studentId);
    setLoadingDetails(true);
    setActiveDossierTab('overview');
    try {
      const res = await api.get(`/admin/students/${studentId}`);
      if (res?.success) {
        setStudentDetails(res);
      }
    } catch (err) {
      console.error('Failed to load student dossier:', err);
      toast.error('Could not fetch student dossier details');
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left max-w-7xl mx-auto">
        <div className="h-32 rounded-3xl bg-slate-900/60 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="h-64 rounded-3xl bg-slate-900/40 animate-pulse" />
      </div>
    );
  }

  const kpis = intelData?.kpis || {
    totalStudents: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    interviewsCount: 0,
    placedCount: 0,
    placementPercentage: 0,
    averagePackageLPA: 0,
    highestPackageLPA: 0,
  };

  const funnel = intelData?.placementFunnel || [];
  const companyApps = intelData?.companyApplications || [];
  const timeline = intelData?.applicationsTimeline || [];
  const readinessTiers = intelData?.readinessDistribution || [];
  const weaknesses = intelData?.collegeWeaknesses || [];

  // Filter student roster
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept =
      selectedDept === 'All Departments' || s.department === selectedDept;

    const matchesTier =
      selectedReadinessTier === 'all' ||
      (selectedReadinessTier === 'high' && s.readinessScore >= 80) ||
      (selectedReadinessTier === 'near' && s.readinessScore >= 65 && s.readinessScore < 80) ||
      (selectedReadinessTier === 'low' && s.readinessScore < 65);

    return matchesSearch && matchesDept && matchesTier;
  });

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-500"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          boxShadow: 'var(--theme-shadow), var(--theme-glow)',
        }}
      >
        <div className="absolute inset-0 z-0 opacity-40 overflow-hidden transition-all duration-700">
          <img
            key={activeTheme?.id || 'midnight'}
            src={activeTheme?.assets?.admin || '/themes/midnight/admin.svg'}
            alt={`${activeTheme?.name || 'Theme'} Admin Artwork`}
            className="w-full h-full object-cover object-center"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, var(--theme-background) 0%, color-mix(in srgb, var(--theme-background) 80%, transparent) 55%, transparent 100%)'
            }}
          />
        </div>
        <div 
          className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700" 
          style={{ background: 'var(--theme-glow-1)' }}
        />
        <div 
          className="absolute -left-10 -top-10 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700" 
          style={{ background: 'var(--theme-glow-2)' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/35 text-violet-300 text-xs font-semibold mb-2.5 shadow-sm shadow-violet-500/10">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Admin Intelligence & Central Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Placement Command & <span className="text-gradient-aurora">Cohort Intelligence</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Full-lifecycle university placement analytics: conversion funnels, company volumes, batch-wide weakness detection, and candidate 360 dossiers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Brief</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/admin/jobs')}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Drive</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ============================================================
          TOP 6 CORE EXECUTIVE STATS (Multi-Accent Spectrum)
          - Students
          - Active Jobs
          - Applications
          - Shortlisted
          - Interviews
          - Placed
         ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Students (Neon Violet) */}
        <Card hover className="p-4 space-y-1.5 border-violet-500/25 bg-gradient-to-b from-violet-950/25 to-[#0b0f19]/90 shadow-lg shadow-violet-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Students</span>
            <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.totalStudents}</div>
          <span className="text-[10px] text-violet-300/80 block font-medium">Active 2026 Batch</span>
        </Card>

        {/* 2. Active Jobs (Sunset Coral) */}
        <Card hover className="p-4 space-y-1.5 border-rose-500/25 bg-gradient-to-b from-rose-950/25 to-[#0b0f19]/90 shadow-lg shadow-rose-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Jobs</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.activeJobs}</div>
          <span className="text-[10px] text-rose-300/90 block font-semibold">Live Campus Drives</span>
        </Card>

        {/* 3. Applications (Aqua Cyan) */}
        <Card hover className="p-4 space-y-1.5 border-cyan-500/25 bg-gradient-to-b from-cyan-950/25 to-[#0b0f19]/90 shadow-lg shadow-cyan-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Applications</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.totalApplications}</div>
          <span className="text-[10px] text-cyan-300/80 block font-medium">Gross Submissions</span>
        </Card>

        {/* 4. Shortlisted (Teal / Emerald) */}
        <Card hover className="p-4 space-y-1.5 border-teal-500/25 bg-gradient-to-b from-teal-950/25 to-[#0b0f19]/90 shadow-lg shadow-teal-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Shortlisted</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-300 font-mono">{kpis.shortlistedCount}</div>
          <span className="text-[10px] text-teal-300/80 block font-medium">Screening Cleared</span>
        </Card>

        {/* 5. Interviews (Sunset Amber) */}
        <Card hover className="p-4 space-y-1.5 border-amber-500/25 bg-gradient-to-b from-amber-950/25 to-[#0b0f19]/90 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Interviews</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">{kpis.interviewsCount}</div>
          <span className="text-[10px] text-amber-300/80 block font-medium">Tech + HR Rounds</span>
        </Card>

        {/* 6. Placed (Emerald Aurora) */}
        <Card hover className="p-4 space-y-1.5 border-emerald-500/35 bg-gradient-to-b from-emerald-950/35 to-[#0b0f19]/90 shadow-lg shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Placed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{kpis.placedCount}</div>
          <span className="text-[10px] text-emerald-300 font-bold block">{kpis.placementPercentage}% Conversion</span>
        </Card>
      </div>

      {/* ============================================================
          INTERACTIVE ANALYTICS SUITE (Funnel, Weaknesses, Companies)
         ============================================================ */}
      <div className="space-y-4">
        {/* Navigation Tabs for Analytics */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAnalyticsView('funnel')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                analyticsView === 'funnel'
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-500 text-white shadow-lg shadow-violet-600/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
              }`}
            >
              Placement Funnel
            </button>
            <button
              onClick={() => setAnalyticsView('weaknesses')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                analyticsView === 'weaknesses'
                  ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 text-white shadow-lg shadow-rose-600/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
              }`}
            >
              College Weakness Radar
            </button>
            <button
              onClick={() => setAnalyticsView('companies')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                analyticsView === 'companies'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
              }`}
            >
              Company Volumes & Selection
            </button>
            <button
              onClick={() => setAnalyticsView('readiness')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                analyticsView === 'readiness'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-600/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
              }`}
            >
              Cohort Readiness Tiers
            </button>
            <button
              onClick={() => setAnalyticsView('timeline')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                analyticsView === 'timeline'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-600/25 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
              }`}
            >
              Applications Over Time
            </button>
          </div>

          <span className="text-xs text-slate-400 font-semibold hidden sm:inline flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Live TPO Telemetry
          </span>
        </div>

        {/* View 1: PLACEMENT FUNNEL */}
        {analyticsView === 'funnel' && (
          <Card className="p-6 border-slate-800 bg-slate-900/90 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Institutional Recruitment Conversion Funnel
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tracks candidate attrition across consecutive hiring hurdles.
                </p>
              </div>
              <Badge variant="purple">512 Applications $\rightarrow$ 76 Placed</Badge>
            </div>

            <div className="space-y-3.5 pt-2">
              {funnel.map((step, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[11px]">
                        {idx + 1}
                      </span>
                      {step.stage}
                    </span>
                    <span className="font-mono text-slate-300">
                      {step.count} candidates ({step.percentage}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={step.percentage}
                    max={100}
                    color={step.color}
                    size="md"
                    showValue={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* View 2: COLLEGE-WIDE WEAKNESS ANALYTICS (Exact Prompt Specification) */}
        {analyticsView === 'weaknesses' && (
          <Card className="p-6 border-slate-800 bg-slate-900/90 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-rose-400" />
                  College-Wide Vulnerability & Weakness Radar
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Aggregated from all mock interviews and OA test scores to trigger departmental intervention workshops.
                </p>
              </div>
              <Badge variant="danger">Action Required</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
              {weaknesses.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{item.topic}</span>
                    <span className="text-lg font-black text-rose-400 font-mono">
                      {item.affectedPercentage}%
                    </span>
                  </div>

                  <ProgressBar
                    value={item.affectedPercentage}
                    max={100}
                    color={item.severity === 'Critical' ? 'amber' : 'purple'}
                    size="sm"
                    showValue={false}
                  />

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-400">Impact: </strong>
                    {item.impact}
                  </p>

                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between gap-3">
                    <p className="text-[11px] text-indigo-200">
                      <strong>Recommended TPO Workshop: </strong>
                      {item.recommendedIntervention}
                    </p>
                    <button
                      onClick={() => toast.success(`Bootcamp scheduled: ${item.topic}`)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shrink-0 shadow transition"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* View 3: COMPANY-WISE APPLICATIONS & SELECTION */}
        {analyticsView === 'companies' && (
          <Card className="p-6 border-slate-800 bg-slate-900/90 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Recruiter Application Volumes & Selection Velocity
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applicant flow and ultimate acceptance rates by corporate partner.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {companyApps.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{comp.company}</h4>
                    <Badge variant="indigo" size="xs">{comp.avgPackage}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Applied</span>
                      <span className="font-bold text-white font-mono">{comp.applied}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Shortlist</span>
                      <span className="font-bold text-indigo-400 font-mono">{comp.shortlisted}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Placed</span>
                      <span className="font-bold text-emerald-400 font-mono">{comp.placed}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Selection Rate:</span>
                    <span className="font-bold text-emerald-400 font-mono">{comp.selectionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* View 4: READINESS TIERS */}
        {analyticsView === 'readiness' && (
          <Card className="p-6 border-slate-800 bg-slate-900/90 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Student Readiness Distribution (Cohort-Wide)
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Categorizes 480 final-year students into actionable placement readiness tiers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {readinessTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center"
                >
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {tier.tier}
                  </span>
                  <div className="text-3xl font-black text-white font-mono">
                    {tier.count} <span className="text-sm font-semibold text-slate-500">Students</span>
                  </div>
                  <ProgressBar
                    value={tier.percentage}
                    max={100}
                    color={tier.color}
                    size="sm"
                    label="Batch Share"
                  />
                  <p className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <strong>Action:</strong> {tier.benchmark}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* View 5: APPLICATIONS TIMELINE */}
        {analyticsView === 'timeline' && (
          <Card className="p-6 border-slate-800 bg-slate-900/90 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Applications Over Time (Recruitment Cycle Timeline)
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Weekly growth of student applications vs scheduled technical rounds.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              {timeline.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-center"
                >
                  <span className="text-[11px] font-bold text-slate-400 block">{t.cycle}</span>
                  <div className="text-xl font-extrabold text-white font-mono">{t.applications}</div>
                  <span className="text-[10px] text-slate-500 block">{t.interviews} Interviews</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* ============================================================
          STUDENT ANALYTICS & 360 DEEP DIVE ROSTER
         ============================================================ */}
      <Card className="border-slate-800 bg-slate-900/90">
        <CardHeader className="flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Student Candidate Roster & 360 Dossier
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any candidate to inspect their complete Profile, Applications, College Resume, Readiness Score, Mock Interview history, and Weaknesses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate or roll..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All Departments">All Departments</option>
              <option value="Computer Science & Engineering">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Comm</option>
            </select>

            {/* Readiness Tier Filter */}
            <select
              value={selectedReadinessTier}
              onChange={(e) => setSelectedReadinessTier(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Readiness</option>
              <option value="high">High (80%+)</option>
              <option value="near">Near Ready (65-79%)</option>
              <option value="low">Needs Focus (&lt;65%)</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Student Candidate</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Readiness Score</TableHead>
                <TableHead>Placement Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s._id} className="hover:bg-slate-800/40 transition">
                  <TableCell className="font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold font-mono">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <span>{s.name}</span>
                      <span className="block text-[11px] text-slate-400 font-normal">{s.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-300">{s.rollNumber}</TableCell>
                  <TableCell className="text-xs text-slate-300">{s.department}</TableCell>
                  <TableCell className="font-semibold text-emerald-400 font-mono">{s.cgpa}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-xs text-indigo-300">
                        {s.readinessScore || 80}%
                      </span>
                      <ProgressBar
                        value={s.readinessScore || 80}
                        max={100}
                        color={(s.readinessScore || 80) >= 80 ? 'emerald' : 'indigo'}
                        size="sm"
                        showValue={false}
                        className="w-16 hidden sm:block"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.placed ? (
                      <Badge variant="success" size="xs">
                        Placed ({s.placedCompany || 'Offered'})
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="xs">
                        In Process
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenStudentDossier(s._id)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      Inspect 360 →
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ============================================================
          STUDENT 360 DEEP DIVE MODAL / DRAWER (Exact Prompt Requirement)
          Admin can open a student and see:
          - Profile
          - Applications
          - Resume
          - Readiness
          - Interview History
          - Weaknesses
          - Preparation Progress
         ============================================================ */}
      {selectedStudentId && (
        <Modal
          isOpen={!!selectedStudentId}
          onClose={() => {
            setSelectedStudentId(null);
            setStudentDetails(null);
          }}
          title={
            studentDetails
              ? `Student 360 Dossier: ${studentDetails.student.name}`
              : 'Loading Student Dossier...'
          }
          description={
            studentDetails
              ? `${studentDetails.student.department} • ${studentDetails.student.rollNumber} • Class of ${studentDetails.student.graduationYear}`
              : ''
          }
          size="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-mono">
                Student ID: {selectedStudentId}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedStudentId(null);
                  setStudentDetails(null);
                }}
              >
                Close Dossier
              </Button>
            </div>
          }
        >
          {loadingDetails || !studentDetails ? (
            <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
              Aggregating Profile, Applications, Resume, Readiness, Mock Interviews, and Weaknesses...
            </div>
          ) : (
            <div className="space-y-6 text-left">
              {/* Dossier Tabs Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800 pb-2">
                {[
                  { id: 'overview', label: 'Overview & Profile', icon: <Users className="w-3.5 h-3.5" /> },
                  { id: 'applications', label: 'Applications Pipeline', icon: <Briefcase className="w-3.5 h-3.5" /> },
                  { id: 'resume', label: 'College Resume & ATS', icon: <FileText className="w-3.5 h-3.5" /> },
                  { id: 'interviews', label: 'Interview History', icon: <Mic className="w-3.5 h-3.5" /> },
                  { id: 'weaknesses', label: 'Weakness Radar', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                  { id: 'preparation', label: 'Preparation Progress', icon: <Code2 className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDossierTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 select-none ${
                      activeDossierTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-white bg-slate-900/60'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* 1. DOSSIER TAB: OVERVIEW & PROFILE */}
              {activeDossierTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cumulative CGPA</span>
                      <span className="text-xl font-bold text-emerald-400 font-mono">{studentDetails.student.cgpa}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Backlogs</span>
                      <span className="text-xl font-bold text-white font-mono">{studentDetails.student.activeBacklogs || 0}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Readiness Benchmark</span>
                      <span className="text-xl font-bold text-indigo-400 font-mono">{studentDetails.preparation.readinessScore}%</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Placement Status</span>
                      <span className="text-sm font-bold text-emerald-300 block mt-1">
                        {studentDetails.student.placed ? 'Offer Extended' : 'Actively Interviewing'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Contact & External Handles</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                      <div><strong>Email:</strong> {studentDetails.student.email}</div>
                      <div><strong>Phone:</strong> {studentDetails.student.phone}</div>
                      <div><strong>GitHub:</strong> <a href={studentDetails.student.github} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{studentDetails.student.github}</a></div>
                      <div><strong>LinkedIn:</strong> <a href={studentDetails.student.linkedin} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{studentDetails.student.linkedin}</a></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Verified Core Skills</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {(studentDetails.student.skills || []).map((sk, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-[11px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. DOSSIER TAB: APPLICATIONS */}
              {activeDossierTab === 'applications' && (
                <div className="space-y-3">
                  {studentDetails.applications.map((app, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{app.company}</span>
                          <Badge variant="indigo" size="xs">{app.package}</Badge>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{app.role}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">Applied: {app.appliedAt}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={app.status === 'Selected' ? 'success' : app.status === 'Shortlisted' ? 'purple' : 'neutral'} size="sm">
                          {app.status}
                        </Badge>
                        <span className="block text-[10px] text-slate-400">{app.currentRound}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. DOSSIER TAB: RESUME */}
              {activeDossierTab === 'resume' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
                    <div>
                      <span className="font-bold text-white text-sm">College Placement Resume</span>
                      <p className="text-slate-400 text-[11px]">Standardized University Format Compliant</p>
                    </div>
                    <Badge variant="success">ATS Score: {studentDetails.preparation.resumeATSScore}%</Badge>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 leading-relaxed">
                    <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Project Highlights on Resume</h5>
                    {(studentDetails.resume?.projects || []).map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between font-semibold text-white">
                          <span>{p.title}</span>
                          <span className="text-slate-500 text-[10px]">{p.duration}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Tech Stack: {Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. DOSSIER TAB: INTERVIEW HISTORY */}
              {activeDossierTab === 'interviews' && (
                <div className="space-y-3">
                  {studentDetails.interviews.map((inv, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{inv.company} Mock</span>
                          <Badge variant="indigo" size="xs">{inv.category}</Badge>
                          <Badge variant="neutral" size="xs">{inv.mode === 'voice' ? '🎙️ Voice' : '⌨️ Text'}</Badge>
                        </div>
                        <span className="font-mono font-bold text-indigo-400 text-sm">{inv.overallScore}%</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] py-1 border-y border-slate-800/60 text-slate-400">
                        <div>Tech: <strong className="text-white font-mono">{inv.technicalScore}%</strong></div>
                        <div>Logic: <strong className="text-white font-mono">{inv.problemSolvingScore}%</strong></div>
                        <div>Comm: <strong className="text-white font-mono">{inv.communicationScore}%</strong></div>
                        <div>Structure: <strong className="text-white font-mono">{inv.structureScore}%</strong></div>
                      </div>

                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {inv.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. DOSSIER TAB: WEAKNESSES */}
              {activeDossierTab === 'weaknesses' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                      <h5 className="font-bold text-rose-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        🔴 Critical Vulnerabilities
                      </h5>
                      {studentDetails.weaknesses?.critical?.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-rose-900/40 text-xs">
                          <span className="font-bold text-white block">{c.topic}</span>
                          <span className="text-rose-200/80 text-[11px]">{c.reason}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                      <h5 className="font-bold text-amber-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        🟠 Needs Improvement
                      </h5>
                      {studentDetails.weaknesses?.needsImprovement?.map((n, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-amber-900/40 text-xs">
                          <span className="font-bold text-white block">{n.topic}</span>
                          <span className="text-amber-200/80 text-[11px]">{n.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                    <h5 className="font-bold text-emerald-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      🟢 Verified Strong Competencies
                    </h5>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {studentDetails.weaknesses?.strong?.map((s, i) => (
                        <span key={i} className="px-3 py-1 rounded-xl bg-slate-900 border border-emerald-900/60 text-emerald-200 text-xs font-semibold">
                          {s.topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. DOSSIER TAB: PREPARATION PROGRESS */}
              {activeDossierTab === 'preparation' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-xs text-slate-400 block font-semibold">Coding Questions Solved</span>
                      <span className="text-2xl font-bold text-white font-mono mt-1 block">
                        {studentDetails.preparation.solvedCodingProblems} / {studentDetails.preparation.totalCodingProblems}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-xs text-slate-400 block font-semibold">Mock Sessions Finished</span>
                      <span className="text-2xl font-bold text-indigo-400 font-mono mt-1 block">
                        {studentDetails.preparation.mockInterviewsCompleted}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Topics Mastered</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {studentDetails.preparation.topicsMastered?.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-[11px]">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Remediation Topics Pending</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {studentDetails.preparation.topicsPending?.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-[11px]">
                          ⚠️ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
