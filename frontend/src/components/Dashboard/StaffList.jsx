import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, User, Plus, X, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const StaffList = ({ ownerId, ownerType, title = "Staff Management", refreshTrigger = 0, onUpdate }) => {
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Add Staff Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [addFormData, setAddFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        role: ownerType === 'client' ? 'CLIENT_STAFF' : 'VENDOR_STAFF'
    });

    const fetchStaff = async () => {
        if (!ownerId) return;
        setIsLoading(true);
        setError('');
        try {
            // Endpoints: /api/clients/{id}/users or /api/vendors/{id}/users
            const base = ownerType === 'client' ? '/api/clients' : '/api/vendors';
            const url = `${base}/${ownerId}/users`;
            
            const res = await fetchWithAuth(url, { method: 'GET' });
            if (!res.ok) {
                if (res.status === 404) {
                    setStaff([]);
                    return;
                }
                throw new Error('Failed to fetch staff');
            }
            const data = await res.json();
            const list = data.data || data.users || data;
            setStaff(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Fetch staff error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [ownerId, refreshTrigger]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        if (!addFormData.name.trim()) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Name is required', showConfirmButton: false, timer: 3000 });
            return;
        }
        if (!addFormData.mobile.trim() || addFormData.mobile.length !== 10) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Valid 10-digit mobile is required', showConfirmButton: false, timer: 3000 });
            return;
        }
        if (addFormData.password.length < 6) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Password must be at least 6 characters', showConfirmButton: false, timer: 3000 });
            return;
        }

        setIsAdding(true);
        try {
            const base = ownerType === 'client' ? '/api/clients' : '/api/vendors';
            const url = `${base}/${ownerId}/users`;

            const res = await fetchWithAuth(url, {
                method: 'POST',
                body: JSON.stringify(addFormData)
            });

            if (res.ok) {
                Swal.fire({ 
                    icon: 'success', 
                    title: 'Success!', 
                    text: 'Staff member added successfully. They can now log in with their credentials.',
                    confirmButtonColor: '#2563eb'
                });
                setShowAddModal(false);
                setAddFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    password: '',
                    role: ownerType === 'client' ? 'CLIENT_STAFF' : 'VENDOR_STAFF'
                });
                fetchStaff();
                if (onUpdate) onUpdate();
            } else {
                let msg = 'Failed to add staff';
                try {
                    const d = await res.json();
                    msg = d.message || d.error || msg;
                } catch(e) {}
                throw new Error(msg);
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message });
        } finally {
            setIsAdding(false);
        }
    };

    const filteredStaff = staff.filter(s =>
        (s.name?.toLowerCase() || s.vendorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.mobile?.toLowerCase() || s.mobile1?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            {title}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mt-1">
                            {isLoading ? 'Fetching records...' : `Total ${staff.length} Members`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-grow min-w-[200px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-600 transition-all font-sans"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-blue-700 transition-all shadow-sm flex-shrink-0"
                        >
                            <Plus size={14} /> Add Staff
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Loading Staff...</p>
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                                <Users size={32} />
                            </div>
                            <h4 className="text-slate-900 font-bold">No Staff Found</h4>
                            <p className="text-slate-400 text-xs mt-1 max-w-[250px]">
                                {searchTerm ? "No matches for your search." : "Start by adding your first staff member to help manage your business."}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Member</th>
                                    <th className="px-8 py-4 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Contact</th>
                                    <th className="px-8 py-4 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Role</th>
                                    <th className="px-8 py-4 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredStaff.map((member, idx) => (
                                    <tr key={member.id || idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-110 transition-transform">
                                                    {(member.name || member.vendorName || member.email || 'S').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{member.name || member.vendorName || 'N/A'}</p>
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={12} className="text-slate-300" />
                                                    <p className="text-xs font-bold text-slate-600">{member.mobile || member.mobile1 || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={12} className="text-slate-300" />
                                                    <p className="text-[10px] font-medium text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className="text-blue-500" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                                                    {member.role?.replace('_', ' ') || 'STAFF'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${member.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {member.active !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl scale-in-center">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Add New Staff</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Create credentials for your team</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2.5 bg-white text-slate-400 rounded-xl hover:text-red-500 hover:shadow-md transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddSubmit} className="p-8 space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            required 
                                            placeholder="Enter staff name"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                                            value={addFormData.name} 
                                            onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <input
                                                type="email"
                                                required 
                                                placeholder="email@example.com"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                                                value={addFormData.email} 
                                                onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Mobile No</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <input
                                                required 
                                                placeholder="10-digit number"
                                                maxLength={10}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                                                value={addFormData.mobile} 
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 10) setAddFormData({ ...addFormData, mobile: val });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Login Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required 
                                            placeholder="Min 6 characters"
                                            className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                                            value={addFormData.password} 
                                            onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Assigned Role</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            disabled
                                            className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-xs text-slate-500 outline-none"
                                            value={addFormData.role.replace('_', ' ')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isAdding} 
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-extrabold uppercase text-[11px] tracking-widest shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all disabled:opacity-50 mt-4 h-14 flex items-center justify-center gap-3"
                            >
                                {isAdding ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Plus size={18} /> Add Staff Member
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffList;
