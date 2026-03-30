import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Phone, Mail, User, Package, 
  TrendingUp, TrendingDown, DollarSign, Truck, AlertTriangle,
  CheckCircle2, Info, Filter, Search, Download, Eye, Edit,
  ChevronRight, ChevronDown, Plus, X, Star, Shield, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Shipment Card Component
export const ShipmentCard = ({ shipment, onClick, detailed = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Transit': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delayed': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Processing': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Delayed': return 'bg-orange-500';
      case 'In Transit': return 'bg-blue-600';
      case 'Processing': return 'bg-purple-600';
      default: return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, shadow: "0 8px 30px rgba(0,0,0,0.12)" }}
      className="bg-white rounded-xl border border-slate-200 p-6 cursor-pointer transition-all hover:border-blue-200"
      onClick={() => onClick && onClick(shipment)}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border border-blue-100">
            <Truck size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{shipment.goods}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm font-medium text-blue-600">{shipment.id}</span>
              <span className="text-sm text-slate-500">{shipment.date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-6">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide">From</p>
              <p className="text-sm font-semibold text-slate-900">{shipment.from}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide">To</p>
              <p className="text-sm font-semibold text-slate-900">{shipment.to}</p>
            </div>
          </div>

          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(shipment.status)}`}>
              {shipment.status}
            </span>
          </div>
        </div>
      </div>

      {detailed && shipment.status !== 'Delivered' && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-slate-500">Transit Progress</p>
                <p className="text-sm font-semibold text-blue-600">{shipment.progress}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Est. Delivery</p>
                <p className="text-sm font-semibold text-slate-900">{shipment.estimatedDelivery}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Driver</p>
              <p className="text-sm font-semibold text-slate-900">{shipment.driver}</p>
              <p className="text-xs text-slate-500">{shipment.vehicle}</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${shipment.progress}%` }}
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(shipment.status)}`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Notification Panel Component
export const NotificationPanel = ({ notifications, onNotificationClick }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={16} className="text-red-500" />;
      case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'info': return <Info size={16} className="text-blue-500" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
            {notifications.filter(n => !n.read).length} New
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                notification.read 
                  ? 'bg-slate-50 border-slate-100' 
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}
              onClick={() => onNotificationClick && onNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Quick Stats Component
export const QuickStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const statItems = [
    {
      label: 'Active Shipments',
      value: stats.activeShipments,
      icon: Package,
      color: 'blue',
      trend: 12
    },
    {
      label: 'Total Spent (MTD)',
      value: formatCurrency(stats.totalSpent),
      icon: DollarSign,
      color: 'green',
      trend: 8
    },
    {
      label: 'On-Time Delivery',
      value: `${stats.onTimeDelivery}%`,
      icon: CheckCircle2,
      color: 'indigo',
      trend: 2
    },
    {
      label: 'Saved Addresses',
      value: stats.savedAddresses,
      icon: MapPin,
      color: 'purple',
      trend: 0
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'green' ? 'bg-green-50 text-green-600' :
              stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
              'bg-purple-50 text-purple-600'
            }`}>
              <stat.icon size={24} />
            </div>
            {stat.trend !== 0 && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                stat.trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(stat.trend)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Performance Card Component
export const PerformanceCard = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
        <TrendingUp size={24} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Performance Insights</h3>
      <p className="text-indigo-100 text-sm mb-6">
        {data.insight || 'Your logistics efficiency has improved this month.'}
      </p>
      <div className="space-y-3">
        {data.metrics?.map((metric, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-indigo-100">{metric.label}</span>
            <span className="text-sm font-semibold">{metric.value}</span>
          </div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2.5 bg-white text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors"
      >
        View Detailed Analytics
      </motion.button>
    </div>
  );
};

// Quick Actions Grid Component
export const QuickActionsGrid = ({ actions }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className={`p-4 rounded-xl border-2 border-dashed hover:border-solid transition-all group ${
              action.color === 'blue' ? 'border-blue-200 hover:border-blue-500 hover:bg-blue-50' :
              action.color === 'green' ? 'border-green-200 hover:border-green-500 hover:bg-green-50' :
              action.color === 'purple' ? 'border-purple-200 hover:border-purple-500 hover:bg-purple-50' :
              'border-orange-200 hover:border-orange-500 hover:bg-orange-50'
            }`}
          >
            <action.icon size={24} className={`mx-auto mb-2 ${
              action.color === 'blue' ? 'text-blue-600 group-hover:text-blue-700' :
              action.color === 'green' ? 'text-green-600 group-hover:text-green-700' :
              action.color === 'purple' ? 'text-purple-600 group-hover:text-purple-700' :
              'text-orange-600 group-hover:text-orange-700'
            }`} />
            <span className="text-sm font-medium text-slate-700">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Support Card Component
export const SupportCard = ({ type = 'basic' }) => {
  if (type === 'enterprise') {
    return (
      <div className="bg-slate-900 rounded-xl p-6 text-white text-center shadow-xl">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
          <User size={24} className="text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Dedicated Support</h3>
        <p className="text-slate-400 text-sm mb-6">
          Your account manager is available 24/7 for enterprise needs.
        </p>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            Contact Manager
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition-colors"
          >
            View Help Center
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 text-white text-center shadow-xl">
      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
        <User size={24} className="text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
      <p className="text-slate-400 text-sm mb-6">
        Our support team is available to help you with your shipments.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
      >
        Contact Support
      </motion.button>
    </div>
  );
};

// Search Bar Component
export const SearchBar = ({ placeholder, onSearch, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full"
      />
    </form>
  );
};

// Filter Dropdown Component
export const FilterDropdown = ({ filters, onFilterChange, activeFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = (key, value) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Filter size={16} />
        Filters
        {Object.keys(activeFilters).length > 0 && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
            {Object.keys(activeFilters).length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50"
          >
            <div className="p-4">
              {filters.map((filter) => (
                <div key={filter.key} className="mb-4 last:mb-0">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">{filter.label}</label>
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.key]?.includes(option.value) || false}
                          onChange={() => toggleFilter(filter.key, option.value)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
