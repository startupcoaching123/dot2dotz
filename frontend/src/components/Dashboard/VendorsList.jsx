import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Building2, Check, X, AlertCircle, MoreVertical, Truck } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const VendorsList = ({ active = true, verified = false, title = "Pending Vendor Verifications", customActions, refreshTrigger = 0 }) => {
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Detailed Vendor Modal State
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showVendorDetails, setShowVendorDetails] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editConfig, setEditConfig] = useState({});
    const [updateSpinner, setUpdateSpinner] = useState(false);

    const getVendorId = (v) => {
        if (!v) return null;

        // Define all possible ID keys
        const idKeys = [
            'vender_id', 'vendor_id', '_id', 'id', 'vendorId', 'userId',
            'user_id', 'venderId', 'clientId', 'client_id'
        ];

        // 1. Specific Keys first (Root level)
        for (const key of idKeys) {
            if (v[key] !== undefined && v[key] !== null && v[key] !== '') return v[key];
        }

        // 2. Search common nested wrappers
        const wrappers = ['user', 'vendor', 'vender', 'data', 'profile', 'business'];
        for (const w of wrappers) {
            if (v[w] && typeof v[w] === 'object') {
                for (const key of idKeys) {
                    if (v[w][key] !== undefined && v[w][key] !== null && v[w][key] !== '') return v[w][key];
                }
            }
        }

        // 3. Fallback: Search ALL keys for anything containing 'id', 'vender', or 'vendor'
        const allKeys = Object.keys(v);
        for (const key of allKeys) {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('id') || lowerKey.includes('vender') || lowerKey.includes('vendor')) {
                const val = v[key];
                if (val && (typeof val === 'string' || typeof val === 'number') && val !== '0' && val !== 'undefined') {
                    return val;
                }
            }
        }

        return null;
    };

    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoading(true);
            setError('');
            try {
                const queryParams = new URLSearchParams();
                if (active !== undefined && active !== null) queryParams.append('active', active);
                if (verified !== undefined && verified !== null) queryParams.append('verified', verified);

                const url = `${AUTH_ENDPOINTS.GET_VENDORS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

                const res = await fetchWithAuth(url, {
                    method: 'GET',
                });

                if (!res.ok) throw new Error('Failed to fetch vendors');
                const data = await res.json();

                const vendorList = data.data || data.vendors || data;
                setVendors(Array.isArray(vendorList) ? vendorList : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVendors();
    }, [active, verified, refreshTrigger]);

    const handleVendorClick = async (vendor) => {
        const vendorId = getVendorId(vendor);
        console.log("Vendor clicked:", vendorId, vendor);

        if (!vendorId) {
            console.error("No valid vendor ID found", vendor);
            // Fallback to local data if no ID
            setSelectedVendor({ ...vendor });
            setEditConfig({ ...vendor });
            setShowVendorDetails(true);
            return;
        }

        try {
            const res = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}`, {
                method: 'GET'
            });

            if (res.ok) {
                const data = await res.json();
                const detailedVendor = data.data || data.vendor || data.user || data;
                // CRITICAL: Merge with original vendor object to ensure ID field is preserved
                const merged = { ...vendor, ...detailedVendor };
                setSelectedVendor(merged);
                setEditConfig({ ...merged });
            } else {
                setSelectedVendor({ ...vendor });
                setEditConfig({ ...vendor });
            }
        } catch (err) {
            console.error("Error fetching vendor details:", err);
            setSelectedVendor({ ...vendor });
            setEditConfig({ ...vendor });
        } finally {
            setShowVendorDetails(true);
            setIsEditing(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        // Restriction for mobile numbers (10 digits)
        if (['mobile', 'phone', 'mobile2'].includes(name)) {
            const val = value.replace(/\D/g, ''); // Remove non-digits
            if (val.length <= 10) {
                setEditConfig(prev => ({ ...prev, [name]: val }));
            }
            return;
        }

        // Restriction for Pincode (6 digits)
        if (name === 'registerPinCode') {
            const val = value.replace(/\D/g, ''); // Remove non-digits
            if (val.length <= 6) {
                setEditConfig(prev => ({ ...prev, [name]: val }));
            }
            return;
        }

        // Restriction for Aadhaar (12 digits)
        if (name === 'aadhaar') {
            const val = value.replace(/\D/g, ''); // Remove non-digits
            if (val.length <= 12) {
                setEditConfig(prev => ({ ...prev, [name]: val }));
            }
            return;
        }

        setEditConfig(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitVendorUpdate = async () => {
        setUpdateSpinner(true);
        try {
            const vendorId = getVendorId(selectedVendor);
            if (!vendorId) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Invalid Vendor ID', showConfirmButton: false, timer: 3000 });
                return;
            }

            // Validation
            if (!editConfig.vendorName?.trim()) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Vendor Name is required', showConfirmButton: false, timer: 3000 });
                return;
            }

            if (!/^[6-9]\d{9}$/.test(editConfig.mobile)) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Mobile must be 10 digits starting with 6-9', showConfirmButton: false, timer: 3000 });
                return;
            }

            if (editConfig.phone && editConfig.phone.length !== 10) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Phone must be exactly 10 digits', showConfirmButton: false, timer: 3000 });
                return;
            }

            if (editConfig.registerPinCode && editConfig.registerPinCode.length !== 6) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Pincode must be exactly 6 digits', showConfirmButton: false, timer: 3000 });
                return;
            }

            if (editConfig.aadhaar && editConfig.aadhaar.length !== 12) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Aadhaar must be exactly 12 digits', showConfirmButton: false, timer: 3000 });
                return;
            }

            if (editConfig.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(editConfig.panNo.toUpperCase())) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Invalid PAN format', showConfirmButton: false, timer: 3000 });
                return;
            }

            const { id, vendorId: vId, _id, vendor_id, vender_id, createdAt, updatedAt, password, ...payload } = editConfig;

            const res = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                const updatedVendor = data.data || data.vendor || data.user || data;

                const mergedRef = { ...selectedVendor, ...payload, ...(typeof updatedVendor === 'object' ? updatedVendor : {}) };

                setVendors(prev => prev.map(v =>
                    (getVendorId(v) === vendorId) ? mergedRef : v
                ));
                setSelectedVendor(mergedRef);
                setIsEditing(false);

                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Vendor updated successfully', showConfirmButton: false, timer: 3000 });
            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Failed to update vendor details', showConfirmButton: false, timer: 3000 });
            }
        } catch (err) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error communicating with server', showConfirmButton: false, timer: 3000 });
        } finally {
            setUpdateSpinner(false);
        }
    };

    const handleStatusUpdate = async (e, vendor, updates, successMessage) => {
        e.stopPropagation();

        try {
            const vendorId = getVendorId(vendor);
            if (!vendorId) {
                console.error("ID DISCOVERY FAILED for vendor object:", vendor);
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: `Invalid Vendor ID (No matching key found)`, showConfirmButton: false, timer: 4000 });
                return;
            }

            let url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}`;
            if (Object.keys(updates).includes('verified')) {
                url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/verify?verified=${updates.verified}`;
            } else if (Object.keys(updates).includes('active')) {
                url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/status?active=${updates.active}`;
            }

            const res = await fetchWithAuth(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                setVendors(prev => prev.map(v =>
                    (getVendorId(v) === vendorId) ? { ...v, ...updates } : v
                ));

                if (selectedVendor && getVendorId(selectedVendor) === vendorId) {
                    setSelectedVendor(prev => ({ ...prev, ...updates }));
                }

                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: successMessage, showConfirmButton: false, timer: 3000 });
            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Status action failed', showConfirmButton: false, timer: 3000 });
            }
        } catch (err) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Network error occurred', showConfirmButton: false, timer: 3000 });
        }
    };

    const filteredVendors = vendors.filter(vendor => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (vendor.vendorName && vendor.vendorName.toLowerCase().includes(searchLower)) ||
            (vendor.companyName && vendor.companyName.toLowerCase().includes(searchLower)) ||
            (vendor.email && vendor.email.toLowerCase().includes(searchLower))
        );
    });

    return (
        <>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                            {title}
                        </h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Found {filteredVendors.length} vendors</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {customActions}
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-600 transition-all"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-black italic uppercase tracking-widest text-[10px]">Fetching vendors...</p>
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <p className="text-red-500 font-bold uppercase text-xs italic">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 text-[10px] font-black underline uppercase tracking-widest">Retry</button>
                        </div>
                    ) : filteredVendors.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck size={32} />
                            </div>
                            <p className="text-slate-400 font-bold italic tracking-widest text-xs uppercase">No vendors found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Vendor / Company</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contact Details</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Verification</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredVendors.map((vendor) => (
                                    <tr
                                        key={getVendorId(vendor)}
                                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                        onClick={() => handleVendorClick(vendor)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-black italic text-lg shadow-sm">
                                                    {vendor.vendorName?.charAt(0) || 'V'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors uppercase italic">{vendor.vendorName}</p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Building2 size={12} className="text-slate-300" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vendor.companyName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 group/contact">
                                                    <Mail size={14} className="text-slate-300 group-hover/contact:text-blue-500 transition-colors" />
                                                    <p className="text-xs font-bold text-slate-600">{vendor.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2 group/contact">
                                                    <Phone size={14} className="text-slate-300 group-hover/contact:text-green-500 transition-colors" />
                                                    <p className="text-xs font-bold text-slate-600">{vendor.mobile}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${vendor.verified ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {vendor.verified ? 'Verified' : 'Pending Verification'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!vendor.verified ? (
                                                    <>
                                                        <button
                                                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all border border-green-100"
                                                            title="Approve"
                                                            onClick={(e) => handleStatusUpdate(e, vendor, { verified: true }, 'Vendor verification approved')}
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                                                            title="Reject"
                                                            onClick={(e) => handleStatusUpdate(e, vendor, { active: false }, 'Vendor registration rejected')}
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        className={`p-2 rounded-xl transition-all border ${vendor.active ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'}`}
                                                        title={vendor.active ? "Block Vendor" : "Unblock Vendor"}
                                                        onClick={(e) => handleStatusUpdate(e, vendor, { active: !vendor.active }, vendor.active ? 'Vendor account blocked' : 'Vendor account unblocked')}
                                                    >
                                                        {vendor.active ? <X size={18} /> : <Check size={18} />}
                                                    </button>
                                                )}
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

            {/* Vendor Details Modal */}
            {showVendorDetails && selectedVendor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-black italic text-xl shadow-inner border border-white">
                                    {selectedVendor.vendorName?.charAt(0) || 'V'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 font-black italic uppercase">
                                        {selectedVendor.vendorName}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${selectedVendor.verified ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {selectedVendor.verified ? 'Verified' : 'Pending'}
                                        </span>
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${selectedVendor.active ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {selectedVendor.active ? 'Active' : 'Blocked'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-6 py-2.5 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all ${isEditing ? 'bg-orange-100 text-orange-700' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'}`}
                                >
                                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>
                                <button
                                    onClick={() => setShowVendorDetails(false)}
                                    className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:text-red-600 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Contact Details</h3>
                                    <div className="space-y-4">
                                        {['vendorName', 'email', 'mobile', 'phone', 'mobile2'].map(field => (
                                            <div key={field}>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                {isEditing ? (
                                                    <input
                                                        name={field}
                                                        value={editConfig[field] || ''}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-orange-500 rounded-xl text-sm font-bold transition-colors"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent">
                                                        {selectedVendor[field] || '—'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Business Data</h3>
                                    <div className="space-y-4">
                                        {['companyName', 'companyType', 'gst', 'panNo', 'aadhaar'].map(field => (
                                            <div key={field}>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    {field === 'companyName' && <Building2 size={12} />}
                                                    {field.replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        name={field}
                                                        value={editConfig[field] || ''}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-orange-500 rounded-xl text-sm font-bold transition-colors uppercase"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent uppercase">
                                                        {selectedVendor[field] || '—'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 md:col-span-2">
                                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Registration Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-3">
                                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Full Address</label>
                                            {isEditing ? (
                                                <input
                                                    name="registerAddress"
                                                    value={editConfig.registerAddress || ''}
                                                    onChange={handleEditChange}
                                                    className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-orange-500 rounded-xl text-sm font-bold transition-colors"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent">
                                                    {selectedVendor.registerAddress || '—'}
                                                </p>
                                            )}
                                        </div>
                                        {['registerCity', 'registerState', 'registerPinCode'].map(field => (
                                            <div key={field}>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{field.replace('register', '')}</label>
                                                {isEditing ? (
                                                    <input
                                                        name={field}
                                                        value={editConfig[field] || ''}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-orange-500 rounded-xl text-sm font-bold transition-colors"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent">
                                                        {selectedVendor[field] || '—'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-8 py-3 bg-white text-slate-600 rounded-2xl font-black uppercase italic text-xs tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={submitVendorUpdate}
                                    disabled={updateSpinner}
                                    className="px-10 py-3 bg-orange-600 text-white rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all flex items-center gap-3 disabled:opacity-70"
                                >
                                    {updateSpinner ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default VendorsList;
