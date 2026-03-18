import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  const colors = {
    red: 'bg-red-50 text-red-600 border-red-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    pink: 'bg-pink-50 text-pink-600 border-pink-100',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-slate-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl border ${colors[color] || colors.slate}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

export const DashboardGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {children}
  </div>
);
