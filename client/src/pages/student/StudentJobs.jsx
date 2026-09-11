import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/Skeleton';

export const StudentJobs = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [minPackage, setMinPackage] = useState('');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications/my'),
      ]);

      if (jobsRes.success) setJobs(jobsRes.jobs || []);
      if (appsRes.success) setApplications(appsRes.applications || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to check eligibility
  const evaluateEligibility = (job) => {
    if (!user) return { isEligible: false, reasons: ['Log in required'] };
    const elig = job.eligibility || {};
    const checks = [
      {
        label: `Minimum CGPA ≥ ${elig.minCgpa || 7.0}`,
        passed: Number(user.cgpa || 0) >= Number(elig.minCgpa || 7.0),
        detail: `Your CGPA: ${user.cgpa || 0}`,
      },
      {
        label: `Eligible Branches (${(elig.allowedBranches || []).length} approved)`,
        passed: (elig.allowedBranches || []).some(
          (b) => b.toLowerCase().trim() === (user.department || '').toLowerCase().trim()
        ),
        detail: `Your branch: ${user.department || 'Not specified'}`,
      },
      {
        label: `Graduating Batch (${(elig.eligibleBatches || [2026]).join(', ')})`,
        passed: (elig.eligibleBatches || [2026]).includes(Number(user.graduationYear || 2026)),
        detail: `Your batch: ${user.graduationYear || 2026}`,
      },
      {
        label: `Backlog Limit (Max ${elig.maxBacklogs || 0})`,
        passed: Number(user.backlogs || 0) <= Number(elig.maxBacklogs || 0),
        detail: `Your backlogs: ${user.backlogs || 0}`,
      },
    ];

    const isEligible = checks.every((c) => c.passed);
    return { isEligible, checks };
  };

  const isAlreadyApplied = (jobId) => {
    return applications.some((a) => a.jobId === jobId || a.job?._id === jobId);
  };

  const getApplicationForJob = (jobId) => {
    return applications.find((a) => a.jobId === jobId || a.job?._id === jobId);
  };

  const handleApply = async (job) => {
    try {
      setApplying(true);
      const res = await api.post('/applications/apply', { jobId: job._id });
      if (res.success) {
        toast.success(`Application submitted to ${job.company.name}!`);
        // Refresh apps
        const appsRes = await api.get('/applications/my');
        if (appsRes.success) setApplications(appsRes.applications || []);
        setSelectedJob(null);
      }
    } catch (err) {
      toast.error(err.message || 'Could not submit application');
    } finally {
      setApplying(false);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const q = debouncedSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.name.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);

    const matchesBranch =
      selectedBranch === 'all' ||
      job.eligibility?.allowedBranches?.some((b) =>
        b.toLowerCase().includes(selectedBranch.toLowerCase())
      );

    const matchesPackage =
      !minPackage || (job.packageLpa || 0) >= Number(minPackage);

    const { isEligible } = evaluateEligibility(job);
    const matchesEligibility = !onlyEligible || isEligible;

    return matchesSearch && matchesBranch && matchesPackage && matchesEligibility;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Batch of 2026 Campus Placement Drives</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
            Explore Placement Drives
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Discover verified corporate recruitment drives with real-time academic eligibility screening.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/student/applications')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Track My Applications ({applications.length})
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company, job title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Academic Branches</option>
              <option value="Computer Science">Computer Science & Engg</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={minPackage}
              onChange={(e) => setMinPackage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Any Compensation</option>
              <option value="20">20+ LPA (Tier-1)</option>
              <option value="25">25+ LPA (Super Dream)</option>
              <option value="30">30+ LPA (Marquee)</option>
            </select>
          </div>
        </div>

        {/* Toggle: Only Eligible For Me */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold select-none">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span>Show drives matching my profile eligibility only</span>
          </label>
          <span className="text-slate-500">
            Showing <strong className="text-white">{filteredJobs.length}</strong> of {jobs.length} drives
          </span>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-3xl p-8">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white">No Matching Placement Drives</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, branch filters, or package threshold.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setSelectedBranch('all');
              setMinPackage('');
              setOnlyEligible(false);
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const { isEligible } = evaluateEligibility(job);
            const applied = isAlreadyApplied(job._id);
            const userApp = getApplicationForJob(job._id);
            const daysLeft = Math.ceil(
              (new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={job._id}
                className="glass-panel card-area-jobs rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
              >
                <div>
                  {/* Top Company & Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/25 to-purple-500/25 border border-indigo-500/40 flex items-center justify-center text-lg font-black text-indigo-200 shadow-md shadow-indigo-500/10 shrink-0">
                        {job.company.logo || job.company.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                          {job.company.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">{job.company.industry}</p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        applied
                          ? 'jobs'
                          : isEligible
                          ? 'success'
                          : 'warning'
                      }
                      size="sm"
                      dot={applied}
                    >
                      {applied ? `Applied (${userApp?.status || 'In Review'})` : isEligible ? 'Eligible' : 'Ineligible'}
                    </Badge>
                  </div>

                  {/* Role Title & CTC */}
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-black text-slate-100 group-hover:text-white transition-colors">{job.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                        <Award className="w-3.5 h-3.5" />
                        {job.package}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Criteria snippet */}
                  <div className="p-3 rounded-2xl bg-[#090d19]/80 border border-white/5 text-[11px] space-y-1.5 mb-4 shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Min CGPA:</span>
                      <span className="text-white font-bold">{job.eligibility?.minCgpa || 7.0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Openings:</span>
                      <span className="text-white font-bold">{job.openings || 10} positions</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Allowed Backlogs:</span>
                      <span className="text-white font-bold">{job.eligibility?.maxBacklogs || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Deadline & Action */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className={`w-3.5 h-3.5 ${daysLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                    <span className={daysLeft <= 3 ? 'text-rose-300 font-bold' : 'text-slate-400'}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Closes today'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ai"
                      size="sm"
                      onClick={() => navigate(`/student/prepare/${job._id}`)}
                      leftIcon={<Sparkles className="w-3.5 h-3.5 text-fuchsia-200" />}
                    >
                      Prepare with AI
                    </Button>
                    <Button
                      variant={applied ? 'secondary' : isEligible ? 'jobs' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedJob(job)}
                    >
                      {applied ? 'Status' : 'View & Apply'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed JD & Apply Modal */}
      {selectedJob && (
        <Modal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={`${selectedJob.company.name} — ${selectedJob.title}`}
          description={`Campus Placement Drive 2026 • ${selectedJob.package}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Deadline: {new Date(selectedJob.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-bold"
                  onClick={() => {
                    setSelectedJob(null);
                    navigate(`/student/prepare/${selectedJob._id}`);
                  }}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                >
                  Prepare Hub
                </Button>
                {isAlreadyApplied(selectedJob._id) ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedJob(null);
                      navigate('/student/applications');
                    }}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Track in Pipeline
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={applying}
                    disabled={!evaluateEligibility(selectedJob).isEligible}
                    onClick={() => handleApply(selectedJob)}
                  >
                    {evaluateEligibility(selectedJob).isEligible
                      ? 'Confirm & Apply'
                      : 'Not Eligible for Drive'}
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-6 text-left max-h-[65vh] overflow-y-auto pr-1">
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Compensation</span>
                <span className="text-emerald-400 font-black text-sm">{selectedJob.package}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Location</span>
                <span className="text-white font-semibold truncate block">{selectedJob.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Min CGPA</span>
                <span className="text-indigo-400 font-bold">{selectedJob.eligibility?.minCgpa || 7.0}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Openings</span>
                <span className="text-white font-bold">{selectedJob.openings || 10} Seats</span>
              </div>
            </div>

            {/* Real-Time Eligibility Evaluation Panel */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Your Eligibility Verification Status
                </h5>
                <Badge
                  variant={evaluateEligibility(selectedJob).isEligible ? 'success' : 'warning'}
                  size="sm"
                >
                  {evaluateEligibility(selectedJob).isEligible ? 'Eligible to Apply' : 'Prerequisites Unmet'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {evaluateEligibility(selectedJob).checks.map((c, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${
                      c.passed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {c.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold text-white">{c.label}</p>
                      <p className="text-[11px] opacity-80">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Preparation Hub Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AI JD Intelligence & Round-by-Round Preparation</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Access company-specific DSA problem sets, Core CS flashcards, ATS resume keywords, and calculate your personalized Readiness Score.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  setSelectedJob(null);
                  navigate(`/student/prepare/${selectedJob._id}`);
                }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Launch Hub
              </Button>
            </div>

            {/* Detailed Job Description */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Job Description & Scope
              </h5>
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedJob.description}
              </div>
            </div>

            {/* Allowed Branches */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Eligible Engineering Branches
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {(selectedJob.eligibility?.allowedBranches || []).map((b, idx) => (
                  <Badge key={idx} variant="neutral" size="sm">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
