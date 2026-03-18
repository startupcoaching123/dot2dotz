import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
    Truck, Search, Filter, Plus, X, RefreshCw,
    Settings, Activity, Users, ShieldCheck, Globe, CreditCard, Database,
    Weight, Ruler, Disc, Briefcase, Type, Maximize, Check, AlertCircle, Layers
} from 'lucide-react';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../api/endpoints';
import fetchWithAuth from '../../../FetchWithAuth';
import Swal from 'sweetalert2';

const VehicleManagementPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        vehicleType: 'LCV',
        vehicle: '',
        vehicleBodyType: 'Closed Body',
        length: '',
        width: '',
        height: '',
        noOfWheels: '',
        maxLoadCapacityKg: '',
        useType: 'GOODS'
    });

    const resetForm = () => {
        setFormData({
            vehicleType: 'LCV',
            vehicle: '',
            vehicleBodyType: 'Closed Body',
            length: '',
            width: '',
            height: '',
            noOfWheels: '',
            maxLoadCapacityKg: '',
            useType: 'GOODS'
        });
        setEditId(null);
    };

    const fetchVehicles = async () => {
        setIsLoading(true);
        try {
            const res = await fetchWithAuth(AUTH_ENDPOINTS.VEHICLES, { method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch vehicles');
            const data = await res.json();
            const list = data.data || data.vehicles || data;
            setVehicles(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [refreshTrigger]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Restriction for numeric fields
        if (['length', 'width', 'height', 'noOfWheels', 'maxLoadCapacityKg'].includes(name)) {
            const val = value.replace(/\D/g, ''); // Remove non-digits
            setFormData(prev => ({ ...prev, [name]: val }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openEditModal = (v) => {
        setEditId(v._id || v.id);
        setFormData({
            vehicleType: v.vehicleType || '',
            vehicle: v.vehicle || '',
            vehicleBodyType: v.vehicleBodyType || v.vehicle_body_type || 'Closed Body',
            length: v.length || '',
            width: v.width || '',
            height: v.height || '',
            noOfWheels: v.noOfWheels || '',
            maxLoadCapacityKg: v.maxLoadCapacityKg || '',
            useType: v.useType || 'GOODS'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.vehicle.trim()) {
            Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Vehicle Name is required' });
            return;
        }

        if (!formData.noOfWheels || parseInt(formData.noOfWheels) <= 0) {
            Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Number of wheels must be greater than 0' });
            return;
        }

        if (!formData.maxLoadCapacityKg || parseInt(formData.maxLoadCapacityKg) <= 0) {
            Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Max load capacity must be greater than 0' });
            return;
        }

        setIsProcessing(true);

        try {
            const payload = {
                ...formData,
                noOfWheels: parseInt(formData.noOfWheels) || 0,
                maxLoadCapacityKg: parseInt(formData.maxLoadCapacityKg) || 0
            };

            const url = editId ? `${AUTH_ENDPOINTS.VEHICLES}/${editId}` : AUTH_ENDPOINTS.VEHICLES;
            const method = editId ? 'PATCH' : 'POST';

            const res = await fetchWithAuth(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                let errorMsg = `Failed to ${editId ? 'update' : 'create'} vehicle`;
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
                title: `Vehicle ${editId ? 'updated' : 'created'} successfully`,
                showConfirmButton: false,
                timer: 3000
            });

            setShowModal(false);
            resetForm();
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            Swal.fire({ icon: 'error', title: `${editId ? 'Update' : 'Creation'} Failed`, text: err.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleVehicleStatus = async (vId, currentStatus) => {
        try {
            const response = await fetchWithAuth(`${AUTH_ENDPOINTS.VEHICLES}/${vId}/status?active=${!currentStatus}`, {
                method: 'PATCH',
            });

            if (response.ok) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `Vehicle ${!currentStatus ? 'activated' : 'deactivated'}`,
                    showConfirmButton: false,
                    timer: 2000
                });
                setRefreshTrigger(prev => prev + 1);
            } else {
                throw new Error('Failed to toggle status');
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Action Failed', text: err.message });
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

    const filteredVehicles = vehicles.filter(v =>
        (v.vehicle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (v.vehicleType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Super Admin">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-red-600 pl-4">Vehicle Catalog</h1>
                        <p className="text-slate-500 text-sm mt-1 ml-4">Manage master vehicle types and specifications</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-red-600 transition-all shadow-sm w-full md:w-64"
                            />
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold text-xs hover:bg-red-700 transition-all shadow-sm"
                        >
                            <Plus size={14} />
                            Add Vehicle
                        </button>
                        <button
                            onClick={() => setRefreshTrigger(prev => prev + 1)}
                            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 transition-all shadow-sm"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4">
                                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-400 font-semibold text-xs">Loading vehicles...</p>
                            </div>
                        ) : filteredVehicles.length === 0 ? (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Truck size={32} />
                                </div>
                                <p className="text-slate-400 font-bold uppercase text-xs italic">No vehicles found</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle Name</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Dimensions</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Capacity</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Wheels</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredVehicles.map((v, idx) => (
                                        <tr key={v._id || idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
                                                        <Truck size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">{v.vehicle || 'N/A'}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">{v.vehicleBodyType || '---'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider rounded-full">{v.vehicleType}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Ruler size={14} className="text-slate-300" />
                                                    <p className="text-xs font-bold text-slate-600">{v.length}x{v.width}x{v.height} ft</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Weight size={14} className="text-slate-300" />
                                                    <p className="text-xs font-bold text-slate-600">{v.maxLoadCapacityKg} KG</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Disc size={14} className="text-slate-300" />
                                                    <p className="text-xs font-bold text-slate-600">{v.noOfWheels}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${v.active === false ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                        {v.active === false ? 'Inactive' : 'Active'}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleVehicleStatus(v._id || v.id, v.active !== false)}
                                                        className={`p-2 rounded-xl border transition-all ${v.active === false ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}
                                                        title={v.active === false ? 'Activate' : 'Deactivate'}
                                                    >
                                                        {v.active === false ? <Check size={18} /> : <X size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(v)}
                                                        className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-red-600 transition-colors border border-slate-100"
                                                    >
                                                        <Settings size={18} />
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

                {/* Vehicle Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
                            <div className="p-8 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{editId ? 'Update' : 'Add New'} Vehicle</h2>
                                        <p className="text-slate-400 text-xs mt-1">{editId ? 'Modify vehicle specifications' : 'Define specs for a new vehicle type'}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:text-red-600 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Specs */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <Type size={16} /> Basic Specifications
                                        </h3>

                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Vehicle Name *</label>
                                            <input
                                                type="text"
                                                name="vehicle"
                                                value={formData.vehicle}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all"
                                                placeholder="e.g. Tata Ace"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Vehicle Type</label>
                                                <select
                                                    name="vehicleType"
                                                    value={formData.vehicleType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all"
                                                >
                                                    <option value="LCV">LCV</option>
                                                    <option value="HCV">HCV</option>
                                                    <option value="TRAILER">TRAILER</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Body Type</label>
                                                <select
                                                    name="vehicleBodyType"
                                                    value={formData.vehicleBodyType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all"
                                                >
                                                    <option value="Closed Body">Closed Body</option>
                                                    <option value="Open Body">Open Body</option>
                                                    <option value="Container">Container</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2">Usage Type</label>
                                            <select
                                                name="useType"
                                                value={formData.useType}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-red-600 transition-all"
                                            >
                                                <option value="GOODS">GOODS</option>
                                                <option value="PASSENGER">PASSENGER</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Physical Specs */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <Maximize size={16} /> Dimensions & Capacity
                                        </h3>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Length (ft)</label>
                                                <input
                                                    type="text"
                                                    name="length"
                                                    value={formData.length}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Width (ft)</label>
                                                <input
                                                    type="text"
                                                    name="width"
                                                    value={formData.width}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Height (ft)</label>
                                                <input
                                                    type="text"
                                                    name="height"
                                                    value={formData.height}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">No. of Wheels</label>
                                                <input
                                                    type="number"
                                                    name="noOfWheels"
                                                    value={formData.noOfWheels}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all"
                                                    placeholder="4"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Max Load (KG)</label>
                                                <input
                                                    type="number"
                                                    name="maxLoadCapacityKg"
                                                    value={formData.maxLoadCapacityKg}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-600 transition-all"
                                                    placeholder="750"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-xs tracking-wide hover:bg-slate-200 transition-all"
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold text-xs tracking-wide hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isProcessing ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Vehicle' : 'Create Vehicle')}
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

export default VehicleManagementPage;
