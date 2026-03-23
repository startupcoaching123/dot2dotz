import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to home if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Robust role extraction: check role and userType, and normalize to UPPERCASE
  const rawRole = user?.role || user?.userType || "";
  const userRole = typeof rawRole === 'string' ? rawRole.toUpperCase() : "";

  if (allowedRoles.length > 0) {
    const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());
    if (!normalizedAllowedRoles.includes(userRole)) {
      // Role not authorized, redirect to their default dashboard dispatcher
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
