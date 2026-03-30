import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { 
  Search, Filter, MapPin, Clock, Calendar, Phone, User, 
  Truck, Package, CheckCircle2, AlertTriangle, Info, 
  Download, Eye, Edit, RefreshCw, ChevronRight, Activity,
  Navigation, Route, Star, MessageSquare, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ShipmentCard, SearchBar, FilterDropdown } from '../../../components/Dashboard/ClientDashboardComponents';
import fetchWithAuth from '../../../FetchWithAuth';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../api/endpoints';

const ShipmentTrackingPage = () => {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sidebarItems = [
    { icon: Package, label: 'Dashboard', path: '/dashboard/client' },
    { icon: FileText, label: 'Leads & Quotes', path: '/dashboard/client/leads' },
    { icon: Plus, label: 'New Shipment', path: '/dashboard/client/new' },
    { icon: Package, label: 'Active Shipments', path: '/dashboard/client/shipments' },
    { icon: Navigation, label: 'Live Tracking', path: '/dashboard/client/track' },
    { icon: History, label: 'Shipment History', path: '/dashboard/client/history' },
    { icon: CreditCard, label: 'Billing & Invoices', path: '/dashboard/client/billing' },
    { icon: User, label: 'Profile', path: '/dashboard/client/profile' },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Shipments' },
        { value: 'pending', label: 'Pending' },
        { value: 'in_transit', label: 'In Transit' },
        { value: 'delayed', label: 'Delayed' },
        { value: 'delivered', label: 'Delivered' },
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' },
      ]
    },
    {
      key: 'date_range',
      label: 'Date Range',
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
      ]
    }
  ];

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadShipments = async () => {
      try {
        setTimeout(() => {
          setShipments([
            {
              id: 'FTL-8821',
              goods: 'Electronic Components',
              from: 'Mumbai, Maharashtra',
              to: 'Bangalore, Karnataka',
              status: 'In Transit',
              progress: 65,
              date: '2024-10-24',
              estimatedDelivery: '2024-10-26',
              driver: 'Rajesh Kumar',
              driverPhone: '+91 98765 43210',
              vehicle: 'MH12AB1234',
              vehicleType: 'Truck - 20 Ton',
              priority: 'high',
              tracking: [
                { location: 'Mumbai Warehouse', time: '2024-10-24 09:00 AM', status: 'picked_up' },
                { location: 'Pune Checkpoint', time: '2024-10-24 02:30 PM', status: 'in_transit' },
                { location: 'Kolhapur Hub', time: '2024-10-24 08:45 PM', status: 'in_transit' },
              ],
              documents: [
                { name: 'E-Way Bill', type: 'pdf', url: '#' },
                { name: 'Delivery Receipt', type: 'pdf', url: '#' },
              ],
              cost: 15000,
              distance: '750 km',
              estimatedTime: '18 hours'
            },
            {
              id: 'FTL-8819',
              goods: 'Industrial Machinery',
              from: 'Pune, Maharashtra',
              to: 'Chennai, Tamil Nadu',
              status: 'Delayed',
              progress: 40,
              date: '2024-10-24',
              estimatedDelivery: '2024-10-27',
              driver: 'Amit Singh',
              driverPhone: '+91 97654 32109',
              vehicle: 'MH34CD5678',
              vehicleType: 'Container Truck - 40 Ton',
              priority: 'high',
              tracking: [
                { location: 'Pune Industrial Area', time: '2024-10-24 07:00 AM', status: 'picked_up' },
                { location: 'Satara Checkpoint', time: '2024-10-24 11:15 AM', status: 'delayed' },
              ],
              documents: [
                { name: 'Insurance Certificate', type: 'pdf', url: '#' },
                { name: 'Weight Slip', type: 'pdf', url: '#' },
              ],
              cost: 25000,
              distance: '1200 km',
              estimatedTime: '24 hours',
              delayReason: 'Heavy traffic at Karnataka border'
            },
            {
              id: 'FTL-8815',
              goods: 'Pharma Supplies',
              from: 'Ahmedabad, Gujarat',
              to: 'Hyderabad, Telangana',
              status: 'Delivered',
              progress: 100,
              date: '2024-10-23',
              estimatedDelivery: '2024-10-24',
              driver: 'Vijay Patil',
              driverPhone: '+91 87654 21098',
              vehicle: 'MH56EF9012',
              vehicleType: 'Refrigerated Truck - 15 Ton',
              priority: 'medium',
              tracking: [
                { location: 'Ahmedabad Warehouse', time: '2024-10-23 06:00 AM', status: 'picked_up' },
                { location: 'Vadodara Hub', time: '2024-10-23 10:30 AM', status: 'in_transit' },
                { location: 'Surat Checkpoint', time: '2024-10-23 03:45 PM', status: 'in_transit' },
                { location: 'Hyderabad Warehouse', time: '2024-10-24 08:00 AM', status: 'delivered' },
              ],
              documents: [
                { name: 'Temperature Log', type: 'pdf', url: '#' },
                { name: 'Delivery Proof', type: 'image', url: '#' },
              ],
              cost: 18000,
              distance: '900 km',
              estimatedTime: '20 hours'
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading shipments:', error);
        setIsLoading(false);
      }
    };

    loadShipments();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleShipmentClick = (shipment) => {
    setSelectedShipment(shipment);
    setShowDetails(true);
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => {
      const currentFilters = prev[key] || [];
      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [key]: currentFilters.filter(f => f !== value)
        };
      } else {
        return {
          ...prev,
          [key]: [...currentFilters, value]
        };
      }
    });
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.goods.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.to.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !activeFilters.status || 
                          activeFilters.status.includes('all') || 
                          activeFilters.status.includes(shipment.status.toLowerCase().replace(' ', '_'));

    const matchesPriority = !activeFilters.priority || 
                           activeFilters.priority.includes('all') || 
                           activeFilters.priority.includes(shipment.priority);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Transit': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delayed': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Shipment Tracking">
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Live Shipment Tracking</h1>
              <p className="text-blue-100 text-lg">
                Real-time tracking of all your shipments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-all disabled:opacity-50"
              >
                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by shipment ID, goods, or location..."
                onSearch={setSearchTerm}
                className="w-full"
              />
            </div>
            <FilterDropdown
              filters={filters}
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
            />
          </div>
        </div>

        {/* Shipment List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">
                Active Shipments ({filteredShipments.length})
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Activity size={16} />
                Live Updates
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {filteredShipments.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No shipments found</h3>
                  <p className="text-slate-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredShipments.map((shipment) => (
                  <motion.div
                    key={shipment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-slate-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleShipmentClick(shipment)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                          <Truck size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-lg font-semibold text-slate-900">{shipment.goods}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(shipment.priority)}`}>
                              {shipment.priority.charAt(0).toUpperCase() + shipment.priority.slice(1)} Priority
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-blue-600">{shipment.id}</span>
                            <span className="text-sm text-slate-500">{shipment.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end gap-6">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">From</p>
                            <p className="text-sm font-semibold text-slate-900">{shipment.from.split(',')[0]}</p>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                          <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">To</p>
                            <p className="text-sm font-semibold text-slate-900">{shipment.to.split(',')[0]}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                          {shipment.status === 'Delayed' && shipment.delayReason && (
                            <p className="text-xs text-red-600 mt-1">{shipment.delayReason}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {shipment.status !== 'Delivered' && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-slate-500">Transit Progress</p>
                              <p className="text-sm font-semibold text-blue-600">{shipment.progress}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Est. Delivery</p>
                              <p className="text-sm font-semibold text-slate-900">{shipment.estimatedDelivery}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Distance</p>
                            <p className="text-sm font-semibold text-slate-900">{shipment.distance}</p>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${shipment.progress}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              shipment.status === 'Delayed' ? 'bg-orange-500' : 'bg-blue-600'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Shipment Details Modal */}
        {showDetails && selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedShipment.id}</h2>
                    <p className="text-slate-600">{selectedShipment.goods}</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Route Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Route Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">From:</span>
                        <span className="font-medium">{selectedShipment.from}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">To:</span>
                        <span className="font-medium">{selectedShipment.to}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Distance:</span>
                        <span className="font-medium">{selectedShipment.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Est. Time:</span>
                        <span className="font-medium">{selectedShipment.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Vehicle & Driver</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vehicle:</span>
                        <span className="font-medium">{selectedShipment.vehicle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Type:</span>
                        <span className="font-medium">{selectedShipment.vehicleType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Driver:</span>
                        <span className="font-medium">{selectedShipment.driver}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <span className="font-medium">{selectedShipment.driverPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Tracking Timeline</h3>
                  <div className="space-y-3">
                    {selectedShipment.tracking.map((point, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{point.location}</p>
                          <p className="text-sm text-slate-500">{point.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Documents</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {selectedShipment.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-sm font-medium">{doc.name}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShipmentTrackingPage;
