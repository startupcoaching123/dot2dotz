import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../api/endpoints';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to send reset email');
      }

      setIsSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link 
          to="/login/super-admin" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">Forgot Password?</h1>
                  <p className="text-gray-500 text-sm">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold italic">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@company.com"
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
                      <>
                        <Send size={18} />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">Check Your Email</h2>
                <p className="text-gray-500 text-sm mb-8">We have sent a password reset link to <br /><span className="font-bold text-black">{email}</span></p>
                
                <button 
                  onClick={() => setIsSent(false)}
                  className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Didn't receive it? Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
