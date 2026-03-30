import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, PhoneCall, ArrowLeft, AlertTriangle } from 'lucide-react';

const PaymentFailure = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                
                {/* Main Failure Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 text-center">
                        
                        {/* Header Section */}
                        <XCircle className="text-red-600 w-16 h-16 mx-auto mb-6" strokeWidth={1.5} />
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment Failed</h1>
                        <p className="text-gray-500 mb-8">
                            We couldn't process your payment for booking <span className="font-medium text-gray-900">#{leadId || '---'}</span>. No funds were deducted from your account.
                        </p>

                        {/* Informational Box */}
                        <div className="bg-gray-50 rounded-lg p-5 mb-8 text-left border border-gray-100">
                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-gray-400" />
                                Common reasons for failure:
                            </h4>
                            <ul className="text-sm text-gray-500 list-disc list-inside space-y-1.5 ml-1">
                                <li>Bank server timeout or high traffic</li>
                                <li>Session expired or interrupted</li>
                                <li>Incorrect authentication details</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button 
                                onClick={() => navigate(-1)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" /> Retry Payment
                            </button>
                            
                            <Link 
                                to="/dashboard/client/leads" 
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Return to Leads
                            </Link>
                        </div>
                    </div>

                    {/* Footer Support Section */}
                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Need assistance?{' '}
                            <a 
                                href="tel:+91XXXXXXXXXX" 
                                className="text-gray-900 font-medium hover:underline inline-flex items-center gap-1.5 ml-1"
                            >
                                <PhoneCall className="w-3.5 h-3.5" /> Call Support
                            </a>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentFailure;