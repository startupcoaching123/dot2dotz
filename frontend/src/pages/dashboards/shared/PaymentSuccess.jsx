import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, MapPin, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import fetchWithAuth from '../../../FetchWithAuth';
import { API_BASE_URL } from '../../../api/endpoints';

const PaymentSuccess = () => {
    const { leadId } = useParams();
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const res = await fetchWithAuth(`/api/bookings/by-lead/${leadId}`);
                if (res.ok) {
                    const data = await res.json();
                    setBooking(data.data || data);
                }
            } catch (err) {
                console.error("Error fetching booking details:", err);
            } finally {
                // Removed the artificial delay for a snappier, more professional UX
                setIsLoading(false);
            }
        };

        if (leadId) fetchBookingDetails();
    }, [leadId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <p className="text-gray-500 font-medium">Retrieving booking details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                
                {/* Main Success Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* Header Section */}
                    <div className="px-8 pt-12 pb-8 text-center">
                        <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-6" strokeWidth={1.5} />
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful</h1>
                        <p className="text-gray-500">Your shipment has been confirmed and successfully scheduled.</p>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Reference & Status */}
                        <div className="flex justify-between items-center py-5 border-y border-gray-100 mb-8">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
                                <p className="text-base font-medium text-gray-900">#{leadId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                <span className="inline-flex items-center text-sm font-medium text-green-700">
                                    <ShieldCheck className="w-4 h-4 mr-1.5" /> Confirmed
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Logistics Details */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                    <Truck className="w-4 h-4 text-gray-400" /> Logistics Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Booking ID</span>
                                        <span className="text-sm font-medium text-gray-900">#{booking?.bookingId || '--'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Lead ID</span>
                                        <span className="text-sm font-medium text-gray-900">#{booking?.leadId || '--'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className="text-sm font-medium text-gray-900">{booking?.bookingStatus || 'PENDING'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Last Update</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {booking?.lastUpdateOn ? new Date(booking.lastUpdateOn).toLocaleDateString() : '--'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Lifecycle */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-gray-400" /> Payment Lifecycle
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Advance Paid</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {booking?.advancePaid ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Paid On</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {booking?.advancePaidOn ? new Date(booking.advancePaidOn).toLocaleDateString() : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Final Payment</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {booking?.finalPaymentPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Advance Amount Paid</p>
                                    <p className="text-xs text-gray-500">Initial commitment</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    ₹{booking?.totalAdvanceAmount?.toLocaleString() || '0'}
                                </p>
                            </div>
                            
                            <div className="h-px bg-gray-200 w-full mb-4" />
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Final Balance Amount</p>
                                    <p className="text-xs text-gray-500">Payable upon delivery</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    ₹{booking?.finalPaymentAmount?.toLocaleString() || '0'}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/dashboard/client/leads"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Go to Dashboard
                            </Link>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                <Download className="w-4 h-4" /> Download Receipt
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    A confirmation receipt has been sent to your registered email address.<br />
                    Need assistance? Contact us at <a href="mailto:support@dot2dotz.com" className="text-gray-900 font-medium hover:underline">support@dot2dotz.com</a>
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;