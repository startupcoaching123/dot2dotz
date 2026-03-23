import { motion } from 'framer-motion';
import { Truck, Users, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();

  const options = [
    {
      id: 'vendor',
      title: 'Vendor Partner',
      description: 'Join as a transporter or fleet owner to manage loads and grow your business.',
      icon: Truck,
      path: '/vendors/register',
      label: 'Partner'
    },
    {
      id: 'client',
      title: 'Freight Client',
      description: 'Post your load requirements and connect with the best transport networks.',
      icon: Users,
      path: '/clients/register',
      label: 'Customer'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 lg:p-24 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Minimal Header */}
        <header className="mb-20 text-center md:text-left">
          <h1 className="text-4xl font-medium tracking-tight mb-4">Choose your portal</h1>
          <p className="text-gray-500 text-sm max-w-md">Select how you want to interact with our logistics ecosystem.</p>
        </header>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {options.map((option) => (
            <div 
              key={option.id}
              onClick={() => navigate(option.path)}
              className="group cursor-pointer space-y-6"
            >
              <div className="aspect-[4/3] bg-gray-50 border border-gray-100 flex items-center justify-center transition-all group-hover:border-black group-hover:bg-white relative overflow-hidden">
                <option.icon size={48} strokeWidth={1} className="text-gray-200 group-hover:text-black transition-colors duration-500 relative z-10" />
                <div className="absolute top-6 left-6 text-[10px] font-semibold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">{option.label}</div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    {option.title}
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">{option.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">© 2026 Dot2Dotz Node</div>
            <div className="flex gap-8">
                <button onClick={() => navigate('/login/client')} className="text-xs font-semibold text-gray-900 hover:text-red-600 transition-colors uppercase tracking-widest">Sign In</button>
                <div className="w-px h-4 bg-gray-100" />
                <button className="text-xs font-semibold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">Support Hub</button>
            </div>
        </footer>
      </div>
    </div>
  );
}
