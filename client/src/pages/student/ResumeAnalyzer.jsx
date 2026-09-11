import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Layers,
  ArrowRight,
  TrendingUp,
  Zap,
  Clock,
  ShieldCheck,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CircularProgress, ProgressBar } from '../../components/common/Progress';

export const ResumeAnalyzer = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [sourceType, setSourceType] = useState('saved'); // 'saved' or 'custom'
  const [customResumeText, setCustomResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [cachedStatus, setCachedStatus] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        if (res.success && res.jobs) {
          setJobs(res.jobs);
          if (res.jobs.length > 0) {
            setSelectedJobId(res.jobs[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load jobs for resume analyzer:', err);
      }
    };

    fetchJobs();
  }, []);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const payload = {
        jobId: selectedJobId,
      };

      if (sourceType === 'custom' && customResumeText.trim()) {
        payload.resumeText = customResumeText.trim();
      }

      const res = await api.post('/resumes/analyze', payload);
      if (res.success && res.analysis) {
        setAnalysisResult(res.analysis);
        setCachedStatus({
          cached: res.cached,
          latencyMs: res.latencyMs,
          cacheKey: res.analysis.cacheKey,
        });
        toast.success(
          res.cached
            ? `Analyzed instantly from cache (${res.latencyMs}ms)!`
            : `AI JD alignment completed (${res.analysis.matchPercentage}% match)!`
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const selectedJob = jobs.find((j) => j._id === selectedJobId);

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Placement Resume Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
              Job-Specific Resume & ATS Analyzer
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Audit your resume against company job descriptions to reveal exact ATS compatibility, strong skill matches, and weak/missing prerequisites with SHA-256 cached intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/resume/builder')}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Open Resume Builder
            </Button>
          </div>
        </div>
      </div>

      {/* Input Selection Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configure Resume & Target Drive</CardTitle>
          <p className="text-xs text-slate-400">Select which resume and job description to compare</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Job Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Target Placement Drive (JD)
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.company.name} — {job.title} ({job.package})
                  </option>
                ))}
              </select>
            </div>

            {/* Resume Source Radio */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Resume Source
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSourceType('saved')}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    sourceType === 'saved'
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  My College Resume
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('custom')}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    sourceType === 'custom'
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Paste Custom Resume Text
                </button>
              </div>
            </div>
          </div>

          {/* Custom Textarea if selected */}
          {sourceType === 'custom' && (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold block">
                Paste your resume text below:
              </label>
              <textarea
                rows={5}
                value={customResumeText}
                onChange={(e) => setCustomResumeText(e.target.value)}
                placeholder="Paste the text of your resume here (education, technical skills, projects, experience, achievements)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleAnalyze}
              isLoading={analyzing}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Analyze Resume vs {selectedJob?.company?.name || 'Drive'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Score Banner with Caching Badge */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <CircularProgress
                value={analysisResult.matchPercentage || 78}
                size={110}
                strokeWidth={9}
                label="Match"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">
                    JD Match: {analysisResult.matchPercentage}%
                  </h2>
                  {cachedStatus?.cached ? (
                    <Badge variant="purple" size="sm">
                      ⚡ Instant Cache ({cachedStatus.latencyMs}ms)
                    </Badge>
                  ) : (
                    <Badge variant="info" size="sm">
                      Fresh AI Evaluation
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-right shrink-0 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Target Role
              </span>
              <span className="text-sm font-bold text-white block">
                {selectedJob?.company?.name} • {selectedJob?.title}
              </span>
              <span className="text-xs text-emerald-400 font-extrabold block">
                {selectedJob?.package}
              </span>
            </div>
          </div>

          {/* Strong Skills vs Weak/Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Matches */}
            <Card className="border-emerald-500/30 bg-emerald-950/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-emerald-300">Strong Skills</CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">Verified technical competencies matching the JD</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">Verified Match</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(analysisResult.strongSkills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                  <span className="font-bold text-slate-300 block">Candidate Strengths:</span>
                  <ul className="list-disc list-outside pl-4 space-y-1 text-slate-400 text-[11px]">
                    {(analysisResult.strengths || []).map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
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
                    <CardTitle className="text-base text-rose-300">Weak / Missing Skills</CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">High-priority JD requirements absent from resume</p>
                  </div>
                </div>
                <Badge variant="danger" size="sm">Action Required</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(analysisResult.missingSkills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                  <span className="font-bold text-slate-300 block">Identified Gaps:</span>
                  <ul className="list-disc list-outside pl-4 space-y-1 text-slate-400 text-[11px]">
                    {(analysisResult.weaknesses || []).map((weak, i) => (
                      <li key={i}>{weak}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 6-Dimensional ATS & Content Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <Card className="p-3.5 text-center space-y-1">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">ATS Score</span>
              <span className="text-indigo-400 font-black text-xl">{analysisResult.atsScore}%</span>
              <span className="text-[10px] text-slate-500 block">Parser parsing</span>
            </Card>

            <Card className="p-3.5 text-center space-y-1">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Formatting</span>
              <span className="text-emerald-400 font-black text-xl">{analysisResult.formattingScore}%</span>
              <span className="text-[10px] text-slate-500 block">College standard</span>
            </Card>

            <Card className="p-3.5 text-center space-y-1">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Skills Density</span>
              <span className="text-amber-400 font-black text-xl">{analysisResult.matchPercentage}%</span>
              <span className="text-[10px] text-slate-500 block">Keyword match</span>
            </Card>

            <Card className="p-3.5 text-center space-y-1">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Projects Depth</span>
              <span className="text-white font-black text-xl">{analysisResult.projectsScore || 85}%</span>
              <span className="text-[10px] text-slate-500 block">Tech architecture</span>
            </Card>

            <Card className="p-3.5 text-center space-y-1">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Achievements</span>
              <span className="text-emerald-400 font-black text-xl">{analysisResult.achievementsScore || 88}%</span>
              <span className="text-[10px] text-slate-500 block">Quantified ranks</span>
            </Card>

            <Card className="p-3.5 text-center space-y-1">
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Action Verbs</span>
              <span className="text-indigo-400 font-black text-xl">{analysisResult.contentQualityScore || 82}%</span>
              <span className="text-[10px] text-slate-500 block">Impact wording</span>
            </Card>
          </div>

          {/* Actionable Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <CardTitle className="text-sm">Actionable Resume Optimization Roadmap</CardTitle>
              </div>
              <Badge variant="purple" size="sm">Tailored for {selectedJob?.company?.name}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {(analysisResult.recommendations || []).map((rec, idx) => (
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
    </div>
  );
};
