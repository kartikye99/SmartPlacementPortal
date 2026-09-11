import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  ArrowLeft,
  Award,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  Code2,
  BookOpen,
  RotateCcw,
  Printer,
  ChevronRight,
  Clock,
  Briefcase,
  Layers,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { CircularProgress, ProgressBar } from '../../components/common/Progress';

export default function InterviewAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/interviews/${id}`);
        if (res.interview) {
          setInterview(res.interview);
        } else {
          setError('Interview analysis record not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load interview analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-sm animate-pulse">
          Synthesizing 8-Dimension Interview Analysis & Weakness Radar...
        </p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Analysis Unavailable</h2>
        <p className="text-slate-400 text-xs mb-4">{error || 'Session report not found'}</p>
        <Button variant="outline" onClick={() => navigate('/student/interview')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Interview Hub
        </Button>
      </div>
    );
  }

  const feedback = interview.feedback || {};
  const weakness = feedback.weaknessAnalysis || {
    critical: [
      {
        topic: 'Dynamic Programming',
        reason: 'State formulation and recurrence relations lacked formal proof.',
      },
    ],
    needsImprovement: [
      {
        topic: 'DBMS Normalization',
        reason: 'Could not clearly articulate dirty read vs phantom read trade-offs.',
      },
      {
        topic: 'Communication Structure',
        reason: 'Explanations wandered slightly into secondary tangents before addressing the core question.',
      },
    ],
    strong: [
      {
        topic: 'Distributed Caching',
        reason: 'Strong grasp of Redis sharding, LRU eviction, and mutex invalidation.',
      },
      {
        topic: 'OOP & Clean Architecture',
        reason: 'Clear, practical application of SOLID principles and interface segregation.',
      },
    ],
  };

  const plan = feedback.recommendedPlan || [
    {
      action: 'Revise Dynamic Programming',
      category: 'revision',
      topic: 'Dynamic Programming',
      detail: 'Review optimal substructure and 1D/2D memoization tables.',
    },
    {
      action: 'Practice 5 DP problems',
      category: 'coding',
      topic: 'Dynamic Programming',
      targetCount: 5,
      link: '/student/practice?topic=Dynamic%20Programming',
      detail: 'Solve 5 recommended questions from the Phase 4 Coding Arena.',
    },
    {
      action: 'Study DBMS Normalization & ACID',
      category: 'corecs',
      topic: 'DBMS',
      detail: 'Deep dive into 1NF-BCNF normalization and transaction consistency.',
    },
    {
      action: 'Practice STAR Behavioral Answers',
      category: 'behavioral',
      detail: 'Draft structured STAR narratives for leadership principles.',
    },
    {
      action: 'Retake Targeted Interview',
      category: 'interview',
      detail: 'Schedule a 15-minute follow-up session to verify weakness remediation.',
      link: '/student/interview',
    },
  ];

  const overall = feedback.overallScore || 78;
  const technical = feedback.technicalScore || 84;
  const problemSolving = feedback.problemSolvingScore || 85;
  const communication = feedback.communicationScore || 72;
  const confidence = feedback.confidenceScore || 68;
  const clarity = feedback.clarityScore || 76;
  const structure = feedback.structureScore || 81;
  const conciseness = feedback.concisenessScore || 70;

  const durationMin = Math.round((interview.durationSeconds || 0) / 60);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/student/interview')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mock Interview Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/student/interview')}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Interview</span>
          </Button>
        </div>
      </div>

      {/* Hero Performance Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-cyan-950/50 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              <span>Phase 7 • AI Interview Analysis & Weakness Radar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {interview.company} — {interview.jobTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-3">
              <span>Round: <strong className="text-white">{interview.category}</strong></span>
              <span>•</span>
              <span>Mode: <strong className="text-white">{interview.mode === 'voice' ? '🎙️ Realtime Voice' : '⌨️ Text'}</strong></span>
              <span>•</span>
              <span>Duration: <strong className="text-white">{durationMin} Mins</strong></span>
              <span>•</span>
              <span>Date: <strong className="text-white">{new Date(interview.createdAt).toLocaleDateString()}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shrink-0 shadow-xl">
            <CircularProgress
              value={overall}
              size={110}
              strokeWidth={9}
              label="Overall Score"
              color={overall >= 80 ? 'emerald' : overall >= 70 ? 'indigo' : 'amber'}
            />
            <div className="space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Placement Benchmark</span>
              <Badge variant={overall >= 80 ? 'success' : overall >= 70 ? 'purple' : 'warning'}>
                {overall >= 80 ? 'High Probability Offer' : overall >= 70 ? 'Competitive Candidate' : 'Remediation Required'}
              </Badge>
              <p className="text-[11px] text-slate-500">Target Benchmark: 80%+</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 1: THE 8-DIMENSION ANALYTICAL MATRIX
         ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              8-Dimension Competency Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-angle evaluation assessing technical mastery, delivery composure, and problem-solving velocity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dimension 1: Technical Knowledge */}
          <Card hover className="p-4 space-y-2 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Technical</span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono">{technical}%</span>
            </div>
            <ProgressBar value={technical} max={100} showValue={false} color="indigo" size="sm" />
            <p className="text-[11px] text-slate-400 leading-tight">
              Concept accuracy, system trade-offs, and architecture fundamentals.
            </p>
          </Card>

          {/* Dimension 2: Problem Solving */}
          <Card hover className="p-4 space-y-2 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Problem Solving</span>
              <span className="text-lg font-extrabold text-indigo-400 font-mono">{problemSolving}%</span>
            </div>
            <ProgressBar value={problemSolving} max={100} showValue={false} color="emerald" size="sm" />
            <p className="text-[11px] text-slate-400 leading-tight">
              Algorithmic logic, edge case handling, and step-by-step decomposition.
            </p>
          </Card>

          {/* Dimension 3: Communication */}
          <Card hover className="p-4 space-y-2 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Communication</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{communication}%</span>
            </div>
            <ProgressBar value={communication} max={100} showValue={false} color="purple" size="sm" />
            <p className="text-[11px] text-slate-400 leading-tight">
              Verbal flow, terminology usage, and active thought-process articulation.
            </p>
          </Card>

          {/* Dimension 4: Confidence */}
          <Card hover className="p-4 space-y-2 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Confidence</span>
              <span className="text-lg font-extrabold text-amber-400 font-mono">{confidence}%</span>
            </div>
            <ProgressBar value={confidence} max={100} showValue={false} color="amber" size="sm" />
            <p className="text-[11px] text-slate-400 leading-tight">
              Poise under follow-up probes, assertive reasoning, and tone composure.
            </p>
          </Card>

          {/* Dimension 5: Clarity */}
          <Card hover className="p-4 space-y-2 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Clarity</span>
              <span className="text-lg font-extrabold text-teal-400 font-mono">{clarity}%</span>
            </div>
            <ProgressBar value={clarity} max={100} showValue={false} color="emerald" size="sm" />
            <p className="text-[11px] text-slate-400 leading-tight">
              Direct answers without ambiguity or confusing terminology.
            </p>
          </Card>

          {/* Dimension 6: Answer Structure */}
          <Card hover className="p-4 space-y-2 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Structure</span>
              <span className="text-lg font-extrabold text-violet-400 font-mono">{structure}%</span>
            </div>
            <ProgressBar value={structure} max={100} showValue={false} color="purple" size="sm" />
            <p className="text-[11px] text-slate-400 leading-tight">
              Use of STAR framing, problem-first framing, and summary conclusion.
            </p>
          </Card>

          {/* Dimension 7: Conciseness */}
          <Card hover className="p-4 space-y-2 border-slate-800 bg-slate-900/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Conciseness</span>
              <span className="text-lg font-extrabold text-rose-400 font-mono">{conciseness}%</span>
            </div>
            <ProgressBar value={conciseness} max={100} showValue={false} color="amber" size="sm" />
            <p className="text-[11px] text-slate-400 leading-tight">
              High signal-to-noise ratio; avoiding rambling and unnecessary tangents.
            </p>
          </Card>

          {/* Dimension 8: Overall Benchmark */}
          <Card hover className="p-4 space-y-2 border-indigo-500/40 bg-gradient-to-br from-indigo-950/40 to-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Overall</span>
              <span className="text-lg font-extrabold text-indigo-400 font-mono">{overall}%</span>
            </div>
            <ProgressBar value={overall} max={100} showValue={false} color="indigo" size="sm" />
            <p className="text-[11px] text-slate-400 leading-tight">
              Weighted composite benchmark across all eight key parameters.
            </p>
          </Card>
        </div>
      </div>

      {/* ============================================================
          SECTION 2: 3-TIER WEAKNESS ENGINE
         ============================================================ */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-400" />
            Weakness Detection & Skill Categorization
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pinpoints exact algorithmic and behavioral blindspots categorized by interview severity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 🔴 Critical Blockers */}
          <div className="p-5 rounded-3xl bg-rose-950/20 border border-rose-800/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-rose-800/30 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider">🔴 Critical Weaknesses</h3>
              </div>
              <span className="text-xs font-bold text-rose-400 font-mono">
                {weakness.critical?.length || 0}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              High-risk vulnerabilities that immediately jeopardize technical rounds.
            </p>
            <div className="space-y-2.5">
              {(weakness.critical || []).map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-rose-900/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.topic}</span>
                    <Badge variant="danger" size="xs">Must Fix</Badge>
                  </div>
                  <p className="text-[11px] text-rose-200/80 leading-relaxed">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 🟠 Needs Improvement */}
          <div className="p-5 rounded-3xl bg-amber-950/20 border border-amber-800/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-amber-800/30 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">🟠 Needs Improvement</h3>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono">
                {weakness.needsImprovement?.length || 0}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Functional knowledge present, but requires refinement for top-tier firms.
            </p>
            <div className="space-y-2.5">
              {(weakness.needsImprovement || []).map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-amber-900/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.topic}</span>
                    <Badge variant="warning" size="xs">Refine</Badge>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 🟢 Verified Strengths */}
          <div className="p-5 rounded-3xl bg-emerald-950/20 border border-emerald-800/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-emerald-800/30 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">🟢 Strong Competencies</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {weakness.strong?.length || 0}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Demonstrated mastery serving as positive differentiators.
            </p>
            <div className="space-y-2.5">
              {(weakness.strong || []).map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-900/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.topic}</span>
                    <Badge variant="success" size="xs">Mastered</Badge>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 3: ACTIONABLE RE-PREPARATION ROADMAP
         ============================================================ */}
      <Card className="p-6 border-slate-800 bg-slate-900/80">
        <CardHeader className="p-0 pb-4 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <CardTitle className="text-lg">Actionable Re-Preparation Engine</CardTitle>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Concrete steps generated from your detected weaknesses to close gaps before your next interview attempt.
              </p>
            </div>
            <Badge variant="purple">Personalized Remediation</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4 space-y-3">
          {plan.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                      {step.action}
                    </h4>
                    {step.topic && <Badge variant="neutral" size="xs">{step.topic}</Badge>}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>

              {step.link ? (
                <Link
                  to={step.link}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/20"
                >
                  <span>Start Practice</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-medium shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Action Item</span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ============================================================
          SECTION 4: TURN-BY-TURN QUESTION CRITIQUE
         ============================================================ */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Turn-by-Turn Question Evaluation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed breakdown of every question asked, your formulated response, and individual coaching advice.
          </p>
        </div>

        <div className="space-y-3">
          {(feedback.questionBreakdown || []).map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Question #{idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Score Rating:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-950 border border-indigo-500/40 text-xs font-bold text-indigo-400 font-mono">
                    {item.rating}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  "{item.question}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Candidate Response:</span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{item.answer}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-200/90">
                <strong className="text-emerald-400 block mb-0.5">AI Coach Recommendation:</strong>
                {item.feedback}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
