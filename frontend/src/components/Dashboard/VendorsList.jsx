import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Building2, Check, X, AlertCircle, MoreVertical, Truck, User, Building } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const VendorsList = ({ active, verified, title = "Vendors List", customActions, refreshTrigger = 0 }) => {
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
        // First application of setSearchTerm filters
        const searchLower = searchTerm.toLowerCase();
        const searchMatches = !searchTerm || (
            (vendor.vendorName && vendor.vendorName.toLowerCase().includes(searchLower)) ||
            (vendor.companyName && vendor.companyName.toLowerCase().includes(searchLower)) ||
            (vendor.email && vendor.email.toLowerCase().includes(searchLower))
        );

        // Then enforce props-based filters (backup for server-side filtering)
        const activeMatches = active === undefined || active === null || String(vendor.active) === String(active);
        const verifiedMatches = verified === undefined || verified === null || String(vendor.verified) === String(verified);

        return searchMatches && activeMatches && verifiedMatches;
    });

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-200 focus:border-orange-500 rounded-lg text-sm font-medium transition-all outline-none shadow-sm";
    const labelClasses = "block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5">{filteredVendors.length} active vendors found</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {customActions}
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search name or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Loading vendors...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-gray-800 text-sm font-semibold">{error}</p>
                        <button onClick={() => window.location.reload()} className="mt-3 text-xs font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">Try Again</button>
                    </div>
                ) : filteredVendors.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Truck size={24} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No vendors accounts found</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-3 text-[11px] font-semibold uppercase text-gray-500 tracking-wider">Vendor details</th>
                                <th className="px-6 py-3 text-[11px] font-semibold uppercase text-gray-500 tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-[11px] font-semibold uppercase text-gray-500 tracking-wider">Verification</th>
                                <th className="px-6 py-3 text-[11px] font-semibold uppercase text-gray-500 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredVendors.map((vendor) => (
                                <tr
                                    key={getVendorId(vendor)}
                                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                    onClick={() => handleVendorClick(vendor)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                                {vendor.vendorName?.charAt(0) || 'V'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors text-sm">{vendor.vendorName}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Building2 size={12} className="text-gray-400" />
                                                    <p className="text-[11px] text-gray-500 font-medium">{vendor.companyName || 'Private Individual'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 group/contact">
                                                <Mail size={12} className="text-gray-400" />
                                                <p className="text-xs text-gray-600">{vendor.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2 group/contact">
                                                <Phone size={12} className="text-gray-400" />
                                                <p className="text-xs text-gray-600">+91 {vendor.mobile}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight rounded-md border ${vendor.verified
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {vendor.verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {!vendor.verified ? (
                                                <>
                                                    <button
                                                        className="p-1.5 bg-white text-green-600 rounded-md hover:bg-green-50 border border-gray-200 transition-all shadow-sm"
                                                        title="Approve"
                                                        onClick={(e) => handleStatusUpdate(e, vendor, { verified: true }, 'Vendor verification approved')}
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="p-1.5 bg-white text-red-600 rounded-md hover:bg-red-50 border border-gray-200 transition-all shadow-sm"
                                                        title="Reject"
                                                        onClick={(e) => handleStatusUpdate(e, vendor, { active: false }, 'Vendor registration rejected')}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className={`p-1.5 rounded-md transition-all border border-gray-200 shadow-sm ${vendor.active ? 'bg-white text-amber-600 hover:bg-amber-50' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                                                    title={vendor.active ? "Block Account" : "Activate Account"}
                                                    onClick={(e) => handleStatusUpdate(e, vendor, { active: !vendor.active }, vendor.active ? 'Vendor account blocked' : 'Vendor account unblocked')}
                                                >
                                                    {vendor.active ? <X size={16} /> : <Check size={16} />}
                                                </button>
                                            )}
                                            <button
                                                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Vendor Details Modal */}
            {showVendorDetails && selectedVendor && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white text-orange-600 rounded-lg flex items-center justify-center font-bold text-lg border border-gray-200 shadow-sm">
                                    {selectedVendor.vendorName?.charAt(0) || 'V'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 px-0.5">
                                        {selectedVendor.vendorName}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${selectedVendor.verified ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {selectedVendor.verified ? 'Verified' : 'Unverified'}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${selectedVendor.active ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            {selectedVendor.active ? 'Active' : 'Blocked'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isEditing ? 'bg-orange-100 text-orange-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                                >
                                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>
                                <button
                                    onClick={() => setShowVendorDetails(false)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto flex-1 bg-white custom-scrollbar mt-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Contact Column */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <User size={14} className="text-orange-600" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-5">
                                        {['vendorName', 'email', 'mobile', 'phone', 'mobile2'].map(field => (
                                            <div key={field}>
                                                <label className={labelClasses}>{field === 'vendorName' ? 'Full Name' : field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                {isEditing ? (
                                                    <input
                                                        name={field}
                                                        value={editConfig[field] || ''}
                                                        onChange={handleEditChange}
                                                        className={inputClasses}
                                                        placeholder={`Enter ${field}`}
                                                    />
                                                ) : (
                                                    <p className="text-sm font-medium text-gray-800 py-1 border-b border-transparent">
                                                        {selectedVendor[field] || 'Not provided'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Business Column */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <Building2 size={14} className="text-orange-600" />
                                        Business Credentials
                                    </h3>
                                    <div className="space-y-5">
                                        {['companyName', 'companyType', 'gst', 'panNo', 'aadhaar'].map(field => (
                                            <div key={field} className="relative">
                                                <label className={labelClasses}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                {isEditing ? (
                                                    field === 'companyType' ? (
                                                        <select name={field} value={editConfig[field] || ''} onChange={handleEditChange} className={inputClasses}>
                                                            <option value="Private Limited">Private Limited</option>
                                                            <option value="Public Limited">Public Limited</option>
                                                            <option value="Proprietorship">Proprietorship</option>
                                                            <option value="Partnership">Partnership</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            name={field}
                                                            value={editConfig[field] || ''}
                                                            onChange={handleEditChange}
                                                            className={`${inputClasses} ${['gst', 'panNo'].includes(field) ? 'uppercase' : ''}`}
                                                            placeholder={`Enter ${field}`}
                                                        />
                                                    )
                                                ) : (
                                                    <p className="text-sm font-medium text-gray-800 py-1 border-b border-transparent uppercase">
                                                        {selectedVendor[field] || 'Not verified'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="space-y-6 md:col-span-2 mt-4">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight border-b border-gray-200 pb-2">Registration Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-3">
                                            <label className={labelClasses}>Full Physical Address</label>
                                            {isEditing ? (
                                                <input
                                                    name="registerAddress"
                                                    value={editConfig.registerAddress || ''}
                                                    onChange={handleEditChange}
                                                    className={inputClasses}
                                                    placeholder="Building No, Street, Landmark"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium text-gray-800 py-1">
                                                    {selectedVendor.registerAddress || 'No address registered'}
                                                </p>
                                            )}
                                        </div>
                                        {['registerCity', 'registerState', 'registerPinCode'].map(field => (
                                            <div key={field}>
                                                <label className={labelClasses}>{field.replace('register', '').replace(/([A-Z])/g, ' $1').trim()}</label>
                                                {isEditing ? (
                                                    <input
                                                        name={field}
                                                        value={editConfig[field] || ''}
                                                        onChange={handleEditChange}
                                                        className={inputClasses}
                                                        placeholder={field.replace('register', '')}
                                                    />
                                                ) : (
                                                    <p className="text-sm font-medium text-gray-800 py-1">
                                                        {selectedVendor[field] || '—'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        {isEditing && (
                            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 translate-y-[-1px]">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    onClick={submitVendorUpdate}
                                    disabled={updateSpinner}
                                    className="px-7 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all flex items-center gap-2.5 disabled:opacity-70 focus:ring-4 focus:ring-orange-500/20"
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
        </div>
    );
};

export default VendorsList;
