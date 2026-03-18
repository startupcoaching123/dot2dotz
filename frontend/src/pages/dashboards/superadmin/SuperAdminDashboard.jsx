import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import ClientsList from '../../../components/Dashboard/ClientsList';
import VendorsList from '../../../components/Dashboard/VendorsList';
import LeadsList from '../../../components/Dashboard/LeadsList';
import {
  Users, ShieldCheck, Activity, Globe,
  Settings, Database, CreditCard, AlertCircle,
  MoreVertical, Check, X, Search, Filter, Mail, Phone, Building2, Truck, Layers
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientsRes = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_CLIENTS}?active=true&verified=true`, {
          method: 'GET',
        });
        if (!clientsRes.ok) throw new Error('Failed to fetch clients');
        const clientsData = await clientsRes.json();

        // Fetch vendors
        const vendorsRes = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}?active=true&verified=true`, {
          method: 'GET',
        });
        if (!vendorsRes.ok) throw new Error('Failed to fetch vendors');
        const vendorsData = await vendorsRes.json();

        // Fetch admins
        const adminsRes = await fetchWithAuth(AUTH_ENDPOINTS.ADMIN, {
          method: 'GET',
        });
        if (!adminsRes.ok) throw new Error('Failed to fetch admins');
        const adminsData = await adminsRes.json();

        // Fetch vehicles
        const vehiclesRes = await fetchWithAuth(AUTH_ENDPOINTS.VEHICLES, {
          method: 'GET',
        });
        const vehiclesData = vehiclesRes.ok ? await vehiclesRes.json() : { data: [] };

        // Fetch leads
        const leadsRes = await fetchWithAuth(AUTH_ENDPOINTS.LEADS, {
          method: 'GET',
        });
        const leadsData = leadsRes.ok ? await leadsRes.json() : { data: [] };

        // Robust extraction for clients
        const clientList = clientsData.data || clientsData.clients || clientsData;
        setClients(Array.isArray(clientList) ? clientList : []);

        const vendorList = vendorsData.data || vendorsData.vendors || vendorsData;
        setVendors(Array.isArray(vendorList) ? vendorList : []);

        // Robust extraction for admins
        const adminList = adminsData.data || adminsData.admins || adminsData;
        setAdmins(Array.isArray(adminList) ? adminList : []);

        // Extraction for vehicles
        const vehicleList = vehiclesData.data || vehiclesData.vehicles || vehiclesData;
        setVehiclesCount(Array.isArray(vehicleList) ? vehicleList.length : 0);

        // Extraction for leads
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

  const [vehiclesCount, setVehiclesCount] = useState(0);

  const handleAdminClick = async (admin) => {
    try {
      console.log(admin)
      // Fetch detailed admin information by ID
      const adminDetailsRes = await fetchWithAuth(`${AUTH_ENDPOINTS.ADMIN}/${admin.adminId}`, {
        method: 'GET',
      });

      if (adminDetailsRes.ok) {
        const adminDetailsData = await adminDetailsRes.json();
        const detailedAdmin = adminDetailsData.data || adminDetailsData;
        setSelectedAdmin(detailedAdmin);
        setShowAdminDetails(true);
      } else {
        // If detailed fetch fails, use the basic admin data
        setSelectedAdmin(admin);
        setShowAdminDetails(true);
      }
    } catch (err) {
      // If there's an error, use the basic admin data
      setSelectedAdmin(admin);
      setShowAdminDetails(true);
    }
  };

  const toggleAdminStatus = async (adminId, currentStatus) => {
    try {
      const response = await fetchWithAuth(`${AUTH_ENDPOINTS.ADMIN}/${adminId}/status?active=${!currentStatus}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        const result = await response.json();
        const updatedAdmin = result.data || result;

        // Update selected admin if it's the current one
        if (selectedAdmin && (selectedAdmin.adminId === adminId || selectedAdmin.id === adminId)) {
          setSelectedAdmin(prev => ({ ...prev, active: !currentStatus }));
        }

        // Update admin in the list
        setAdmins(prev => prev.map(admin =>
          (admin.adminId === adminId || admin.id === adminId)
            ? { ...admin, active: !currentStatus }
            : admin
        ));

        console.log(`Admin ${adminId} ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      } else {
        console.error('Failed to toggle admin status');
      }
    } catch (err) {
      console.error('Error toggling admin status:', err);
    }
  };

  const updateAdminDetails = async (adminId, updateData) => {
    try {
      const response = await fetchWithAuth(`${AUTH_ENDPOINTS.ADMIN}/${adminId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedAdmin = result.data || result;

        // Update selected admin
        if (selectedAdmin && (selectedAdmin.adminId === adminId || selectedAdmin.id === adminId)) {
          setSelectedAdmin(updatedAdmin);
        }

        // Update admin in the list
        setAdmins(prev => prev.map(admin =>
          (admin.adminId === adminId || admin.id === adminId)
            ? updatedAdmin
            : admin
        ));

        console.log('Admin details updated successfully');
        return true;
      } else {
        console.error('Failed to update admin details');
        return false;
      }
    } catch (err) {
      console.error('Error updating admin details:', err);
      return false;
    }
  };

  const toggleAdminDetails = () => {
    setShowAdminDetails(!showAdminDetails);
  };

  const sidebarItems = [
    { icon: Activity, label: 'Overview', path: '/dashboard/super-admin' },
    { icon: Users, label: 'Clients', path: '/dashboard/super-admin/users' },
    { icon: Truck, label: 'Vendors', path: '/dashboard/super-admin/vendors' },
    { icon: Truck, label: 'Vehicles', path: '/dashboard/super-admin/vehicles' },
    { icon: Layers, label: 'Payment Slabs', path: '/dashboard/super-admin/payment-slabs' },
    { icon: ShieldCheck, label: 'Admin Roles', path: '/dashboard/super-admin/roles' },
    { icon: Globe, label: 'Leads', path: '/dashboard/super-admin/leads' },
    { icon: CreditCard, label: 'Transactions', path: '/dashboard/super-admin/finance' },
    { icon: Database, label: 'Payments Logs', path: '/dashboard/super-admin/logs' },
    { icon: Settings, label: 'System Settings', path: '/dashboard/super-admin/settings' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Super Admin">
      <div className="space-y-8">
        <DashboardGrid>
          <StatCard title="Total Clients" value={clients.length} icon={Users} trend={12} color="blue" />
          <StatCard title="Total Vendors" value={vendors.length} icon={Truck} trend={8} color="orange" />
          <StatCard title="Total Admins" value={admins.length} icon={ShieldCheck} trend={0.2} color="green" />
          <StatCard title="Total Leads" value={leads.length} icon={Activity} trend={15} color="indigo" />
          <StatCard title="Vehicle Catalog" value={vehiclesCount} icon={Truck} trend={5} color="red" />
        </DashboardGrid>

        {/* Admin Management Section */}
        {/* <AdminManagement /> */}

        {/* Admin List Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
                Admin Accounts
              </h3>
              <p className="text-slate-500 text-sm mt-1 ml-4">Found {admins.length} admin accounts</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search admins..."
                  className="w-full pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:border-green-600 transition-all"
                />
              </div>
              <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-semibold text-xs">Fetching admins...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={32} />
                </div>
                <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">No admin accounts found</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-semibold uppercase text-slate-400 tracking-wider">Admin Details</th>
                    <th className="px-8 py-4 text-xs font-semibold uppercase text-slate-400 tracking-wider">Contact</th>
                    <th className="px-8 py-4 text-xs font-semibold uppercase text-slate-400 tracking-wider">Role</th>
                    <th className="px-8 py-4 text-xs font-semibold uppercase text-slate-400 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => handleAdminClick(admin)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
                            {admin.name?.charAt(0) || admin.emailID?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors uppercase">
                              {admin.name || 'Unknown'}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <ShieldCheck size={12} className="text-slate-300" />
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                {admin.assignedRole || admin.role || 'Admin'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 group/contact">
                            <Mail size={14} className="text-slate-300 group-hover/contact:text-blue-500 transition-colors" />
                            <p className="text-xs font-medium text-slate-600">{admin.emailID}</p>
                          </div>
                          {admin.mobileNo && (
                            <div className="flex items-center gap-2 group/contact">
                              <Phone size={14} className="text-slate-300 group-hover/contact:text-green-500 transition-colors" />
                              <p className="text-xs font-medium text-slate-600">{admin.mobileNo}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-green-100">
                          {admin.assignedRole || admin.role || 'Administrator'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all border border-blue-100"
                            title="Edit"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Settings size={18} />
                          </button>
                          <button
                            className={`p-2 rounded-lg transition-all border ${admin.active
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-100'
                              }`}
                            title={admin.active ? 'Disable Admin' : 'Enable Admin'}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAdminStatus(admin.adminId || admin.id, admin.active);
                            }}
                          >
                            {admin.active ? <X size={18} /> : <Check size={18} />}
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={18} />
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

        {/* Admin Details Section */}
        {selectedAdmin && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
                  Admin Details
                </h3>
                <p className="text-slate-500 text-sm mt-1 ml-4">
                  {selectedAdmin.name || selectedAdmin.username || 'Unknown Admin'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAdminDetails}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all border border-green-100 text-sm font-semibold"
                >
                  {showAdminDetails ? 'Hide Details' : 'Show Details'}
                </button>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {showAdminDetails && (
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Section */}
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm mx-auto mb-4">
                        {selectedAdmin.name?.charAt(0) || selectedAdmin.emailID?.charAt(0) || 'A'}
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        {selectedAdmin.name || 'Unknown'}
                      </h4>
                      <div className="flex flex-col gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-green-100">
                          {selectedAdmin.assignedRole || selectedAdmin.role || 'Administrator'}
                        </span>
                        {(selectedAdmin.adminId === 1 || selectedAdmin.id === 1) && (
                          <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-purple-100">
                            Super Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest">Contact Information</h5>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-slate-300" />
                            <div>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email</p>
                              <p className="text-sm font-semibold text-slate-900">{selectedAdmin.emailID}</p>
                            </div>
                          </div>
                          {selectedAdmin.mobileNo && (
                            <div className="flex items-center gap-3">
                              <Phone size={16} className="text-slate-300" />
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Phone</p>
                                <p className="text-sm font-semibold text-slate-900">{selectedAdmin.mobileNo}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Information</h5>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <ShieldCheck size={16} className="text-slate-300" />
                            <div>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Admin ID</p>
                              <p className="text-sm font-semibold text-slate-900">#{selectedAdmin.adminId || selectedAdmin.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <ShieldCheck size={16} className="text-green-500" />
                            <div>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</p>
                              <p className="text-sm font-semibold text-green-600">{selectedAdmin.active ? 'Active' : 'Inactive'}</p>
                            </div>
                          </div>
                          {selectedAdmin.designation && (
                            <div className="flex items-center gap-3">
                              <Settings size={16} className="text-blue-500" />
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Designation</p>
                                <p className="text-sm font-semibold text-slate-900">{selectedAdmin.designation}</p>
                              </div>
                            </div>
                          )}
                          {selectedAdmin.dateOfJoining && (
                            <div className="flex items-center gap-3">
                              <Activity size={16} className="text-amber-500" />
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date of Joining</p>
                                <p className="text-sm font-semibold text-slate-900">{new Date(selectedAdmin.dateOfJoining).toLocaleDateString()}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Actions */}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <button
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-100 text-sm font-semibold flex items-center gap-2"
                        onClick={() => {
                          // Simple edit functionality - you can expand this with a modal
                          const newName = prompt('Enter new name:', selectedAdmin.name);
                          if (newName && newName !== selectedAdmin.name) {
                            updateAdminDetails(selectedAdmin.adminId || selectedAdmin.id, { name: newName });
                          }
                        }}
                      >
                        <Settings size={16} />
                        Edit Admin
                      </button>
                      <button className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all border border-amber-100 text-sm font-semibold flex items-center gap-2">
                        <ShieldCheck size={16} />
                        Manage Permissions
                      </button>
                      <button
                        className={`px-4 py-2 rounded-xl transition-all border text-sm font-semibold flex items-center gap-2 ${selectedAdmin.active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-100'
                          }`}
                        onClick={() => toggleAdminStatus(selectedAdmin.adminId || selectedAdmin.id, selectedAdmin.active)}
                      >
                        {selectedAdmin.active ? <X size={16} /> : <Check size={16} />}
                        {selectedAdmin.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Client & Vendor Management Sections */}
        <div className="space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === 'clients' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === 'vendors' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Vendors
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === 'leads' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Leads
            </button>
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'clients' ? (
              <ClientsList active={true} verified={false} title="Pending Client Verifications" />
            ) : activeTab === 'vendors' ? (
              <VendorsList active={true} verified={false} title="Pending Vendor Verifications" />
            ) : (
              <LeadsList title="Recent Platform Leads" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Platform Activity
            </h3>
            <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Activity Graph Placeholder</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-slate-900 rounded-full"></span>
              Recent System Logs
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-semibold">New Sub-Admin Created</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">2 mins ago • user_mgmt_service</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-semibold text-slate-400 hover:text-slate-900 uppercase tracking-wider">View</button>
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
