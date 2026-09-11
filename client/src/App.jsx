import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Immediate load for core entry points
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { StudentDashboard } from './pages/student/StudentDashboard';

// Code-split / Lazy-loaded components for optimal initial payload
const StudentJobs = lazy(() => import('./pages/student/StudentJobs').then(m => ({ default: m.StudentJobs })));
const StudentApplications = lazy(() => import('./pages/student/StudentApplications').then(m => ({ default: m.StudentApplications })));
const PrepareHub = lazy(() => import('./pages/student/PrepareHub').then(m => ({ default: m.PrepareHub })));
const CodingArena = lazy(() => import('./pages/student/CodingArena').then(m => ({ default: m.CodingArena })));
const ResumeBuilder = lazy(() => import('./pages/student/ResumeBuilder').then(m => ({ default: m.ResumeBuilder })));
const ResumeAnalyzer = lazy(() => import('./pages/student/ResumeAnalyzer').then(m => ({ default: m.ResumeAnalyzer })));
const InterviewHub = lazy(() => import('./pages/student/InterviewHub'));
const MockInterviewArena = lazy(() => import('./pages/student/MockInterviewArena'));
const InterviewAnalysis = lazy(() => import('./pages/student/InterviewAnalysis'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile').then(m => ({ default: m.StudentProfile })));

// Admin Lazy Routes
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs').then(m => ({ default: m.AdminJobs })));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications').then(m => ({ default: m.AdminApplications })));

// High-fidelity route skeleton loader
const PageSkeleton = () => (
  <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in text-left">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2.5">
        <div className="h-8 w-56 bg-slate-800/80 animate-shimmer rounded-xl" />
        <div className="h-4 w-80 bg-slate-800/60 animate-shimmer rounded-lg" />
      </div>
      <div className="h-10 w-36 bg-slate-800/70 animate-shimmer rounded-xl shrink-0" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-36 bg-slate-800/50 border border-slate-800/60 animate-shimmer rounded-2xl" />
      <div className="h-36 bg-slate-800/50 border border-slate-800/60 animate-shimmer rounded-2xl" />
      <div className="h-36 bg-slate-800/50 border border-slate-800/60 animate-shimmer rounded-2xl" />
    </div>
    <div className="h-72 bg-slate-800/40 border border-slate-800/60 animate-shimmer rounded-2xl" />
  </div>
);

const RootRedirect = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/student/dashboard" replace />
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Student Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                  <Route element={<AppLayout />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/jobs" element={<StudentJobs />} />
                    <Route path="/student/applications" element={<StudentApplications />} />
                    <Route path="/student/practice" element={<CodingArena />} />
                    <Route path="/student/resume" element={<Navigate to="/student/resume/builder" replace />} />
                    <Route path="/student/resume/builder" element={<ResumeBuilder />} />
                    <Route path="/student/resume/analyzer" element={<ResumeAnalyzer />} />
                    <Route path="/student/interview" element={<InterviewHub />} />
                    <Route path="/student/interview/arena/:id" element={<MockInterviewArena />} />
                    <Route path="/student/interview/analysis/:id" element={<InterviewAnalysis />} />
                    <Route path="/student/prepare" element={<Navigate to="/student/practice" replace />} />
                    <Route path="/student/prepare/:jobId" element={<PrepareHub />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                  </Route>
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route element={<AppLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/jobs" element={<AdminJobs />} />
                    <Route path="/admin/applications" element={<AdminApplications />} />
                  </Route>
                </Route>

                {/* Root redirect */}
                <Route path="/" element={<RootRedirect />} />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
