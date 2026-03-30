import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import ClientsList from '../../../components/Dashboard/ClientsList';
import VendorsList from '../../../components/Dashboard/VendorsList';
import LeadsList from '../../../components/Dashboard/LeadsList';
import {
  Users, ShieldCheck, Activity, Globe,
  Settings, Database, CreditCard, AlertCircle,
  MoreVertical, Check, X, Search, Filter, Mail, Phone, Building2, Truck, Layers, ChevronDown, ChevronUp
} from 'lucide-react';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../api/endpoints';
import fetchWithAuth from '../../../FetchWithAuth';

const SuperAdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('clients');
  const [vehiclesCount, setVehiclesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsRes = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_CLIENTS}?active=true&verified=true`, { method: 'GET' });
        if (!clientsRes.ok) throw new Error('Failed to fetch clients');
        const clientsData = await clientsRes.json();

        const vendorsRes = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}?active=true&verified=true`, { method: 'GET' });
        if (!vendorsRes.ok) throw new Error('Failed to fetch vendors');
        const vendorsData = await vendorsRes.json();

        const adminsRes = await fetchWithAuth(AUTH_ENDPOINTS.ADMIN, { method: 'GET' });
        if (!adminsRes.ok) throw new Error('Failed to fetch admins');
        const adminsData = await adminsRes.json();

        const vehiclesRes = await fetchWithAuth(AUTH_ENDPOINTS.VEHICLES, { method: 'GET' });
        const vehiclesData = vehiclesRes.ok ? await vehiclesRes.json() : { data: [] };

        const leadsRes = await fetchWithAuth(AUTH_ENDPOINTS.LEADS, { method: 'GET' });
        const leadsData = leadsRes.ok ? await leadsRes.json() : { data: [] };

        const clientList = clientsData.data || clientsData.clients || clientsData;
        setClients(Array.isArray(clientList) ? clientList : []);

        const vendorList = vendorsData.data || vendorsData.vendors || vendorsData;
        setVendors(Array.isArray(vendorList) ? vendorList : []);

        const adminList = adminsData.data || adminsData.admins || adminsData;
        setAdmins(Array.isArray(adminList) ? adminList : []);

        const vehicleList = vehiclesData.data || vehiclesData.vehicles || vehiclesData;
        setVehiclesCount(Array.isArray(vehicleList) ? vehicleList.length : 0);

        const leadList = leadsData.data || leadsData.leads || leadsData;
        setLeads(Array.isArray(leadList) ? leadList : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdminClick = async (admin) => {
    try {
      const adminDetailsRes = await fetchWithAuth(`${AUTH_ENDPOINTS.ADMIN}/${admin.adminId}`, { method: 'GET' });
      if (adminDetailsRes.ok) {
        const adminDetailsData = await adminDetailsRes.json();
        const detailedAdmin = adminDetailsData.data || adminDetailsData;
        setSelectedAdmin(detailedAdmin);
        setShowAdminDetails(true);
      } else {
        setSelectedAdmin(admin);
        setShowAdminDetails(true);
      }
    } catch (err) {
      setSelectedAdmin(admin);
      setShowAdminDetails(true);
    }
  };

  const toggleAdminStatus = async (adminId, currentStatus) => {
    try {
      const response = await fetchWithAuth(`${AUTH_ENDPOINTS.ADMIN}/${adminId}/status?active=${!currentStatus}`, { method: 'PATCH' });
      if (response.ok) {
        if (selectedAdmin && (selectedAdmin.adminId === adminId || selectedAdmin.id === adminId)) {
          setSelectedAdmin(prev => ({ ...prev, active: !currentStatus }));
        }
        setAdmins(prev => prev.map(admin =>
          (admin.adminId === adminId || admin.id === adminId) ? { ...admin, active: !currentStatus } : admin
        ));
      }
    } catch (err) {
      console.error('Error toggling admin status:', err);
    }
  };

  const updateAdminDetails = async (adminId, updateData) => {
    try {
      const response = await fetchWithAuth(`${AUTH_ENDPOINTS.ADMIN}/${adminId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedAdmin = result.data || result;
        if (selectedAdmin && (selectedAdmin.adminId === adminId || selectedAdmin.id === adminId)) {
          setSelectedAdmin(updatedAdmin);
        }
        setAdmins(prev => prev.map(admin =>
          (admin.adminId === adminId || admin.id === adminId) ? updatedAdmin : admin
        ));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating admin details:', err);
      return false;
    }
  };

  const sidebarItems = [
    { icon: Activity, label: 'Overview', path: '/dashboard/super-admin' },
    { icon: Users, label: 'Clients', path: '/dashboard/super-admin/users' },
    { icon: Truck, label: 'Vendors', path: '/dashboard/super-admin/vendors' },
    { icon: Truck, label: 'Vehicles', path: '/dashboard/super-admin/vehicles' },
    { icon: Layers, label: 'Payment Slabs', path: '/dashboard/super-admin/payment-slabs' },
    { icon: ShieldCheck, label: 'Admin Roles', path: '/dashboard/super-admin/roles' },
    { icon: Globe, label: 'Leads', path: '/dashboard/super-admin/leads' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Super Admin">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Top Stats Grid */}
        <DashboardGrid cols={5}>
          <StatCard title="Total Clients" value={clients.length} icon={Users} trend={12} color="blue" />
          <StatCard title="Total Vendors" value={vendors.length} icon={Truck} trend={8} color="orange" />
          <StatCard title="Total Admins" value={admins.length} icon={ShieldCheck} trend={0.2} color="green" />
          <StatCard title="Total Leads" value={leads.length} icon={Activity} trend={15} color="indigo" />
          <StatCard title="Vehicle Catalog" value={vehiclesCount} icon={Truck} trend={5} color="red" />
        </DashboardGrid>

        {/* Admin Details Section (Appears above list when active for better UX) */}
        {selectedAdmin && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                  Personnel Profile
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAdminDetails(!showAdminDetails)}
                  className="px-5 py-2.5 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 text-sm font-bold flex items-center gap-2 shadow-sm"
                >
                  {showAdminDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {showAdminDetails ? 'Hide' : 'Expand'}
                </button>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="p-2.5 bg-white text-slate-400 hover:text-red-600 rounded-xl transition-all border border-slate-200 shadow-sm hover:border-red-100 hover:bg-red-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {showAdminDetails && (
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-12">

                  {/* Profile Left Column */}
                  <div className="lg:w-1/3 flex flex-col items-center text-center space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-tr from-indigo-100 to-blue-50 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-black shadow-inner border-4 border-white ring-1 ring-slate-100">
                      {selectedAdmin.name?.charAt(0) || selectedAdmin.emailID?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                        {selectedAdmin.name || 'Unknown User'}
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-widest rounded-full">
                          {selectedAdmin.assignedRole || selectedAdmin.role || 'Administrator'}
                        </span>
                        {(selectedAdmin.adminId === 1 || selectedAdmin.id === 1) && (
                          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-widest rounded-full">
                            Super Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details Right Column */}
                  <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Contact Info */}
                    <div className="space-y-6">
                      <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Data</h5>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4 group">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Mail size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{selectedAdmin.emailID}</p>
                          </div>
                        </div>
                        {selectedAdmin.mobileNo && (
                          <div className="flex items-start gap-4 group">
                            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                              <Phone size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</p>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">{selectedAdmin.mobileNo}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="space-y-6">
                      <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">System Data</h5>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">System ID</p>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5 font-mono">#{selectedAdmin.adminId || selectedAdmin.id}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl ${selectedAdmin.active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <Activity size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Status</p>
                            <p className={`text-sm font-bold mt-0.5 ${selectedAdmin.active ? 'text-emerald-600' : 'text-red-600'}`}>
                              {selectedAdmin.active ? 'Active Account' : 'Suspended'}
                            </p>
                          </div>
                        </div>
                        {selectedAdmin.dateOfJoining && (
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                              <Activity size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Joined Date</p>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                {new Date(selectedAdmin.dateOfJoining).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap justify-end gap-3">
                  <button
                    className="px-6 py-2.5 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 text-sm font-bold flex items-center gap-2 shadow-sm"
                    onClick={() => {
                      const newName = prompt('Enter new name:', selectedAdmin.name);
                      if (newName && newName !== selectedAdmin.name) {
                        updateAdminDetails(selectedAdmin.adminId || selectedAdmin.id, { name: newName });
                      }
                    }}
                  >
                    <Settings size={16} /> Edit Profile
                  </button>
                  <button className="px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100 text-sm font-bold flex items-center gap-2">
                    <ShieldCheck size={16} /> Permissions
                  </button>
                  <button
                    className={`px-6 py-2.5 rounded-xl transition-all border text-sm font-bold flex items-center gap-2 shadow-sm ${selectedAdmin.active
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                      }`}
                    onClick={() => toggleAdminStatus(selectedAdmin.adminId || selectedAdmin.id, selectedAdmin.active)}
                  >
                    {selectedAdmin.active ? <X size={16} /> : <Check size={16} />}
                    {selectedAdmin.active ? 'Suspend Account' : 'Activate Account'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin List Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:px-8 md:py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Admin Directory</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">{admins.length} Systems Personnel</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
              <button className="p-2.5 bg-white text-slate-600 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 shadow-sm">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Syncing Data...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                  <ShieldCheck size={28} />
                </div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Records Found</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-8 py-4 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Personnel Details</th>
                    <th className="px-8 py-4 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Reach</th>
                    <th className="px-8 py-4 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Access Tier</th>
                    <th className="px-8 py-4 text-[11px] font-semibold uppercase text-slate-400 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => handleAdminClick(admin)}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-sm font-black border border-indigo-100 shadow-sm">
                            {admin.name?.charAt(0) || admin.emailID?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {admin.name || 'Unknown'}
                            </p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">#{admin.adminId || admin.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                            <Mail size={12} className="text-slate-400" /> {admin.emailID}
                          </p>
                          {admin.mobileNo && (
                            <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                              <Phone size={12} className="text-slate-400" /> {admin.mobileNo}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200">
                          {admin.assignedRole || admin.role || 'Admin'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Settings size={16} />
                          </button>
                          <button
                            className={`p-2 rounded-lg transition-all ${admin.active ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAdminStatus(admin.adminId || admin.id, admin.active);
                            }}
                          >
                            {admin.active ? <X size={16} /> : <Check size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Dynamic List Section (Clients/Vendors/Leads) */}
        <div className="space-y-6">
          {/* Segmented Control Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-2xl w-fit border border-slate-100 ml-auto md:ml-0">
            {[
              { id: 'clients', label: 'Clients' },
              { id: 'vendors', label: 'Vendors' },
              { id: 'leads', label: 'Leads' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-10 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-md border border-slate-100'
                  : 'text-slate-400 hover:text-slate-500 hover:bg-white/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-6 min-h-[400px]">
            {activeTab === 'clients' ? (
              <ClientsList active={true} verified={false} title="Pending Verifications" />
            ) : activeTab === 'vendors' ? (
              <VendorsList active={true} verified={false} title="Pending Verifications" />
            ) : (
              <LeadsList title="Platform Leads" />
            )}
          </div>
        </div>

        {/* Bottom Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">

          {/* Chart Widget */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100/50 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">Analytics</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Platform Activity</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={16} />
              </div>
            </div>
            <div className="h-64 bg-slate-50/20 rounded-2xl flex flex-col items-center justify-center border border-slate-100 relative group-hover:bg-slate-50/40 transition-colors">
              <Activity size={24} className="text-slate-100 mb-2" />
              <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">Active Data Stream</p>
            </div>
          </div>

          {/* Logs Widget */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100/50 shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">System Events</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Live Notifications</p>
              </div>
              <button className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-700">View All</button>
            </div>
            <div className="space-y-3 flex-grow">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group/item">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full group-hover/item:bg-indigo-500 transition-colors shadow-[0_0_8px_rgba(99,102,241,0.2)]"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Client Access Granted</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">2m ago • auth_id: 284</p>
                    </div>
                  </div>
                  <button className="text-[9px] font-bold text-transparent group-hover/item:text-slate-300 uppercase tracking-widest transition-colors">Details</button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;