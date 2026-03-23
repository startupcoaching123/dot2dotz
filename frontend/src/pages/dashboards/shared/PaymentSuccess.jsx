import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, Calendar, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import fetchWithAuth from '../../../FetchWithAuth';
import { API_BASE_URL } from '../../../api/endpoints';

const PaymentSuccess = () => {
    const { leadId } = useParams();
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const res = await fetchWithAuth(`${API_BASE_URL}/api/bookings/${leadId}`);
                if (res.ok) {
                    const data = await res.json();
                    setBooking(data.data || data);
                }
            } catch (err) {
                console.error("Error fetching booking details:", err);
            } finally {
                setIsLoading(true);
                // Artificial delay for premium feel
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        if (leadId) fetchBookingDetails();
    }, [leadId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium animate-pulse">Finalizing your booking...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
                    <div className="bg-emerald-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500 rounded-full opacity-20"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-700 rounded-full opacity-20"></div>
                        
                        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg animate-bounce">
                            <CheckCircle className="text-emerald-600 w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
                        <p className="text-emerald-50 text-lg opacity-90">Your shipment is now confirmed and scheduled.</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Transaction ID */}
                        <div className="flex justify-between items-center py-4 border-b border-slate-100">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Booking Reference</p>
                                <p className="text-lg font-bold text-slate-900">#{leadId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Status</p>
                                <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold ring-1 ring-inset ring-emerald-600/20">
                                    <ShieldCheck className="w-3 h-3 mr-1" /> Confirmed
                                </span>
                            </div>
                        </div>

                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-emerald-600" /> Logistics Details
                                </h3>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 font-medium">Vehicle Type</span>
                                        <span className="text-sm font-bold text-slate-900">{booking?.vehicle || 'Full Truck Load'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 font-medium">Load Capacity</span>
                                        <span className="text-sm font-bold text-slate-900">{booking?.maxLoadCapacityKg || '--'} KG</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 font-medium">Booking Date</span>
                                        <span className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-600" /> Route Info
                                </h3>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-bold mb-1">Origin</span>
                                        <span className="text-sm font-bold text-slate-900 truncate">{booking?.pickupCity || 'Calculating...'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-bold mb-1">Destination</span>
                                        <span className="text-sm font-bold text-slate-900 truncate">{booking?.dropCity || 'Calculating...'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-slate-600">Initial Quote Amount</p>
                                    <p className="text-xs text-slate-400 mt-1">Total agreed cost for this shipment</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-slate-900">₹{(booking?.totalAdvanceAmount + (booking?.finalPaymentAmount || 0)).toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="h-px bg-emerald-100 w-full" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-emerald-700">Advance Paid Now</p>
                                    <p className="text-xs text-emerald-600/60 mt-1 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Securely processed via Razorpay
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-emerald-700">₹{booking?.totalAdvanceAmount?.toLocaleString() || '---'}</p>
                                </div>
                            </div>

                            <div className="h-px bg-emerald-100 w-full" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">Remaining Balance</p>
                                    <p className="text-xs text-slate-400 mt-1">Payable after delivery completion</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-slate-600">₹{booking?.finalPaymentAmount?.toLocaleString() || '0'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                            <Link 
                                to="/dashboard/client/leads" 
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                            >
                                <ArrowLeft className="w-4 h-4" /> Go to Dashboard
                            </Link>
                            <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-sm hover:border-emerald-600 hover:text-emerald-600 transition-all active:scale-95">
                                <Download className="w-4 h-4" /> Download Receipt
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8">
                    An email confirmation has been sent to your registered address. <br/>
                    Need help? Contact support at <span className="text-emerald-600 font-bold">support@dot2dotz.com</span>
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
