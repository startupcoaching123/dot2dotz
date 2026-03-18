import React, { useState } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
    Users, RefreshCw, Activity, ShieldCheck, Globe, CreditCard,
    Database, Settings, Plus, X, User, Lock, Eye, EyeOff, Truck, Layers
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

        // Restriction for mobile numbers (10 digits)
        if (['mobile', 'phone', 'mobile2'].includes(name)) {
            const val = value.replace(/\D/g, ''); // Remove non-digits
            if (val.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: val }));
            }
            return;
        }

        // Restriction for Pincode (6 digits)
        if (name === 'registerPinCode') {
            const val = value.replace(/\D/g, ''); // Remove non-digits
            if (val.length <= 6) {
                setFormData(prev => ({ ...prev, [name]: val }));
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const required = ['vendorName', 'mobile', 'email', 'companyName', 'password'];
        const missing = required.filter(field => !formData[field].trim());

        if (missing.length > 0) {
            setCreateError(`Required fields: ${missing.join(', ')}`);
            return false;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            setCreateError('Invalid email format');
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            setCreateError('Mobile number must be exactly 10 digits and start with 6-9');
            return false;
        }

        if (formData.phone && formData.phone.length !== 10) {
            setCreateError('Phone number must be exactly 10 digits');
            return false;
        }

        if (formData.mobile2 && formData.mobile2.length !== 10) {
            setCreateError('Second mobile number must be exactly 10 digits');
            return false;
        }

        if (formData.registerPinCode && formData.registerPinCode.length !== 6) {
            setCreateError('Pincode must be exactly 6 digits');
            return false;
        }

        if (formData.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo.toUpperCase())) {
            setCreateError('Invalid PAN number format (e.g., ABCDE1234F)');
            return false;
        }

        if (formData.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst.toUpperCase())) {
            setCreateError('Invalid GST number format');
            return false;
        }

        if (formData.password.length < 8) {
            setCreateError('Password must be at least 8 characters');
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create vendor');
            }

            // Reset form and close modal
            setFormData({
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
            setShowCreateModal(false);

            // Refresh vendor list
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

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Super Admin">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-orange-600 pl-4">Vendor Management</h1>
                        <p className="text-slate-500 text-sm mt-1 ml-5">Handle vendor verification and operations</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                            {['all', 'pending', 'verified'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${filter === f ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setRefreshList(prev => prev + 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-orange-600 transition-all shadow-sm"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                <VendorsList
                    active={filter === 'pending' ? true : undefined}
                    verified={filter === 'pending' ? false : filter === 'verified' ? true : undefined}
                    title={filter === 'pending' ? 'Pending Verifications' : filter === 'verified' ? 'Verified Vendors' : 'All Vendors'}
                    refreshTrigger={refreshList}
                    customActions={
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold text-xs hover:bg-orange-700 transition-all shadow-sm"
                        >
                            <Plus size={14} />
                            Add Vendor
                        </button>
                    }
                />

                {/* Create Vendor Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
                            <div className="p-8 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Create New Vendor</h2>
                                        <p className="text-slate-500 text-sm mt-1">Register a new vendor account</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setCreateError('');
                                        }}
                                        className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:text-orange-600 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleCreateVendor} className="p-8 overflow-y-auto max-h-[60vh]">
                                {createError && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                                        <p className="text-red-600 text-xs font-semibold uppercase tracking-wider">{createError}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-2">Basic Information</h3>
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Vendor Name *</label>
                                            <input
                                                type="text" name="vendorName"
                                                value={formData.vendorName} onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                                placeholder="Enter vendor name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Email *</label>
                                            <input
                                                type="email" name="email"
                                                value={formData.email} onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                                placeholder="vendor@example.com"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Mobile *</label>
                                            <input
                                                type="tel" name="mobile"
                                                value={formData.mobile} onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                                placeholder="9876543210"
                                                maxLength={10}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Password *</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"} name="password"
                                                    value={formData.password} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                                    placeholder="Enter password"
                                                    required
                                                />
                                                <button
                                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-2">Company Information</h3>
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Company Name *</label>
                                            <input
                                                type="text" name="companyName"
                                                value={formData.companyName} onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                                placeholder="Enter company name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Company Type</label>
                                            <select
                                                name="companyType"
                                                value={formData.companyType} onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                            >
                                                <option value="Private Limited">Private Limited</option>
                                                <option value="Public Limited">Public Limited</option>
                                                <option value="Proprietorship">Proprietorship</option>
                                                <option value="Partnership">Partnership</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">PAN Number</label>
                                            <input
                                                type="text" name="panNo"
                                                value={formData.panNo} onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all uppercase"
                                                placeholder="ABCDE1234F"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">GST Number</label>
                                            <input
                                                type="text" name="gst"
                                                value={formData.gst} onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all uppercase"
                                                placeholder="27ABCDE1234F1Z5"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:col-span-2">
                                        <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-2">Business Address</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Full Address</label>
                                                <input
                                                    type="text" name="registerAddress"
                                                    value={formData.registerAddress} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                                    placeholder="Plot 45, MIDC, Andheri East"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">City</label>
                                                <input
                                                    type="text" name="registerCity"
                                                    value={formData.registerCity} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                                    placeholder="Mumbai"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Pin Code</label>
                                                <input
                                                    type="text" name="registerPinCode"
                                                    value={formData.registerPinCode} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-600 transition-all"
                                                    placeholder="400093"
                                                    maxLength={6}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-xs tracking-wider hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold text-xs tracking-wider hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isCreating ? 'Adding...' : 'Add Vendor'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default VendorManagementPage;
