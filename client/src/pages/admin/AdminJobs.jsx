import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Award,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../components/common/Table';
import { SkeletonCard } from '../../components/common/Skeleton';

const ALL_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
];

export const AdminJobs = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Form State
  const initialForm = {
    companyName: '',
    companyWebsite: '',
    companyIndustry: 'Software & Technology',
    companyDescription: '',
    title: '',
    description: '',
    package: '',
    location: 'Bengaluru / Hybrid',
    deadline: '',
    openings: 10,
    status: 'published',
    minCgpa: 7.5,
    allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
    eligibleBatches: [2026],
    maxBacklogs: 0,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs');
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      ...initialForm,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      companyName: job.company?.name || '',
      companyWebsite: job.company?.website || '',
      companyIndustry: job.company?.industry || 'Software & Technology',
      companyDescription: job.company?.description || '',
      title: job.title || '',
      description: job.description || '',
      package: job.package || '',
      location: job.location || '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
      openings: job.openings || 10,
      status: job.status || 'published',
      minCgpa: job.eligibility?.minCgpa || 7.5,
      allowedBranches: job.eligibility?.allowedBranches || ['Computer Science & Engineering'],
      eligibleBatches: job.eligibility?.eligibleBatches || [2026],
      maxBacklogs: job.eligibility?.maxBacklogs || 0,
    });
    setModalOpen(true);
  };

  const handleBranchToggle = (branch) => {
    setFormData((prev) => {
      const branches = prev.allowedBranches.includes(branch)
        ? prev.allowedBranches.filter((b) => b !== branch)
        : [...prev.allowedBranches, branch];
      return { ...prev, allowedBranches: branches };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.title || !formData.package || !formData.deadline) {
      toast.warning('Please complete all required fields.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        company: {
          name: formData.companyName,
          website: formData.companyWebsite,
          industry: formData.companyIndustry,
          description: formData.companyDescription,
          logo: formData.companyName.charAt(0).toUpperCase(),
        },
        title: formData.title,
        description: formData.description,
        package: formData.package,
        location: formData.location,
        deadline: formData.deadline,
        openings: formData.openings,
        status: formData.status,
        eligibility: {
          minCgpa: Number(formData.minCgpa),
          allowedBranches: formData.allowedBranches,
          eligibleBatches: formData.eligibleBatches,
          maxBacklogs: Number(formData.maxBacklogs),
        },
      };

      if (editingJob) {
        const res = await api.put(`/jobs/${editingJob._id}`, payload);
        if (res.success) {
          toast.success(`Drive for ${formData.companyName} updated!`);
          fetchJobs();
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/jobs', payload);
        if (res.success) {
          toast.success(`Placement drive created and published!`);
          fetchJobs();
          setModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (job) => {
    try {
      const res = await api.put(`/jobs/${job._id}/publish`);
      if (res.success) {
        toast.success(res.message);
        setJobs((prev) =>
          prev.map((j) => (j._id === job._id ? { ...j, status: res.job.status } : j))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Toggle failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      const res = await api.delete(`/jobs/${jobToDelete._id}`);
      if (res.success) {
        toast.success('Drive deleted successfully');
        setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
        setDeleteModalOpen(false);
        setJobToDelete(null);
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(q) ||
      job.company?.name.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TPO Recruitment Administration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
            Company & Drives Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Create, configure eligibility cutoffs, publish/unpublish, and oversee corporate campus recruitment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/applications')}
            leftIcon={<Users className="w-4 h-4" />}
          >
            View All Applicants
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Drive
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hover className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Drives</p>
          <h3 className="text-2xl font-black text-white mt-1">{jobs.length}</h3>
          <span className="text-[10px] text-indigo-400 font-semibold">Registered companies</span>
        </Card>
        <Card hover className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published (Live)</p>
          <h3 className="text-2xl font-black text-white mt-1">
            {jobs.filter((j) => j.status === 'published').length}
          </h3>
          <span className="text-[10px] text-emerald-400 font-semibold">Open for applications</span>
        </Card>
        <Card hover className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Draft Drives</p>
          <h3 className="text-2xl font-black text-white mt-1">
            {jobs.filter((j) => j.status === 'draft').length}
          </h3>
          <span className="text-[10px] text-amber-400 font-semibold">Pending approval</span>
        </Card>
        <Card hover className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Openings</p>
          <h3 className="text-2xl font-black text-white mt-1">
            {jobs.reduce((acc, curr) => acc + (curr.openings || 0), 0)}
          </h3>
          <span className="text-[10px] text-purple-400 font-semibold">Career opportunities</span>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drives by company, role title, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Drive Statuses</option>
            <option value="published">Live / Published</option>
            <option value="draft">Drafts</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Drives Management Table */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Company & Role</TableHead>
              <TableHead>Compensation</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Eligibility</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {loading ? (
              <tr>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                  Loading placement drives...
                </TableCell>
              </tr>
            ) : filteredJobs.length === 0 ? (
              <tr>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  No placement drives found. Click "Create New Drive" above to add one.
                </TableCell>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-extrabold text-indigo-400 shrink-0">
                      {job.company?.logo || job.company?.name?.charAt(0) || '🏢'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{job.company?.name}</p>
                      <p className="text-xs text-indigo-400 font-semibold">{job.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-extrabold text-emerald-400">
                    {job.package}
                  </TableCell>
                  <TableCell className="text-slate-300 text-xs">
                    {job.location}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="space-y-0.5">
                      <p className="text-slate-300 font-semibold">Min CGPA: {job.eligibility?.minCgpa || 7.0}</p>
                      <p className="text-[11px] text-slate-400">
                        {(job.eligibility?.allowedBranches || []).length} Branches • Max {job.eligibility?.maxBacklogs || 0} Backlog
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-300">
                    {new Date(job.deadline).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleTogglePublish(job)}
                      className="cursor-pointer"
                      title="Click to toggle publish status"
                    >
                      <Badge
                        variant={
                          job.status === 'published'
                            ? 'success'
                            : job.status === 'draft'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                        dot={job.status === 'published'}
                      >
                        {job.status === 'published' ? 'Published (Live)' : job.status === 'draft' ? 'Draft' : 'Closed'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Applicants"
                        onClick={() => navigate(`/admin/applications?jobId=${job._id}`)}
                      >
                        <Users className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit Drive"
                        onClick={() => openEditModal(job)}
                      >
                        <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete Drive"
                        onClick={() => {
                          setJobToDelete(job);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create / Edit Drive Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingJob ? `Edit Placement Drive: ${editingJob.company?.name}` : 'Create New Placement Drive'}
          description="Configure company details, job description, compensation, and strict eligibility thresholds."
          maxWidth="max-w-3xl"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={saving}
                onClick={handleSubmit}
              >
                {editingJob ? 'Save Drive Changes' : 'Publish Placement Drive'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5 text-left max-h-[70vh] overflow-y-auto pr-1">
            {/* Company Info */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                1. Company Information
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Company Name"
                  required
                  placeholder="e.g. Apple Inc."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
                <Input
                  label="Industry / Domain"
                  placeholder="e.g. Consumer Hardware & OS"
                  value={formData.companyIndustry}
                  onChange={(e) => setFormData({ ...formData, companyIndustry: e.target.value })}
                />
                <Input
                  label="Careers Website URL"
                  placeholder="https://apple.com/careers"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                />
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                2. Job Role & Compensation
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Job / Role Title"
                  required
                  placeholder="e.g. Systems Software Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Input
                  label="CTC Package (LPA)"
                  required
                  placeholder="e.g. 36 LPA"
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                />
                <Input
                  label="Job Locations"
                  placeholder="e.g. Hyderabad / Bengaluru"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Application Deadline"
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
                <Input
                  label="Openings (Vacancies)"
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
                />
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="published">Published (Visible to Students)</option>
                    <option value="draft">Draft (Private to TPO)</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Full Job Description (JD)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify core responsibilities, day-to-day duties, tech stacks, and interview rounds..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Eligibility Cutoffs */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                3. Academic Eligibility Cutoffs & Screening
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Minimum CGPA Required"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.minCgpa}
                  onChange={(e) => setFormData({ ...formData, minCgpa: Number(e.target.value) })}
                />
                <Input
                  label="Maximum Allowed Active Backlogs"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.maxBacklogs}
                  onChange={(e) => setFormData({ ...formData, maxBacklogs: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Eligible Engineering Branches
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {ALL_BRANCHES.map((branch) => {
                    const isChecked = formData.allowedBranches.includes(branch);
                    return (
                      <label
                        key={branch}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-200 font-semibold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBranchToggle(branch)}
                          className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span>{branch}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Drive Deletion"
          description="This action cannot be undone."
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                Delete Drive
              </Button>
            </>
          }
        >
          <p className="text-xs text-slate-300">
            Are you sure you want to delete the placement drive for{' '}
            <strong className="text-white">{jobToDelete?.company?.name} — {jobToDelete?.title}</strong>? All associated student applications will be permanently removed.
          </p>
        </Modal>
      )}
    </div>
  );
};
