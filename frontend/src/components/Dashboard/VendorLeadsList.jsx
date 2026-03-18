import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, MapPin, Truck, Calendar, 
    Check, X, AlertCircle, Eye,
    Info, DollarSign, Send, Package, User, Phone
} from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const VendorLeadsList = ({ title = "Assigned Loads for Quoting" }) => {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Lead details cache/state to show basic info
    const [leadDetails, setLeadDetails] = useState({});
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // Quote Modal State
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [quoteValue, setQuoteValue] = useState('');
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

    // Detailed Lead Modal
    const [selectedLead, setSelectedLead] = useState(null);
    const [showLeadDetails, setShowLeadDetails] = useState(false);
    const [dimensions, setDimensions] = useState([]);
    const [isLoadingDimensions, setIsLoadingDimensions] = useState(false);

    useEffect(() => {
        const fetchIncomingLeads = async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.VENDOR_INCOMING_LEADS}`, {
                    method: 'GET',
                });

                if (!res.ok) throw new Error('Failed to fetch assigned leads');
                const data = await res.json();

                const matchList = data.data || data.matches || data;
                setMatches(Array.isArray(matchList) ? matchList : []);
                
                // Fetch lead details for each match ID if needed, 
                // but usually the backend should provide them.
                // For now, we'll fetch them on demand or assume we need to fetch them.
                if (Array.isArray(matchList)) {
                   matchList.forEach(m => fetchLeadDetail(m.leadId));
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIncomingLeads();
    }, []);

    const fetchLeadDetail = async (leadId) => {
        if (leadDetails[leadId]) return;
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.LEADS}/${leadId}`, {
                method: 'GET'
            });
            if (res.ok) {
                const data = await res.json();
                const detail = data.data || data;
                setLeadDetails(prev => ({ ...prev, [leadId]: detail }));
            }
        } catch (err) {
            console.error(`Error fetching lead ${leadId}:`, err);
        }
    };

    const handleViewDetails = async (match) => {
        const leadId = match.leadId;
        setSelectedMatch(match); // Store the match context
        const lead = leadDetails[leadId];
        if (lead) {
            setSelectedLead(lead);
            setShowLeadDetails(true);
            fetchDimensions(leadId);
        } else {
            // If details not in cache, fetch them
            setIsLoadingDetails(true);
            try {
                const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.LEADS}/${leadId}`, {
                    method: 'GET'
                });
                if (res.ok) {
                    const data = await res.json();
                    const detail = data.data || data;
                    setSelectedLead(detail);
                    setShowLeadDetails(true);
                    fetchDimensions(leadId);
                }
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Could not load lead details' });
            } finally {
                setIsLoadingDetails(false);
            }
        }
    };

    const fetchDimensions = async (leadId) => {
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

    const handleOpenQuoteModal = (match) => {
        setSelectedMatch(match);
        setQuoteValue(match.vendorQuotedCost || '');
        setShowQuoteModal(true);
    };

    const handleSubmitQuote = async (e) => {
        e.preventDefault();
        if (!quoteValue || isNaN(quoteValue)) {
            Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Please enter a valid numeric quote' });
            return;
        }

        setIsSubmittingQuote(true);
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/quotes/${selectedMatch.leadMatchId}/vendor-response`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quotedCost: parseFloat(quoteValue),
                    note: "Submitted from Vendor Dashboard"
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to submit quote');
            }

            Swal.fire({
                icon: 'success',
                title: 'Quote Submitted',
                text: 'Your quote has been sent to the client via Admin',
                timer: 2000,
                showConfirmButton: false
            });

            // Update local state
            setMatches(prev => prev.map(m => 
                m.leadMatchId === selectedMatch.leadMatchId 
                ? { ...m, vendorQuotedCost: parseFloat(quoteValue), leadStatus: 'QUOTED' } 
                : m
            ));

            setShowQuoteModal(false);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Submission Error', text: err.message });
        } finally {
            setIsSubmittingQuote(false);
        }
    };

    const filteredMatches = matches.filter(m => {
        const lead = leadDetails[m.leadId] || {};
        const searchLower = searchTerm.toLowerCase();
        return (
            (lead.pickupCity && lead.pickupCity.toLowerCase().includes(searchLower)) ||
            (lead.dropCity && lead.dropCity.toLowerCase().includes(searchLower)) ||
            (m.leadId && m.leadId.toString().includes(searchLower)) ||
            (m.leadStatus && m.leadStatus.toLowerCase().includes(searchLower))
        );
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'SENT': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'QUOTED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'ACCEPTED': return 'bg-green-50 text-green-600 border-green-100';
            case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
            case 'PAYMENT_PENDING': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getMatchStatus = (match) => {
        if (match.clientResponse === 'LEADPAYMENT') return 'ACCEPTED';
        if (match.vendorQuotedCost) return 'QUOTED';
        return match.leadStatus || 'SENT';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 uppercase">
                            <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                            {title}
                        </h3>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Found {filteredMatches.length} assignments</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-grow min-w-[200px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by city, ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-orange-500 transition-all uppercase"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Scanning incoming loads...</p>
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold uppercase transition-all">
                                <AlertCircle size={32} />
                            </div>
                            <p className="text-red-500 font-black uppercase text-xs italic">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 text-[10px] font-black underline uppercase tracking-widest">Retry Connection</button>
                        </div>
                    ) : filteredMatches.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 transition-all">
                                <Truck size={48} />
                            </div>
                            <p className="text-slate-400 font-black italic tracking-widest text-xs uppercase">No new load assignments found</p>
                            <p className="text-slate-300 text-[10px] font-bold mt-2 uppercase">Check back later or contact admin</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Assign Info</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Route (From - To)</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargo Detail</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">My Quote</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredMatches.map((match) => {
                                    const lead = leadDetails[match.leadId] || {};
                                    return (
                                        <tr key={match.leadMatchId} className="hover:bg-orange-50/20 transition-all group">
                                            <td className="px-8 py-6">
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 uppercase italic">Match #{match.leadMatchId}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                        <Calendar size={12} />
                                                        <p className="text-[10px] font-bold uppercase tracking-tighter">Sent: {new Date(match.sentOn).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                                        <p className="text-xs font-black text-slate-700 uppercase italic">{lead.pickupCity || 'Loading...'}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                        <p className="text-xs font-black text-slate-700 uppercase italic">{lead.dropCity || 'Loading...'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-600 uppercase italic flex items-center gap-1.5">
                                                        <Info size={12} className="text-slate-300" />
                                                        {lead.consignmentType}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {lead.consignmentGrossWeight ? `${lead.consignmentGrossWeight} KG` : '---'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {match.vendorQuotedCost ? (
                                                    <div className="bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 w-fit">
                                                        <p className="text-xs font-black text-orange-600 uppercase italic">₹ {match.vendorQuotedCost}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Pending Quote</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(getMatchStatus(match))}`}>
                                                    {getMatchStatus(match)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(match)}
                                                        className="p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-transparent hover:border-orange-100"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenQuoteModal(match)}
                                                        disabled={match.clientResponse === 'LEADPAYMENT'}
                                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all italic border shadow-sm ${
                                                            match.clientResponse === 'LEADPAYMENT'
                                                            ? 'bg-green-50 text-green-600 border-green-100 cursor-not-allowed'
                                                            : match.vendorQuotedCost 
                                                                ? 'bg-white text-orange-600 border-orange-100 hover:bg-orange-50' 
                                                                : 'bg-slate-900 text-white border-transparent hover:bg-orange-600'
                                                        }`}
                                                    >
                                                        {match.clientResponse === 'LEADPAYMENT' ? <Check size={12}/> : (match.vendorQuotedCost ? <DollarSign size={12}/> : <Send size={12} />)}
                                                        {match.clientResponse === 'LEADPAYMENT' ? 'Lead Confirmed' : (match.vendorQuotedCost ? 'Update Quote' : 'Submit Quote')}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Quote Modal */}
            {showQuoteModal && selectedMatch && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-gradient-to-br from-orange-50/50 to-white">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Submit Your Quote</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Match ID: {selectedMatch.leadMatchId}</p>
                            </div>
                            <button onClick={() => setShowQuoteModal(false)} className="p-4 bg-white text-slate-400 rounded-2xl hover:text-red-500 transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitQuote} className="p-10 space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Your Quoted Amount (₹)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                                    <input
                                        type="number"
                                        required
                                        value={quoteValue}
                                        onChange={(e) => setQuoteValue(e.target.value)}
                                        placeholder="Enter total cost for this load"
                                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner uppercase tracking-wider"
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 mt-4 px-1 uppercase tracking-widest italic leading-relaxed">
                                    Admin will add system margins on top of your quote before showing it to the client.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowQuoteModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-transparent shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingQuote}
                                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-100 disabled:opacity-50 italic"
                                >
                                    {isSubmittingQuote ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Confirm Quote
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lead Details Modal */}
            {showLeadDetails && selectedLead && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300 border border-white">
                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-gradient-to-br from-orange-50/50 to-white">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-[1.25rem] flex items-center justify-center text-xl font-black shadow-lg shadow-orange-100 italic">
                                    #{selectedLead.leadId.toString().substring(0, 2)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                                            Lead #{selectedLead.leadId}
                                        </h2>
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border bg-orange-50 text-orange-600 border-orange-100 shadow-sm`}>
                                            {selectedLead.leadStatus}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-1.5 mt-2">
                                        <Calendar size={12} />
                                        Cargo Wanted On: {new Date(selectedLead.requestedOn).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLeadDetails(false)}
                                className="p-4 bg-white text-slate-400 rounded-2xl hover:text-red-500 transition-all shadow-sm active:scale-95"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-10 overflow-y-auto flex-1 bg-white space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Route Info */}
                                <div className="space-y-8">
                                    <h3 className="text-xs font-black uppercase text-orange-500 tracking-[0.2em] flex items-center gap-2 italic">
                                        <MapPin size={14} /> Transport Route
                                    </h3>
                                    
                                    <div className="relative pl-8 space-y-10 border-l-2 border-dashed border-slate-100 ml-2">
                                        {/* Pickup */}
                                        <div className="relative">
                                            <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm ring-4 ring-teal-50"></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Pickup From</p>
                                                <p className="text-sm font-black text-slate-900 uppercase leading-snug">{selectedLead.pickupCity}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">{selectedLead.pickupState} — {selectedLead.pickupFromPincode}</p>
                                            </div>
                                        </div>

                                        {/* Drop */}
                                        <div className="relative">
                                            <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-red-500 border-4 border-white shadow-sm ring-4 ring-red-50"></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Delivery To</p>
                                                <p className="text-sm font-black text-slate-900 uppercase leading-snug">{selectedLead.dropCity}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">{selectedLead.dropState} — {selectedLead.dropToPincode}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex gap-2 items-center"><Info size={12}/> Loading Instructions</p>
                                        <p className="text-[11px] font-black text-slate-700 uppercase leading-relaxed italic">
                                            {selectedLead.pickupNote || 'No specific instructions provided for this load.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Cargo Info */}
                                <div className="space-y-8">
                                    <h3 className="text-xs font-black uppercase text-orange-500 tracking-[0.2em] flex items-center gap-2 italic">
                                        <Truck size={14} /> Cargo Dimensions
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-orange-100 transition-colors">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 italic">Goods Type</p>
                                            <p className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{selectedLead.consignmentType}</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-orange-100 transition-colors">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 italic">Weight</p>
                                            <p className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{selectedLead.consignmentGrossWeight} <span className="text-xs">KG</span></p>
                                        </div>
                                        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 col-span-2 flex items-center justify-between group">
                                            <div>
                                                <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest mb-2 italic">Required Truck</p>
                                                <p className="text-lg font-black text-orange-900 uppercase italic tracking-tight">{selectedLead.vehicle} <span className="text-slate-400 text-xs font-bold not-italic">({selectedLead.vehicleType})</span></p>
                                            </div>
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 group-hover:scale-110 transition-transform">
                                                <Truck size={24} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dimensions Section */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase text-orange-400 tracking-[0.2em] flex items-center gap-2 italic">
                                            <Package size={14} /> Detailed Measurements
                                        </h3>
                                        {isLoadingDimensions ? (
                                            <div className="flex items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Scanning units...</span>
                                            </div>
                                        ) : dimensions.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {dimensions.map((dim, idx) => (
                                                    <div key={dim.id || idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-orange-100 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-orange-600 text-[10px] shadow-sm border border-slate-50 italic">
                                                                {dim.qty}x
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black uppercase text-slate-900 tracking-wider">
                                                                    {dim.length}L × {dim.breadth}B × {dim.height}H
                                                                </p>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">{dim.sizeType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="px-3 py-1 bg-white border border-slate-50 rounded-lg text-[8px] font-black uppercase text-slate-200 italic group-hover:text-orange-400 transition-colors">
                                                            P-UNIT {idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] italic">No dimension details specified</p>
                                            </div>
                                        )}
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
                                Close info
                            </button>
                            {!selectedMatch?.vendorQuotedCost && (
                                <button
                                    onClick={() => {
                                        setShowLeadDetails(false);
                                        handleOpenQuoteModal(selectedMatch);
                                    }}
                                    className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-100 hover:bg-orange-600 transition-all transform hover:-translate-y-0.5 active:scale-95 italic"
                                >
                                    Proceed to Quote
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorLeadsList;
