import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import Swal from 'sweetalert2';
import {
  Package, Plus, Search, MapPin, FileText,
  History, CreditCard, Clock, CheckCircle2,
  ChevronRight, UserCircle, Bell, AlertTriangle,
  Truck, BarChart3, Download, Star, Shield,
  TrendingUp, Users, Settings, ArrowRight
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard/client' },
  { icon: FileText, label: 'Leads & Quotes', path: '/dashboard/client/leads' },
  { icon: Plus, label: 'New Shipment', path: '/dashboard/client/new' },
  { icon: Package, label: 'Active Shipments', path: '/dashboard/client/shipments' },
  { icon: Clock, label: 'Live Tracking', path: '/dashboard/client/track' },

  { icon: UserCircle, label: 'Profile', path: '/dashboard/client/profile' },
];

const MOCK_DASHBOARD_DATA = {
  stats: {
    activeShipments: 8,
    totalSpent: 420000,
    onTimeDelivery: 96.4,
    savedAddresses: 12
  },
  recentShipments: [
    { id: 'FTL-8821', goods: 'Electronic Components', from: 'Mumbai', to: 'Bangalore', status: 'In Transit', progress: 65, date: '2 hours ago', estimatedDelivery: 'Oct 26, 2024' },
    { id: 'FTL-8819', goods: 'Industrial Machinery', from: 'Pune', to: 'Chennai', status: 'Delayed', progress: 40, date: '5 hours ago', estimatedDelivery: 'Oct 27, 2024' },
    { id: 'FTL-8815', goods: 'Pharma Supplies', from: 'Ahmedabad', to: 'Hyderabad', status: 'Delivered', progress: 100, date: 'Yesterday', estimatedDelivery: 'Oct 24, 2024' }
  ],
  notifications: [
    { id: 1, type: 'alert', title: 'Shipment Delayed', message: 'FTL-8819 is experiencing delays.', time: '1 hour ago', read: false },
    { id: 2, type: 'success', title: 'Shipment Delivered', message: 'FTL-8815 has been successfully delivered.', time: '2 hours ago', read: false },
    { id: 3, type: 'info', title: 'New Quote Available', message: 'You have a new quote for your recent lead.', time: '3 hours ago', read: true }
  ]
};

const SeparatedClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setTimeout(() => {
          setDashboardData(MOCK_DASHBOARD_DATA);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleDownloadReports = () => {
    Swal.fire({
      icon: 'info',
      title: 'Download Reports',
      text: 'Report download feature will be available soon!',
      confirmButtonColor: '#0f172a'
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
      'Delayed': 'bg-red-50 text-red-700 border-red-200',
      'Pending': 'bg-slate-50 text-slate-600 border-slate-200'
    };
    return styles[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'alert': <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle size={18} className="text-red-600" /></div>,
      'success': <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 size={18} className="text-emerald-600" /></div>,
      'info': <div className="p-2 bg-blue-50 rounded-lg"><Bell size={18} className="text-blue-600" /></div>
    };
    return icons[type] || <div className="p-2 bg-slate-50 rounded-lg"><Bell size={18} className="text-slate-500" /></div>;
  };

  const quickActions = [
    { icon: Plus, label: 'New Booking', action: () => navigate('/dashboard/client/new') },
    { icon: Search, label: 'Track Shipment', action: () => navigate('/dashboard/client/track') },
    { icon: FileText, label: 'Request Quote', action: () => navigate('/dashboard/client/leads') },
    { icon: Download, label: 'Reports', action: handleDownloadReports }
  ];

  if (isLoading || !dashboardData) {
    return (
      <DashboardLayout sidebarItems={SIDEBAR_ITEMS} roleName="Client Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={SIDEBAR_ITEMS} roleName="Client Dashboard">
      {/* Adding a subtle background color to the main container helps white cards pop */}
      <div className="space-y-6 pb-8 max-w-7xl mx-auto font-sans bg-slate-50/30 p-2 md:p-4 rounded-xl">
        
        {/* Header Section - Clearly Boxed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-500 font-medium text-xs tracking-wide uppercase">System Operational</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Welcome, {user?.name || 'Client'}
              </h1>
              <p className="text-slate-500 text-sm">
                {user?.companyName || 'Your Company'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Tracking ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <button
                onClick={() => navigate('/dashboard/client/new')}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Plus size={18} />
                New Shipment
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardGrid>
          <StatCard title="Active Shipments" value={dashboardData.stats.activeShipments} icon={Package} trend={12} />
          <StatCard title="Total Spent (MTD)" value={`₹${(dashboardData.stats.totalSpent / 1000).toFixed(1)}K`} icon={CreditCard} trend={8} />
          <StatCard title="On-Time Delivery" value={`${dashboardData.stats.onTimeDelivery}%`} icon={CheckCircle2} trend={2} />
          <StatCard title="Saved Addresses" value={dashboardData.stats.savedAddresses} icon={MapPin} trend={0} />
        </DashboardGrid>

        {/* Quick Actions - Clearly Boxed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-400 hover:shadow-sm transition-all group flex flex-col items-center gap-3"
              >
                <div className="p-2 bg-white rounded-md border border-slate-200 group-hover:border-slate-900 transition-colors">
                  <action.icon size={20} className="text-slate-600 group-hover:text-slate-900" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Content: Shipments - Clearly Boxed */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Shipments</h3>
                  <p className="text-xs text-slate-500 mt-1">Real-time status of your freight</p>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/client/shipments')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-md"
                >
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {dashboardData.recentShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="border border-slate-200 rounded-xl p-5 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer bg-white"
                    onClick={() => navigate(`/dashboard/client/track/${shipment.id}`)}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                           <Truck size={20} className="text-slate-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{shipment.id}</span>
                            <span className="text-xs text-slate-500 font-medium">{shipment.date}</span>
                          </div>
                          <p className="text-base font-bold text-slate-900">{shipment.goods}</p>
                        </div>
                      </div>

                      {/* Right: Route & Status */}
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                        <div className="flex items-center gap-4 text-center">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Origin</p>
                            <p className="text-sm font-semibold text-slate-800">{shipment.from}</p>
                          </div>
                          <ArrowRight size={16} className="text-slate-300" />
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dest</p>
                            <p className="text-sm font-semibold text-slate-800">{shipment.to}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${getStatusStyle(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </div>
                    </div>

                    {/* Minimal Progress Bar */}
                    {shipment.status !== 'Delivered' && (
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-xs text-slate-500 font-semibold">Transit Progress <span className="text-slate-900">{shipment.progress}%</span></p>
                          <p className="text-xs font-semibold text-slate-900">Est. {shipment.estimatedDelivery}</p>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            style={{ width: `${shipment.progress}%` }}
                            className={`h-full rounded-full transition-all duration-1000 ${
                              shipment.status === 'Delayed' ? 'bg-red-500' : 'bg-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Clearly Boxed */}
          <div className="space-y-6">
            
            {/* Notifications */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">Inbox</h3>
                {dashboardData.notifications.filter(n => !n.read).length > 0 && (
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-xs font-bold">
                    {dashboardData.notifications.filter(n => !n.read).length} New
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                {dashboardData.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-5 transition-colors cursor-pointer flex gap-4 ${
                      notification.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/30 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <p className={`text-sm ${notification.read ? 'text-slate-700 font-semibold' : 'text-slate-900 font-bold'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notification.message}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Insights Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                  <TrendingUp size={20} className="text-slate-700" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Efficiency Up 15%</h3>
              </div>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Logistics costs have decreased this month due to optimized route planning.
              </p>
              
              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-600">Cost Savings</span>
                  <span className="text-sm font-bold text-emerald-600">₹24,500</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-medium text-slate-600">Time Saved</span>
                  <span className="text-sm font-bold text-blue-600">12 hours</span>
                </div>
              </div>
              
              <button className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
                View Full Report
              </button>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeparatedClientDashboard;