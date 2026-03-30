import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  const colors = {
    red: 'bg-red-50/50 text-red-600 border-red-100/50',
    blue: 'bg-blue-50/50 text-blue-600 border-blue-100/50',
    green: 'bg-green-50/50 text-green-600 border-green-100/50',
    slate: 'bg-slate-50/50 text-slate-600 border-slate-100/50',
    orange: 'bg-orange-50/50 text-orange-600 border-orange-100/50',
    purple: 'bg-purple-50/50 text-purple-600 border-purple-100/50',
    indigo: 'bg-indigo-50/50 text-indigo-600 border-indigo-100/50',
    pink: 'bg-pink-50/50 text-pink-600 border-pink-100/50',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-lg hover:border-slate-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colors[color] || colors.slate}`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {trend !== undefined && (
            <TrendingUp size={12} className={trend >= 0 ? 'text-emerald-400' : 'text-red-400'} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const DashboardGrid = ({ children, cols = 4 }) => {
  const gridCols = {
    4: 'lg:grid-cols-4',
    5: 'xl:grid-cols-5 lg:grid-cols-3',
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols[cols] || gridCols[4]} gap-5`}>
      {children}
    </div>
  );
};
