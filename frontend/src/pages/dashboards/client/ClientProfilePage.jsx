import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { AUTH_ENDPOINTS } from '../../../api/endpoints';
import fetchWithAuth from '../../../FetchWithAuth';
import { useToast } from '../../../components/Toast/Toast';
import { 
  Package, Plus, FileText, Clock, History, CreditCard, User, UserCircle, 
  Building2, Phone, Mail, MapPin, CreditCard as BankIcon, Upload, Check, AlertCircle, Loader2, Lock
} from 'lucide-react';

const ClientProfilePage = () => {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [clientData, setClientData] = useState(null);
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Expose the same sidebar items for continuity
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

  const [formData, setFormData] = useState({
    bankName: '',
    accountNo: '',
    ifscCode: '',
    branchAddress: '',
    mobile: '',
    email: '',
    gstSlab: '',
    gst: ''
  });

  const clientId = user?.entityId || user?.userId || user?.clientId || user?.id;

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const res = await fetchWithAuth(AUTH_ENDPOINTS.CLIENT_DETAILS(clientId), { method: 'GET' });
        
        if (res.ok) {
          const data = await res.json();
          const clientData = data.data;
          setClientData(clientData);
          setFormData({
            bankName: clientData.bankName || '',
            accountNo: clientData.accountNo || '',
            ifscCode: clientData.ifscCode || '',
            branchAddress: clientData.branchAddress || '',
            mobile: clientData.mobile || '',
            email: clientData.email || '',
            gstSlab: clientData.gstSlab || '',
            gst: clientData.gst || ''
          });
        } else {
          toastError('Failed to load profile details');
        }
      } catch (err) {
        toastError('Network error while loading profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientDetails();
    } else if (!user) {
      // If user isn't fully loaded yet, wait
      return;
    } else {
      setLoading(false);
      toastError('Profile context could not be established');
    }
  }, [clientId, user, toastError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordDataChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toastError('Please fill all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toastError('New passwords do not match');
      return;
    }
    setChangingPassword(true);
    
    try {
      const res = await fetchWithAuth(AUTH_ENDPOINTS.CHANGE_CLIENT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toastSuccess('Password updated successfully');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toastError(data.message || 'Failed to update password');
      }
    } catch (err) {
      toastError('Network error while updating password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        ...formData,
        gstSlab: formData.gstSlab ? parseInt(formData.gstSlab) : null
      };

      const res = await fetchWithAuth(AUTH_ENDPOINTS.UPDATE_CLIENT(clientId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toastSuccess('Profile updated successfully');
        setClientData(prev => ({ ...prev, ...formData })); // Optimistic update
      } else {
        toastError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toastError('Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} roleName="Client">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex border border-blue-100 items-center justify-center shadow-sm">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                {clientData?.companyName || 'Corporate Client'}
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${clientData?.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {clientData?.companyType || 'Enterprise'} Type • ID: {clientData?.clientId || clientId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
               <span className="text-xs text-slate-400 block mb-0.5">Verification Status</span>
               {clientData?.verified ? (
                 <span className="text-sm font-semibold text-green-600 flex items-center gap-1.5"><Check size={14}/> Verified Profile</span>
               ) : (
                 <span className="text-sm font-semibold text-orange-600 flex items-center gap-1.5"><AlertCircle size={14}/> Unverified</span>
               )}
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account & Contact Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <UserCircle size={20} className="text-slate-500" />
                  Contact Information
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Official Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      placeholder="company@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel" 
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <BankIcon size={20} className="text-slate-500" />
                  Banking Details
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Bank Name</label>
                  <input 
                    type="text" 
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Account Number</label>
                  <input 
                    type="text" 
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="Enter Account Number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">IFSC Code</label>
                  <input 
                    type="text" 
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all uppercase"
                    placeholder="e.g. HDFC0001234"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Branch Address</label>
                  <input 
                    type="text" 
                    name="branchAddress"
                    value={formData.branchAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-5 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Lock size={20} className="text-slate-500" />
                  Security & Password
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <input 
                      type="password" 
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordDataChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="hidden md:block"></div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordDataChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordDataChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    type="button"
                    onClick={handlePasswordSubmit}
                    disabled={changingPassword}
                    className="px-5 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                  >
                    {changingPassword && <Loader2 size={16} className="animate-spin" />}
                    Update Password
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Tax Settings */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="border-b border-slate-200 px-6 py-5 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText size={20} className="text-slate-500" />
                  Tax & Registration
                </h3>
              </div>
              <div className="p-6 space-y-6">
                 
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">GST Number</label>
                  <input 
                    type="text" 
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all uppercase"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">GST Slab (%)</label>
                  <select 
                    name="gstSlab"
                    value={formData.gstSlab}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Slab</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                
                {/* Read-only fields from backend for context */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">PAN Number:</span>
                    <span className="font-medium text-slate-900">{clientData?.panNo || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Registered On:</span>
                    <span className="font-medium text-slate-900">
                      {clientData?.registeredOn ? new Date(clientData.registeredOn).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 mb-3 shadow-sm">
                 <Upload size={20} className="text-blue-600" />
               </div>
               <h4 className="text-sm font-semibold text-slate-900 mb-1">Upload Documents</h4>
               <p className="text-xs text-slate-500 mb-4">Need to update GST or PAN certificate?</p>
               <button type="button" className="text-blue-600 text-sm font-medium hover:underline">Go to Document Vault</button>
            </div>

          </div>
          
          {/* Action Footer */}
          <div className="lg:col-span-3 flex justify-end items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-2">
            <button 
              type="button"
              className="px-6 py-2.5 text-slate-600 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default ClientProfilePage;
