import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Building2, Check, X, AlertCircle, MoreVertical } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const ClientsList = ({ active = true, verified = false, title = "Pending Client Verifications", customActions, refreshTrigger = 0 }) => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Detailed Client Modal State
    const [selectedClient, setSelectedClient] = useState(null);
    const [showClientDetails, setShowClientDetails] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editConfig, setEditConfig] = useState({});
    const [updateSpinner, setUpdateSpinner] = useState(false);

    const getClientId = (client) => {
        if (!client) return null;
        return client.client_id || client._id || client.id || client.clientId;
    };

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            setError('');
            try {
                const queryParams = new URLSearchParams();
                if (active !== undefined && active !== null) queryParams.append('active', active);
                if (verified !== undefined && verified !== null) queryParams.append('verified', verified);

                const url = `${AUTH_ENDPOINTS.GET_CLIENTS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

                const res = await fetchWithAuth(url, {
                    method: 'GET',
                });

                if (!res.ok) throw new Error('Failed to fetch clients');
                const data = await res.json();

                const clientList = data.data || data.clients || data;
                setClients(Array.isArray(clientList) ? clientList : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [active, verified, refreshTrigger]);

    const handleClientClick = async (client) => {
        const clientId = getClientId(client);
        if (!clientId) {
            console.error("No valid client ID found", client);
            return;
        }

        try {
            const res = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_CLIENTS}/${clientId}`, {
                method: 'GET'
            });

            if (res.ok) {
                const data = await res.json();
                // Extract client data from possible nested response keys
                const detailedClient = data.data || data.client || data.user || data;
                setSelectedClient({ ...detailedClient });
                setEditConfig({ ...detailedClient });
            } else {
                setSelectedClient(client);
                setEditConfig(client);
            }
        } catch (err) {
            setSelectedClient(client);
            setEditConfig(client);
        } finally {
            setShowClientDetails(true);
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

    const submitClientUpdate = async () => {
        setUpdateSpinner(true);
        try {
            const clientId = getClientId(selectedClient);
            if (!clientId) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Invalid Client ID', showConfirmButton: false, timer: 3000 });
                return;
            }

            // Validation
            if (!editConfig.clientName?.trim()) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Client Name is required', showConfirmButton: false, timer: 3000 });
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

            // Omit immutable ID fields and sensitive password field to avoid backend rejection
            const { id, clientId: cId, _id, client_id, createdAt, updatedAt, password, ...payload } = editConfig;

            console.log("Updating client with payload:", payload);

            const res = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_CLIENTS}/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            console.log("Response from server:", res);

            if (res.ok) {
                const data = await res.json();
                // Check multiple possible locations for the updated object
                const updatedClient = data.data || data.client || data.user || data;

                // Update local lists - merge payload FIRST so user sees their changes
                // if the server returns a partial or generic object
                const mergedRef = { ...selectedClient, ...payload, ...(typeof updatedClient === 'object' ? updatedClient : {}) };

                setClients(prev => prev.map(c =>
                    (getClientId(c) === clientId) ? mergedRef : c
                ));
                setSelectedClient(mergedRef);
                setIsEditing(false);

                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Client updated successfully', showConfirmButton: false, timer: 3000 });
            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Failed to update client details', showConfirmButton: false, timer: 3000 });
            }
        } catch (err) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Error communicating with server', showConfirmButton: false, timer: 3000 });
        } finally {
            setUpdateSpinner(false);
        }
    };

    // Quick action handler for approving/rejecting from the table
    const handleStatusUpdate = async (e, client, updates, successMessage) => {
        e.stopPropagation();

        try {
            const clientId = getClientId(client);
            if (!clientId) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Invalid Client ID', showConfirmButton: false, timer: 3000 });
                return;
            }

            // Handle special verification and status toggle endpoints provided by user
            let url = `${AUTH_ENDPOINTS.GET_CLIENTS}/${clientId}`;
            if (Object.keys(updates).includes('verified')) {
                url = `${AUTH_ENDPOINTS.GET_CLIENTS}/${clientId}/verify?verified=${updates.verified}`;
            } else if (Object.keys(updates).includes('active')) {
                url = `${AUTH_ENDPOINTS.GET_CLIENTS}/${clientId}/status?active=${updates.active}`;
            }

            const res = await fetchWithAuth(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                const data = await res.json();
                const updatedClient = data.data || data;

                setClients(prev => prev.map(c =>
                    (getClientId(c) === clientId) ? { ...c, ...updates } : c
                ));

                if (selectedClient && getClientId(selectedClient) === clientId) {
                    setSelectedClient(prev => ({ ...prev, ...updates }));
                }

                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: successMessage, showConfirmButton: false, timer: 3000 });
            } else {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Status action failed', showConfirmButton: false, timer: 3000 });
            }
        } catch (err) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Network error occurred', showConfirmButton: false, timer: 3000 });
        }
    };

    const filteredClients = clients.filter(client => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (client.clientName && client.clientName.toLowerCase().includes(searchLower)) ||
            (client.companyName && client.companyName.toLowerCase().includes(searchLower)) ||
            (client.email && client.email.toLowerCase().includes(searchLower))
        );
    });

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                            {title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">Found {filteredClients.length} clients</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {customActions}
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:border-red-600 transition-all"
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
                            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-semibold text-xs">Fetching clients...</p>
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <p className="text-red-500 font-bold uppercase text-xs italic">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 text-[10px] font-black underline uppercase tracking-widest">Retry</button>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} />
                            </div>
                            <p className="text-slate-400 font-bold italic tracking-widest text-xs uppercase">No clients found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-xs font-semibold uppercase text-slate-400 tracking-wider">Client / Company</th>
                                    <th className="px-8 py-4 text-xs font-semibold uppercase text-slate-400 tracking-wider">Contact Details</th>
                                    <th className="px-8 py-4 text-xs font-semibold uppercase text-slate-400 tracking-wider">Verification</th>
                                    <th className="px-8 py-4 text-xs font-semibold uppercase text-slate-400 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredClients.map((client) => (
                                    <tr
                                        key={getClientId(client)}
                                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                        onClick={() => handleClientClick(client)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
                                                    {client.clientName?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors uppercase">{client.clientName}</p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Building2 size={12} className="text-slate-300" />
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{client.companyName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 group/contact">
                                                    <Mail size={14} className="text-slate-300 group-hover/contact:text-blue-500 transition-colors" />
                                                    <p className="text-xs font-medium text-slate-600">{client.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2 group/contact">
                                                    <Phone size={14} className="text-slate-300 group-hover/contact:text-green-500 transition-colors" />
                                                    <p className="text-xs font-medium text-slate-600">{client.mobile}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                                                {client.verified ? 'Verified' : 'Pending Verification'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!client.verified ? (
                                                    <>
                                                        <button
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all border border-green-100"
                                                            title="Approve"
                                                            onClick={(e) => handleStatusUpdate(e, client, { verified: true }, 'Client verification approved')}
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-100"
                                                            title="Reject"
                                                            onClick={(e) => handleStatusUpdate(e, client, { active: false }, 'Client registration rejected')}
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        className={`p-2 rounded-lg transition-all border ${client.active ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'}`}
                                                        title={client.active ? "Block Client" : "Unblock Client"}
                                                        onClick={(e) => handleStatusUpdate(e, client, { active: !client.active }, client.active ? 'Client account blocked' : 'Client account unblocked')}
                                                    >
                                                        {client.active ? <X size={18} /> : <Check size={18} />}
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

            {/* Client Details Modal */}
            {showClientDetails && selectedClient && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white">
                                    {selectedClient.clientName?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {selectedClient.clientName}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${selectedClient.verified ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {selectedClient.verified ? 'Verified' : 'Pending'}
                                        </span>
                                        <span className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${selectedClient.active ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {selectedClient.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${isEditing ? 'bg-amber-100 text-amber-700' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'}`}
                                >
                                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>
                                <button
                                    onClick={() => setShowClientDetails(false)}
                                    className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:text-red-600 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto flex-1 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Personal Info */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Contact Details</h3>
                                    <div className="space-y-4">
                                        {['clientName', 'email', 'mobile', 'phone', 'mobile2'].map(field => (
                                            <div key={field}>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                {isEditing ? (
                                                    <input
                                                        name={field}
                                                        value={editConfig[field] || ''}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-bold transition-colors"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent">
                                                        {selectedClient[field] || '—'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Company Info */}
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
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-bold transition-colors uppercase"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent uppercase">
                                                        {selectedClient[field] || '—'}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Address Info */}
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
                                                    className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-bold transition-colors"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent">
                                                    {selectedClient.registerAddress || '—'}
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
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-bold transition-colors"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2.5 rounded-xl border border-transparent">
                                                        {selectedClient[field] || '—'}
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
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditConfig(selectedClient); // Reset config on discard
                                    }}
                                    className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold text-xs tracking-wide hover:bg-slate-50 transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    onClick={submitClientUpdate}
                                    disabled={updateSpinner}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold text-xs tracking-wide hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 disabled:opacity-70"
                                >
                                    {updateSpinner ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Save Changes
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

export default ClientsList;
