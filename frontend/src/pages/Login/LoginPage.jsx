import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Truck, Shield, User, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../api/endpoints';

const USER_TYPE_CONFIG = {
  'super-admin': {
    title: 'Super Admin',
    userType: 'SUPER_ADMIN',
    icon: Shield,
    color: 'from-slate-900 to-slate-800',
    dashboardPath: '/dashboard/super-admin',
    demo: { username: 'superadmin', password: 'Password@123' }
  },
  'admin-operational': {
    title: 'Operational Admin',
    userType: 'ADMIN_OPERATIONAL',
    icon: Shield,
    color: 'from-red-600 to-red-500',
    dashboardPath: '/dashboard/admin-operational',
    demo: { username: 'ops_admin', password: 'Password@123' }
  },
  'admin-finance': {
    title: 'Finance Admin',
    userType: 'ADMIN_FINANCE',
    icon: Shield,
    color: 'from-green-600 to-green-500',
    dashboardPath: '/dashboard/admin-finance',
    demo: { username: 'fin_admin', password: 'Password@123' }
  },
  'client': {
    title: 'Client Owner',
    userType: 'CLIENT',
    icon: Building2,
    color: 'from-blue-600 to-blue-500',
    dashboardPath: '/dashboard/client',
    demo: { username: 'client_owner', password: 'Password@123' }
  },
  'client-staff': {
    title: 'Client Staff',
    userType: 'CLIENT_STAFF',
    icon: User,
    color: 'from-blue-400 to-blue-300',
    dashboardPath: '/dashboard/client-staff',
    demo: { username: 'client_staff', password: 'Password@123' }
  },
  'vendor': {
    title: 'Vendor Owner',
    userType: 'VENDOR',
    icon: Truck,
    color: 'from-orange-600 to-orange-500',
    dashboardPath: '/dashboard/vendor',
    demo: { username: 'vendor_owner', password: 'Password@123' }
  },
  'vendor-staff': {
    title: 'Vendor Staff',
    userType: 'VENDOR_STAFF',
    icon: User,
    color: 'from-orange-400 to-orange-300',
    dashboardPath: '/dashboard/vendor-staff',
    demo: { username: 'vendor_staff', password: 'Password@123' }
  }
};

const ROLE_DASHBOARD_MAP = {
  'SUPER_ADMIN': '/dashboard/super-admin',
  'ADMIN_OPERATIONAL': '/dashboard/admin-operational',
  'ADMIN_FINANCE': '/dashboard/admin-finance',
  'CLIENT': '/dashboard/client',
  'CLIENT_OWNER': '/dashboard/client',
  'CLIENT_STAFF': '/dashboard/client-staff',
  'VENDOR': '/dashboard/vendor',
  'VENDOR_OWNER': '/dashboard/vendor',
  'VENDOR_STAFF': '/dashboard/vendor-staff',
};

const getRoleFromUser = (u) => {
  if (!u) return "";
  // Check for common property names and nested objects
  const rawRole = u.role || u.userType || u.user_type || u.type ||
    u.data?.role || u.data?.userType || u.data?.user_type ||
    "";
  return typeof rawRole === 'string' ? rawRole.toUpperCase() : "";
};

export default function LoginPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user: authUser } = useAuth();

  const config = USER_TYPE_CONFIG[type];
  const Icon = config.icon;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && authUser) {
      const userRole = getRoleFromUser(authUser);
      console.log('Guard Check - Role:', userRole);

      const targetPath = ROLE_DASHBOARD_MAP[userRole];
      if (targetPath) {
        console.log('Guard Redirecting to:', targetPath);
        navigate(targetPath, { replace: true });
      } else if (userRole) {
        // Fallback for known roles but missing mapping
        console.warn('Role detected but no mapping found for:', userRole);
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, authUser, navigate]);

  // Reset state when type changes
  useEffect(() => {
    setUsername('');
    setPassword('');
    setErrors({});
    setApiError('');
  }, [type]);

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password
        }),
      });

      if (!res.ok) {
        let errorMessage = 'Login failed. Please check your credentials.';
        try {
          const data = await res.json();
          errorMessage = data?.message || data?.error || errorMessage;
        } catch {
          // response wasn't JSON
        }
        setApiError(errorMessage);
        return;
      }

      const data = await res.json();
      console.log('Login successful:', data);

      const user = data.user || data.data || data;
      const token = data.token || data.accessToken || (data.data && (data.data.token || data.data.accessToken));

      if (token) {
        document.cookie = `accessToken=${token}; path=/; max-age=3600; SameSite=Lax`;
      }

      console.log('Extracted User Data:', user);
      console.log('Available Keys:', Object.keys(user));

      await login(user);

      const userRole = getRoleFromUser(user);
      console.log('🎯 Final Detected Role:', userRole);

      const fromPath = location.state?.from?.pathname;
      const targetPath = (fromPath && fromPath !== '/dashboard')
        ? fromPath
        : ROLE_DASHBOARD_MAP[userRole] || config?.dashboardPath;

      console.log('🚀 Redirecting to:', targetPath);
      navigate(targetPath || '/dashboard', { replace: true });

    } catch (err) {
      setApiError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 py-8">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, rgba(0,0,0,0.03) 0%, transparent 50%)`,
              `radial-gradient(circle at 40% 40%, rgba(0,0,0,0.03) 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-4"
          >
            <div className={`bg-gradient-to-br ${config.color} p-3 sm:p-4 rounded-2xl shadow-lg`}>
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Login as {config.title}</h1>
          <p className="text-sm sm:text-base text-gray-600">Access your {config.title.toLowerCase()} dashboard</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100"
        >
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium"
            >
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: '' });
                  if (apiError) setApiError('');
                }}
                placeholder={`Enter your ${config.title.toLowerCase()} username`}
                className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base focus:outline-none ${errors.username
                  ? 'border-red-500 bg-red-50 focus:bg-white'
                  : 'border-gray-200 bg-gray-50 focus:border-red-500 focus:bg-white'
                  }`}
              />
              {errors.username && (
                <p className="text-xs sm:text-sm text-red-600 mt-1.5 font-medium">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                    if (apiError) setApiError('');
                  }}
                  placeholder="Enter your password"
                  className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base focus:outline-none pr-12 ${errors.password
                    ? 'border-red-500 bg-red-50 focus:bg-white'
                    : 'border-gray-200 bg-gray-50 focus:border-red-500 focus:bg-white'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-600 mt-1.5 font-medium">{errors.password}</p>
              )}
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-black italic uppercase text-gray-400 hover:text-red-500 transition-colors tracking-widest"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              className={`w-full bg-gradient-to-r ${config.color} text-white font-bold py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base disabled:opacity-70`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Login</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5 sm:my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">DEMO ACCOUNT</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Use these credentials:</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600 flex justify-between">
                <span>Username:</span>
                <span className="font-mono font-semibold text-gray-900">{config.demo.username}</span>
              </p>
              <p className="text-xs text-gray-600 flex justify-between">
                <span>Password:</span>
                <span className="font-mono font-semibold text-gray-900">{config.demo.password}</span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-center text-xs sm:text-sm text-gray-600 mt-6 sm:mt-8"
        >
          Having trouble logging in?{' '}
          <a href="#" className="text-[#D28042] hover:underline font-semibold transition-colors">
            Contact Support
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
