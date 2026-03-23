import React, { useState, useEffect } from 'react';
import {
    Search, Filter, MapPin, Truck, Calendar,
    Check, X, AlertCircle, MoreVertical, Eye,
    User, Phone, Hash, Info, Package
} from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const LeadsList = ({ title = "All Freight Leads", refreshTrigger = 0 }) => {
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Detailed Lead Modal State
    const [selectedLead, setSelectedLead] = useState(null);
    const [showLeadDetails, setShowLeadDetails] = useState(false);
    const [dimensions, setDimensions] = useState([]);
    const [isLoadingDimensions, setIsLoadingDimensions] = useState(false);

    // Vendor Assignment State
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [isLoadingVendors, setIsLoadingVendors] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [matchedVendorIds, setMatchedVendorIds] = useState([]);

    const getLeadId = (lead) => {
        if (!lead) return null;
        return lead.leadId || lead._id || lead.id;
    };

    const getVendorId = (v) => {
        if (!v) return null;
        const idKeys = [
            'vender_id', 'vendor_id', '_id', 'id', 'vendorId', 'userId',
            'user_id', 'venderId', 'clientId', 'client_id'
        ];
        // Root level search
        for (const key of idKeys) {
            if (v[key] !== undefined && v[key] !== null) return v[key];
        }
        // Nested search
        const wrappers = ['user', 'vendor', 'vender', 'data', 'profile'];
        for (const w of wrappers) {
            if (v[w] && typeof v[w] === 'object') {
                for (const key of idKeys) {
                    if (v[w][key] !== undefined && v[w][key] !== null) return v[w][key];
                }
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.LEADS}`, {
                    method: 'GET',
                });

                if (!res.ok) throw new Error('Failed to fetch leads');
                const data = await res.json();

                const leadList = data.data || data.leads || data;
                setLeads(Array.isArray(leadList) ? leadList : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeads();
    }, [refreshTrigger]);

    const handleLeadClick = (lead) => {
        setSelectedLead(lead);
        setShowLeadDetails(true);
        fetchDimensions(getLeadId(lead));
    };

    const fetchDimensions = async (leadId) => {
        if (!leadId) return;
        setDimensions([]); // Clear old dimensions
        setIsLoadingDimensions(true);
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/${leadId}/dimensions`, {
                method: 'GET'
            });
            if (res.ok) {
                const data = await res.json();
                setDimensions(data.data || []);
            } else {
                setDimensions([]);
            }
        } catch (err) {
            console.error('Error fetching dimensions:', err);
            setDimensions([]);
        } finally {
            setIsLoadingDimensions(false);
        }
    };

    const fetchVendors = async () => {
        setIsLoadingVendors(true);
        setMatchedVendorIds([]); // Reset state for the new lead
        try {
            const leadId = getLeadId(selectedLead);
            if (!leadId) return;

            // Fetch existing matches first
            await fetchExistingMatches(leadId);

            // Fetch available vendors specifically for this lead
            const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/${leadId}/available-vendors`, {
                method: 'GET'
            });

            if (!res.ok) throw new Error('Failed to fetch available vendors');
            const data = await res.json();
            const list = data.data || data.vendors || data;
            setVendors(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Error fetching vendors:', err);
            Swal.fire({ icon: 'error', title: 'Fetch Failed', text: 'Could not load available vendors for this lead' });
        } finally {
            setIsLoadingVendors(false);
        }
    };

    const fetchExistingMatches = async (leadId) => {
        try {
            // Assuming there's an endpoint to get matches, or we check matching logic
            // If no specific endpoint, we might have to rely on local state tracking
            // For now, let's try to fetch if possible, or just reset local state
            // If backend provides matches in lead detail, we could use that.
            // Let's assume for now we track them during the session OR there's a GET matches endpoint
            const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/${leadId}/matches`, {
                method: 'GET'
            });
            if (res.ok) {
                const data = await res.json();
                const matches = data.data || [];
                setMatchedVendorIds(matches.map(m => m.vendorId));
            }
        } catch (err) {
            console.error('Error fetching matches:', err);
        }
    };

    const handleAssignVendor = async (vendorId) => {
        const leadId = getLeadId(selectedLead);
        if (!leadId || !vendorId) return;

        setIsAssigning(true);
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.LEADS}/${leadId}/match?vendorId=${vendorId}`, {
                method: 'POST'
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Assignment failed');
            }

            Swal.fire({
                icon: 'success',
                title: 'Vendor Matched',
                text: 'Lead has been successfully matched with the vendor. You can continue matching more vendors if needed.',
                timer: 1500,
                showConfirmButton: false
            });

            // Update local state to disable button
            setMatchedVendorIds(prev => [...prev, vendorId]);

            // Keep modals open to allow matching multiple vendors
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Assignment Error', text: err.message });
        } finally {
            setIsAssigning(false);
        }
    };

    const filteredLeads = leads.filter(lead => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (lead.pickupCity && lead.pickupCity.toLowerCase().includes(searchLower)) ||
            (lead.dropCity && lead.dropCity.toLowerCase().includes(searchLower)) ||
            (lead.leadId && lead.leadId.toString().includes(searchLower)) ||
            (lead.consignmentType && lead.consignmentType.toLowerCase().includes(searchLower))
        );
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'GENERATED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'LEADSENT': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'LEADACCEPTED': return 'bg-green-50 text-green-600 border-green-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                            {title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">Found {filteredLeads.length} active leads</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-grow min-w-[200px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by city, ID, type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-600 transition-all"
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
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest">Fetching leads data...</p>
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <p className="text-red-500 font-bold uppercase text-xs italic">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 text-[10px] font-black underline uppercase tracking-widest">Retry Connection</button>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Hash size={32} />
                            </div>
                            <p className="text-slate-400 font-bold italic tracking-widest text-xs uppercase">No leads matching your search</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Lead Info</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Route (From - To)</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Consignment / Vehicle</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredLeads.map((lead) => (
                                    <tr
                                        key={getLeadId(lead)}
                                        className="hover:bg-indigo-50/20 transition-all duration-200 group cursor-pointer"
                                        onClick={() => handleLeadClick(lead)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center text-xs font-bold border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                                    #{getLeadId(lead).toString().substring(0, 4)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 uppercase">Lead #{getLeadId(lead)}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                        <Calendar size={12} />
                                                        <p className="text-[10px] font-bold uppercase">{new Date(lead.requestedOn).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 group/route">
                                                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                                    <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{lead.pickupCity}</p>
                                                </div>
                                                <div className="flex items-center gap-2 group/route">
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                    <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{lead.dropCity}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Info size={12} className="text-slate-300" />
                                                    <p className="text-xs font-bold text-slate-600 uppercase">{lead.consignmentType} ({lead.consignmentGrossWeight}kg)</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Truck size={12} className="text-slate-300" />
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{lead.vehicleType} - {lead.vehicle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusStyle(lead.leadStatus)}`}>
                                                {lead.leadStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 px-4 shadow-xl border-slate-50 border h-fit rounded-lg">
                                                <button
                                                    className="p-2 text-indigo-400 hover:text-indigo-600 transition-colors"
                                                    title="View Full Details"
                                                >
                                                    <Eye size={18} />
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

            {/* Lead Details Modal */}
            {showLeadDetails && selectedLead && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-gradient-to-br from-indigo-50/30 to-white">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-100 italic">
                                    #{selectedLead.leadId.toString().substring(0, 2)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                            Lead #{selectedLead.leadId}
                                        </h2>
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border ${getStatusStyle(selectedLead.leadStatus)} shadow-sm`}>
                                            {selectedLead.leadStatus}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            Generated on {new Date(selectedLead.requestedOn).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.1em] flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full">
                                            <Truck size={12} />
                                            {selectedLead.leadType} LEAD
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLeadDetails(false)}
                                className="p-4 bg-white text-slate-400 rounded-2xl hover:text-red-600 transition-all shadow-sm active:scale-95"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-10 overflow-y-auto flex-1 bg-white space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Route Info */}
                                <div className="space-y-8">
                                    <h3 className="text-xs font-black uppercase text-indigo-400 tracking-[0.2em] flex items-center gap-2">
                                        <MapPin size={14} /> Logistics Route
                                    </h3>

                                    <div className="relative pl-8 space-y-10">
                                        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-dashed-line border-l-2 border-dashed border-slate-100"></div>

                                        {/* Pickup */}
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm ring-4 ring-teal-50"></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Pickup Location</p>
                                                <p className="text-sm font-black text-slate-900 uppercase leading-snug">{selectedLead.pickupAddress}</p>
                                                <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase italic tracking-wider">{selectedLead.pickupCity}, {selectedLead.pickupState} — {selectedLead.pickupFromPincode}</p>

                                                <div className="mt-4 flex flex-wrap gap-4">
                                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                                        <User size={12} className="text-slate-400" />
                                                        <p className="text-[10px] font-black text-slate-600 uppercase">{selectedLead.pickupContactPersonName}</p>
                                                    </div>
                                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                                        <Phone size={12} className="text-slate-400" />
                                                        <p className="text-[10px] font-black text-slate-600 uppercase">{selectedLead.pickupContactNo}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Drop */}
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-500 border-4 border-white shadow-sm ring-4 ring-red-50"></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Drop Location</p>
                                                <p className="text-sm font-black text-slate-900 uppercase leading-snug">{selectedLead.dropAddress}</p>
                                                <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase italic tracking-wider">{selectedLead.dropCity}, {selectedLead.dropState} — {selectedLead.dropToPincode}</p>

                                                <div className="mt-4 flex flex-wrap gap-4">
                                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                                        <User size={12} className="text-slate-400" />
                                                        <p className="text-[10px] font-black text-slate-600 uppercase">{selectedLead.dropContactPersonName || 'N/A'}</p>
                                                    </div>
                                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                                        <Phone size={12} className="text-slate-400" />
                                                        <p className="text-[10px] font-black text-slate-600 uppercase">{selectedLead.dropContactNo || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cargo Info */}
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Consignment Type</p>
                                            <p className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{selectedLead.consignmentType}</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Gross Weight</p>
                                            <p className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{selectedLead.consignmentGrossWeight} <span className="text-xs">KG</span></p>
                                        </div>
                                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 col-span-2 flex items-center justify-between group">
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Requested Vehicle</p>
                                                <p className="text-lg font-black text-indigo-900 uppercase italic tracking-tight">{selectedLead.vehicle} <span className="text-slate-400 text-xs font-bold not-italic">({selectedLead.vehicleType})</span></p>
                                            </div>
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
                                                <Truck size={24} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dimensions Section */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase text-indigo-400 tracking-[0.2em] flex items-center gap-2">
                                            <Package size={14} /> Package Dimensions
                                        </h3>
                                        {isLoadingDimensions ? (
                                            <div className="flex items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Fetching unit details...</span>
                                            </div>
                                        ) : dimensions.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {dimensions.map((dim, idx) => (
                                                    <div key={dim.id || idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 text-[10px] shadow-sm border border-slate-50 italic">
                                                                {dim.qty}x
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black uppercase text-slate-900 tracking-wider">
                                                                    {dim.length}L × {dim.breadth}B × {dim.height}H
                                                                </p>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">{dim.sizeType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="px-3 py-1 bg-white border border-slate-50 rounded-lg text-[8px] font-black uppercase text-slate-300 italic group-hover:text-indigo-400 transition-colors">
                                                            DIM-{idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] italic">No dimension details available</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                                                <Info size={16} />
                                            </div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">System Information</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Generated By</span>
                                                <span className="text-xs font-black uppercase">{selectedLead.leadGeneratedBy}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Client ID</span>
                                                <span className="text-xs font-black uppercase">#{selectedLead.clientId}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 pt-1 border-white/10">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Pickup Timing</span>
                                                <span className="text-xs font-black uppercase italic text-indigo-300">{selectedLead.pickupPreferTiming}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-4">
                            <button
                                onClick={() => setShowLeadDetails(false)}
                                className="px-10 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                            >
                                Close View
                            </button>
                            {selectedLead.leadStatus === 'GENERATED' && (
                                <button
                                    onClick={() => {
                                        fetchVendors();
                                        setShowAssignModal(true);
                                    }}
                                    className="px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                >
                                    Assign To Vendor
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Vendor Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-50/30">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Assign Vendor</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select an active vendor for Lead #{getLeadId(selectedLead)}</p>
                            </div>
                            <button onClick={() => setShowAssignModal(false)} className="p-3 bg-white text-slate-400 rounded-xl hover:text-red-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            {isLoadingVendors ? (
                                <div className="py-12 flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Loading Vendors...</p>
                                </div>
                            ) : vendors.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 uppercase font-bold text-xs">No active/verified vendors found</div>
                            ) : (
                                <div className="space-y-3">
                                    {vendors.map(vendor => (
                                        <div
                                            key={vendor.vendorId || vendor.id || vendor._id}
                                            className="p-5 border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-slate-50 group-hover:scale-110 transition-transform shadow-sm">
                                                    {vendor.vendorName?.charAt(0) || 'V'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase italic group-hover:text-indigo-600">{vendor.vendorName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{vendor.companyName}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAssignVendor(getVendorId(vendor))}
                                                disabled={isAssigning || matchedVendorIds.includes(getVendorId(vendor))}
                                                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 ${matchedVendorIds.includes(getVendorId(vendor))
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-slate-900 text-white hover:bg-indigo-600'
                                                    }`}
                                            >
                                                {isAssigning ? 'Wait...' : matchedVendorIds.includes(getVendorId(vendor)) ? 'Matched' : 'Match'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-8 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LeadsList;
