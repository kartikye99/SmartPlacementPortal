import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Save,
  Download,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  BookOpen,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const ResumeBuilder = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  const resumePrintRef = useRef(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await api.get('/resumes/my');
        if (res.success && res.resume) {
          setResume(res.resume);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.post('/resumes/my', resume);
      if (res.success) {
        toast.success('Resume saved successfully in university placement format!');
      }
    } catch (err) {
      toast.error(err.message || 'Could not save resume');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper state updaters
  const updatePersonal = (field, value) => {
    setResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateEducation = (idx, field, value) => {
    const next = [...(resume.education || [])];
    next[idx] = { ...next[idx], [field]: value };
    setResume((prev) => ({ ...prev, education: next }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { institution: '', degree: '', branch: '', cgpa: '', startYear: '2022', endYear: '2026' },
      ],
    }));
  };

  const removeEducation = (idx) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  const updateProject = (idx, field, value) => {
    const next = [...(resume.projects || [])];
    next[idx] = { ...next[idx], [field]: value };
    setResume((prev) => ({ ...prev, projects: next }));
  };

  const updateProjectBullet = (pIdx, bIdx, value) => {
    const next = [...(resume.projects || [])];
    const bullets = [...(next[pIdx].bullets || [])];
    bullets[bIdx] = value;
    next[pIdx].bullets = bullets;
    setResume((prev) => ({ ...prev, projects: next }));
  };

  const addProjectBullet = (pIdx) => {
    const next = [...(resume.projects || [])];
    next[pIdx].bullets = [...(next[pIdx].bullets || []), ''];
    setResume((prev) => ({ ...prev, projects: next }));
  };

  const removeProjectBullet = (pIdx, bIdx) => {
    const next = [...(resume.projects || [])];
    next[pIdx].bullets = next[pIdx].bullets.filter((_, i) => i !== bIdx);
    setResume((prev) => ({ ...prev, projects: next }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          title: 'New Technical Project',
          techStack: ['Node.js', 'React', 'MongoDB'],
          duration: '2026',
          liveUrl: '',
          repoUrl: '',
          bullets: ['Engineered scalable web services using clean architecture.'],
        },
      ],
    }));
  };

  const removeProject = (idx) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx),
    }));
  };

  const updateExperience = (idx, field, value) => {
    const next = [...(resume.experience || [])];
    next[idx] = { ...next[idx], [field]: value };
    setResume((prev) => ({ ...prev, experience: next }));
  };

  const updateExperienceBullet = (expIdx, bIdx, value) => {
    const next = [...(resume.experience || [])];
    const bullets = [...(next[expIdx].bullets || [])];
    bullets[bIdx] = value;
    next[expIdx].bullets = bullets;
    setResume((prev) => ({ ...prev, experience: next }));
  };

  const addExperienceBullet = (expIdx) => {
    const next = [...(resume.experience || [])];
    next[expIdx].bullets = [...(next[expIdx].bullets || []), ''];
    setResume((prev) => ({ ...prev, experience: next }));
  };

  const removeExperienceBullet = (expIdx, bIdx) => {
    const next = [...(resume.experience || [])];
    next[expIdx].bullets = next[expIdx].bullets.filter((_, i) => i !== bIdx);
    setResume((prev) => ({ ...prev, experience: next }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          company: 'Tech Enterprise',
          role: 'Software Engineering Intern',
          location: 'Bengaluru, India',
          duration: 'May 2025 - Jul 2025',
          bullets: ['Developed high-performance software modules.'],
        },
      ],
    }));
  };

  const removeExperience = (idx) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  if (loading || !resume) {
    return (
      <div className="py-20 text-center space-y-4 max-w-xl mx-auto">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading university placement resume template...</p>
      </div>
    );
  }

  const { personal, education, skills, projects, experience, achievements, certifications, positions, codingProfiles } = resume;

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel card-area-resume p-4 rounded-2xl print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <GraduationCap className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-black text-white font-display">
              College Placement Resume Builder
            </h1>
            <Badge variant="resume" size="sm">Standardized Template</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official single-page placement format enforced by Training & Placement Cell (TPO).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ai"
            size="sm"
            onClick={() => navigate('/student/resume/analyzer')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-fuchsia-200" />}
          >
            AI Analyze ATS
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save
          </Button>

          <Button
            variant="resume"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Main Two-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: FORM EDITOR ================= */}
        <div className="lg:col-span-6 space-y-4 print:hidden">
          {/* Section Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'education', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'achievements', label: 'Achievements' },
              { id: 'certifications', label: 'Certs & Leads' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  activeSection === s.id
                    ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white border-orange-400/50 shadow-md shadow-orange-500/25 ring-1 ring-white/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <Card className="max-h-[75vh] overflow-y-auto pr-1">
            {/* 1. Personal Section */}
            {activeSection === 'personal' && (
              <div className="space-y-4 p-1">
                <CardTitle className="text-sm">Personal & Contact Details</CardTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Full Name</label>
                    <input
                      type="text"
                      value={personal.fullName || ''}
                      onChange={(e) => updatePersonal('fullName', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Email Address</label>
                    <input
                      type="email"
                      value={personal.email || ''}
                      onChange={(e) => updatePersonal('email', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Phone Number</label>
                    <input
                      type="text"
                      value={personal.phone || ''}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Location / City</label>
                    <input
                      type="text"
                      value={personal.location || ''}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={personal.linkedin || ''}
                      onChange={(e) => updatePersonal('linkedin', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={personal.github || ''}
                      onChange={(e) => updatePersonal('github', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Education Section */}
            {activeSection === 'education' && (
              <div className="space-y-4 p-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Academic History</CardTitle>
                  <Button variant="ghost" size="sm" onClick={addEducation} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add Entry
                  </Button>
                </div>

                {(education || []).map((edu, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400">Entry #{idx + 1}</span>
                      {education.length > 1 && (
                        <button
                          onClick={() => removeEducation(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-0.5">Institution / College</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Degree / Certification</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">CGPA / Percentage</label>
                        <input
                          type="text"
                          value={edu.cgpa}
                          onChange={(e) => updateEducation(idx, 'cgpa', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Duration / Years</label>
                        <input
                          type="text"
                          value={`${edu.startYear} - ${edu.endYear}`}
                          onChange={(e) => {
                            const [start, end] = e.target.value.split('-');
                            updateEducation(idx, 'startYear', (start || '').trim());
                            updateEducation(idx, 'endYear', (end || '').trim());
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Skills Section */}
            {activeSection === 'skills' && (
              <div className="space-y-4 p-1 text-xs">
                <CardTitle className="text-sm">Categorized Technical Skills</CardTitle>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Programming Languages (Comma separated)</label>
                    <input
                      type="text"
                      value={(skills.languages || []).join(', ')}
                      onChange={(e) =>
                        setResume((prev) => ({
                          ...prev,
                          skills: { ...prev.skills, languages: e.target.value.split(',').map((s) => s.trim()) },
                        }))
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Frameworks & Web Technologies</label>
                    <input
                      type="text"
                      value={(skills.frameworks || []).join(', ')}
                      onChange={(e) =>
                        setResume((prev) => ({
                          ...prev,
                          skills: { ...prev.skills, frameworks: e.target.value.split(',').map((s) => s.trim()) },
                        }))
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Databases & Caching</label>
                    <input
                      type="text"
                      value={(skills.databases || []).join(', ')}
                      onChange={(e) =>
                        setResume((prev) => ({
                          ...prev,
                          skills: { ...prev.skills, databases: e.target.value.split(',').map((s) => s.trim()) },
                        }))
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Core CS Fundamentals</label>
                    <input
                      type="text"
                      value={(skills.coreCS || []).join(', ')}
                      onChange={(e) =>
                        setResume((prev) => ({
                          ...prev,
                          skills: { ...prev.skills, coreCS: e.target.value.split(',').map((s) => s.trim()) },
                        }))
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Tools, Cloud & DevOps</label>
                    <input
                      type="text"
                      value={(skills.tools || []).join(', ')}
                      onChange={(e) =>
                        setResume((prev) => ({
                          ...prev,
                          skills: { ...prev.skills, tools: e.target.value.split(',').map((s) => s.trim()) },
                        }))
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Projects Section */}
            {activeSection === 'projects' && (
              <div className="space-y-4 p-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Key Technical Projects</CardTitle>
                  <Button variant="ghost" size="sm" onClick={addProject} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add Project
                  </Button>
                </div>

                {(projects || []).map((proj, pIdx) => (
                  <div key={pIdx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400">Project #{pIdx + 1}</span>
                      {projects.length > 1 && (
                        <button
                          onClick={() => removeProject(pIdx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-0.5">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(pIdx, 'title', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={(proj.techStack || []).join(', ')}
                          onChange={(e) =>
                            updateProject(pIdx, 'techStack', e.target.value.split(',').map((s) => s.trim()))
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-400 font-semibold">Bullet Points (Action Verb + Metric)</label>
                        <button
                          onClick={() => addProjectBullet(pIdx)}
                          className="text-indigo-400 hover:text-indigo-300 text-[11px] font-bold"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {(proj.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateProjectBullet(pIdx, bIdx, e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white text-[11px]"
                          />
                          <button
                            onClick={() => removeProjectBullet(pIdx, bIdx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Experience Section */}
            {activeSection === 'experience' && (
              <div className="space-y-4 p-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Internships & Professional Experience</CardTitle>
                  <Button variant="ghost" size="sm" onClick={addExperience} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add Internship
                  </Button>
                </div>

                {(experience || []).map((exp, expIdx) => (
                  <div key={expIdx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400">Experience #{expIdx + 1}</span>
                      <button
                        onClick={() => removeExperience(expIdx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-0.5">Company Name</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(expIdx, 'role', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => updateExperience(expIdx, 'duration', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-0.5">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(expIdx, 'location', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-400 font-semibold">Key Achievements & Impact</label>
                        <button
                          onClick={() => addExperienceBullet(expIdx)}
                          className="text-indigo-400 hover:text-indigo-300 text-[11px] font-bold"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {(exp.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateExperienceBullet(expIdx, bIdx, e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white text-[11px]"
                          />
                          <button
                            onClick={() => removeExperienceBullet(expIdx, bIdx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Achievements Section */}
            {activeSection === 'achievements' && (
              <div className="space-y-4 p-1 text-xs">
                <CardTitle className="text-sm">Competitive Coding & Honors</CardTitle>
                <div className="space-y-2">
                  {(achievements || []).map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ach}
                        onChange={(e) => {
                          const next = [...achievements];
                          next[idx] = e.target.value;
                          setResume((prev) => ({ ...prev, achievements: next }));
                        }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                      />
                      <button
                        onClick={() =>
                          setResume((prev) => ({
                            ...prev,
                            achievements: prev.achievements.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-slate-500 hover:text-rose-400 p-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setResume((prev) => ({
                        ...prev,
                        achievements: [...prev.achievements, 'Global Top 1% in competitive programming.'],
                      }))
                    }
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Achievement
                  </Button>
                </div>
              </div>
            )}

            {/* 7. Certifications & Positions */}
            {activeSection === 'certifications' && (
              <div className="space-y-4 p-1 text-xs">
                <CardTitle className="text-sm">Certifications & Positions of Responsibility</CardTitle>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Certifications (Title - Issuer)</label>
                    {(certifications || []).map((c, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                        <input
                          type="text"
                          value={c.title}
                          placeholder="Certification Title"
                          onChange={(e) => {
                            const next = [...certifications];
                            next[i].title = e.target.value;
                            setResume((prev) => ({ ...prev, certifications: next }));
                          }}
                          className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                        />
                        <input
                          type="text"
                          value={c.issuer}
                          placeholder="Issuer (e.g. AWS)"
                          onChange={(e) => {
                            const next = [...certifications];
                            next[i].issuer = e.target.value;
                            setResume((prev) => ({ ...prev, certifications: next }));
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Coding Profiles</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="LeetCode Profile URL"
                        value={codingProfiles?.leetcode || ''}
                        onChange={(e) =>
                          setResume((prev) => ({
                            ...prev,
                            codingProfiles: { ...prev.codingProfiles, leetcode: e.target.value },
                          }))
                        }
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-white text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Codeforces Profile URL"
                        value={codingProfiles?.codeforces || ''}
                        onChange={(e) =>
                          setResume((prev) => ({
                            ...prev,
                            codingProfiles: { ...prev.codingProfiles, codeforces: e.target.value },
                          }))
                        }
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ================= RIGHT COLUMN: LIVE COLLEGE RESUME SHEET ================= */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div
            ref={resumePrintRef}
            id="college-resume-sheet"
            className="w-full max-w-[650px] bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 font-sans leading-relaxed text-[11.5px]"
            style={{ minHeight: '842px' }}
          >
            {/* Header / Personal Details */}
            <div className="text-center pb-3 border-b-2 border-slate-900">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase font-display">
                {personal.fullName || 'ALEX CHEN'}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 mt-1.5 text-[10.5px] font-medium text-slate-700">
                <span>{personal.email}</span>
                <span>•</span>
                <span>{personal.phone}</span>
                <span>•</span>
                <span>{personal.location}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 mt-1 text-[10px] font-semibold text-indigo-900">
                <a href={personal.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                  LinkedIn
                </a>
                <span>•</span>
                <a href={personal.github} target="_blank" rel="noreferrer" className="hover:underline">
                  GitHub
                </a>
                <span>•</span>
                <a href={codingProfiles?.leetcode} target="_blank" rel="noreferrer" className="hover:underline">
                  LeetCode
                </a>
                <span>•</span>
                <a href={codingProfiles?.codeforces} target="_blank" rel="noreferrer" className="hover:underline">
                  Codeforces
                </a>
              </div>
            </div>

            {/* 1. Education Section */}
            <div className="mt-3.5 space-y-1.5">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Education
              </h2>
              <div className="space-y-1.5">
                {(education || []).map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-[11px]">
                    <div>
                      <span className="font-bold text-slate-900">{edu.institution}</span>
                      <p className="text-[10.5px] text-slate-700">{edu.degree}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-slate-900">{edu.cgpa}</span>
                      <p className="text-[10px] text-slate-600">{edu.startYear} – {edu.endYear}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Technical Skills */}
            <div className="mt-3.5 space-y-1">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Technical Skills
              </h2>
              <div className="space-y-0.5 text-[10.5px] text-slate-800">
                <p>
                  <strong className="text-slate-950 font-bold">Languages:</strong> {(skills?.languages || []).join(', ')}
                </p>
                <p>
                  <strong className="text-slate-950 font-bold">Frameworks & Web:</strong> {(skills?.frameworks || []).join(', ')}
                </p>
                <p>
                  <strong className="text-slate-950 font-bold">Databases & Caching:</strong> {(skills?.databases || []).join(', ')}
                </p>
                <p>
                  <strong className="text-slate-950 font-bold">Core CS:</strong> {(skills?.coreCS || []).join(', ')}
                </p>
                <p>
                  <strong className="text-slate-950 font-bold">Cloud & Tools:</strong> {(skills?.tools || []).join(', ')}
                </p>
              </div>
            </div>

            {/* 3. Experience */}
            {experience && experience.length > 0 && (
              <div className="mt-3.5 space-y-1.5">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                  Professional Experience
                </h2>
                <div className="space-y-2">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <div>
                          <span className="font-bold text-slate-950">{exp.role}</span>
                          <span className="text-slate-700"> | {exp.company}</span>
                        </div>
                        <span className="text-[10px] text-slate-600">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-[10.5px] text-slate-800 leading-snug">
                        {(exp.bullets || []).map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Projects */}
            <div className="mt-3.5 space-y-1.5">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Academic & Technical Projects
              </h2>
              <div className="space-y-2">
                {(projects || []).map((proj, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline text-[11px]">
                      <div>
                        <span className="font-bold text-slate-950">{proj.title}</span>
                        <span className="text-[10px] text-slate-600 font-medium">
                          {' '}| {(proj.techStack || []).join(', ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600">{proj.duration}</span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-[10.5px] text-slate-800 leading-snug">
                      {(proj.bullets || []).map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Achievements */}
            <div className="mt-3.5 space-y-1">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Key Achievements & Honors
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-0.5 text-[10.5px] text-slate-800 leading-snug">
                {(achievements || []).map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>

            {/* 6. Certifications & Leadership */}
            <div className="mt-3.5 space-y-1">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                Certifications & Positions of Responsibility
              </h2>
              <div className="space-y-0.5 text-[10.5px] text-slate-800">
                {(certifications || []).map((c, idx) => (
                  <p key={idx}>
                    <strong className="text-slate-950 font-bold">{c.title}</strong> — {c.issuer} ({c.year || '2025'})
                  </p>
                ))}
                {(positions || []).map((pos, idx) => (
                  <p key={idx}>
                    <strong className="text-slate-950 font-bold">{pos.role}</strong>, {pos.organization} ({pos.duration}): {pos.description}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
