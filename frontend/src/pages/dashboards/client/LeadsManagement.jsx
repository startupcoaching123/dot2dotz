import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Search, MapPin,
  Truck, Package, User, Phone, History,
  Clock, StickyNote, ChevronRight, CreditCard,
  Filter, X, CheckCircle2, AlertCircle,
  TrendingUp, ArrowRight, Eye, ShieldCheck
} from 'lucide-react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import fetchWithAuth from '../../../FetchWithAuth';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../api/endpoints';
import Swal from 'sweetalert2';

const LeadsManagement = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Lead Details Modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [leadDimensions, setLeadDimensions] = useState([]);
  const [isLoadingLeadDimensions, setIsLoadingLeadDimensions] = useState(false);
  const [leadQuotes, setLeadQuotes] = useState([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    pickupFromPincode: "",
    pickupCity: "",
    pickupState: "",
    pickupAddress: "",
    pickupContactPersonName: "",
    pickupContactNo: "",
    pickupPreferTiming: "",
    pickupNote: "",
    dropToPincode: "",
    dropCity: "",
    dropState: "",
    dropAddress: "",
    dropContactPersonName: "",
    dropContactNo: "",
    dropNote: "",
    vehicleId: "",
    vehicleType: "LCV", // Default
    truckType: "Full Truck Load",
    truckBodyType: "Open Body",
    consignmentType: "",
    consignmentGrossWeight: "",
    leadType: "PRIVATE"
  });

  const [dimensions, setDimensions] = useState([]);
  const [dimForm, setDimForm] = useState({
    qty: "",
    length: "",
    breadth: "",
    height: "",
    sizeType: "Feet"
  });

  const handleDimChange = (e) => {
    const { name, value } = e.target;
    setDimForm(prev => ({ ...prev, [name]: value }));
  };

  const addDimension = () => {
    if (!dimForm.qty || !dimForm.length || !dimForm.breadth || !dimForm.height) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Dimensions',
        text: 'Please fill all dimension values (Qty, L, B, H).'
      });
      return;
    }
    setDimensions([...dimensions, { ...dimForm, id: Date.now() }]);
    setDimForm({ qty: "", length: "", breadth: "", height: "", sizeType: "Feet" });
  };

  const removeDimension = (id) => {
    setDimensions(dimensions.filter(d => d.id !== id));
  };

  const sidebarItems = [
    { icon: Package, label: 'Overview', path: '/dashboard/client' },
    { icon: FileText, label: 'Leads', path: '/dashboard/client/leads' },
    { icon: Plus, label: 'New Shipment', path: '/dashboard/client/new' },
    { icon: Clock, label: 'Active Tracking', path: '/dashboard/client/track' },
    { icon: History, label: 'Shipment History', path: '/dashboard/client/history' },
    { icon: CreditCard, label: 'Billing & Invoices', path: '/dashboard/client/billing' },
    { icon: User, label: 'Team Management', path: '/dashboard/client/team' },
  ];
  const fetchDimensions = async (leadId) => {
    if (!leadId) return;
    setLeadDimensions([]);
    setIsLoadingLeadDimensions(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/${leadId}/dimensions`, {
        method: 'GET'
      });
      if (res.ok) {
        const data = await res.json();
        setLeadDimensions(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching dimensions:', err);
    } finally {
      setIsLoadingLeadDimensions(false);
    }
  };

  const fetchQuotes = async (leadId) => {
    if (!leadId) return;
    setLeadQuotes([]);
    setIsLoadingQuotes(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/${leadId}/quotes`, {
        method: 'GET'
      });
      if (res.ok) {
        const data = await res.json();
        const quotes = data.data || [];
        // Only show quotes that have been responded to by vendors
        setLeadQuotes(quotes.filter(q => q.vendorResponseBy && q.vendorQuotedCost));
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  const handleAcceptQuote = async (quote) => {
    const result = await Swal.fire({
      title: 'Confirm Acceptance',
      text: `Are you sure you want to accept this quote for ₹${quote.costToClient}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept it!',
      cancelButtonText: 'No, keep looking',
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#f1f5f9',
      customClass: {
        confirmButton: 'text-[10px] uppercase font-black tracking-widest px-8 py-3 rounded-xl italic',
        cancelButton: 'text-[10px] uppercase font-black tracking-widest px-8 py-3 rounded-xl italic text-slate-500'
      }
    });

    if (result.isConfirmed) {
      setIsAccepting(true);
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/${selectedLead.leadId}/accept?matchId=${quote.leadMatchId}`, {
          method: 'POST'
        });

        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Quote Accepted!',
            text: 'Transport partner confirmed. Proceeding to payment manifest.',
            timer: 2000,
            showConfirmButton: false
          });
          setShowLeadDetails(false);
          fetchLeads(); // Refresh list
        } else {
          throw new Error('Failed to accept quote');
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Oops!', text: 'Something went wrong while accepting the quote.' });
      } finally {
        setIsAccepting(false);
      }
    }
  };

  const handleViewLeadDetails = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
    fetchDimensions(lead.leadId);
    fetchQuotes(lead.leadId);
  };

  useEffect(() => {
    fetchLeads();
    fetchVehicles();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.LEADS}`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.VEHICLES}`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Restriction for contact numbers (10 digits)
    if (['pickupContactNo', 'dropContactNo'].includes(name)) {
      const val = value.replace(/\D/g, ''); // Remove non-digits
      if (val.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: val }));
      }
      return;
    }

    // Restriction for pincodes (6 digits)
    if (['pickupFromPincode', 'dropToPincode'].includes(name)) {
      const val = value.replace(/\D/g, ''); // Remove non-digits
      if (val.length <= 6) {
        setFormData(prev => ({ ...prev, [name]: val }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.pickupFromPincode || formData.pickupFromPincode.length !== 6) {
      Swal.fire({ icon: 'warning', title: 'Invalid Pincode', text: 'Pickup Pincode must be exactly 6 digits.' });
      return;
    }

    if (!formData.dropToPincode || formData.dropToPincode.length !== 6) {
      Swal.fire({ icon: 'warning', title: 'Invalid Pincode', text: 'Drop Pincode must be exactly 6 digits.' });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.pickupContactNo)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Contact', text: 'Pickup Contact must be 10 digits starting with 6-9.' });
      return;
    }

    if (formData.dropContactNo && !/^[6-9]\d{9}$/.test(formData.dropContactNo)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Contact', text: 'Drop Contact must be 10 digits starting with 6-9.' });
      return;
    }

    if (!formData.vehicleId) {
      Swal.fire({ icon: 'warning', title: 'Vehicle Required', text: 'Please select a vehicle type from the catalog.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.LEADS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const responseData = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Lead Created!',
          text: 'Your freight lead has been generated successfully.',
          timer: 2000,
          showConfirmButton: false
        });

        // Post dimensions if any
        const leadId = responseData.data?.leadId || responseData.data?.id;
        if (leadId && dimensions.length > 0) {
          for (const dim of dimensions) {
            const { id, ...dimBody } = dim;
            try {
              await fetchWithAuth(`${API_BASE_URL}/api/leads/${leadId}/dimensions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dimBody)
              });
            } catch (dimErr) {
              console.error(`Error posting dimension for lead ${leadId}:`, dimErr);
            }
          }
        }

        setActiveTab('list');
        fetchLeads();
        // Reset form
        setFormData({
          ...formData,
          pickupFromPincode: "", pickupCity: "", pickupState: "", pickupAddress: "",
          pickupContactPersonName: "", pickupContactNo: "", pickupPreferTiming: "", pickupNote: "",
          dropToPincode: "", dropCity: "", dropState: "", dropAddress: "",
          dropContactPersonName: "", dropContactNo: "", dropNote: "",
          consignmentType: "", consignmentGrossWeight: ""
        });
        setDimensions([]);
      } else {
        throw new Error(responseData.message || 'Failed to create lead');
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLeads = leads.filter(l =>
    l.leadId?.toString().includes(searchTerm) ||
    l.pickupCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.dropCity?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client Owner">
      <div className="space-y-10 pb-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
              Lead <span className="text-blue-600">Operations</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Management System • {activeTab === 'list' ? 'Active Directory' : 'New Requirements'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab(activeTab === 'list' ? 'create' : 'list')}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl group
                ${activeTab === 'list'
                  ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
                  : 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'}`}
            >
              {activeTab === 'list' ? (
                <>
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                  Create New Lead
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Back to Leads
                </>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <DashboardGrid>
              <StatCard title="Total Leads" value={leads.length} icon={FileText} trend={5} color="blue" />
              <StatCard title="Active Enquiries" value={leads.filter(l => l.leadStatus === 'GENERATED').length} icon={TrendingUp} trend={12} color="green" />
              <StatCard title="Quotes Received" value="14" icon={CheckCircle2} trend={2} color="indigo" />
              <StatCard title="Avg. Response" value="2.4h" icon={Clock} trend={-10} color="orange" />
            </DashboardGrid>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">My Freight Enquiries</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time tracking of your private leads</p>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Lead ID or City..."
                    className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-wider focus:outline-none focus:border-blue-500 transition-all w-full sm:w-80"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Records...</p>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="py-20 text-center">
                    <Package size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase text-xs">No Leads Found</p>
                    <button onClick={() => setActiveTab('create')} className="mt-4 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline">Generate your first enquiry</button>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Lead Entity</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Route Details</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Consignment</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredLeads.map((lead, idx) => (
                        <tr key={lead.leadId} className="hover:bg-slate-50/30 transition-all group">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:shadow-blue-50 transition-all">
                                <FileText className="text-blue-600" size={24} />
                              </div>
                              <div>
                                <p className="text-base font-black text-slate-900 uppercase italic tracking-tighter">#{lead.leadId}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Generated: {new Date(lead.requestedOn).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-3">
                              <div className="text-center min-w-[60px]">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                                <p className="text-xs font-black text-slate-900 mt-1">{lead.pickupCity}</p>
                              </div>
                              <div className="flex flex-col items-center">
                                <ArrowRight size={14} className="text-slate-300" />
                              </div>
                              <div className="text-center min-w-[60px]">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dest</p>
                                <p className="text-xs font-black text-slate-900 mt-1">{lead.dropCity}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="space-y-1">
                              <p className="text-xs font-black text-slate-900 italic">{lead.consignmentType}</p>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase text-slate-500">{lead.vehicleType}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase">{lead.consignmentGrossWeight}kg</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border
                                                ${lead.leadStatus === 'GENERATED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                              {lead.leadStatus}
                            </span>
                          </td>
                           <td className="px-10 py-8 text-right">
                            <button 
                              onClick={() => handleViewLeadDetails(lead)}
                              className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Form Section */}
            <div className="lg:col-span-8">
              <form onSubmit={handleCreateLead} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-10 space-y-12">

                {/* Section: Origin */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                      <MapPin size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Pickup Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Pincode *</label>
                      <input required name="pickupFromPincode" value={formData.pickupFromPincode} onChange={handleInputChange} placeholder="400093" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" maxLength={6} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">City *</label>
                      <input required name="pickupCity" value={formData.pickupCity} onChange={handleInputChange} placeholder="Mumbai" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">State *</label>
                      <input required name="pickupState" value={formData.pickupState} onChange={handleInputChange} placeholder="Maharashtra" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Pickup Address</label>
                      <input name="pickupAddress" value={formData.pickupAddress} onChange={handleInputChange} placeholder="Plot 45, MIDC, Andheri East..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Timing Pref</label>
                      <input name="pickupPreferTiming" value={formData.pickupPreferTiming} onChange={handleInputChange} placeholder="Morning 8am-12pm" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex gap-2 items-center"><User size={12} /> Point of Contact</label>
                      <input name="pickupContactPersonName" value={formData.pickupContactPersonName} onChange={handleInputChange} placeholder="Ramesh Sharma" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex gap-2 items-center"><Phone size={12} /> Contact No</label>
                      <input name="pickupContactNo" value={formData.pickupContactNo} onChange={handleInputChange} placeholder="9876543210" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" maxLength={10} />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-50" />

                {/* Section: Destination */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-100">
                      <MapPin size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Delivery Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Pincode *</label>
                      <input required name="dropToPincode" value={formData.dropToPincode} onChange={handleInputChange} placeholder="380001" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" maxLength={6} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">City *</label>
                      <input required name="dropCity" value={formData.dropCity} onChange={handleInputChange} placeholder="Ahmedabad" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">State *</label>
                      <input required name="dropState" value={formData.dropState} onChange={handleInputChange} placeholder="Gujarat" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Drop Address</label>
                      <input name="dropAddress" value={formData.dropAddress} onChange={handleInputChange} placeholder="Near Sardar Patel Bridge..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex gap-2 items-center"><User size={12} /> Receiver Name</label>
                      <input name="dropContactPersonName" value={formData.dropContactPersonName} onChange={handleInputChange} placeholder="Suresh Patel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex gap-2 items-center"><Phone size={12} /> Receiver No</label>
                      <input name="dropContactNo" value={formData.dropContactNo} onChange={handleInputChange} placeholder="9123456780" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" maxLength={10} />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-50" />

                {/* Section: Cargo & Logistics */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                      <Package size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Cargo & Logistics</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Consignment Type</label>
                        <input name="consignmentType" value={formData.consignmentType} onChange={handleInputChange} placeholder="e.g., Industrial Goods, Pharma..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Gross Weight (kg)</label>
                        <input name="consignmentGrossWeight" value={formData.consignmentGrossWeight} onChange={handleInputChange} placeholder="12000" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Truck size={100} />
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Select Logistics Partner Type</p>
                      <div className="space-y-4">
                        <select
                          name="vehicleId"
                          value={formData.vehicleId}
                          onChange={(e) => {
                            const v = vehicles.find(v => v.id === parseInt(e.target.value));
                            setFormData(prev => ({
                              ...prev,
                              vehicleId: e.target.value,
                              vehicleType: v?.vehicleType || prev.vehicleType,
                              truckBodyType: v?.vehicleBodyType || prev.truckBodyType
                            }));
                          }}
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select Vehicle Type...</option>
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.vehicle} - {v.vehicleType} ({v.maxLoadCapacityKg}kg)</option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase text-slate-500">{formData.truckType}</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase text-slate-500">{formData.truckBodyType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-50" />

                {/* Section: Dimensions */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                      <Package size={20} />
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Package Dimensions</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{dimensions.length} Items Added</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Qty</label>
                        <input name="qty" type="number" value={dimForm.qty} onChange={handleDimChange} placeholder="20" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Length</label>
                        <input name="length" type="number" step="0.1" value={dimForm.length} onChange={handleDimChange} placeholder="2.5" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Breadth</label>
                        <input name="breadth" type="number" step="0.1" value={dimForm.breadth} onChange={handleDimChange} placeholder="1.5" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Height</label>
                        <input name="height" type="number" step="0.1" value={dimForm.height} onChange={handleDimChange} placeholder="1.8" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Unit</label>
                        <select name="sizeType" value={dimForm.sizeType} onChange={handleDimChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none focus:border-indigo-500 transition-all shadow-inner appearance-none cursor-pointer">
                          <option value="Feet">Feet</option>
                          <option value="Inches">Inches</option>
                          <option value="Cm">Cm</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addDimension}
                      className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 border border-indigo-100"
                    >
                      <Plus size={16} /> Add Consignment Unit
                    </button>

                    <AnimatePresence>
                      {dimensions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          {dimensions.map((dim) => (
                            <motion.div
                              key={dim.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group hover:border-indigo-200 transition-all shadow-sm"
                            >
                              <div className="flex items-center gap-5">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 text-[10px] shadow-inner">
                                  {dim.qty}x
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase text-slate-900 tracking-wider">
                                    {dim.length}L × {dim.breadth}B × {dim.height}H
                                  </p>
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{dim.sizeType}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDimension(dim.id)}
                                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <X size={16} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase italic text-sm tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50"
                  >
                    {isSubmitting ? 'GENERATING ENQUIRY...' : 'PUBLISH FREIGHT LEAD'}
                  </button>
                  <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6">By publishing, you agree to our transit and insurance policies.</p>
                </div>
              </form>
            </div>

            {/* Side Assistance */}
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <AlertCircle size={48} />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-4 uppercase italic">Pro <span className="text-blue-400">Tips</span></h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-blue-400 font-black">1</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-semibold leading-relaxed uppercase tracking-wider">Ensure pincodes are accurate for precise automated route matching.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-blue-400 font-black">2</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-semibold leading-relaxed uppercase tracking-wider">Descriptive pickup notes help vendors plan the loading sequence better.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-100/50">
                <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                  <StickyNote className="text-blue-600" size={20} />
                  Operational Notes
                </h3>
                <textarea
                  name="pickupNote"
                  value={formData.pickupNote}
                  onChange={handleInputChange}
                  placeholder="Add any specific instructions for the transport team..."
                  className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-wider focus:outline-none focus:border-blue-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lead Details Modal */}
        <AnimatePresence>
          {showLeadDetails && selectedLead && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-blue-50/30">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Lead Details #{selectedLead.leadId}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${selectedLead.leadStatus === 'GENERATED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                          {selectedLead.leadStatus}
                        </span>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{new Date(selectedLead.requestedOn).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowLeadDetails(false)} className="p-3 bg-white text-slate-400 rounded-xl hover:text-red-500 transition-all shadow-sm">
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-10 overflow-y-auto flex-1 space-y-12 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Side: Specs & Route */}
                    <div className="space-y-12">
                      <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] flex items-center gap-2 italic">
                          <MapPin size={12} /> Route Specifications
                        </h4>
                        <div className="relative pl-8 space-y-10 border-l-2 border-dashed border-slate-100 ml-2">
                          <div className="relative">
                            <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm ring-4 ring-blue-50"></div>
                            <div>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Pickup Information</p>
                              <p className="text-sm font-black text-slate-900 uppercase leading-snug">{selectedLead.pickupCity}, {selectedLead.pickupState}</p>
                              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase italic tracking-wider">{selectedLead.pickupAddress} — {selectedLead.pickupFromPincode}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm ring-4 ring-slate-50"></div>
                            <div>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Delivery Information</p>
                              <p className="text-sm font-black text-slate-900 uppercase leading-snug">{selectedLead.dropCity}, {selectedLead.dropState}</p>
                              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase italic tracking-wider">{selectedLead.dropAddress} — {selectedLead.dropToPincode}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Clock size={12} /> Pickup Preference</p>
                          <p className="text-[11px] font-black text-slate-800 uppercase italic tracking-tight">{selectedLead.pickupPreferTiming || 'Standard working hours'}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 italic">
                          <Package size={12} /> Package Measurements
                        </h4>
                        
                        {isLoadingLeadDimensions ? (
                          <div className="flex items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Loading units...</span>
                          </div>
                        ) : leadDimensions.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {leadDimensions.map((dim, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-100 transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 text-[10px] shadow-sm italic">
                                    {dim.qty}x
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black uppercase text-slate-900 tracking-wider">
                                      {dim.length}L × {dim.breadth}B × {dim.height}H
                                    </p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{dim.sizeType}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">No detailed dimensions recorded</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Cargo & Quotes */}
                    <div className="space-y-12">
                      <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] flex items-center gap-2 italic">
                          <Truck size={12} /> Cargo & Logistics
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Item Type</p>
                            <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{selectedLead.consignmentType}</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Weight</p>
                            <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{selectedLead.consignmentGrossWeight} <span className="text-[10px] not-italic text-slate-400">KG</span></p>
                          </div>
                          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 col-span-2 flex items-center justify-between">
                            <div>
                              <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-2">Requirement</p>
                              <p className="text-sm font-black text-blue-900 uppercase italic tracking-tight">{selectedLead.vehicle} <span className="text-blue-400 font-bold not-italic text-[10px] ml-1">({selectedLead.vehicleType})</span></p>
                            </div>
                            <Truck className="text-blue-600" size={24} />
                          </div>
                        </div>
                      </div>

                      {/* Quotes Section */}
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] flex items-center gap-2 italic">
                            <TrendingUp size={12} /> Vendor Bids & Quotes
                          </h4>
                          {leadQuotes.length > 0 && (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-black uppercase tracking-widest border border-indigo-100">
                              {leadQuotes.length} Offers Available
                            </span>
                          )}
                        </div>

                        {isLoadingQuotes ? (
                          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[2rem] border border-slate-100 gap-4">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Scanning Platform for Bids...</p>
                          </div>
                        ) : leadQuotes.length === 0 ? (
                          <div className="p-12 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-50">
                              <History className="text-slate-300" size={24} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Vendor responses</p>
                              <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">Estimations will appear here once vendors bid</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {leadQuotes.map((quote) => (
                              <div key={quote.leadMatchId} className="group p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
                                
                                <div className="flex items-start justify-between relative z-10">
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-indigo-100 text-xs">
                                        ₹
                                      </div>
                                      <div>
                                        <p className="text-lg font-black text-slate-900 tracking-tighter italic">₹{quote.costToClient?.toLocaleString()}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">All inclusive transit fare</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                        <ShieldCheck size={10} className="text-green-500" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Verified Vendor</span>
                                      </div>
                                      <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest italic">{quote.vendorResponseBy}</p>
                                    </div>
                                  </div>

                                  <button 
                                    onClick={() => handleAcceptQuote(quote)}
                                    disabled={isAccepting || selectedLead.leadStatus === 'LEADACCEPTED'}
                                    className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 italic ${
                                      selectedLead.leadStatus === 'LEADACCEPTED' 
                                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                                      : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-100'
                                    }`}
                                  >
                                    {selectedLead.leadStatus === 'LEADACCEPTED' ? 'Booking Finalized' : 'Finalize Bid'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-50 flex justify-end bg-slate-50/50">
                  <button onClick={() => setShowLeadDetails(false)} className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 italic">
                    Close Manifest
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default LeadsManagement;
