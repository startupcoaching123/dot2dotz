import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import signInImg from '../../assets/sign-in.png';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeTerms: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up form submitted:', formData);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#F8F9FB] flex overflow-hidden">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-8 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Join thousands of businesses streamlining their logistics with Dot2Dotz.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-50 focus:border-red-600 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-50 focus:border-red-600 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-50 focus:border-red-600 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 outline-none pr-12 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-1">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <div className={`w-4.5 h-4.5 rounded border-2 transition-all duration-200 ${
                      formData.agreeTerms ? 'bg-red-600 border-red-600' : 'border-gray-300 group-hover:border-red-400'
                    }`}>
                      {formData.agreeTerms && (
                        <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-2.5 text-xs font-medium text-gray-500">
                    Agree to <a href="#" className="font-bold text-gray-900 hover:text-red-600">Terms</a> & <a href="#" className="font-bold text-gray-900 hover:text-red-600">Privacy</a>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#E31E24] hover:bg-[#C1191F] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Create Account
              </button>

              {/* Google Button */}
              <button
                type="button"
                className="w-full bg-white border border-gray-100 hover:bg-gray-50 text-gray-900 font-semibold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5 text-sm"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs">
                Already have an account?{' '}
                <Link to="/login/client" className="text-blue-600 font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block lg:w-1/2 relative p-6">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
          <img
            src={signInImg}
            alt="Sign Up Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
