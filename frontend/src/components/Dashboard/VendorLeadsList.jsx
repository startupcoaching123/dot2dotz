import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, Truck, Calendar,
    Check, X, AlertCircle, Eye,
    Info, IndianRupee, Send, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

// Helper to format currency in Indian Rupees
const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

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
        setSelectedMatch(match);
        const lead = leadDetails[leadId];
        if (lead) {
            setSelectedLead(lead);
            setShowLeadDetails(true);
            fetchDimensions(leadId);
        } else {
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
        setDimensions([]);
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
            case 'SENT': return 'bg-amber-50 text-amber-700 border-amber-200/60';
            case 'QUOTED': return 'bg-blue-50 text-blue-700 border-blue-200/60';
            case 'ACCEPTED': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
            case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-200/60';
            case 'PAYMENT_PENDING': return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
            default: return 'bg-gray-50 text-gray-700 border-gray-200/60';
        }
    };

    const getMatchStatus = (match) => {
        if (match.clientResponse === 'LEADPAYMENT') return 'ACCEPTED';
        if (match.vendorQuotedCost) return 'QUOTED';
        return match.leadStatus || 'SENT';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">Found {filteredMatches.length} active assignments</p>
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by city, ID, or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-gray-500">Scanning incoming loads...</p>
                        </div>
                    ) : error ? (
                        <div className="py-24 text-center">
                            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <AlertCircle size={24} />
                            </div>
                            <p className="text-sm font-medium text-rose-600">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-3 text-sm text-gray-500 hover:text-gray-900 underline transition-colors">Retry Connection</button>
                        </div>
                    ) : filteredMatches.length === 0 ? (
                        <div className="py-28 text-center">
                            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl border border-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Truck size={32} />
                            </div>
                            <p className="text-base font-semibold text-gray-900">No new load assignments</p>
                            <p className="text-sm text-gray-500 mt-1">Assignments will appear here when an admin routes them to you.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Assign Info</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Route (From - To)</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Cargo Detail</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">My Quote</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMatches.map((match) => {
                                    const lead = leadDetails[match.leadId] || {};
                                    return (
                                        <tr key={match.leadMatchId} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-5 align-top">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Match #{match.leadMatchId}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                                                        <Calendar size={12} />
                                                        <p className="text-xs">Sent: {new Date(match.sentOn).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <div className="space-y-2.5">
                                                    <div className="flex items-start gap-2.5">
                                                        <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0 ring-4 ring-blue-50"></div>
                                                        <p className="text-sm font-medium text-gray-900">{lead.pickupCity || 'Loading...'}</p>
                                                    </div>
                                                    <div className="flex items-start gap-2.5">
                                                        <div className="w-2 h-2 mt-1.5 bg-rose-500 rounded-full flex-shrink-0 ring-4 ring-rose-50"></div>
                                                        <p className="text-sm font-medium text-gray-900">{lead.dropCity || 'Loading...'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-900 flex items-center gap-1.5 font-medium">
                                                        <Package size={14} className="text-gray-400" />
                                                        {lead.consignmentType}
                                                    </p>
                                                    <p className="text-xs text-gray-500 ml-5 font-medium">
                                                        {lead.consignmentGrossWeight ? `${lead.consignmentGrossWeight} KG` : '---'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                {match.vendorQuotedCost ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-gray-100/80 border border-gray-200 rounded-md text-sm font-semibold text-gray-900">
                                                        {formatINR(match.vendorQuotedCost)}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium">Pending Quote</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getStatusStyle(getMatchStatus(match))}`}>
                                                    {getMatchStatus(match)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 align-top text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleViewDetails(match)}
                                                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenQuoteModal(match)}
                                                        disabled={match.clientResponse === 'LEADPAYMENT'}
                                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shadow-sm ${match.clientResponse === 'LEADPAYMENT'
                                                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100 shadow-none'
                                                            : match.vendorQuotedCost
                                                                ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                                                : 'bg-gray-900 border border-transparent text-white hover:bg-gray-800 hover:shadow-md'
                                                            }`}
                                                    >
                                                        {match.clientResponse === 'LEADPAYMENT' ? <Check size={14} /> : (match.vendorQuotedCost ? <IndianRupee size={14} /> : <Send size={14} />)}
                                                        {match.clientResponse === 'LEADPAYMENT' ? 'Confirmed' : (match.vendorQuotedCost ? 'Update' : 'Quote')}
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
            <AnimatePresence>
                {showQuoteModal && selectedMatch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Submit Your Quote</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Match ID: {selectedMatch.leadMatchId}</p>
                                </div>
                                <button onClick={() => setShowQuoteModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitQuote} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount Quoted</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            required
                                            value={quoteValue}
                                            onChange={(e) => setQuoteValue(e.target.value)}
                                            placeholder="e.g. 15000"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2.5 flex gap-1.5 items-start">
                                        <Info size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
                                        Admin will review and add system margins before presenting the final price to the client.
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowQuoteModal(false)}
                                        className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingQuote}
                                        className="flex-1 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-medium text-sm hover:from-black hover:to-gray-900 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmittingQuote ? (
                                            <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Submit Quote
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lead Details Modal */}
            <AnimatePresence>
                {showLeadDetails && selectedLead && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl flex items-center justify-center text-lg font-semibold shadow-sm">
                                        #{selectedLead.leadId.toString().substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                                                Lead #{selectedLead.leadId}
                                            </h2>
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                                                {selectedLead.leadStatus}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                            <Calendar size={14} />
                                            Required On: {new Date(selectedLead.requestedOn).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowLeadDetails(false)}
                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-gray-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Route Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                            <MapPin size={16} className="text-gray-500" /> Transport Route
                                        </h3>

                                        <div className="relative pl-6 space-y-6 ml-2">
                                            {/* Connecting Dashed Line */}
                                            <div className="absolute left-1.5 top-3 bottom-8 w-px border-l-2 border-dashed border-gray-200"></div>

                                            {/* Pickup */}
                                            <div className="relative z-10">
                                                <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-gray-50 ring-4 ring-blue-50"></div>
                                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                    <p className="text-xs font-medium text-gray-500 mb-1">Pickup Location</p>
                                                    <p className="text-base font-semibold text-gray-900 leading-snug">{selectedLead.pickupCity}</p>
                                                    <p className="text-sm text-gray-500 mt-0.5">{selectedLead.pickupState} — {selectedLead.pickupFromPincode}</p>
                                                </div>
                                            </div>

                                            {/* Drop */}
                                            <div className="relative z-10">
                                                <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-gray-50 ring-4 ring-rose-50"></div>
                                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                    <p className="text-xs font-medium text-gray-500 mb-1">Delivery Location</p>
                                                    <p className="text-base font-semibold text-gray-900 leading-snug">{selectedLead.dropCity}</p>
                                                    <p className="text-sm text-gray-500 mt-0.5">{selectedLead.dropState} — {selectedLead.dropToPincode}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                            <p className="text-xs font-semibold text-gray-900 mb-2 flex gap-1.5 items-center"><Info size={14} className="text-gray-400" /> Loading Instructions</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {selectedLead.pickupNote || 'No specific instructions provided for this load.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Cargo Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                            <Truck size={16} className="text-gray-500" /> Cargo Requirements
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Goods Type</p>
                                                <p className="text-base font-semibold text-gray-900">{selectedLead.consignmentType}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Total Weight</p>
                                                <p className="text-base font-semibold text-gray-900">{selectedLead.consignmentGrossWeight} <span className="text-sm text-gray-500 font-medium">KG</span></p>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm col-span-2 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 mb-1">Required Truck Profile</p>
                                                    <p className="text-base font-semibold text-gray-900">{selectedLead.vehicle} <span className="text-gray-500 text-sm font-medium">({selectedLead.vehicleType})</span></p>
                                                </div>
                                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                                                    <Truck size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dimensions Section */}
                                        <div className="space-y-4 pt-2">
                                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                                <Package size={16} className="text-gray-500" /> Dimensional Details
                                            </h3>
                                            {isLoadingDimensions ? (
                                                <div className="flex justify-center py-4">
                                                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            ) : dimensions.length > 0 ? (
                                                <div className="space-y-2">
                                                    {dimensions.map((dim, idx) => (
                                                        <div key={dim.id || idx} className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center font-semibold text-gray-700 text-sm border border-gray-100">
                                                                    {dim.qty}x
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900 tracking-wide">
                                                                        {dim.length}L × {dim.breadth}B × {dim.height}H
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider font-medium">{dim.sizeType}</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                                Unit {idx + 1}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-5 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                                                    <p className="text-sm text-gray-500">No specific dimensions provided.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setShowLeadDetails(false)}
                                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Close Info
                                </button>
                                {!selectedMatch?.vendorQuotedCost && (
                                    <button
                                        onClick={() => {
                                            setShowLeadDetails(false);
                                            handleOpenQuoteModal(selectedMatch);
                                        }}
                                        className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-medium text-sm hover:from-black hover:to-gray-900 shadow-md transition-all flex items-center gap-2"
                                    >
                                        <IndianRupee size={16} />
                                        Proceed to Quote
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorLeadsList;