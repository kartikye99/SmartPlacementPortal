import React, { useState, useEffect } from 'react';
import {
  Code2,
  Search,
  Filter,
  CheckSquare,
  Square,
  ExternalLink,
  Flame,
  Award,
  Sparkles,
  Building2,
  Layers,
  ChevronRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/Progress';
import { SkeletonCard } from '../../components/common/Skeleton';
import { useTheme } from '../../context/ThemeContext';

const COMPANIES = [
  'All Companies',
  'Amazon',
  'Google',
  'Microsoft',
  'Goldman Sachs',
  'Meta',
  'Apple',
  'Uber',
];

const TOPICS = [
  'All Topics',
  'Graphs',
  'Trees',
  'Dynamic Programming',
  'Arrays & Strings',
  'Heap / Priority Queue',
  'Linked List',
  'Trie',
  'Recursion & Backtracking',
];

export const CodingArena = () => {
  const toast = useToast();
  const { activeTheme } = useTheme();

  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All Companies');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCompany !== 'All Companies') queryParams.append('company', selectedCompany);
      if (selectedTopic !== 'All Topics') queryParams.append('topic', selectedTopic);
      if (selectedDifficulty !== 'all') queryParams.append('difficulty', selectedDifficulty);
      if (selectedPlatform !== 'all') queryParams.append('platform', selectedPlatform);
      if (selectedStatus !== 'all') queryParams.append('status', selectedStatus);
      if (search.trim()) queryParams.append('search', search.trim());

      const [qRes, statsRes] = await Promise.all([
        api.get(`/questions?${queryParams.toString()}`),
        api.get('/questions/stats'),
      ]);

      if (qRes.success) setQuestions(qRes.questions || []);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 250);
    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCompany, selectedTopic, selectedDifficulty, selectedPlatform, selectedStatus]);

  const handleToggleSolve = async (questionId) => {
    // Optimistic UI update
    setQuestions((prev) =>
      prev.map((q) => (q._id === questionId ? { ...q, isSolved: !q.isSolved } : q))
    );

    try {
      const res = await api.post(`/questions/${questionId}/toggle-solve`);
      if (res.success) {
        toast.success(res.message);
        // Refresh global stats
        const statsRes = await api.get('/questions/stats');
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err) {
      // Revert optimistic update
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, isSolved: !q.isSolved } : q))
      );
      toast.error('Could not update status');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCompany('All Companies');
    setSelectedTopic('All Topics');
    setSelectedDifficulty('all');
    setSelectedPlatform('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Header Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-2xl backdrop-blur-xl transition-all duration-500"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          boxShadow: 'var(--theme-shadow), var(--theme-glow)',
        }}
      >
        <div className="absolute inset-0 z-0 opacity-30 overflow-hidden transition-all duration-700">
          <img
            key={activeTheme?.id || 'midnight'}
            src={activeTheme?.assets?.prepare || '/themes/midnight/prepare.svg'}
            alt=""
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border"
              style={{
                backgroundColor: 'var(--theme-badge-bg)',
                color: 'var(--theme-badge-text)',
                borderColor: 'var(--theme-badge-border)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Placement Coding Intelligence Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
              Company-Specific <span className="text-gradient-aurora">Coding Arena</span> 💻
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Master algorithmic patterns frequently asked in technical interviews at Amazon, Google, Microsoft, and Goldman Sachs. Verified LeetCode & GeeksforGeeks problems.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchData}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Stats Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hover className="p-4 space-y-2 border-violet-500/20 bg-gradient-to-b from-violet-950/20 to-[#0b0f19]/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Solved</span>
              <Badge variant="violet" size="sm">Overall</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{stats.totalSolved}</span>
              <span className="text-xs text-slate-400">/ {stats.totalQuestions} questions</span>
            </div>
            <ProgressBar value={stats.completionRate} variant="default" size="sm" />
            <span className="text-[10px] text-violet-300 font-semibold">{stats.completionRate}% Mastery Rate</span>
          </Card>

          <Card hover className="p-4 space-y-2 border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-[#0b0f19]/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Easy Problems</span>
              <Badge variant="success" size="sm">Foundations</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{stats.difficulty.easy.solved}</span>
              <span className="text-xs text-slate-400">/ {stats.difficulty.easy.total} solved</span>
            </div>
            <ProgressBar
              value={Math.round((stats.difficulty.easy.solved / Math.max(1, stats.difficulty.easy.total)) * 100)}
              variant="success"
              size="sm"
            />
            <span className="text-[10px] text-slate-400 font-medium">Speed & warm-up rounds</span>
          </Card>

          <Card hover className="p-4 space-y-2 border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-[#0b0f19]/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Medium Problems</span>
              <Badge variant="warning" size="sm">High Yield</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">{stats.difficulty.medium.solved}</span>
              <span className="text-xs text-slate-400">/ {stats.difficulty.medium.total} solved</span>
            </div>
            <ProgressBar
              value={Math.round((stats.difficulty.medium.solved / Math.max(1, stats.difficulty.medium.total)) * 100)}
              variant="warning"
              size="sm"
            />
            <span className="text-[10px] text-amber-300 font-medium">Primary OA & Technical benchmark</span>
          </Card>

          <Card hover className="p-4 space-y-2 border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-[#0b0f19]/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hard Problems</span>
              <Badge variant="danger" size="sm">Tier-1 Dream</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-400">{stats.difficulty.hard.solved}</span>
              <span className="text-xs text-slate-400">/ {stats.difficulty.hard.total} solved</span>
            </div>
            <ProgressBar
              value={Math.round((stats.difficulty.hard.solved / Math.max(1, stats.difficulty.hard.total)) * 100)}
              variant="danger"
              size="sm"
            />
            <span className="text-[10px] text-rose-300 font-medium">Advanced graph & DP edge cases</span>
          </Card>
        </div>
      )}

      {/* Quick Company Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 shrink-0">Company Filters:</span>
        {COMPANIES.map((comp) => (
          <button
            key={comp}
            onClick={() => setSelectedCompany(comp)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
              selectedCompany === comp
                ? 'bg-gradient-to-r from-violet-600 to-rose-600 text-white border-white/20 shadow-md shadow-violet-500/25'
                : 'bg-white/[0.03] text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {comp}
          </button>
        ))}
      </div>

      {/* Search & Comprehensive Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by title, concept or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Topic */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Difficulty */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Platform */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Platforms</option>
            <option value="LeetCode">LeetCode</option>
            <option value="GeeksforGeeks">GeeksforGeeks</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="unsolved">Unsolved Only</option>
            <option value="solved">Solved Only</option>
          </select>

          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* Questions Results */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <Code2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No questions matched your filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting company, topic, or difficulty settings to explore the rest of the problem bank.
          </p>
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-900/40 border-b border-slate-800">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <span>Problem Catalog ({questions.length})</span>
                {selectedCompany !== 'All Companies' && (
                  <Badge variant="purple" size="sm">
                    {selectedCompany} High-Yield
                  </Badge>
                )}
              </CardTitle>
              <span className="text-xs text-slate-400">
                {questions.filter((q) => q.isSolved).length} solved in view
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-800/80">
            {questions.map((q, idx) => (
              <div
                key={q._id}
                onClick={() => handleToggleSolve(q._id)}
                className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  q.isSolved ? 'bg-emerald-950/15 text-emerald-300' : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-bold text-slate-500 w-6 shrink-0 text-center">
                    {idx + 1}.
                  </span>

                  <div className="shrink-0">
                    {q.isSolved ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm font-bold truncate ${
                          q.isSolved ? 'line-through opacity-75' : 'text-white'
                        }`}
                      >
                        {q.title}
                      </h4>
                      {q.frequency >= 90 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                          🔥 {q.frequency}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span>{(q.topics || []).join(', ')}</span>
                      <span>•</span>
                      <span className="text-indigo-400">
                        {(q.companies || []).slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      q.platform === 'LeetCode'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {q.platform}
                  </span>

                  <Badge
                    variant={
                      q.difficulty === 'Hard'
                        ? 'danger'
                        : q.difficulty === 'Medium'
                        ? 'warning'
                        : 'success'
                    }
                    size="sm"
                  >
                    {q.difficulty}
                  </Badge>

                  <a
                    href={q.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
                    title={`Open ${q.title} on ${q.platform}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
