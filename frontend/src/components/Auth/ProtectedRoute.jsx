import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, AlertCircle } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (user) {
    console.log('--- PROTECTED ROUTE USER CHECK ---');
    console.log('User Role/Type:', user?.role || user?.userType || user?.user_type);
    console.log('User Status:', {
      active: user?.active,
      is_active: user?.is_active,
      verified: user?.verified,
      isvarified: user?.isvarified,
      is_verified: user?.is_verified
    });
    console.log('Full User Detail:', user);
    console.log('--- END PROTECTED ROUTE CHECK ---');
  }

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

  // Extremely robust extraction for role/userType
  const getExtractedRole = (u) => {
    if (!u) return "";
    const roleKeys = ['role', 'userType', 'user_type', 'type', 'role_name', 'user_role'];
    const wrappers = ['user', 'data', 'profile', 'business', 'auth'];
    
    // 1. Root level
    for (const key of roleKeys) {
      if (u[key] && typeof u[key] === 'string') return u[key].toUpperCase();
      if (u[key] && typeof u[key] === 'object' && u[key].name) return u[key].name.toUpperCase();
    }
    
    // 2. Wrapped levels
    for (const w of wrappers) {
      if (u[w] && typeof u[w] === 'object') {
        for (const key of roleKeys) {
          if (u[w][key] && typeof u[w][key] === 'string') return u[w][key].toUpperCase();
          if (u[w][key] && typeof u[w][key] === 'object' && u[w][key].name) return u[w][key].name.toUpperCase();
        }
      }
    }
    return "";
  };

  const userRole = getExtractedRole(user);

  // Vendor Status Check - Apply to all vendor roles
  if (userRole.includes('VENDOR')) {
    // Robust status check
    const checkValue = (u, field) => {
      const wrappers = ['user', 'vendor', 'vender', 'data', 'profile', 'business'];
      
      // Try root
      if (u?.[field] !== undefined) return u[field];
      
      // Try wrappers
      for (const w of wrappers) {
        if (u?.[w]?.[field] !== undefined) return u[w][field];
      }
      return undefined;
    };

    const isFalsy = (val) => val === false || val === 0 || val === '0' || val === 'false';
    
    // Check EXACT fields the user mentioned: is_active and isvarified
    const activeVal = checkValue(user, 'is_active') ?? checkValue(user, 'active') ?? checkValue(user, 'isActive');
    const verifiedVal = checkValue(user, 'isvarified') ?? checkValue(user, 'is_varified') ?? checkValue(user, 'isVerified') ?? checkValue(user, 'verified') ?? checkValue(user, 'isVarified');

    const isNotActive = isFalsy(activeVal);
    const isNotVerified = isFalsy(verifiedVal);

    if (isNotActive || isNotVerified) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white animate-pulse">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">
                Account Status
              </h2>
              <div className="space-y-4 mb-8">
                {isNotActive && (
                  <p className="text-xs font-black uppercase tracking-widest text-red-500 bg-red-50 py-2 rounded-xl border border-red-100">
                    Account Inactive
                  </p>
                )}
                {isNotVerified && (
                  <p className="text-xs font-black uppercase tracking-widest text-amber-500 bg-amber-50 py-2 rounded-xl border border-amber-100">
                    Verification Pending
                  </p>
                )}
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                {isNotActive
                  ? "Your account has been deactivated by the administrator. Please contact support for more information."
                  : "Your account is currently under review by our team. You will have full access once your verification is completed."}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Check Status
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full py-4 bg-white text-slate-400 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] border border-slate-100 hover:bg-slate-50 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

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
