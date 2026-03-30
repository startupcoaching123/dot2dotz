import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import {
  Package, Plus, Search, MapPin, FileText,
  History, User, ArrowRight,
  TrendingUp, CreditCard, Clock, CheckCircle2, ChevronRight, UserCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ClientOwnerDashboard = () => {
  const { user } = useAuth();

  const sidebarItems = [
    { icon: Package, label: 'Overview', path: '/dashboard/client' },
    { icon: FileText, label: 'Leads', path: '/dashboard/client/leads' },
    { icon: Plus, label: 'New Shipment', path: '/dashboard/client/new' },
    { icon: Clock, label: 'Active Tracking', path: '/dashboard/client/track' },
    { icon: History, label: 'Shipment History', path: '/dashboard/client/history' },
    { icon: CreditCard, label: 'Billing & Invoices', path: '/dashboard/client/billing' },
    { icon: User, label: 'Team Management', path: '/dashboard/client/team' },
    { icon: UserCircle, label: 'Profile', path: '/dashboard/client/profile' },
  ];

  const recentShipments = [
    { id: 'FTL-8821', goods: 'Electronic Components', from: 'Mumbai', to: 'Bangalore', status: 'In Transit', progress: 65, date: '2 hours ago' },
    { id: 'FTL-8819', goods: 'Industrial Machinery', from: 'Pune', to: 'Chennai', status: 'Delayed', progress: 40, date: '5 hours ago' },
    { id: 'FTL-8815', goods: 'Pharma Supplies', from: 'Ahmedabad', to: 'Hyderabad', status: 'Delivered', progress: 100, date: 'Yesterday' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client Owner">
      <div className="space-y-6 pb-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Master Control
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Live Enterprise Operations • {user?.companyName || 'Corporate Client'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                placeholder="Track Shipment ID..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <Link
              to="/dashboard/client/new"
              className="flex w-full sm:w-auto justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={18} />
              New Booking
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardGrid>
          <StatCard title="Active Loads" value="08" icon={Package} trend={12} color="blue" />
          <StatCard title="Total Spent" value="₹ 4.2L" icon={CreditCard} trend={8} color="green" />
          <StatCard title="Avg Transit" value="38 hrs" icon={Clock} trend={-5} color="orange" />
          <StatCard title="On-time Rate" value="96.4%" icon={CheckCircle2} trend={2} color="indigo" />
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Shipments Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Live Shipments</h3>
                  <p className="text-sm text-slate-500 mt-1">Real-time status of your active freight</p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">View Analytics</button>
              </div>

              <div className="space-y-4">
                {recentShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 text-blue-600 shrink-0">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{shipment.goods}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{shipment.id} • {shipment.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                      <div className="flex items-center gap-3">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-slate-400">Origin</p>
                          <p className="text-sm font-medium text-slate-900">{shipment.from}</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 mx-2" />
                        <div className="text-left">
                          <p className="text-xs text-slate-400">Destination</p>
                          <p className="text-sm font-medium text-slate-900">{shipment.to}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${shipment.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                            shipment.status === 'Delayed' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                          {shipment.status}
                        </span>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center hidden sm:flex">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar for Active Shipments */}
                    {shipment.status !== 'Delivered' && (
                      <div className="w-full md:w-full mt-2 md:mt-0 col-span-full">
                        <div className="flex justify-between items-center mb-1.5">
                          <p className="text-xs text-slate-500">Transit Progress</p>
                          <p className="text-xs font-medium text-blue-600">{shipment.progress}%</p>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${shipment.progress}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${shipment.status === 'Delayed' ? 'bg-orange-500' : 'bg-blue-600'}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-slate-900 rounded-xl p-6 text-white text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Market Insights</h3>
              <p className="text-slate-400 text-sm mb-6">
                Current demand for MH-DL route is up by 15%. Consider booking in advance for better rates.
              </p>
              <button className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">Analyze Routes</button>
            </div>

            {/* Tracking Support Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="text-blue-600" size={18} />
                Terminal Finder
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Closest Terminal</p>
                    <p className="text-sm font-medium text-slate-900">Navi Mumbai Hub - 4.2 km</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Operational Hours</p>
                    <p className="text-sm font-medium text-slate-900">24/7 Service Active</p>
                  </div>
                </div>
                <button className="w-full py-2 mt-2 text-blue-600 font-medium text-sm hover:underline">Find All Hub Locations</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientOwnerDashboard;
