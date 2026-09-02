import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated, useUser } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'parent' | 'admin' | 'teacher';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the user's own dashboard
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
}
