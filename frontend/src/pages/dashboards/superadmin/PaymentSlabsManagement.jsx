import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
    Activity, Users, Truck, ShieldCheck, Globe, CreditCard,
    Database, Settings, Plus, X, Search, Filter,
    RefreshCw, Layers, IndianRupee, Percent, TrendingUp,
    Check, AlertCircle, Edit2
} from 'lucide-react';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../api/endpoints';
import fetchWithAuth from '../../../FetchWithAuth';
import Swal from 'sweetalert2';

const PaymentSlabsManagement = () => {
    const [slabs, setSlabs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        minAmount: "",
        maxAmount: "",
        advancePercentage: "",
        marginPercentage: "",
        minAmountToBeCharged: ""
    });

    const resetForm = () => {
        setFormData({
            minAmount: "",
            maxAmount: "",
            advancePercentage: "",
            marginPercentage: "",
            minAmountToBeCharged: ""
        });
        setEditId(null);
    };

    const fetchSlabs = async () => {
        setIsLoading(true);
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}${AUTH_ENDPOINTS.PAYMENT_SLABS}`, { method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch slabs');
            const data = await res.json();
            const list = data.data || data;
            setSlabs(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Error fetching slabs:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSlabs();
    }, [refreshTrigger]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openEditModal = (slab) => {
        const id = slab.paymentSlabId || slab._id || slab.id;
        setEditId(id);
        setFormData({
            minAmount: slab.minAmount || "",
            maxAmount: slab.maxAmount || "",
            advancePercentage: slab.advancePercentage || "",
            marginPercentage: slab.marginPercentage || "",
            minAmountToBeCharged: slab.minAmountToBeCharged || ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (Number(formData.minAmount) < 0 || Number(formData.maxAmount) < 0) {
            Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Amounts cannot be negative' });
            return;
        }

        if (Number(formData.maxAmount) <= Number(formData.minAmount)) {
            Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Max Amount must be greater than Min Amount' });
            return;
        }

        if (Number(formData.advancePercentage) < 0 || Number(formData.advancePercentage) > 100) {
            Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Advance percentage must be between 0 and 100' });
            return;
        }

        if (Number(formData.marginPercentage) < 0 || Number(formData.marginPercentage) > 100) {
            Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Margin percentage must be between 0 and 100' });
            return;
        }

        setIsProcessing(true);

        try {
            const payload = {
                paymentSlabId: editId,
                minAmount: Number(formData.minAmount),
                maxAmount: Number(formData.maxAmount),
                advancePercentage: Number(formData.advancePercentage),
                marginPercentage: Number(formData.marginPercentage),
                minAmountToBeCharged: Number(formData.minAmountToBeCharged)
            };
            console.log(payload);
            const url = editId
                ? `${API_BASE_URL}${AUTH_ENDPOINTS.PAYMENT_SLABS}`
                : `${API_BASE_URL}${AUTH_ENDPOINTS.PAYMENT_SLABS}`;
            const method = 'POST';

            const res = await fetchWithAuth(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                let errorMsg = `Failed to ${editId ? 'update' : 'create'} slab`;
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorMsg;
                } catch { }
                throw new Error(errorMsg);
            }

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Payment slab ${editId ? 'updated' : 'created'} successfully`,
                showConfirmButton: false,
                timer: 3000
            });

            setShowModal(false);
            resetForm();
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Action Failed', text: err.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const sidebarItems = [
        { icon: Activity, label: 'Overview', path: '/dashboard/super-admin' },
        { icon: Users, label: 'Clients', path: '/dashboard/super-admin/users' },
        { icon: Truck, label: 'Vendors', path: '/dashboard/super-admin/vendors' },
        { icon: Truck, label: 'Vehicles', path: '/dashboard/super-admin/vehicles' },
        { icon: Layers, label: 'Payment Slabs', path: '/dashboard/super-admin/payment-slabs' },
        { icon: ShieldCheck, label: 'Admin Roles', path: '/dashboard/super-admin/roles' },
        { icon: Globe, label: 'Leads', path: '/dashboard/super-admin/leads' },
        { icon: CreditCard, label: 'Transactions', path: '/dashboard/super-admin/finance' },
        { icon: Database, label: 'Payments Logs', path: '/dashboard/super-admin/logs' },
        { icon: Settings, label: 'System Settings', path: '/dashboard/super-admin/settings' },
    ];

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Super Admin">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tight">Payment Slabs</h1>
                        <p className="text-slate-500 text-sm mt-1 ml-4 italic font-medium">Manage pricing structures with advance and margin percentages</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                        >
                            <Plus size={14} />
                            Add Slab
                        </button>
                        <button
                            onClick={() => setRefreshTrigger(prev => prev + 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-6">
                                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] animate-pulse">Synchronizing Data...</p>
                            </div>
                        ) : slabs.length === 0 ? (
                            <div className="py-24 text-center">
                                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Layers size={40} />
                                </div>
                                <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">No payment slabs defined</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Slab Range</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Percentages</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Min Charge</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {slabs.map((slab, idx) => (
                                        <tr key={slab.paymentSlabId || slab._id || slab.id || idx} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                                                        <IndianRupee size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                            ₹{slab.minAmount.toLocaleString()} - ₹{slab.maxAmount.toLocaleString()}
                                                        </p>
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Slab ID: {(slab.paymentSlabId || slab._id || slab.id || '').toString().substring(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Percent size={12} className="text-teal-500" />
                                                        <p className="text-xs font-black text-slate-600 uppercase tracking-tight">Advance: <span className="text-teal-600 font-black">{slab.advancePercentage}%</span></p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp size={12} className="text-orange-500" />
                                                        <p className="text-xs font-black text-slate-600 uppercase tracking-tight">Margin: <span className="text-orange-600 font-black">{slab.marginPercentage}%</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-indigo-900 tracking-tight">₹{slab.minAmountToBeCharged.toLocaleString()}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => openEditModal(slab)}
                                                    className="p-3 bg-white text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100 shadow-sm active:scale-90"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Slab Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                            <div className="p-10 border-b border-slate-50 bg-gradient-to-br from-indigo-50/50 to-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{editId ? 'Modify' : 'Initialize'} Slab</h2>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic">Defining pricing logic parameters</p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-4 bg-white text-slate-400 rounded-3xl hover:text-red-500 transition-all shadow-sm active:rotate-90"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">Min Amount (₹)</label>
                                        <input
                                            type="number"
                                            name="minAmount"
                                            value={formData.minAmount}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                                            placeholder="10000"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">Max Amount (₹)</label>
                                        <input
                                            type="number"
                                            name="maxAmount"
                                            value={formData.maxAmount}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                                            placeholder="50000"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">Advance (%)</label>
                                        <input
                                            type="number"
                                            name="advancePercentage"
                                            value={formData.advancePercentage}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-inner"
                                            placeholder="30"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">Margin (%)</label>
                                        <input
                                            type="number"
                                            name="marginPercentage"
                                            value={formData.marginPercentage}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner"
                                            placeholder="10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">Min Amount To Be Charged (₹)</label>
                                    <input
                                        type="number"
                                        name="minAmountToBeCharged"
                                        value={formData.minAmountToBeCharged}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                                        placeholder="1500"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-5 pt-8">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-10 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                        disabled={isProcessing}
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center gap-3 active:scale-95"
                                    >
                                        {isProcessing ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Check size={14} />
                                        )}
                                        <span>{editId ? 'Finalize Changes' : 'Confirm Protocol'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PaymentSlabsManagement;
