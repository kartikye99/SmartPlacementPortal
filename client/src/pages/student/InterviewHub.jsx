import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MessageSquare,
  Sparkles,
  Play,
  Clock,
  Award,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Bot,
  Brain,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../context/ThemeContext';

export default function InterviewHub() {
  const navigate = useNavigate();
  const { activeTheme } = useTheme();

  // Launcher Form State
  const [company, setCompany] = useState('Amazon');
  const [jobTitle, setJobTitle] = useState('Software Development Engineer');
  const [category, setCategory] = useState('Technical');
  const [mode, setMode] = useState('voice');
  const [recordingConsent, setRecordingConsent] = useState(true);
  const [starting, setStarting] = useState(false);

  // History & Statistics
  const [interviews, setInterviews] = useState([]);
  const [improvementData, setImprovementData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Available Companies
  const companies = [
    { name: 'Amazon', role: 'SDE-1 (Systems & Distributed)' },
    { name: 'Google', role: 'Software Engineer (Algorithms & System Design)' },
    { name: 'Microsoft', role: 'Software Development Engineer' },
    { name: 'Goldman Sachs', role: 'Analyst / Tech Division' },
    { name: 'General Technical Mock', role: 'Core CS & Fullstack Engineering' },
  ];

  const categories = [
    {
      id: 'Technical',
      title: 'Technical & System Architecture',
      desc: 'Distributed caching, concurrency, DB indexing, microservices, scaling trade-offs.',
      icon: '⚙️',
    },
    {
      id: 'DSA',
      title: 'Data Structures & Algorithms',
      desc: 'Graph traversals, Dynamic Programming, tree paths, heaps, and complexity analysis.',
      icon: '🌲',
    },
    {
      id: 'Core CS',
      title: 'Core Computer Science',
      desc: 'OS context switching, deadlocks, TCP 3-way handshake, ACID transactions, B+ trees.',
      icon: '💻',
    },
    {
      id: 'HR & Behavioral',
      title: 'HR & Behavioral (STAR Method)',
      desc: 'Conflict resolution, leadership principles, tight delivery deadlines, culture fit.',
      icon: '🤝',
    },
    {
      id: 'Comprehensive',
      title: 'Comprehensive Bar Raiser',
      desc: 'Full-spectrum simulation across technical, algorithmic, and leadership competencies.',
      icon: '🎯',
    },
  ];

  // Fetch Interview History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const [historyRes, improvementRes] = await Promise.all([
          api.get('/interviews'),
          api.get('/interviews/analytics/improvement').catch(() => null),
        ]);
        if (historyRes?.interviews) {
          setInterviews(historyRes.interviews);
        }
        if (improvementRes?.success) {
          setImprovementData(improvementRes);
        }
      } catch (err) {
        console.warn('Could not load interview history:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Launch New Interview Session
  const handleStartInterview = async () => {
    try {
      setStarting(true);
      const res = await api.post('/interviews/start', {
        company,
        jobTitle,
        category,
        mode,
        recordingConsentGiven: recordingConsent,
      });

      if (res.interview?._id) {
        navigate(`/student/interview/arena/${res.interview._id}`);
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert(err.message || 'Failed to start interview session');
    } finally {
      setStarting(false);
    }
  };

  // Compute Metrics
  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const avgScore = completedInterviews.length > 0
    ? Math.round(
        completedInterviews.reduce((acc, i) => acc + (i.feedback?.overallScore || 75), 0) /
          completedInterviews.length
      )
    : 0;
  const totalSeconds = completedInterviews.reduce((acc, i) => acc + (i.durationSeconds || 0), 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl border p-8 shadow-2xl backdrop-blur-xl transition-all duration-500"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          boxShadow: 'var(--theme-shadow), var(--theme-glow)',
        }}
      >
        <div className="absolute inset-0 z-0 opacity-35 overflow-hidden transition-all duration-700">
          <img
            key={activeTheme?.id || 'midnight'}
            src={activeTheme?.assets?.interview || '/themes/midnight/interview.svg'}
            alt={`${activeTheme?.name || 'Theme'} Interview Artwork`}
            className="w-full h-full object-cover object-center"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, var(--theme-background) 0%, color-mix(in srgb, var(--theme-background) 80%, transparent) 60%, transparent 100%)'
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

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
              style={{
                backgroundColor: 'var(--theme-badge-bg)',
                color: 'var(--theme-badge-text)',
                borderColor: 'var(--theme-badge-border)',
              }}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Mock Interview & Live Voice Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
              AI Interview Simulator & Live Voice Arena
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Practice rigorous technical, DSA, Core CS, and behavioral rounds with realistic AI interviewers.
              Experience real-time voice conversations with dynamic adaptive follow-ups and instant performance scoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center shadow-lg">
              <span className="text-xs text-slate-400 block font-medium">Average Score</span>
              <span className="text-2xl font-black text-indigo-400 font-mono">
                {avgScore > 0 ? `${avgScore}%` : 'N/A'}
              </span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center shadow-lg">
              <span className="text-xs text-slate-400 block font-medium">Completed Mocks</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {completedInterviews.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Launcher Setup + Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ============================================================
            INTERVIEW LAUNCHER CONFIGURATION
           ============================================================ */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Configure Your Interview Session</h2>
            </div>

            {/* 1. Target Company Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                1. Select Target Company & Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {companies.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setCompany(c.name);
                      setJobTitle(c.role);
                    }}
                    className={`p-3 rounded-2xl border text-left transition ${
                      company === c.name
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-sm text-white">{c.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">{c.role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Round Category Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                2. Select Interview Category
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                      category === cat.id
                        ? 'bg-gradient-to-r from-indigo-950/50 to-slate-900 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{cat.title}</span>
                        {category === cat.id && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Interaction Mode: Live Voice vs Text */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                3. Interview Interaction Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('voice')}
                  className={`p-4 rounded-2xl border text-center transition ${
                    mode === 'voice'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/30 flex items-center justify-center mx-auto mb-2 text-indigo-300">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-white">Live Voice Mode</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Realtime speech synthesis & microphone recognition
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('text')}
                  className={`p-4 rounded-2xl border text-center transition ${
                    mode === 'text'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-2 text-cyan-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-white">Text Simulator</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Interactive typed chat with structured follow-ups
                  </p>
                </button>
              </div>
            </div>

            {/* 4. Audio Recording Consent */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordingConsent}
                  onChange={(e) => setRecordingConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                />
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Consent to record session audio for playback & AI evaluation
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Audio is stored locally for session playback and question review. You can download the recording after concluding the interview.
                  </p>
                </div>
              </label>
            </div>

            {/* Launch Action */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartInterview}
              disabled={starting}
              className="w-full py-4 text-base font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {starting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Preparing AI Stage...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Mock Interview</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ============================================================
            INTERVIEW HISTORY & PERFORMANCE TRACKER
           ============================================================ */}
        <div className="lg:col-span-5 space-y-6">
          {/* Historical Improvement Trajectory (Phase 7 Deliverable) */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Improvement Trajectory</h3>
              </div>
              <Badge variant="purple" size="xs">Score Velocity</Badge>
            </div>

            {improvementData?.trajectory?.length > 0 ? (
              <div className="space-y-4">
                {/* Horizontal Progress Curve */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {improvementData.trajectory.map((step, idx) => (
                      <React.Fragment key={step.id || idx}>
                        <div
                          onClick={() => navigate(`/student/interview/analysis/${step.id}`)}
                          className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition text-center shrink-0 min-w-[96px]"
                        >
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {step.label}
                          </span>
                          <span className="text-base font-extrabold text-white font-mono block mt-0.5">
                            {step.score}%
                          </span>
                          {step.delta !== null && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full inline-block mt-0.5 ${
                                step.delta >= 0
                                  ? 'text-emerald-400 bg-emerald-950/60'
                                  : 'text-rose-400 bg-rose-950/60'
                              }`}
                            >
                              {step.delta >= 0 ? `+${step.delta}%` : `${step.delta}%`}
                            </span>
                          )}
                        </div>

                        {idx < improvementData.trajectory.length - 1 && (
                          <div className="text-slate-600 font-bold text-xs shrink-0">→</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Active Weakness Radar Pills */}
                {improvementData.weaknessRadar?.critical?.length > 0 && (
                  <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-xs">
                    <span className="font-bold text-rose-300 block mb-1 text-[11px] uppercase tracking-wider">
                      🔴 Critical Priority Focus:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {improvementData.weaknessRadar.critical.map((w, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-900 border border-rose-900/60 text-rose-200 text-[11px]"
                        >
                          {w.topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete multiple interviews to unlock your chronological score trajectory (e.g. <em>Interview 1: 71% → Interview 2: 77% → Interview 3: 84%</em>).
              </p>
            )}
          </div>

          {/* Quick Stats Widget */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              Readiness & Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">Total Practice Time</span>
                <div className="text-xl font-bold text-white mt-1 font-mono">{totalMinutes} Mins</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">Top Competency</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">Technical</div>
              </div>
            </div>
          </div>

          {/* Past Sessions List */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Past Mock Sessions</h3>
              </div>
              <span className="text-xs text-slate-400">{interviews.length} Total</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
                Loading session history...
              </div>
            ) : interviews.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-400 text-xs">
                No mock interviews recorded yet. Launch your first session to receive multidimensional AI evaluation and feedback!
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                {interviews.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition flex items-center justify-between group"
                  >
                    <div
                      onClick={() => navigate(`/student/interview/arena/${item._id}`)}
                      className="cursor-pointer flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white group-hover:text-indigo-400 transition">
                          {item.company}
                        </span>
                        <Badge variant="indigo" size="xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{item.mode === 'voice' ? '🎙️ Voice' : '⌨️ Text'}</span>
                        <span>•</span>
                        <span>{Math.round((item.durationSeconds || 0) / 60)} mins</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.feedback?.overallScore ? (
                        <>
                          <button
                            onClick={() => navigate(`/student/interview/analysis/${item._id}`)}
                            className="px-2.5 py-1 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-bold text-indigo-300 font-mono transition"
                            title="View Deep Analysis & Weakness Radar"
                          >
                            {item.feedback.overallScore}%
                          </button>
                          <button
                            onClick={() => navigate(`/student/interview/analysis/${item._id}`)}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline hidden sm:inline"
                          >
                            Analysis
                          </button>
                        </>
                      ) : (
                        <Badge variant="amber" size="xs">
                          In Progress
                        </Badge>
                      )}
                      <ChevronRight
                        onClick={() => navigate(`/student/interview/arena/${item._id}`)}
                        className="w-4 h-4 text-slate-600 group-hover:text-white cursor-pointer transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
