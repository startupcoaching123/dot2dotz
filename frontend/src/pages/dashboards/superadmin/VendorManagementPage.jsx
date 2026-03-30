import React, { useState } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
    Users, RefreshCw, Activity, ShieldCheck, Globe, CreditCard,
    Database, Settings, Plus, X, Eye, EyeOff, Truck, Layers, Building2
} from 'lucide-react';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../api/endpoints';
import fetchWithAuth from '../../../FetchWithAuth';
import VendorsList from '../../../components/Dashboard/VendorsList';

const VendorManagementPage = () => {
    const [filter, setFilter] = useState('pending'); // all, pending, verified
    const [refreshList, setRefreshList] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        vendorName: '',
        mobile: '',
        phone: '',
        mobile2: '',
        email: '',
        companyType: 'Private Limited',
        companyName: '',
        panNo: '',
        gst: '',
        aadhaar: '',
        registerAddress: '',
        registerState: '',
        registerCity: '',
        registerPinCode: '',
        referBy: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (['mobile', 'phone', 'mobile2'].includes(name)) {
            const val = value.replace(/\D/g, '');
            if (val.length <= 10) setFormData(prev => ({ ...prev, [name]: val }));
            return;
        }

        if (name === 'registerPinCode') {
            const val = value.replace(/\D/g, '');
            if (val.length <= 6) setFormData(prev => ({ ...prev, [name]: val }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const required = ['vendorName', 'mobile', 'email', 'companyName', 'password'];
        const missing = required.filter(field => !formData[field].trim());

        if (missing.length > 0) {
            setCreateError(`Required fields missing: ${missing.join(', ')}`);
            return false;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            setCreateError('Please enter a valid email address.');
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            setCreateError('Mobile number must be 10 digits and start with 6-9.');
            return false;
        }

        if (formData.registerPinCode && formData.registerPinCode.length !== 6) {
            setCreateError('Pincode must be exactly 6 digits.');
            return false;
        }

        if (formData.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo.toUpperCase())) {
            setCreateError('Invalid PAN number format (e.g., ABCDE1234F).');
            return false;
        }

        if (formData.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst.toUpperCase())) {
            setCreateError('Invalid GST number format.');
            return false;
        }

        if (formData.password.length < 8) {
            setCreateError('Password must be at least 8 characters long.');
            return false;
        }

        return true;
    };

    const handleCreateVendor = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsCreating(true);
        setCreateError('');

        try {
            const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.VENDOR_REGISTER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create vendor');
            }

            setFormData({
                vendorName: '', mobile: '', phone: '', mobile2: '', email: '',
                companyType: 'Private Limited', companyName: '', panNo: '', gst: '',
                aadhaar: '', registerAddress: '', registerState: '', registerCity: '',
                registerPinCode: '', referBy: '', password: ''
            });
            setShowCreateModal(false);
            setRefreshList(prev => prev + 1);
        } catch (err) {
            setCreateError(err.message);
        } finally {
            setIsCreating(false);
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
        { icon: CreditCard, label: 'Transactions', path: '/dashboard/super-admin/finance' },
        { icon: Database, label: 'Payments Logs', path: '/dashboard/super-admin/logs' },
        { icon: Settings, label: 'System Settings', path: '/dashboard/super-admin/settings' },
    ];

    const inputClasses = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Super Admin">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Vendors</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage, verify, and monitor your vendor network.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Segmented Control for Filters */}
                        <div className="flex bg-gray-100/80 p-1 rounded-lg border border-gray-200/50">
                            {['all', 'pending', 'verified'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all duration-200 ${filter === f
                                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setRefreshList(prev => prev + 1)}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            title="Refresh List"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {/* List Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <VendorsList
                        active={filter === 'pending' ? true : undefined}
                        verified={filter === 'pending' ? false : filter === 'verified' ? true : undefined}
                        title={filter === 'pending' ? 'Pending Verifications' : filter === 'verified' ? 'Verified Vendors' : 'All Vendors'}
                        refreshTrigger={refreshList}
                        customActions={
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium text-sm hover:bg-orange-700 active:bg-orange-800 transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                            >
                                <Plus size={16} />
                                Add Vendor
                            </button>
                        }
                    />
                </div>

                {/* Create Vendor Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
                        <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Create New Vendor</h2>
                                        <p className="text-gray-500 text-xs mt-0.5">Enter the vendor's professional details to register them.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setCreateError('');
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50">
                                <form id="vendor-form" onSubmit={handleCreateVendor} className="space-y-8">
                                    {createError && (
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                                            <div className="text-red-600 text-sm">{createError}</div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

                                        {/* Left Column: Basic Info */}
                                        <div className="space-y-5">
                                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Primary Contact</h3>

                                            <div>
                                                <label className={labelClasses}>Vendor Name <span className="text-red-500">*</span></label>
                                                <input type="text" name="vendorName" value={formData.vendorName} onChange={handleInputChange} className={inputClasses} placeholder="e.g. John Doe" required />
                                            </div>

                                            <div>
                                                <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
                                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses} placeholder="vendor@example.com" required />
                                            </div>

                                            <div>
                                                <label className={labelClasses}>Mobile Number <span className="text-red-500">*</span></label>
                                                <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className={inputClasses} placeholder="9876543210" maxLength={10} required />
                                            </div>

                                            <div>
                                                <label className={labelClasses}>Password <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className={inputClasses} placeholder="••••••••" required />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1">
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Company Info */}
                                        <div className="space-y-5">
                                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Business Details</h3>

                                            <div>
                                                <label className={labelClasses}>Company Name <span className="text-red-500">*</span></label>
                                                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={inputClasses} placeholder="Acme Corp Ltd." required />
                                            </div>

                                            <div>
                                                <label className={labelClasses}>Company Type</label>
                                                <select name="companyType" value={formData.companyType} onChange={handleInputChange} className={`${inputClasses} cursor-pointer appearance-none`}>
                                                    <option value="Private Limited">Private Limited</option>
                                                    <option value="Public Limited">Public Limited</option>
                                                    <option value="Proprietorship">Proprietorship</option>
                                                    <option value="Partnership">Partnership</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className={labelClasses}>PAN Number</label>
                                                <input type="text" name="panNo" value={formData.panNo} onChange={handleInputChange} className={`${inputClasses} uppercase`} placeholder="ABCDE1234F" maxLength={10} />
                                            </div>

                                            <div>
                                                <label className={labelClasses}>GST Number</label>
                                                <input type="text" name="gst" value={formData.gst} onChange={handleInputChange} className={`${inputClasses} uppercase`} placeholder="27ABCDE1234F1Z5" maxLength={15} />
                                            </div>
                                        </div>

                                        {/* Full Width: Address */}
                                        <div className="md:col-span-2 space-y-5 mt-2">
                                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Registration Address</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="md:col-span-3">
                                                    <label className={labelClasses}>Street Address</label>
                                                    <input type="text" name="registerAddress" value={formData.registerAddress} onChange={handleInputChange} className={inputClasses} placeholder="Plot 45, MIDC, Andheri East" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className={labelClasses}>City</label>
                                                    <input type="text" name="registerCity" value={formData.registerCity} onChange={handleInputChange} className={inputClasses} placeholder="Mumbai" />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className={labelClasses}>Pin Code</label>
                                                    <input type="text" name="registerPinCode" value={formData.registerPinCode} onChange={handleInputChange} className={inputClasses} placeholder="400093" maxLength={6} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 rounded-b-xl">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    form="vendor-form"
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all flex items-center gap-2"
                                >
                                    {isCreating ? 'Creating...' : 'Create Vendor'}
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default VendorManagementPage;