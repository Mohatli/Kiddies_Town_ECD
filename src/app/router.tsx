import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy-loaded feature pages
const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const AdminPage = lazy(() => import('../features/admin/AdminPage'));
const ParentPage = lazy(() => import('../features/parent/ParentPage'));
const TeacherPage = lazy(() => import('../features/teacher/TeacherPage'));
const EnrolmentPage = lazy(() => import('../features/enrollment/EnrolmentPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary fallbackTitle="Page Error">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/enrol" element={<EnrolmentPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );
}
