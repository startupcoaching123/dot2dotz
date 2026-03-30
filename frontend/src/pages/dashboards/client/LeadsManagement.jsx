import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Search, MapPin,
  Truck, Package, User, Phone, History,
  Clock, StickyNote, ChevronRight, CreditCard,
  Filter, X, CheckCircle2, AlertCircle,
  TrendingUp, ArrowRight, Eye, ShieldCheck, UserCircle
} from 'lucide-react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import fetchWithAuth from '../../../FetchWithAuth';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../api/endpoints';
import Swal from 'sweetalert2';

const LeadsManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', or 'quotes'
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allQuotes, setAllQuotes] = useState([]);
  const [isLoadingAllQuotes, setIsLoadingAllQuotes] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'GENERATED', 'LEADACCEPTED', 'BOOKED'
  const [vehicleFilter, setVehicleFilter] = useState('ALL'); // 'ALL', 'LCV', 'HCV', etc.

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
    { icon: UserCircle, label: 'Profile', path: '/dashboard/client/profile' },
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

  const handleAcceptQuote = async (quote, specificLeadId = null) => {
    const leadId = specificLeadId || selectedLead?.leadId;
    if (!leadId) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Lead information missing' });
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Acceptance',
      text: `Are you sure you want to accept this quote for ₹${quote.costToClient}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept it',
      cancelButtonText: 'No, keep looking',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#94a3b8'
    });

    if (result.isConfirmed) {
      setIsAccepting(true);
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/${leadId}/accept?matchId=${quote.leadMatchId}`, {
          method: 'POST'
        });

        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Quote Accepted!',
            text: 'Transport partner confirmed. Proceeding to payment...',
            timer: 2000,
            showConfirmButton: false
          });

          // Refresh list and data
          fetchLeads();

          // Trigger payment initiation automatically
          setTimeout(() => {
            handleInitiatePayment(selectedLead.leadId);
          }, 1500);

        } else {
          throw new Error('Failed to accept quote');
        }
      } catch (_err) {
        Swal.fire({ icon: 'error', title: 'Oops!', text: 'Something went wrong while accepting the quote.' });
      } finally {
        setIsAccepting(true); // Keep loading state until payment redirect or refresh
      }
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchVehicles();

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchAllQuotes = async () => {
    if (leads.length === 0) return;
    setIsLoadingAllQuotes(true);
    try {
      // Only fetch for leads that are not finished
      const activeLeads = leads.filter(l => l.leadStatus === 'GENERATED' || l.leadStatus === 'LEADACCEPTED');
      
      const results = await Promise.all(activeLeads.map(async (lead) => {
        try {
          const res = await fetchWithAuth(`${API_BASE_URL}/api/leads/${lead.leadId}/quotes`, { method: 'GET' });
          if (res.ok) {
            const data = await res.json();
            const quotes = data.data || [];
            return quotes
              .filter(q => q.vendorResponseBy && q.vendorQuotedCost)
              .map(q => ({ ...q, lead }));
          }
        } catch (e) {
          console.error(`Error fetching quotes for lead ${lead.leadId}:`, e);
        }
        return [];
      }));

      const flattenedQuotes = results.flat().sort((a, b) => new Date(b.sentOn) - new Date(a.sentOn));
      setAllQuotes(flattenedQuotes);
    } catch (err) {
      console.error("Error fetching all quotes:", err);
    } finally {
      setIsLoadingAllQuotes(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quotes') {
      fetchAllQuotes();
    }
  }, [activeTab, leads]);

  const handleInitiatePayment = async (leadId) => {
    setIsAccepting(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/payments/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: Number(leadId),
          orderType: "ADVANCE"
        })
      });

      if (res.ok) {
        const data = await res.json();
        const paymentData = data.data || data;

        // Razorpay Options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY || paymentData.razorpayKeyId || 'rzp_test_GJ4jfGjgrXSq5J',
          amount: paymentData.amount,
          currency: paymentData.currency || "INR",
          name: "Dot2Dotz Logistics",
          description: `Advance Payment for Lead #${leadId}`,
          order_id: paymentData.razorpayOrderId,
          handler: async function (response) {
            // This is called after successful payment
            try {
              const verifyRes = await fetchWithAuth(`${API_BASE_URL}/api/payments/webhook/razorpay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  leadId: Number(leadId)
                })
              });

              if (verifyRes.ok) {
                fetchLeads(); // Refresh to show paid status
                navigate(`/payment/success/${leadId}`);
              } else {
                navigate(`/payment/failure/${leadId}`);
              }
            } catch (err) {
              console.error("Verification error:", err);
            }
          },
          prefill: {
            name: selectedLead?.pickupContactPersonName || "",
            contact: selectedLead?.pickupContactNo || ""
          },
          theme: {
            color: "#2563eb"
          }
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response) {
          navigate(`/payment/failure/${leadId}`);
        });

        rzp.open();

      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Payment initiation failed');
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Payment Error', text: err.message });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleViewLeadDetails = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
    fetchDimensions(lead.leadId);
    fetchQuotes(lead.leadId);
  };

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
    if (!formData.pickupFromPincode || formData.pickupFromPincode.length !== 6 || 
        !formData.dropToPincode || formData.dropToPincode.length !== 6) {
      Swal.fire({ icon: 'warning', title: 'Invalid Pincode', text: 'Pincodes must be exactly 6 digits.' });
      return;
    }

    if (!formData.pickupAddress || !formData.pickupContactPersonName || !formData.pickupContactNo ||
        !formData.dropAddress || !formData.dropContactPersonName || !formData.dropContactNo ||
        !formData.consignmentType || !formData.consignmentGrossWeight) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill all required fields marked with *' });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.pickupContactNo)) {
      Swal.fire({ icon: 'warning', title: 'Invalid Contact', text: 'Pickup Contact must be 10 digits starting with 6-9.' });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.dropContactNo)) {
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
            const { id: _id, ...dimBody } = dim;
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

  const filteredLeads = leads.filter(l => {
    // Search Filter
    const matchesSearch = 
      l.leadId?.toString().includes(searchTerm) ||
      l.pickupCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.dropCity?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status Filter
    const matchesStatus = statusFilter === 'ALL' || l.leadStatus === statusFilter;

    // Vehicle Category Filter
    const matchesVehicle = vehicleFilter === 'ALL' || l.vehicleType === vehicleFilter;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const uniqueVehicleTypes = Array.from(new Set(leads.map(l => l.vehicleType).filter(Boolean)));

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client Owner">
      <div className="space-y-6 pb-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Lead Operations
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Management System • {activeTab === 'list' ? 'Active Directory' : 'New Requirements'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Lead List
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'quotes' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Quotations
              </button>
            </div>
            
            <button
              onClick={() => setActiveTab(activeTab === 'create' ? 'list' : 'create')}
              className={`flex w-full md:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm
                ${activeTab === 'create'
                  ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {activeTab === 'create' ? (
                <>
                  <FileText size={18} />
                  Back to Hub
                </>
              ) : (
                <>
                  <Plus size={18} />
                  New Lead
                </>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
          <div className="space-y-6">
            <DashboardGrid>
              <StatCard title="Total Leads" value={leads.length} icon={FileText} trend={5} color="blue" />
              <StatCard title="Active Enquiries" value={leads.filter(l => l.leadStatus === 'GENERATED').length} icon={TrendingUp} trend={12} color="green" />
              <StatCard title="Quotes Received" value="14" icon={CheckCircle2} trend={2} color="indigo" />
              <StatCard title="Avg. Response" value="2.4h" icon={Clock} trend={-10} color="orange" />
            </DashboardGrid>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Freight Enquiries</h3>
                  <p className="text-sm text-gray-500 mt-1">Real-time tracking of your private leads</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="ALL">All Status</option>
                        <option value="GENERATED">Pending Enquiry</option>
                        <option value="LEADACCEPTED">Finalized (Unpaid)</option>
                        <option value="BOOKED">Paid Shipments</option>
                      </select>
                    </div>
                    <div className="relative flex-1 sm:w-44">
                      <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <select
                        value={vehicleFilter}
                        onChange={(e) => setVehicleFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="ALL">All Vehicles</option>
                        {uniqueVehicleTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search ID or City..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading records...</p>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="py-12 text-center">
                    <Package size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">No Leads Found</p>
                    <button onClick={() => setActiveTab('create')} className="mt-2 text-blue-600 font-medium text-sm hover:underline">Generate your first enquiry</button>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Entity</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route Details</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Consignment</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.leadId} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                                <FileText className="text-blue-600" size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">#{lead.leadId}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Generated: {new Date(lead.requestedOn).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="text-left min-w-[60px]">
                                <p className="text-xs text-gray-400">Origin</p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5">{lead.pickupCity}</p>
                              </div>
                              <ArrowRight size={14} className="text-gray-300 mx-1" />
                              <div className="text-left min-w-[60px]">
                                <p className="text-xs text-gray-400">Dest</p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5">{lead.dropCity}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">{lead.consignmentType}</p>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 font-medium">{lead.vehicleType}</span>
                                <span className="text-xs text-gray-500">{lead.consignmentGrossWeight}kg</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border
                              ${lead.leadStatus === 'GENERATED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                lead.leadStatus === 'BOOKED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  'bg-green-50 text-green-700 border-green-200'}`}>
                              {lead.leadStatus === 'BOOKED' ? 'PAYMENT DONE SUCCESSFULLY' : lead.leadStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleViewLeadDetails(lead)}
                              className="w-8 h-8 ml-auto bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'quotes' ? (
          <div className="space-y-6">
            <DashboardGrid>
              <StatCard title="Active Bids" value={allQuotes.length} icon={TrendingUp} trend={4} color="blue" />
              <StatCard title="Avg. Fare" value={`₹${allQuotes.length > 0 ? (allQuotes.reduce((acc, q) => acc + (q.costToClient || 0), 0) / allQuotes.length).toFixed(0) : 0}`} icon={CreditCard} trend={0} color="indigo" />
              <StatCard title="Top Vendor" value={allQuotes.length > 0 ? allQuotes[0].vendorResponseBy : '---'} icon={ShieldCheck} trend={0} color="green" />
              <StatCard title="Lead Coverage" value={`${leads.length > 0 ? (leads.filter(l => l.leadStatus === 'GENERATED').length) : 0} Enq`} icon={Package} trend={-2} color="orange" />
            </DashboardGrid>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Live Bidding Dashboard</h3>
                  <p className="text-sm text-gray-500 mt-1">Review vendor quotes and finalize bookings</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    placeholder="Filter by lead or vendor..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {isLoadingAllQuotes ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gray-500">Scanning platform for latest bids...</p>
                </div>
              ) : allQuotes.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <TrendingUp className="text-gray-300" size={32} />
                  </div>
                  <p className="text-base font-semibold text-gray-900">No active quotes yet</p>
                  <p className="text-sm text-gray-500 mt-1">Quotes will appear here as vendors bid on your requirements.</p>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allQuotes.map((quote) => (
                    <div key={quote.leadMatchId} className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Truck className="text-blue-600" size={24} />
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Lead ID</p>
                            <p className="text-sm font-bold text-gray-900 mt-1">#{quote.lead.leadId}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">{quote.vendorResponseBy}</p>
                            <ShieldCheck size={14} className="text-green-500" />
                          </div>
                          <p className="text-2xl font-black text-gray-900 flex items-baseline gap-1">
                            <span className="text-sm font-semibold">₹</span>
                            {quote.costToClient?.toLocaleString()}
                            <span className="text-[10px] font-medium text-gray-400 ml-1">Total Fare</span>
                          </p>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Route</p>
                                <p className="text-xs font-semibold text-gray-700 truncate">{quote.lead.pickupCity} → {quote.lead.dropCity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-gray-200 rounded-full"></div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vehicle</p>
                                <p className="text-xs font-semibold text-gray-700">{quote.lead.vehicleType}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewLeadDetails(quote.lead)}
                            className="flex-1 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors border border-gray-100"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => {
                                setSelectedLead(quote.lead);
                                if (quote.lead.leadStatus === 'LEADACCEPTED') {
                                    handleInitiatePayment(quote.lead.leadId);
                                } else {
                                    handleAcceptQuote(quote, quote.lead.leadId);
                                }
                            }}
                            className="flex-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
                          >
                            {quote.lead.leadStatus === 'LEADACCEPTED' ? <CreditCard size={14}/> : <Check size={14}/>}
                            {quote.lead.leadStatus === 'LEADACCEPTED' ? 'Pay Now' : 'Finalize'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-8">
              <form onSubmit={handleCreateLead} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
                {/* Section: Origin */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b flex-wrap pb-3">
                    <MapPin className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Pickup Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Pincode *</label>
                      <input required name="pickupFromPincode" value={formData.pickupFromPincode} onChange={handleInputChange} placeholder="400093" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" maxLength={6} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">City *</label>
                      <input required name="pickupCity" value={formData.pickupCity} onChange={handleInputChange} placeholder="Mumbai" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">State *</label>
                      <input required name="pickupState" value={formData.pickupState} onChange={handleInputChange} placeholder="Maharashtra" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Pickup Address *</label>
                      <input required name="pickupAddress" value={formData.pickupAddress} onChange={handleInputChange} placeholder="Plot 45, MIDC, Andheri East..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Timing Pref *</label>
                      <input required name="pickupPreferTiming" value={formData.pickupPreferTiming} onChange={handleInputChange} placeholder="Morning 8am-12pm" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex gap-2 items-center"><User size={14} className="text-gray-400" /> Point of Contact *</label>
                      <input required name="pickupContactPersonName" value={formData.pickupContactPersonName} onChange={handleInputChange} placeholder="Ramesh Sharma" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex gap-2 items-center"><Phone size={14} className="text-gray-400" /> Contact No *</label>
                      <input required name="pickupContactNo" value={formData.pickupContactNo} onChange={handleInputChange} placeholder="9876543210" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" maxLength={10} />
                    </div>
                  </div>
                </div>

                {/* Section: Destination */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b flex-wrap pb-3">
                    <MapPin className="text-gray-700" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Pincode *</label>
                      <input required name="dropToPincode" value={formData.dropToPincode} onChange={handleInputChange} placeholder="380001" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" maxLength={6} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">City *</label>
                      <input required name="dropCity" value={formData.dropCity} onChange={handleInputChange} placeholder="Ahmedabad" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">State *</label>
                      <input required name="dropState" value={formData.dropState} onChange={handleInputChange} placeholder="Gujarat" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Drop Address *</label>
                      <input required name="dropAddress" value={formData.dropAddress} onChange={handleInputChange} placeholder="Near Sardar Patel Bridge..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex gap-2 items-center"><User size={14} className="text-gray-400" /> Receiver Name *</label>
                      <input required name="dropContactPersonName" value={formData.dropContactPersonName} onChange={handleInputChange} placeholder="Suresh Patel" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex gap-2 items-center"><Phone size={14} className="text-gray-400" /> Receiver No *</label>
                      <input required name="dropContactNo" value={formData.dropContactNo} onChange={handleInputChange} placeholder="9123456780" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" maxLength={10} />
                    </div>
                  </div>
                </div>

                {/* Section: Cargo & Logistics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b flex-wrap pb-3">
                    <Package className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Cargo & Logistics</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Consignment Type *</label>
                        <input required name="consignmentType" value={formData.consignmentType} onChange={handleInputChange} placeholder="e.g., Industrial Goods, Pharma..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Gross Weight (kg) *</label>
                        <input required name="consignmentGrossWeight" value={formData.consignmentGrossWeight} onChange={handleInputChange} placeholder="12000" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-3">Select Logistics Partner Type</p>
                      <div className="space-y-3">
                        <select
                          required
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
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">Select Vehicle Type *</option>
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.vehicle} - {v.vehicleType} ({v.maxLoadCapacityKg}kg)</option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-600">{formData.truckType}</span>
                          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-600">{formData.truckBodyType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Dimensions */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <Package className="text-indigo-600" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">Package Dimensions</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{dimensions.length} Items Added</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Qty</label>
                        <input name="qty" type="number" value={dimForm.qty} onChange={handleDimChange} placeholder="20" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Length</label>
                        <input name="length" type="number" step="0.1" value={dimForm.length} onChange={handleDimChange} placeholder="2.5" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Breadth</label>
                        <input name="breadth" type="number" step="0.1" value={dimForm.breadth} onChange={handleDimChange} placeholder="1.5" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Height</label>
                        <input name="height" type="number" step="0.1" value={dimForm.height} onChange={handleDimChange} placeholder="1.8" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600">Unit</label>
                        <select name="sizeType" value={dimForm.sizeType} onChange={handleDimChange} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                          <option value="Feet">Feet</option>
                          <option value="Inches">Inches</option>
                          <option value="Cm">Cm</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addDimension}
                      className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-md font-medium text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 border border-indigo-200"
                    >
                      <Plus size={16} /> Add Consignment Unit
                    </button>

                    {dimensions.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {dimensions.map((dim) => (
                          <div key={dim.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-50 rounded-md flex items-center justify-center font-semibold text-indigo-700 text-xs border border-indigo-100 shrink-0">
                                {dim.qty}x
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-900">
                                  {dim.length}L × {dim.breadth}B × {dim.height}H
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{dim.sizeType}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDimension(dim.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isSubmitting ? 'GENERATING ENQUIRY...' : 'PUBLISH FREIGHT LEAD'}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-3">By publishing, you agree to our transit and insurance policies.</p>
                </div>
              </form>
            </div>

            {/* Side Assistance */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-xl p-6 text-white shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={20} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 font-semibold text-xs flex items-center justify-center shrink-0">1</span>
                    <p className="text-slate-300 text-sm">Ensure pincodes are accurate for precise automated route matching.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 font-semibold text-xs flex items-center justify-center shrink-0">2</span>
                    <p className="text-slate-300 text-sm">Descriptive pickup notes help vendors plan the loading sequence better.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <StickyNote className="text-blue-600" size={18} />
                  Operational Notes
                </h3>
                <textarea
                  name="pickupNote"
                  value={formData.pickupNote}
                  onChange={handleInputChange}
                  placeholder="Add any specific instructions for the transport team..."
                  className="w-full h-32 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Lead Details Modal */}
        {showLeadDetails && selectedLead && (() => {
          const currentLead = leads.find(l => l.leadId === selectedLead.leadId) || selectedLead;
          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Lead Details #{currentLead.leadId}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${currentLead.leadStatus === 'GENERATED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            currentLead.leadStatus === 'BOOKED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              'bg-green-50 text-green-700 border-green-200'
                          }`}>
                          {currentLead.leadStatus === 'BOOKED' ? 'PAYMENT DONE SUCCESSFULLY' : currentLead.leadStatus}
                        </span>
                        <p className="text-xs text-gray-500">{new Date(currentLead.requestedOn).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowLeadDetails(false)} className="p-2 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors border border-gray-200">
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side: Specs & Route */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-blue-600 flex items-center gap-2 border-b border-gray-100 pb-2">
                          <MapPin size={16} /> Route Specifications
                        </h4>
                        <div className="relative pl-6 space-y-6 border-l-2 border-dashed border-gray-200 ml-2">
                          <div className="relative">
                            <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-blue-600 box-content border-2 border-white ring-2 ring-blue-100"></div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-0.5">Pickup Information</p>
                              <p className="text-sm font-semibold text-gray-900">{currentLead.pickupCity}, {currentLead.pickupState}</p>
                              <p className="text-xs text-gray-600 mt-1">{currentLead.pickupAddress} — {currentLead.pickupFromPincode}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-gray-500 box-content border-2 border-white ring-2 ring-gray-100"></div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-0.5">Delivery Information</p>
                              <p className="text-sm font-semibold text-gray-900">{currentLead.dropCity}, {currentLead.dropState}</p>
                              <p className="text-xs text-gray-600 mt-1">{currentLead.dropAddress} — {currentLead.dropToPincode}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-2"><Clock size={14} /> Pickup Preference</p>
                          <p className="text-sm font-medium text-gray-900">{currentLead.pickupPreferTiming || 'Standard working hours'}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 border-b border-gray-100 pb-2">
                          <Package size={16} /> Package Measurements
                        </h4>

                        {isLoadingLeadDimensions ? (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-gray-500">Loading units...</span>
                          </div>
                        ) : leadDimensions.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {leadDimensions.map((dim, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center font-semibold text-blue-700 text-xs border border-blue-100">
                                    {dim.qty}x
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {dim.length}L × {dim.breadth}B × {dim.height}H
                                    </p>
                                    <p className="text-xs text-gray-500">{dim.sizeType}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">No detailed dimensions recorded</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Cargo & Quotes */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-blue-600 flex items-center gap-2 border-b border-gray-100 pb-2">
                          <Truck size={16} /> Cargo & Logistics
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 mb-1">Item Type</p>
                            <p className="text-sm font-semibold text-gray-900">{currentLead.consignmentType}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs font-medium text-gray-500 mb-1">Weight</p>
                            <p className="text-sm font-semibold text-gray-900">{currentLead.consignmentGrossWeight} <span className="text-xs font-normal text-gray-500">KG</span></p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 col-span-2 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-blue-600 mb-1">Requirement</p>
                              <p className="text-sm font-semibold text-blue-900">{currentLead.vehicle} <span className="text-blue-600 font-normal text-sm ml-1">({currentLead.vehicleType})</span></p>
                            </div>
                            <Truck className="text-blue-600" size={20} />
                          </div>
                        </div>

                        {/* Integrated Dimensions in Cargo Section */}
                        {leadDimensions.length > 0 && (
                          <div className="space-y-3 pt-2">
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Package Dimensions</p>
                             <div className="grid grid-cols-1 gap-2">
                               {leadDimensions.map((dim, idx) => (
                                 <div key={idx} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                   <div className="w-7 h-7 bg-indigo-50 rounded flex items-center justify-center font-bold text-indigo-700 text-[10px] border border-indigo-100">
                                     {dim.qty}x
                                   </div>
                                   <p className="text-xs font-semibold text-gray-700">
                                     {dim.length} × {dim.breadth} × {dim.height} ({dim.sizeType})
                                   </p>
                                 </div>
                               ))}
                             </div>
                          </div>
                        )}
                      </div>

                      {/* Quotes Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <h4 className="text-sm font-semibold text-indigo-600 flex items-center gap-2">
                            <TrendingUp size={16} /> Vendor Bids & Quotes
                          </h4>
                          {leadQuotes.length > 0 && (
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-200">
                              {leadQuotes.length} Offers Available
                            </span>
                          )}
                        </div>

                        {isLoadingQuotes ? (
                          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 gap-3">
                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-medium text-gray-500">Scanning Platform for Bids...</p>
                          </div>
                        ) : leadQuotes.length === 0 ? (
                          <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 text-center space-y-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto shadow-sm border border-gray-200">
                              <History className="text-gray-400" size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Awaiting Vendor responses</p>
                              <p className="text-xs text-gray-500 mt-1">Estimations will appear here once vendors bid</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {leadQuotes.map((quote) => (
                              <div key={quote.leadMatchId} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-md flex items-center justify-center font-semibold text-sm">
                                        ₹
                                      </div>
                                      <div>
                                        <p className="text-lg font-semibold text-gray-900">₹{quote.costToClient?.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">All inclusive transit fare</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-200">
                                        <ShieldCheck size={12} className="text-green-600" />
                                        <span className="text-xs font-medium text-gray-600">Verified Vendor</span>
                                      </div>
                                      <p className="text-sm font-medium text-indigo-600">{quote.vendorResponseBy}</p>
                                    </div>
                                  </div>

                                  {currentLead.leadStatus === 'BOOKED' ? (
                                    <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-semibold text-sm border border-emerald-200 shadow-sm">
                                      <CheckCircle2 size={16} />
                                      Payment done successfully
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (currentLead.leadStatus === 'LEADACCEPTED') {
                                          handleInitiatePayment(currentLead.leadId);
                                        } else {
                                          handleAcceptQuote(quote);
                                        }
                                      }}
                                      disabled={isAccepting}
                                      className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${currentLead.leadStatus === 'LEADACCEPTED'
                                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                                        }`}
                                    >
                                      {isAccepting ? (
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                          Processing...
                                        </div>
                                      ) : currentLead.leadStatus === 'BOOKED' ? (
                                        <div className="flex items-center gap-2">
                                          <CheckCircle2 size={16} />
                                          Payment done successfully
                                        </div>
                                      ) : currentLead.leadStatus === 'LEADACCEPTED' ? (
                                        <div className="flex items-center gap-2">
                                          <CreditCard size={16} />
                                          Proceed to Payment
                                        </div>
                                      ) : (
                                        'Finalize Bid'
                                      )}
                                    </button>
                                  )}
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
                <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
                  <button onClick={() => setShowLeadDetails(false)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors shadow-sm">
                    Close Manifest
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </DashboardLayout>
  );
};

export default LeadsManagement;
