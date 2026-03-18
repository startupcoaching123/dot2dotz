import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../api/endpoints';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.RESET_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to reset password');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">Password Reset!</h2>
          <p className="text-gray-500 text-sm mb-8">Your password has been successfully updated. You can now login with your new password.</p>
          <button
            onClick={() => navigate('/login/super-admin')}
            className="w-full py-4 bg-black text-white rounded-2xl font-black italic uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            Go to Login
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">Reset Password</h1>
          <p className="text-gray-500 text-sm">Please enter your new password below.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold italic">
            {error}
          </div>
        )}

        {!token ? (
          <div className="p-4 bg-orange-50 border border-orange-100 text-orange-600 text-sm rounded-2xl font-bold italic">
            Invalid or missing reset token. Please check your email link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold italic focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold italic focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-4 bg-black text-white rounded-2xl font-black italic uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
