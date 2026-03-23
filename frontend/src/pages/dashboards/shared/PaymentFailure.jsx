import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, PhoneCall, ArrowLeft, AlertTriangle } from 'lucide-react';

const PaymentFailure = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Failure Card */}
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-t-[10px] border-rose-600 animate-in fade-in zoom-in duration-500">
                    <div className="p-10 text-center">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-rose-50 rounded-full mb-8 shadow-inner">
                            <XCircle className="text-rose-600 w-12 h-12" />
                            <div className="absolute top-0 right-0 w-6 h-6 bg-rose-600 rounded-full border-4 border-white flex items-center justify-center">
                                <AlertTriangle className="text-white w-3 h-3" />
                            </div>
                        </div>
                        
                        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Oops!</h2>
                        <h3 className="text-xl font-bold text-slate-700 mb-4 opacity-80">Payment Unsuccessful</h3>
                        <p className="text-sm text-slate-500 font-medium mb-12 px-6">
                            We couldn't process your payment for booking <span className="text-slate-900 font-black">#{leadId || '---'}</span>.
                            No funds were deducted from your account.
                        </p>

                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate(-1)}
                                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-3xl font-black text-base hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                            >
                                <RefreshCw className="w-5 h-5" /> Retry Payment
                            </button>
                            
                            <Link 
                                to="/dashboard/client/leads" 
                                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white text-slate-700 border-2 border-slate-100 rounded-3xl font-bold text-base hover:border-slate-300 transition-all active:scale-95 translate-y-2 opacity-80 hover:opacity-100"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-400" /> Go Back to Leads
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-100 mt-6 flex justify-center gap-1.5 flex-wrap">
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                             Help Desk • 
                        </p>
                        <a href="tel:+91XXXXXXXXXX" className="text-sm text-rose-600 font-black hover:underline flex items-center gap-1.5 group transition-all">
                             <PhoneCall className="w-4 h-4 group-hover:animate-bounce" /> Call Support
                        </a>
                    </div>
                </div>

                {/* Common Reasons */}
                <div className="mt-12 space-y-4 px-4 opacity-0 animate-in fade-in slide-in-from-bottom-5 delay-500 fill-mode-forwards">
                    <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-6 text-center">Common Failure Reasons</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/50">
                            <p className="text-xs font-bold text-slate-700 mb-1 leading-tight">Server Timeout</p>
                            <p className="text-[10px] text-slate-400 font-medium">Bank server busy</p>
                        </div>
                        <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/50">
                            <p className="text-xs font-bold text-slate-700 mb-1 leading-tight">Session Expired</p>
                            <p className="text-[10px] text-slate-400 font-medium">Please refresh</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
