import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Info, 
    ArrowLeft, 
    ChevronDown, 
    Smartphone, 
    CheckCircle2, 
    X,
    Truck,
    Box,
    Layers,
    Monitor
} from 'lucide-react';

const FTLFormPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [origin, setOrigin] = useState(location.state?.origin || '');
    const [destination, setDestination] = useState(location.state?.destination || '');
    
    // Form States
    const [cargoType, setCargoType] = useState('Machinery');
    const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
    const [weight, setWeight] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [specialReqs, setSpecialReqs] = useState({
        fragile: false,
        odc: false,
        hazardous: false,
        tempControlled: false,
        tarpaulin: false
    });
    
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleNextStep = () => {
        if (modalStep < 3) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setModalStep(modalStep + 1);
            }, 1000);
        } else {
            setIsModalOpen(false);
            navigate('/booking-summary', { state: { origin, destination, vehicle: selectedTruck } });
        }
    };

    const trucks = [
        { id: 1, name: '14ft Mini Truck', length: '14 FT', payload: '2.5 TON', desc: 'Perfect for small residential moves and light commercial goods.', bestFor: 'Furniture • Home Appliances', recommended: 'Local deliveries, Narrow streets', image: '/ftl_truck_delivery_professional_1773813905993.png' },
        { id: 2, name: '14ft Mini Truck', length: '14 FT', payload: '2.5 TON', desc: 'Perfect for small residential moves and light commercial goods.', bestFor: 'Furniture • Home Appliances', recommended: 'Local deliveries, Narrow streets', bestMatch: true, image: '/ptl_parcel_delivery_professional_1773813926389.png' },
        { id: 3, name: '14ft Mini Truck', length: '14 FT', payload: '2.5 TON', desc: 'Perfect for small residential moves and light commercial goods.', bestFor: 'Furniture • Home Appliances', recommended: 'Local deliveries, Narrow streets', image: '/ftl_truck_delivery_professional_1773813905993.png' }
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-24 pb-12 px-4 md:px-8 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Main Form Card */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12 space-y-10">
                    
                    {/* Route Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-50 pb-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Origin</label>
                            <input 
                                type="text" 
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                placeholder="Enter pickup pincode" 
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:bg-white focus:border-red-500 transition-all italic tracking-wider"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Destination</label>
                            <input 
                                type="text" 
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Enter delivery pincode" 
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:bg-white focus:border-red-500 transition-all italic tracking-wider"
                            />
                        </div>
                    </div>

                    {/* Cargo & Specs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Cargo Type</label>
                                <div className="relative">
                                    <select 
                                        value={cargoType}
                                        onChange={(e) => setCargoType(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none appearance-none cursor-pointer italic"
                                    >
                                        <option>Machinery</option>
                                        <option>Electronics</option>
                                        <option>FMCG</option>
                                        <option>Textiles</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Truck Type</label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none appearance-none cursor-pointer italic"
                                    >
                                        <option>Full Truck (Closed body)</option>
                                        <option>Open Truck</option>
                                        <option>Container</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <button className="absolute -top-6 right-0 text-[9px] font-black text-red-500 uppercase tracking-widest italic hover:underline">Not sure? Let us help</button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Vehicle Type</label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:outline-none appearance-none cursor-pointer italic"
                                    >
                                        <option>Full Truck (Closed body)</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Dimensions</label>
                                    <div className="flex bg-slate-100 rounded-lg p-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                        <button className="px-3 py-1 bg-red-600 text-white rounded-md">Feet</button>
                                        <button className="px-3 py-1">Meters</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <input placeholder="L" className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs font-bold" />
                                    <input placeholder="W" className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs font-bold" />
                                    <input placeholder="H" className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs font-bold" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Weight</label>
                                        <div className="flex bg-slate-100 rounded-lg p-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            <button className="px-3 py-1 bg-red-600 text-white rounded-md">Tons</button>
                                            <button className="px-3 py-1">Kgs</button>
                                        </div>
                                    </div>
                                    <input type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Quantity</label>
                                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Special Reqs */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Special Requirements</label>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { id: 'fragile', label: 'Fragile' },
                                { id: 'odc', label: 'ODC (Over Dimensioned)' },
                                { id: 'hazardous', label: 'Hazardous' },
                                { id: 'tempControlled', label: 'Temperature Controlled' },
                                { id: 'tarpaulin', label: 'Tarpaulin Required' }
                            ].map(req => (
                                <label key={req.id} className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-6 py-4 rounded-xl cursor-pointer hover:bg-white hover:border-red-200 transition-all">
                                    <input 
                                        type="checkbox" 
                                        checked={specialReqs[req.id]}
                                        onChange={() => setSpecialReqs({ ...specialReqs, [req.id]: !specialReqs[req.id] })}
                                        className="w-4 h-4 rounded-md border-slate-200 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{req.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Truck Selection section */}
                    <div className="pt-10 border-t border-slate-50 space-y-8">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase leading-none">Select Truck</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Recommended Truck for your load</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {trucks.map(truck => (
                                <motion.div 
                                    key={truck.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedTruck(truck)}
                                    className={`relative p-8 rounded-[2rem] border transition-all cursor-pointer flex flex-col gap-6 ${selectedTruck?.id === truck.id ? 'border-red-500 bg-red-50/20' : 'border-slate-50 bg-[#F8FAFC] hover:border-slate-200'}`}
                                >
                                    {truck.bestMatch && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                                            Best Match
                                        </div>
                                    )}
                                    <div className="h-40 bg-white rounded-2xl flex items-center justify-center p-4">
                                        <img src={truck.image || '/ftl_truck_delivery_professional_1773813905993.png'} alt={truck.name} className="h-full object-contain" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-slate-900">{truck.name}</h4>
                                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{truck.desc}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                                            <div className="text-center">
                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Length</p>
                                                <p className="text-[10px] font-bold text-slate-900">{truck.length}</p>
                                            </div>
                                            <div className="text-center border-l border-slate-100">
                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Payload</p>
                                                <p className="text-[10px] font-bold text-slate-900">{truck.payload}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[8px] font-black text-red-600 uppercase tracking-widest italic mb-1">Ideal For</p>
                                                <p className="text-[10px] font-bold text-slate-700 leading-relaxed">• {truck.bestFor}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommended for</p>
                                                <p className="text-[10px] font-bold text-slate-700 leading-relaxed">{truck.recommended}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                        <button 
                            onClick={() => navigate(-1)}
                            className="px-8 py-4 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <button 
                            onClick={() => {
                                if (!selectedTruck) {
                                    alert('Please select a truck to continue');
                                    return;
                                }
                                setIsModalOpen(true);
                            }}
                            className="px-12 py-5 bg-red-600 hover:bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-500/10 flex items-center gap-3 italic"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>

            {/* Verification Modal (Shared logic) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-[440px] rounded-[2.5rem] p-10 shadow-2xl overflow-hidden" >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"> <X size={24} /> </button>
                            {modalStep === 1 && (
                                <div className="space-y-10 py-4">
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600"> <Smartphone size={24} /> </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase">Enter Phone</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verification required to proceed</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mobile Number</label>
                                            <input type="tel" placeholder="98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold focus:outline-none focus:bg-white focus:border-red-500 transition-all tracking-widest" />
                                        </div>
                                        <button onClick={handleNextStep} disabled={phone.length !== 10 || isLoading} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-red-600 disabled:opacity-50 shadow-xl" >
                                            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Send Security Code'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {modalStep === 2 && (
                                <div className="space-y-10 py-4">
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600"> <CheckCircle2 size={24} /> </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase">Verify OTP</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Code sent to +91 {phone}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-8 text-center">
                                        <div className="flex justify-between gap-2"> {otp.map((digit, i) => ( <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-red-500 transition-all" /> ))} </div>
                                        <button onClick={handleNextStep} disabled={otp.some(d => !d) || isLoading} className="w-full py-5 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-900 disabled:opacity-50 shadow-xl" >
                                            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Verify & Proceed'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {modalStep === 3 && (
                                <div className="space-y-8 py-8 items-center text-center flex flex-col">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner"> <CheckCircle2 size={40} /> </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">Success!</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification complete.</p>
                                    </div>
                                    <button onClick={handleNextStep} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-red-600 shadow-xl" > View Summary </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FTLFormPage;
