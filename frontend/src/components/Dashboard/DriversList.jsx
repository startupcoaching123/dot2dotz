import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, MapPin, Check, X, AlertCircle, MoreVertical, User, Plus, Camera, CreditCard, FileText, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const DriversList = ({ vendorId, title = "Driver Management", refreshTrigger = 0, onUpdate }) => {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Detailed Driver Modal State
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showDriverDetails, setShowDriverDetails] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editConfig, setEditConfig] = useState({});
    const [updateSpinner, setUpdateSpinner] = useState(false);

    // Add Driver Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [addFormData, setAddFormData] = useState({
        driverName: '',
        mobileNo: '',
        address: '',
        licence: '',
        proofType: 'LICENCE',
        image: '',
        proofImage: '' // Changed from 'proof' to 'proofImage'
    });

    const getDriverId = (d) => {
        if (!d) return null;
        const possibleIds = ['driverId', 'driver_id', '_id', 'id'];
        for (const key of possibleIds) {
            if (d[key] && !String(d[key]).includes('vendor')) return d[key];
        }
        return d.driverId || d.vender_id || d.vendor_id;
    };

    const fetchDrivers = async () => {
        if (!vendorId) return;
        setIsLoading(true);
        setError('');
        try {
            const url = `${AUTH_ENDPOINTS.VENDOR_DRIVERS(vendorId)}?active=true`;
            const res = await fetchWithAuth(url, { method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch drivers');
            const data = await res.json();

            const driverList = data.data || data.drivers || data;
            setDrivers(Array.isArray(driverList) ? driverList : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, [vendorId, refreshTrigger]);

    const handleDriverClick = (driver) => {
        setSelectedDriver({ ...driver });
        setEditConfig({ ...driver });
        setShowDriverDetails(true);
        setIsEditing(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        if (name === 'mobileNo') {
            const val = value.replace(/\D/g, ''); 
            if (val.length <= 10) {
                setEditConfig(prev => ({ ...prev, [name]: val }));
            }
            return;
        }

        setEditConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, isEdit = false) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            if (isEdit) {
                setEditConfig(prev => ({ ...prev, [name]: files[0] }));
            } else {
                setAddFormData(prev => ({ ...prev, [name]: files[0] }));
            }
        }
    };

    const submitDriverUpdate = async () => {
        setUpdateSpinner(true);
        try {
            const driverId = getDriverId(selectedDriver);
            if (!driverId) throw new Error('Could not identify unique Driver ID for update');

            if (!editConfig.driverName?.trim()) throw new Error('Driver Name is required');
            if (!/^[6-9]\d{9}$/.test(editConfig.mobileNo)) throw new Error('Mobile Number must be 10 digits starting with 6-9');

            const url = `${AUTH_ENDPOINTS.VENDOR_DRIVERS(vendorId)}/${driverId}`;

            const formData = new FormData();
            formData.append('driverName', editConfig.driverName || '');
            formData.append('mobileNo', editConfig.mobileNo || '');
            formData.append('address', editConfig.address || '');
            formData.append('licence', editConfig.licence || '');
            formData.append('proofType', editConfig.proofType || 'LICENCE');

            if (editConfig.image instanceof File) formData.append('image', editConfig.image);
            // Append as proofImage
            if (editConfig.proofImage instanceof File) formData.append('proofImage', editConfig.proofImage);

            const res = await fetchWithAuth(url, { method: 'PUT', body: formData });

            if (res.ok) {
                const data = await res.json();
                const updated = data.data || data.driver || editConfig;
                const merged = { ...selectedDriver, ...(typeof updated === 'object' ? updated : editConfig) };

                setDrivers(prev => prev.map(d => getDriverId(d) === driverId ? merged : d));
                setSelectedDriver(merged);
                setIsEditing(false);
                if (onUpdate) onUpdate();
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Driver updated successfully', showConfirmButton: false, timer: 3000 });
            } else {
                let errorMsg = 'Server Update Error';
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorData.error || `Error ${res.status}`;
                } catch (e) {
                    errorMsg = `Server responded with status ${res.status}`;
                }
                throw new Error(errorMsg);
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Operation Failed', text: err.message });
        } finally {
            setUpdateSpinner(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        if (!addFormData.driverName?.trim()) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Driver Name is required', showConfirmButton: false, timer: 3000 });
            return;
        }

        if (!/^[6-9]\d{9}$/.test(addFormData.mobileNo)) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Mobile must be 10 digits starting with 6-9', showConfirmButton: false, timer: 3000 });
            return;
        }

        setIsAdding(true);
        try {
            const url = `${AUTH_ENDPOINTS.VENDOR_DRIVERS(vendorId)}`;

            const formData = new FormData();
            formData.append('driverName', addFormData.driverName);
            formData.append('mobileNo', addFormData.mobileNo);
            formData.append('address', addFormData.address);
            formData.append('licence', addFormData.licence);
            formData.append('proofType', addFormData.proofType); 
            
            if (addFormData.image) formData.append('image', addFormData.image);
            // Append as proofImage
            if (addFormData.proofImage) formData.append('proofImage', addFormData.proofImage);

            const res = await fetchWithAuth(url, { method: 'POST', body: formData });

            if (res.ok) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Driver added successfully', showConfirmButton: false, timer: 3000 });
                setShowAddModal(false);
                // Reset state with proofImage
                setAddFormData({ driverName: '', mobileNo: '', address: '', licence: '', proofType: 'LICENCE', image: '', proofImage: '' });
                fetchDrivers();
                if (onUpdate) onUpdate();
            } else {
                let errorTitle = 'Failed to add driver';
                try {
                    const data = await res.json();
                    errorTitle = data.message || data.error || `Server responded with ${res.status}`;
                } catch {
                    errorTitle = `Server error ${res.status}`;
                }
                throw new Error(errorTitle);
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: err.message });
        } finally {
            setIsAdding(false);
        }
    };

    const filteredDrivers = drivers.filter(d =>
        (d.driverName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (d.mobileNo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const formatProofType = (type) => {
        if (!type) return 'Document';
        if (type === 'PAN_CARD') return 'PAN Card';
        if (type === 'AADHAAR') return 'Aadhar Card';
        if (type === 'LICENCE') return 'Driving Licence';
        return type;
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            {title}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mt-1">Total {drivers.length} Drivers</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search drivers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-600 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <Plus size={14} /> Add Driver
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Loading Drivers...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Driver Info</th>
                                    <th className="px-8 py-4 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Contact</th>
                                    <th className="px-8 py-4 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Licence</th>
                                    <th className="px-8 py-4 text-[10px] font-semibold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredDrivers.map((driver) => (
                                    <tr key={getDriverId(driver)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => handleDriverClick(driver)}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner overflow-hidden">
                                                    {driver.image ? <img src={driver.image.startsWith('http') ? driver.image : `${API_BASE_URL}/${driver.image}`} className="w-full h-full object-cover" /> : (driver.driverName?.charAt(0) || 'D')}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{driver.driverName}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                        <MapPin size={12} />
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider">{driver.address || 'No Address'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-slate-300" />
                                                <p className="text-xs font-bold text-slate-600">{driver.mobileNo}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={14} className="text-slate-300" />
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{driver.licence || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Driver Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-slate-900">Add New Driver</h1>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Register new personnel to fleet</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:text-red-500 transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-8 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase text-slate-500">Driver Name</label>
                                    <input
                                        required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                                        value={addFormData.driverName} onChange={(e) => setAddFormData({ ...addFormData, driverName: e.target.value })}
                                        placeholder="Full name of driver"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase text-slate-500">Mobile No</label>
                                    <input
                                        required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                                        value={addFormData.mobileNo} 
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 10) setAddFormData({ ...addFormData, mobileNo: val });
                                        }}
                                        placeholder="Mobile number" maxLength={10}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase text-slate-500">Licence No</label>
                                    <input
                                        required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs uppercase focus:bg-white focus:border-blue-600 outline-none transition-all"
                                        value={addFormData.licence} onChange={(e) => setAddFormData({ ...addFormData, licence: e.target.value })}
                                        placeholder="MH122024..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase text-slate-500">Proof Type</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                                        value={addFormData.proofType}
                                        onChange={(e) => setAddFormData({ ...addFormData, proofType: e.target.value })}
                                    >
                                        <option value="LICENCE">Driving Licence</option>
                                        <option value="AADHAAR">Aadhar Card</option>
                                        <option value="PAN_CARD">PAN Card</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-semibold uppercase text-slate-500">Full Address</label>
                                    <input
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
                                        value={addFormData.address} onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })}
                                        placeholder="Residential address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase text-slate-500">Driver Photo (JPG/PNG)</label>
                                    <div className="relative group/file">
                                        <input
                                            type="file" name="image" accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => handleFileChange(e)}
                                        />
                                        <div className="w-full px-4 py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center gap-3 group-hover/file:border-blue-500 transition-all">
                                            <Camera size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-500 truncate">
                                                {addFormData.image ? addFormData.image.name : 'Upload Photo'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold uppercase text-slate-500">Proof Document (PDF/Image)</label>
                                    <div className="relative group/file">
                                        {/* Input name changed to proofImage */}
                                        <input
                                            type="file" name="proofImage" accept=".pdf,image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => handleFileChange(e)}
                                        />
                                        <div className="w-full px-4 py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center gap-3 group-hover/file:border-blue-500 transition-all">
                                            <FileText size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-500 truncate">
                                                {addFormData.proofImage ? addFormData.proofImage.name : `Upload ${formatProofType(addFormData.proofType)}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={isAdding} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs shadow-sm mt-4 disabled:opacity-50">
                                {isAdding ? 'Adding...' : 'Save Driver'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Driver Details / Update Modal */}
            {showDriverDetails && selectedDriver && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg uppercase overflow-hidden ring-4 ring-white">
                                    {selectedDriver.image ? <img src={selectedDriver.image.startsWith('http') ? selectedDriver.image : `${API_BASE_URL}/${selectedDriver.image}`} className="w-full h-full object-cover" /> : (selectedDriver.driverName?.charAt(0) || 'D')}
                                </div>
                                <div>
                                    {isEditing ? (
                                        <div className="space-y-1">
                                            <input
                                                name="driverName"
                                                value={editConfig.driverName || ''}
                                                onChange={handleEditChange}
                                                className="text-xl font-bold tracking-tight text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-lg focus:border-blue-600 outline-none"
                                            />
                                            <p className="text-[8px] font-semibold text-blue-600 uppercase tracking-wider">Editing Driver Name</p>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{selectedDriver.driverName}</h2>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Driver Profile Data</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(!isEditing)} className={`px-5 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-wider flex items-center gap-2 transition-all ${isEditing ? 'bg-amber-100 text-amber-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>
                                <button onClick={() => setShowDriverDetails(false)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:text-red-500 hover:bg-red-50 transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider ml-1">Mobile Number</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                                <input name="mobileNo" value={editConfig.mobileNo || ''} onChange={handleEditChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs focus:bg-white focus:border-blue-500 transition-all outline-none" />
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                                <p className="text-sm font-bold text-slate-900 flex items-center gap-3"><Phone size={16} className="text-blue-500" />{selectedDriver.mobileNo || 'N/A'}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider ml-1">Licence ID</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                                <input name="licence" value={editConfig.licence || ''} onChange={handleEditChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs uppercase focus:bg-white focus:border-blue-500 transition-all outline-none" />
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                                <p className="text-sm font-bold text-slate-900 flex items-center gap-3 uppercase"><CreditCard size={16} className="text-orange-500" />{selectedDriver.licence || 'N/A'}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider ml-1">Residential Address</label>
                                        {isEditing ? (
                                            <textarea name="address" value={editConfig.address || ''} onChange={handleEditChange} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs focus:bg-white focus:border-blue-500 transition-all outline-none resize-none" />
                                        ) : (
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                                <p className="text-sm font-bold text-slate-900 flex items-start gap-3 leading-relaxed underline decoration-slate-200 underline-offset-4 decoration-dotted"><MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />{selectedDriver.address || 'N/A'}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider ml-1">Driver Photo</label>
                                        {isEditing ? (
                                            <div className="relative group/file">
                                                <input
                                                    type="file" name="image" accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => handleFileChange(e, true)}
                                                />
                                                <div className="w-full px-4 py-3 bg-white border border-dashed border-slate-200 rounded-xl flex items-center gap-3 group-hover/file:border-blue-500 transition-all">
                                                    <Camera size={14} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-500 truncate">
                                                        {editConfig.image instanceof File ? editConfig.image.name : 'Change Photo'}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all overflow-hidden text-ellipsis whitespace-nowrap">
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-3"><Camera size={16} className="text-slate-300 flex-shrink-0" />Photo Uploaded</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider ml-1">Proof Type</label>
                                        {isEditing ? (
                                            <select
                                                name="proofType"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs focus:bg-white focus:border-blue-500 outline-none transition-all"
                                                value={editConfig.proofType || 'LICENCE'}
                                                onChange={handleEditChange}
                                            >
                                                <option value="LICENCE">Driving Licence</option>
                                                <option value="AADHAAR">Aadhar Card</option>
                                                <option value="PAN_CARD">PAN Card</option>
                                            </select>
                                        ) : (
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                                <p className="text-sm font-bold text-slate-900 flex items-center gap-3"><FileText size={16} className="text-indigo-500" />{formatProofType(selectedDriver.proofType)}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider ml-1">Proof Document</label>
                                        {isEditing ? (
                                            <div className="relative group/file">
                                                {/* Input name changed to proofImage */}
                                                <input
                                                    type="file" name="proofImage" accept=".pdf,image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => handleFileChange(e, true)}
                                                />
                                                <div className="w-full px-4 py-3 bg-white border border-dashed border-slate-200 rounded-xl flex items-center gap-3 group-hover/file:border-blue-500 transition-all">
                                                    <FileText size={14} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-500 truncate">
                                                        {editConfig.proofImage instanceof File ? editConfig.proofImage.name : 'Update Proof Document'}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                                {/* Changed selectedDriver.proof to selectedDriver.proofImage */}
                                                {selectedDriver.proofImage ? (
                                                    <a
                                                        href={selectedDriver.proofImage.startsWith('http') ? selectedDriver.proofImage : `${API_BASE_URL}/${selectedDriver.proofImage}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                                    >
                                                        <ExternalLink size={14} /> View Uploaded Document
                                                    </a>
                                                ) : (
                                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-3"><FileText size={16} className="text-slate-300 flex-shrink-0" />No proof document</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                                <button
                                    onClick={submitDriverUpdate}
                                    disabled={updateSpinner}
                                    className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs shadow-sm flex items-center justify-center gap-3 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 min-w-[200px]"
                                >
                                    {updateSpinner ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check size={18} /> Update Driver Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriversList;