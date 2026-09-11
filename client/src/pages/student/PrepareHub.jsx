import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  Code2,
  Cpu,
  FileText,
  Users,
  TrendingUp,
  ExternalLink,
  CheckSquare,
  Square,
  Flame,
  HelpCircle,
  Layers,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Zap,
  Mic,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CircularProgress, ProgressBar } from '../../components/common/Progress';
import { SkeletonCard } from '../../components/common/Skeleton';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'analysis', label: 'JD Analysis', icon: <Layers className="w-4 h-4" /> },
  { id: 'coding', label: 'Coding & DSA', icon: <Code2 className="w-4 h-4" /> },
  { id: 'corecs', label: 'Core CS', icon: <Cpu className="w-4 h-4" /> },
  { id: 'resume', label: 'Resume Match', icon: <FileText className="w-4 h-4" /> },
  { id: 'interview', label: 'Interview Prep', icon: <Users className="w-4 h-4" /> },
  { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
];

export const PrepareHub = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { activeTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [recommendedData, setRecommendedData] = useState(null);
  const [resumeMatchData, setResumeMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coding Tab Interactive Filters
  const [codingTopicFilter, setCodingTopicFilter] = useState('all');
  const [codingDifficultyFilter, setCodingDifficultyFilter] = useState('all');
  const [codingPlatformFilter, setCodingPlatformFilter] = useState('all');
  const [codingStatusFilter, setCodingStatusFilter] = useState('all');

  const [solvedProblems, setSolvedProblems] = useState(() => {
    try {
      const saved = localStorage.getItem(`prep_solved_${jobId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedChecklist, setCompletedChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(`prep_checklist_${jobId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchPreparationData = async () => {
      try {
        setLoading(true);
        const [jobRes, recRes, resumeRes] = await Promise.all([
          api.get(`/jobs/${jobId}/prepare`),
          api.get(`/questions/recommended/${jobId}`),
          api.get(`/resumes/match/${jobId}`),
        ]);

        if (jobRes.success) {
          setData(jobRes);
          if (jobRes.cached) {
            console.log('[PrepareHub] Served instantly from AI cache.');
          }
        }

        if (recRes.success) {
          setRecommendedData(recRes);
          // Sync solved items from authenticated student database
          const backendSolved = (recRes.questions || [])
            .filter((q) => q.isSolved)
            .map((q) => q._id);
          setSolvedProblems((prev) => Array.from(new Set([...prev, ...backendSolved])));
        }

        if (resumeRes?.success) {
          setResumeMatchData(resumeRes);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load preparation hub');
      } finally {
        setLoading(false);
      }
    };

    fetchPreparationData();
  }, [jobId]);

  const toggleProblem = async (qId) => {
    const isCurrentlySolved = solvedProblems.includes(qId);
    const next = isCurrentlySolved
      ? solvedProblems.filter((p) => p !== qId)
      : [...solvedProblems, qId];
    setSolvedProblems(next);
    localStorage.setItem(`prep_solved_${jobId}`, JSON.stringify(next));

    try {
      const res = await api.post(`/questions/${qId}/toggle-solve`);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.info(next.includes(qId) ? 'Problem marked as solved! (+3% Readiness)' : 'Problem unmarked.');
    }
  };

  const toggleChecklistItem = (id) => {
    const next = completedChecklist.includes(id)
      ? completedChecklist.filter((c) => c !== id)
      : [...completedChecklist, id];
    setCompletedChecklist(next);
    localStorage.setItem(`prep_checklist_${jobId}`, JSON.stringify(next));
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left max-w-7xl mx-auto">
        <div className="h-44 rounded-3xl bg-slate-900 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!data?.job || !data?.analysis) {
    return (
      <div className="py-20 text-center glass-panel rounded-3xl p-8 max-w-xl mx-auto space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-500 mx-auto opacity-70" />
        <h3 className="text-base font-bold text-white">Drive Preparation Workspace Not Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          This placement drive record is not currently accessible or has been removed. You can continue practicing high-frequency algorithmic problems in the Coding Arena.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/student/jobs')}>
            Browse Drives
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/student/practice')}>
            Go to Coding Arena
          </Button>
        </div>
      </div>
    );
  }

  const { job, analysis } = data;

  // Dynamic Readiness Calculation:
  // Base 60% + (solved problems * 4%) + (checklist items * 4%) capped at 98%
  const totalProblems = analysis.codingProblems?.length || 7;
  const codingPoints = Math.round((solvedProblems.length / totalProblems) * 20);
  const checklistPoints = Math.min(20, completedChecklist.length * 5);
  const dynamicReadiness = Math.min(98, 55 + codingPoints + checklistPoints);

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Back Navigation & Engine Badge */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Drives</span>
        </button>

        <div className="flex items-center gap-2">
          {data.cached && (
            <Badge variant="violet" size="sm">
              ⚡ Instant AI Cache
            </Badge>
          )}
          <Badge variant="cyan" size="sm">
            {analysis.engine || 'Gemini 2.5 Flash'}
          </Badge>
        </div>
      </div>

      {/* Hero Workspace Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-2xl backdrop-blur-xl transition-all duration-500"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          boxShadow: 'var(--theme-shadow), var(--theme-glow)',
        }}
      >
        <div className="absolute inset-0 z-0 opacity-40 overflow-hidden transition-all duration-700">
          <img
            key={activeTheme?.id || 'midnight'}
            src={activeTheme?.assets?.prepare || '/themes/midnight/prepare.svg'}
            alt={`${activeTheme?.name || 'Theme'} Prepare Artwork`}
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
          className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700" 
          style={{ background: 'var(--theme-glow-1)' }}
        />
        <div 
          className="absolute -left-10 -top-10 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700" 
          style={{ background: 'var(--theme-glow-2)' }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/35 text-violet-300 text-xs font-semibold shadow-sm shadow-violet-500/10">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Job-Specific Preparation Workspace</span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-rose-600/30 border border-violet-500/40 flex items-center justify-center text-lg font-black text-violet-300 shrink-0">
                  {job.company?.logo || job.company?.name?.charAt(0)}
                </span>
                Prepare for <span className="text-gradient-aurora">{job.company?.name}</span> — {job.title}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                {job.package} • {job.location} • Deadline: {new Date(job.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {analysis.programmingLanguages?.map((lang, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Readiness Score Gauge */}
          <div 
            className="flex items-center gap-6 p-4 rounded-2xl border shrink-0 shadow-xl backdrop-blur-md transition-all duration-400"
            style={{
              backgroundColor: 'var(--theme-surface-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <CircularProgress
              value={dynamicReadiness}
              size={110}
              strokeWidth={9}
              label="Readiness"
            />
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Alignment
              </span>
              <p className="text-base font-black text-white">Readiness: {dynamicReadiness}%</p>
              <p className="text-xs text-emerald-400 font-semibold">
                {dynamicReadiness >= 75 ? 'Tier-1 Interview Ready' : 'In Progress (Active Prep)'}
              </p>
              <p className="text-[10px] text-slate-400">
                {solvedProblems.length} of {totalProblems} problems solved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 select-none ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-600/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <CardTitle>AI Executive Summary</CardTitle>
              </div>
              <Badge variant="purple" size="sm">Gemini Verified</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 leading-relaxed">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card hover className="p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Package (CTC)</span>
              <p className="text-xl font-black text-emerald-400 mt-1">{job.package}</p>
              <span className="text-[10px] text-slate-400">Competitive Base + RSUs</span>
            </Card>
            <Card hover className="p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Location</span>
              <p className="text-sm font-bold text-white mt-1 truncate">{job.location}</p>
              <span className="text-[10px] text-slate-400">Campus & R&D Hub</span>
            </Card>
            <Card hover className="p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Openings</span>
              <p className="text-xl font-black text-white mt-1">{job.openings || 10}</p>
              <span className="text-[10px] text-slate-400">Approved Vacancies</span>
            </Card>
            <Card hover className="p-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Cutoff Criteria</span>
              <p className="text-sm font-bold text-indigo-300 mt-1">CGPA ≥ {job.eligibility?.minCgpa || 7.5}</p>
              <span className="text-[10px] text-slate-400">Max {job.eligibility?.maxBacklogs || 0} Backlog</span>
            </Card>
          </div>

          {/* 4-Week Job-Specific Preparation Roadmap */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>4-Week Job-Specific Preparation Roadmap</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Milestone-based preparation calibrated to the interview patterns of {job.company?.name}.
                </p>
              </div>
              <Badge variant="info" size="sm">Structured Plan</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.roadmap?.map((weekItem) => (
                  <div
                    key={weekItem.week}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{weekItem.title}</h4>
                      <Badge variant="neutral" size="sm">Week {weekItem.week}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{weekItem.description}</p>
                    <div className="space-y-1 pt-1 border-t border-slate-800/80">
                      {weekItem.milestones?.map((m, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TAB 2: JD ANALYSIS ================= */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Responsibilities & Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Engineering Deliverables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {analysis.responsibilities?.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required vs. Preferred Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      Must-Have Prerequisites
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.requiredSkills?.map((s, idx) => (
                        <Badge key={idx} variant="danger" size="sm">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Preferred / Bonus Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.preferredSkills?.map((s, idx) => (
                        <Badge key={idx} variant="info" size="sm">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Topic Priority Matrix */}
            <div className="lg:col-span-6 space-y-6">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Topic Priority Matrix</CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">High-yield study areas weighted by exam frequency</p>
                  </div>
                  <Badge variant="purple" size="sm">Ranked</Badge>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden">
                  <div className="divide-y divide-slate-800/80">
                    {analysis.topicPriority?.map((tp, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-white">{tp.topic}</p>
                          <p className="text-[11px] text-slate-400">{tp.category} • {tp.expectedQuestions}</p>
                        </div>
                        <Badge
                          variant={
                            tp.priority === 'High'
                              ? 'danger'
                              : tp.priority === 'Medium'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                          dot
                        >
                          {tp.priority} Priority
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skill Importance Weights */}
              <Card>
                <CardHeader>
                  <CardTitle>Skill Importance & Screening Weight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.skillImportance?.map((si, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{si.skill}</span>
                        <Badge
                          variant={si.importance === 'Must-Have' ? 'danger' : 'info'}
                          size="sm"
                        >
                          {si.importance}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{si.reason}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CODING & DSA ================= */}
      {activeTab === 'coding' && (
        <div className="space-y-6">
          {/* Header Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Curated Questions</span>
              <span className="text-white font-black text-lg">
                {recommendedData?.totalRecommended || 32} Problems
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Solved by You</span>
              <span className="text-emerald-400 font-black text-lg">
                {solvedProblems.length} Solved
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Platforms</span>
              <span className="text-indigo-300 font-bold text-sm flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px]">LeetCode</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">GFG</span>
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Company Target</span>
              <span className="text-white font-bold text-sm mt-0.5 block truncate">
                {job.company?.name} Placement
              </span>
            </div>
          </div>

          {/* Interactive Multi-Filter Bar */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            {/* Topic Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[11px]">Topic:</span>
              <select
                value={codingTopicFilter}
                onChange={(e) => setCodingTopicFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Topics</option>
                {recommendedData?.groupedTopics?.map((gt, i) => (
                  <option key={i} value={gt.topic}>{gt.topic}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[11px]">Difficulty:</span>
              <select
                value={codingDifficultyFilter}
                onChange={(e) => setCodingDifficultyFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[11px]">Platform:</span>
              <select
                value={codingPlatformFilter}
                onChange={(e) => setCodingPlatformFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Platforms</option>
                <option value="LeetCode">LeetCode</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold text-[11px]">Status:</span>
              <select
                value={codingStatusFilter}
                onChange={(e) => setCodingStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="unsolved">Unsolved Only</option>
                <option value="solved">Solved Only</option>
              </select>
            </div>

            {(codingTopicFilter !== 'all' || codingDifficultyFilter !== 'all' || codingPlatformFilter !== 'all' || codingStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setCodingTopicFilter('all');
                  setCodingDifficultyFilter('all');
                  setCodingPlatformFilter('all');
                  setCodingStatusFilter('all');
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold underline ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Grouped Topics & Questions List */}
          <div className="space-y-6">
            {(recommendedData?.groupedTopics || []).map((group, groupIdx) => {
              // Apply local filters to this group's questions
              if (codingTopicFilter !== 'all' && group.topic.toLowerCase() !== codingTopicFilter.toLowerCase()) {
                return null;
              }

              const filteredGroupQuestions = (group.questions || []).filter((q) => {
                if (codingDifficultyFilter !== 'all' && q.difficulty !== codingDifficultyFilter) return false;
                if (codingPlatformFilter !== 'all' && q.platform !== codingPlatformFilter) return false;
                const isSolved = solvedProblems.includes(q._id);
                if (codingStatusFilter === 'solved' && !isSolved) return false;
                if (codingStatusFilter === 'unsolved' && isSolved) return false;
                return true;
              });

              if (filteredGroupQuestions.length === 0 && (codingDifficultyFilter !== 'all' || codingPlatformFilter !== 'all' || codingStatusFilter !== 'all')) {
                return null;
              }

              return (
                <Card key={groupIdx} className="overflow-hidden">
                  <CardHeader className="bg-slate-900/50 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {group.topic}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                            {group.badge}
                          </span>
                        </CardTitle>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          High frequency in {job.company?.name} technical screenings
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="font-bold text-white">
                        {filteredGroupQuestions.filter((q) => solvedProblems.includes(q._id)).length}
                      </span>
                      /{filteredGroupQuestions.length} Solved
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 divide-y divide-slate-800/80">
                    {filteredGroupQuestions.map((prob, qIdx) => {
                      const isSolved = solvedProblems.includes(prob._id);
                      return (
                        <div
                          key={prob._id}
                          onClick={() => toggleProblem(prob._id)}
                          className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                            isSolved
                              ? 'bg-emerald-950/15 text-emerald-300'
                              : 'hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className="text-xs font-bold text-slate-500 w-5 shrink-0 text-center">
                              {qIdx + 1}.
                            </span>

                            <div className="shrink-0">
                              {isSolved ? (
                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <h4
                                className={`text-xs font-bold truncate ${
                                  isSolved ? 'line-through opacity-75' : 'text-white'
                                }`}
                              >
                                {prob.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                <span>{(prob.topics || []).slice(0, 2).join(' • ')}</span>
                                <span>•</span>
                                <span className="text-amber-400/90 font-medium">
                                  🔥 {prob.frequency}% Asked
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex items-center gap-2.5 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                prob.platform === 'LeetCode'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {prob.platform}
                            </span>

                            <Badge
                              variant={
                                prob.difficulty === 'Hard'
                                  ? 'danger'
                                  : prob.difficulty === 'Medium'
                                  ? 'warning'
                                  : 'success'
                              }
                              size="sm"
                            >
                              {prob.difficulty}
                            </Badge>

                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
                              title={`Solve ${prob.title} on ${prob.platform}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: CORE CS ================= */}
      {activeTab === 'corecs' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Core CS Revision Flashcards</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Frequently examined conceptual questions for Technical Rounds
                </p>
              </div>
              <Badge variant="purple" size="sm">Theory Mastery</Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.coreCsFlashcards?.map((card, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <Badge variant="info" size="sm">{card.subject}</Badge>
                    <h4 className="text-xs font-extrabold text-white leading-snug">
                      {card.question}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {card.answer}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    {card.keyPoints?.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-indigo-300 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TAB 5: RESUME ================= */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          {/* Top Match Gauge Card */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <CircularProgress
                value={resumeMatchData?.analysis?.matchPercentage || 78}
                size={100}
                strokeWidth={8}
                label="JD Match"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">
                    JD Match: {resumeMatchData?.analysis?.matchPercentage || 78}%
                  </h3>
                  {resumeMatchData?.cached && (
                    <Badge variant="purple" size="sm">
                      ⚡ SHA-256 Cached ({resumeMatchData.latencyMs}ms)
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  {resumeMatchData?.analysis?.summary ||
                    `Comparison of your college resume against ${job.company?.name} ${job.title}.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/resume/builder')}
                leftIcon={<FileText className="w-3.5 h-3.5" />}
              >
                Edit Resume
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/student/resume/analyzer')}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Full Analyzer
              </Button>
            </div>
          </div>

          {/* Strong Skills vs Weak/Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Skills */}
            <Card className="border-emerald-500/30 bg-emerald-950/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm text-emerald-300">Strong</CardTitle>
                    <p className="text-[11px] text-slate-400 mt-0.5">Competencies confirmed on your resume</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Matches JD</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(resumeMatchData?.analysis?.strongSkills || ['DSA', 'C++', 'OOP', 'Distributed Systems']).map(
                    (skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weak / Missing Skills */}
            <Card className="border-rose-500/30 bg-rose-950/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm text-rose-300">Weak / Missing</CardTitle>
                    <p className="text-[11px] text-slate-400 mt-0.5">Keywords & skills absent from your resume</p>
                  </div>
                </div>
                <Badge variant="danger" size="sm">Gaps to Bridge</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(resumeMatchData?.analysis?.missingSkills || ['AWS', 'REST APIs', 'Testing', 'Docker']).map(
                    (skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actionable Tailoring Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <CardTitle className="text-sm">Job-Specific Tailoring Roadmap</CardTitle>
              </div>
              <Badge variant="purple" size="sm">Recommended Additions</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                resumeMatchData?.analysis?.recommendations || [
                  `Incorporate AWS cloud deployment details in your primary projects.`,
                  `Add 1-2 bullet points showcasing REST API performance optimization.`,
                  `Highlight automated testing metrics (e.g. 90%+ code coverage with Jest / JUnit).`,
                ]
              ).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TAB 6: INTERVIEW ================= */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          {/* Direct Mock Interview Launcher */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold">
                <Mic className="w-3 h-3" />
                <span>Phase 6 AI Voice Simulator</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Simulate {job.company?.name || 'Company'} Interview Live
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Step into the AI Interviewer Arena. Practice verbal follow-ups, system trade-offs, and behavioral rounds specifically tailored for {job.title}.
              </p>
            </div>
            <button
              onClick={async () => {
                try {
                  const res = await api.post('/interviews/start', {
                    jobId: job._id,
                    company: job.company?.name || 'Target Company',
                    jobTitle: job.title || 'Software Development Engineer',
                    category: 'Technical',
                    mode: 'voice',
                    recordingConsentGiven: true,
                  });
                  if (res.interview?._id) {
                    navigate(`/student/interview/arena/${res.interview._id}`);
                  }
                } catch (err) {
                  toast.error(err.message || 'Could not start interview');
                }
              }}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition shrink-0"
            >
              <Mic className="w-4 h-4" />
              <span>Launch Live Mock Interview</span>
            </button>
          </div>

          {/* Round-by-Round Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Round Structure & Expectations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.interviewFocus?.map((focus, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-slate-200 leading-relaxed pt-0.5">{focus}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sample Behavioral / Technical Questions */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Sample Questions & Answer Strategies</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prepare your STAR stories (Situation, Task, Action, Result)
                </p>
              </div>
              <Badge variant="warning" size="sm">STAR Method</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.interviewQuestions?.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <Badge variant="info" size="sm">{q.round}</Badge>
                  </div>
                  <h4 className="font-bold text-white text-sm">{q.question}</h4>
                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-[11px] leading-relaxed">
                    💡 <strong>Pro Tip:</strong> {q.tip}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TAB 7: PERFORMANCE ================= */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Personalized Readiness Checklist</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete preparation milestones to achieve 90%+ readiness for {job.company?.name}.
                </p>
              </div>
              <Badge variant="success" size="sm">Overall: {dynamicReadiness}%</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'm-1', label: 'Academic & CGPA verification', detail: `CGPA ${user?.cgpa || 8.8} matches cutoff (≥ ${job.eligibility?.minCgpa || 7.5})` },
                { id: 'm-2', label: 'Complete 5 High-Yield LeetCode Problems', detail: `${solvedProblems.length} of ${totalProblems} problems marked solved` },
                { id: 'm-3', label: 'Review Core OS Concurrency & Deadlocks', detail: 'Flashcards reviewed' },
                { id: 'm-4', label: 'Review Database Indexing (B+ Trees & Transactions)', detail: 'Flashcards reviewed' },
                { id: 'm-5', label: 'Align Resume with Target Keywords', detail: 'ATS keywords checked' },
                { id: 'm-6', label: 'Rehearse 3 STAR Behavioral Stories', detail: 'Ready for leadership round' },
              ].map((item) => {
                const isChecked = completedChecklist.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-600 shrink-0" />
                      )}
                      <div>
                        <h4 className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-slate-200'}`}>
                          {item.label}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.detail}</p>
                      </div>
                    </div>

                    <Badge variant={isChecked ? 'success' : 'neutral'} size="sm">
                      {isChecked ? 'Done' : 'Pending'}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
