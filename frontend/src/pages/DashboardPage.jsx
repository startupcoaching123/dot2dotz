import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    ShoppingCart,
    Wallet,
    Warehouse,
    HelpCircle,
    User,
    Plus,
    Search,
    Truck,
    MapPin,
    Calendar,
    FileText,
    Clock,
    Trash2,
    ChevronDown,
    X,
    IndianRupee,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Download,
    Filter
} from 'lucide-react';

const DashboardPage = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isTruckMoving, setIsTruckMoving] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard' or 'wallet'

    const handlePickupClick = () => {
        setIsTruckMoving(true);
        setTimeout(() => {
            setIsPickupModalOpen(true);
            setIsTruckMoving(false);
        }, 1000);
    };

    const handleDeliveryClick = () => {
        setIsTruckMoving(true);
        setTimeout(() => {
            setIsDeliveryModalOpen(true);
            setIsTruckMoving(false);
        }, 1000);
    };

    // Redirect to role-specific dashboard
    React.useEffect(() => {
        const roleDashboardMap = {
            'SUPER_ADMIN': '/dashboard/super-admin',
            'ADMIN_OPERATIONAL': '/dashboard/admin-operational',
            'ADMIN_FINANCE': '/dashboard/admin-finance',
            'CLIENT': '/dashboard/client',
            'CLIENT_STAFF': '/dashboard/client-staff',
            'VENDOR': '/dashboard/vendor',
            'VENDOR_STAFF': '/dashboard/vendor-staff',
        };

        const rawRole = user?.role || user?.userType || "";
        const userRole = typeof rawRole === 'string' ? rawRole.toUpperCase() : "";

        if (isAuthenticated && userRole) {
            const targetPath = roleDashboardMap[userRole];
            console.log('Dashboard Entry - Routing Role:', userRole, 'to', targetPath);
            if (targetPath) {
                navigate(targetPath, { replace: true });
            }
        } else if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-20 flex font-sans">

            {/* Sidebar */}
            <aside className="w-64 bg-white/50 backdrop-blur-xl border-r border-gray-100 hidden lg:flex flex-col p-6 fixed h-full z-10">
                <div className="space-y-2 flex-grow">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', active: activeSection === 'dashboard' },
                        { icon: Wallet, label: 'Wallet', active: activeSection === 'wallet' },
                        { icon: ShoppingCart, label: 'Order', active: false },
                        { icon: Warehouse, label: 'Finances', active: false },
                        { icon: HelpCircle, label: 'Help', active: false },
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSection(item.label.toLowerCase())}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-semibold text-sm transition-all group ${item.active
                                ? 'bg-red-600 text-white shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <item.icon size={20} className={item.active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow lg:ml-64 p-8 space-y-8 pb-20 w-full overflow-x-hidden">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-900">Orders Details</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all">
                            <Search size={20} />
                        </button>
                        <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl border border-slate-100">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                <User size={20} />
                            </div>
                            <span className="font-semibold text-xs tracking-wide text-slate-900">John Doe</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Details Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-50 space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-900">Delivery Details</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Pickup */}
                        <div
                            onClick={handlePickupClick}
                            className="lg:col-span-5 bg-slate-50/50 p-6 rounded-xl border border-slate-100 flex items-start gap-4 hover:border-red-100 transition-all group cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-all flex-shrink-0">
                                <Plus size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-[10px] uppercase text-slate-400 tracking-wider">Pick Up - Seller Detail</h3>
                                <button className="text-sm font-semibold text-slate-900 hover:text-red-600 transition-all">+ Add Seller Details</button>
                            </div>
                        </div>

                        {/* Truck Icon with Line */}
                        <div className="lg:col-span-2 flex justify-center items-center relative">
                            {/* Movement Line behind truck */}
                            <div className="absolute left-0 right-0 w-full h-0.5 z-0">
                                <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                            </div>
                            <motion.div
                                animate={{
                                    x: isTruckMoving ? [-20, 0, 20, 0] : 0,
                                    opacity: isTruckMoving ? [0, 1, 0] : 1
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <Truck
                                    size={40}
                                    className={`${isTruckMoving ? 'text-red-600 scale-110' : 'text-gray-400 scale-100'} transition-all duration-300 drop-shadow-lg`}
                                />
                            </motion.div>
                        </div>

                        {/* Destination */}
                        <div
                            onClick={handleDeliveryClick}
                            className="lg:col-span-5 bg-slate-50/50 p-6 rounded-xl border border-slate-100 flex items-start gap-4 hover:border-red-100 transition-all group cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-all flex-shrink-0">
                                <Plus size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-[10px] uppercase text-slate-400 tracking-wider">Destination - Customer Detail</h3>
                                <button className="text-sm font-semibold text-slate-900 hover:text-red-600 transition-all">+ Add Customer Details</button>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Order Detail Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-50 space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-900">Order Detail</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Order Reference</label>
                            <input disabled value="ORD-2024-8842" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-lg text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Package Type</label>
                            <div className="relative">
                                <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-lg appearance-none focus:outline-none focus:border-red-600">
                                    <option>Standard Box</option>
                                    <option>Wooden Crate</option>
                                    <option>Pallet</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Priority</label>
                            <div className="flex gap-2">
                                <button className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-xs uppercase text-slate-400 hover:bg-white hover:border-slate-900 hover:text-slate-900 transition-all">Normal</button>
                                <button className="flex-1 py-3 bg-red-50 border border-red-100 rounded-xl font-semibold text-xs uppercase text-red-600 shadow-sm">Urgent</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Pickup Date</label>
                            <div className="relative">
                                <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600" />
                                <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Invoice To</label>
                            <div className="flex gap-2">
                                <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-[10px] uppercase text-slate-900 shadow-sm">Shipper</button>
                                <button className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-[10px] uppercase text-slate-400">Consignee</button>
                                <button className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-[10px] uppercase text-slate-400">Others</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Invoice Number</label>
                            <input placeholder="INV-001" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Invoice Amount</label>
                            <input type="number" placeholder="₹ 40,000" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Upload Invoice</label>
                            <div className="relative group cursor-pointer">
                                <div className="w-full h-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl font-semibold text-[10px] uppercase text-slate-400 group-hover:border-red-600 group-hover:bg-white transition-all flex items-center justify-between">
                                    <span>Choose File</span>
                                    <FileText size={16} />
                                </div>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Add Products Section */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm border border-slate-50 space-y-8"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                            <h2 className="text-lg font-bold text-slate-900">Add products to be shipped</h2>
                        </div>

                        <div className="relative group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input placeholder="Search and add product..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600 focus:bg-white transition-all shadow-inner" />
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 bg-white border border-slate-50 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                                        <LayoutDashboard size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-900">Wood rod</h4>
                                        <div className="flex gap-4">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">HSN: 441234</span>
                                            <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">SUB: 10%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <span className="block font-bold text-slate-900">₹ 40,000.00</span>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Subtotal</span>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-red-600 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 py-4">
                            <input type="checkbox" id="fragile" className="w-4 h-4 rounded accent-red-600" />
                            <label htmlFor="fragile" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My package contains fragile items</label>
                        </div>
                    </motion.section>

                    {/* Box Details Section */}
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm border border-slate-50 flex flex-col justify-between"
                    >
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                                    <h2 className="text-lg font-bold text-slate-900">Box Details</h2>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(n => (
                                        <button key={n} className={`w-8 h-8 rounded-lg font-semibold text-xs ${n === 1 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>{n}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Package Type</label>
                                    <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600">
                                        <option>Cardboard Box</option>
                                        <option>Crate</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Dimensions (L x W x H)</label>
                                    <div className="flex gap-2">
                                        <input placeholder="600" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-lg text-center focus:border-slate-900 outline-none" />
                                        <input placeholder="200" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-lg text-center focus:border-slate-900 outline-none" />
                                        <input placeholder="400" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-lg text-center focus:border-slate-900 outline-none" />
                                        <div className="px-3 flex items-center font-semibold text-[10px] text-slate-400 uppercase tracking-wider">cm</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Weight</label>
                                    <div className="relative">
                                        <input placeholder="16.0" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-[10px] text-slate-400 tracking-wider">gm</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex gap-4">
                            <button className="flex-1 py-4 bg-white border border-slate-100 rounded-xl font-semibold text-slate-900 uppercase text-xs hover:bg-slate-50 transition-all">Save Draft</button>
                            <button className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-semibold uppercase text-xs hover:bg-red-600 transition-all shadow-sm">Generate Shipment</button>
                        </div>
                    </motion.section>
                </div>

            </main>

            {/* Pickup Modal */}
            <AnimatePresence>
                {isPickupModalOpen && (
                    <div className="fixed inset-0 z-200 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPickupModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative bg-white w-full max-w-[600px] max-h-[90vh] rounded-2xl overflow-hidden shadow-xl p-8 border border-white"
                        >
                            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Add Pickup Address</h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin size={16} />
                                        <span className="font-semibold text-sm">Address Details</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Facility Name</label>
                                            <input type="text" placeholder="Enter name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600 focus:bg-white" />
                                            <p className="text-[8px] text-slate-400 mt-1">Please note that facility name cannot be edited after saving</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Contact Person Name (Optional)</label>
                                            <input type="text" placeholder="Enter contact person name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600 focus:bg-white" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pickup Location Contact</label>
                                            <div className="flex">
                                                <span className="px-4 py-3 bg-slate-200 rounded-l-xl font-semibold text-lg">+91</span>
                                                <input 
                                                    type="tel" 
                                                    placeholder="10 digit mobile" 
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-r-xl font-semibold text-lg focus:outline-none focus:border-red-600 focus:bg-white" 
                                                    maxLength={10}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                        e.target.value = val;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email (Optional)</label>
                                            <input type="email" placeholder="Enter email ID" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600 focus:bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Address Line</label>
                                        <input type="text" placeholder="Enter address" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600 focus:bg-white" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pincode</label>
                                             <input 
                                                type="text" 
                                                placeholder="6 digits" 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600 focus:bg-white" 
                                                maxLength={6}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                    e.target.value = val;
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">City</label>
                                            <input type="text" placeholder="Enter city" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-lg focus:outline-none focus:border-red-600 focus:bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Default Pickup Slot</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button className="py-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs uppercase text-gray-400 hover:bg-white hover:border-black transition-all">9 AM - 12 PM</button>
                                            <button className="py-3 bg-red-50 border border-red-100 rounded-xl font-black text-xs uppercase text-red-600">12 PM - 9 PM</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Working Days</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button className="py-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs uppercase text-gray-400 hover:bg-white hover:border-black transition-all">Mon</button>
                                            <button className="py-3 bg-red-50 border border-red-100 rounded-xl font-black text-xs uppercase text-red-600">Tue</button>
                                            <button className="py-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs uppercase text-gray-400 hover:bg-white hover:border-black transition-all">Wed</button>
                                            <button className="py-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs uppercase text-gray-400 hover:bg-white hover:border-black transition-all">Thu</button>
                                            <button className="py-3 bg-red-50 border border-red-100 rounded-xl font-black text-xs uppercase text-red-600">Fri</button>
                                            <button className="py-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs uppercase text-gray-400 hover:bg-white hover:border-black transition-all">Sat</button>
                                            <button className="py-3 bg-gray-50 border border-gray-200 rounded-xl font-black text-xs uppercase text-gray-400 hover:bg-white hover:border-black transition-all">Sun</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Return Details</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" id="return" className="w-4 h-4 rounded accent-red-600" />
                                                <label htmlFor="return" className="text-sm font-bold text-gray-700">Return Available</label>
                                            </div>
                                            <input type="text" placeholder="Enter return details" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-lg focus:outline-none focus:border-red-600 focus:bg-white" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setIsPickupModalOpen(false)}
                                            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold uppercase text-xs hover:bg-slate-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => setIsPickupModalOpen(false)}
                                            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold uppercase text-xs hover:bg-slate-900 transition-all"
                                        >
                                            Save Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delivery Modal */}
            <AnimatePresence>
                {isDeliveryModalOpen && (
                    <div className="fixed inset-0 z-200 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeliveryModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative bg-white w-full max-w-[500px] max-h-[90vh] rounded-2xl overflow-hidden shadow-xl p-8 border border-white"
                        >
                            <button
                                onClick={() => setIsDeliveryModalOpen(false)}
                                className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Delivery Details</h3>
                                        <p className="text-sm text-slate-500">Add customer information</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2 block">Customer Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter customer name"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2 block">Delivery Address</label>
                                        <textarea
                                            placeholder="Enter delivery address"
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2 block">Contact Number</label>
                                         <input
                                            type="tel"
                                            placeholder="10 digit number"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                                            maxLength={10}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                e.target.value = val;
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setIsDeliveryModalOpen(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold uppercase text-xs hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setIsDeliveryModalOpen(false)}
                                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold uppercase text-xs hover:bg-slate-900 transition-all"
                                    >
                                        Save Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardPage;
