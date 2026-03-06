import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Truck } from 'lucide-react';
import fetchWithAuth, { API_BASE_URL } from '../../FetchWithAuth';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, setAccessToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

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
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ username, password, userType: 'CLIENT' }),
      });

      if (!res.ok) {
        let errorMessage = 'Login failed. Please check your credentials.';
        try {
          const data = await res.json();
          errorMessage = data?.message || data?.error || errorMessage;
        } catch {
          // response wasn't JSON, use default message
        }
        setApiError(errorMessage);
        return;
      }

      const data = await res.json();
      console.log('Login successful:', data);

      // Set authentication state and redirect to dashboard
      login(data.user || data);
      navigate('/dashboard');

    } catch (err) {
      if (err.message === 'Session expired') return; // Already redirected
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
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-0">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(217, 139, 148, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(217, 139, 148, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(217, 139, 148, 0.1) 0%, transparent 50%)',
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
            <div className="bg-gradient-to-br from-red-600 to-red-500 p-3 sm:p-4 rounded-2xl shadow-lg">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">FreightFlow</h1>
          <p className="text-sm sm:text-base text-gray-600">Login to your logistics dashboard</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100"
        >
          {/* API Error Banner */}
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
            {/* Username Field */}
            <motion.div variants={itemVariants}>
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
                placeholder="Enter your username"
                className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base focus:outline-none ${
                  errors.username
                    ? 'border-red-500 bg-red-50 focus:bg-white'
                    : 'border-gray-200 bg-gray-50 focus:border-red-500 focus:bg-white'
                }`}
              />
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 mt-1.5 font-medium"
                >
                  {errors.username}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
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
                  className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base focus:outline-none pr-12 ${
                    errors.password
                      ? 'border-red-500 bg-red-50 focus:bg-white'
                      : 'border-gray-200 bg-gray-50 focus:border-red-500 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 mt-1.5 font-medium"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Login Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Login</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 my-5 sm:my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div
            variants={itemVariants}
            className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4"
          >
            <p className="text-xs text-gray-700 font-medium mb-1.5">Demo Credentials:</p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Username:</span> 9876543210
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Password:</span> Client@12345
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs sm:text-sm text-gray-600 mt-6 sm:mt-8"
        >
          Don't have an account?{' '}
          <a href="#" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
            Sign up here
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}