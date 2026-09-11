import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/Skeleton';

const PIPELINE_STAGES = [
  { id: 'Applied', label: '1. Applied', short: 'Applied' },
  { id: 'Shortlisted', label: '2. Shortlisted', short: 'Shortlist' },
  { id: 'OA', label: '3. Online Assessment', short: 'OA' },
  { id: 'Technical', label: '4. Technical Round', short: 'Tech' },
  { id: 'HR', label: '5. HR Round', short: 'HR' },
  { id: 'Selected', label: '6. Offer Extended', short: 'Selected' },
];

export const StudentApplications = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my');
      if (res.success) {
        setApplications(res.applications || []);
        if (res.applications?.length > 0 && !selectedApp) {
          setSelectedApp(res.applications[0]);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStageIndex = (stage) => {
    if (stage === 'Rejected') return -1;
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === stage);
    return idx >= 0 ? idx : 0;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <Badge variant="success" dot>Selected / Offer</Badge>;
      case 'Rejected':
        return <Badge variant="danger" dot>Not Shortlisted</Badge>;
      case 'Shortlisted':
        return <Badge variant="purple" dot>Shortlisted</Badge>;
      case 'OA':
        return <Badge variant="warning" dot>Online Assessment</Badge>;
      case 'Technical':
        return <Badge variant="info" dot>Technical Interview</Badge>;
      case 'HR':
        return <Badge variant="info" dot>HR Interview</Badge>;
      default:
        return <Badge variant="neutral" dot>Application Submitted</Badge>;
    }
  };

  const filteredApps = applications.filter((app) => {
    const q = search.toLowerCase();
    const company = app.job?.company?.name || '';
    const title = app.job?.title || '';
    const matchesSearch = company.toLowerCase().includes(q) || title.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruitment Pipeline Tracker</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
            Application Status & Rounds
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time status updates across all 6 stages of your campus recruitment process.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/student/jobs')}
          leftIcon={<Building2 className="w-4 h-4" />}
        >
          Explore More Drives
        </Button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hover className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Applied</p>
          <h3 className="text-2xl font-black text-white mt-1">{applications.length}</h3>
          <span className="text-[10px] text-indigo-400 font-semibold">Active candidacies</span>
        </Card>
        <Card hover className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Shortlisted</p>
          <h3 className="text-2xl font-black text-white mt-1">
            {applications.filter((a) => ['Shortlisted', 'OA', 'Technical', 'HR', 'Selected'].includes(a.status)).length}
          </h3>
          <span className="text-[10px] text-emerald-400 font-semibold">Cleared resume screen</span>
        </Card>
        <Card hover className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">In Rounds (OA/Tech/HR)</p>
          <h3 className="text-2xl font-black text-white mt-1">
            {applications.filter((a) => ['OA', 'Technical', 'HR'].includes(a.status)).length}
          </h3>
          <span className="text-[10px] text-amber-400 font-semibold">Active evaluations</span>
        </Card>
        <Card hover className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Offers Extended</p>
          <h3 className="text-2xl font-black text-white mt-1">
            {applications.filter((a) => a.status === 'Selected').length}
          </h3>
          <span className="text-[10px] text-emerald-400 font-semibold">Final selections</span>
        </Card>
      </div>

      {/* Main Content Split: Applications List on Left, Active Pipeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Applications List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-3 rounded-2xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search applied drives..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="OA">Online Assessment</option>
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
              <option value="Selected">Selected</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center">
              <FileCheck className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-60" />
              <h4 className="text-sm font-bold text-white">No Applications Found</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                You haven't submitted applications matching the filter yet.
              </p>
              <Button variant="primary" size="sm" onClick={() => navigate('/student/jobs')}>
                Browse Campus Drives
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredApps.map((app) => {
                const isSelected = selectedApp?._id === app._id;
                return (
                  <div
                    key={app._id}
                    onClick={() => setSelectedApp(app)}
                    className={`glass-panel p-4 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                        : 'hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-black text-indigo-300 shrink-0">
                          {app.job?.company?.logo || app.job?.company?.name?.charAt(0) || '🏢'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white truncate max-w-[170px]">
                            {app.job?.company?.name || 'Company'}
                          </h4>
                          <p className="text-xs text-indigo-400 font-semibold truncate max-w-[170px]">
                            {app.job?.title || 'Position'}
                          </p>
                        </div>
                      </div>
                      <div>{getStatusBadge(app.status)}</div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{app.job?.package || '24 LPA'}</span>
                      <span className="flex items-center gap-1">
                        Applied {new Date(app.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed 6-Stage Pipeline Tracker */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <Card className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-lg font-black text-indigo-300">
                    {selectedApp.job?.company?.logo || selectedApp.job?.company?.name?.charAt(0) || '🏢'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedApp.job?.company?.name}</h3>
                    <p className="text-xs font-semibold text-indigo-400">{selectedApp.job?.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedApp.job?.package} • {selectedApp.job?.location}
                    </p>
                  </div>
                </div>

                <div className="sm:self-start flex flex-col sm:items-end gap-2.5">
                  <div>{getStatusBadge(selectedApp.status)}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-bold text-xs"
                    onClick={() => navigate(`/student/prepare/${selectedApp.jobId || selectedApp.job?._id}`)}
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                  >
                    Prepare for Rounds
                  </Button>
                </div>
              </div>

              {/* 6-Stage Pipeline Stepper Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Stage Progression Pipeline
                  </h4>
                  <span className="text-xs font-extrabold text-indigo-300">
                    {selectedApp.status === 'Rejected'
                      ? 'Process Concluded'
                      : `Stage ${getStageIndex(selectedApp.status) + 1} of 6`}
                  </span>
                </div>

                {/* Visual Pipeline Bar */}
                <div className="grid grid-cols-6 gap-1.5">
                  {PIPELINE_STAGES.map((stage, idx) => {
                    const currentIdx = getStageIndex(selectedApp.status);
                    const isRejected = selectedApp.status === 'Rejected';
                    const isPassed = !isRejected && currentIdx > idx;
                    const isCurrent = !isRejected && currentIdx === idx;

                    return (
                      <div
                        key={stage.id}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          isPassed
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
                            : isCurrent
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30 font-bold shadow-lg shadow-indigo-500/10'
                            : isRejected
                            ? 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-60'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-500'
                        }`}
                      >
                        <div className="flex justify-center mb-1">
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isCurrent ? (
                            <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-700 mt-1" />
                          )}
                        </div>
                        <p className="text-[10px] font-semibold truncate">{stage.short}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline Stage History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Round History & Official Feedback
                </h4>

                <div className="space-y-3">
                  {(selectedApp.timeline || []).map((step, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white">Stage: {step.stage}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(step.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-6">
                        {step.notes || 'Status confirmed by recruitment cell.'}
                      </p>
                      <div className="pl-6 pt-1 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Updated by: {step.updatedBy || 'TPO Officer'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-white">Select an Application</h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose any applied drive from the list to view its complete recruitment pipeline stages.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
