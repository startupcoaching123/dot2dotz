import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
    LayoutDashboard, Briefcase, Truck, Users, Wallet, MapPin,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import VehiclesList from '../../../components/Dashboard/VehiclesList';

const VendorFleetPage = () => {
    const { user, loading } = useAuth();

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/vendor' },
        { icon: Briefcase, label: 'Available Loads', path: '/dashboard/vendor/loads' },
        { icon: Truck, label: 'Fleet Status', path: '/dashboard/vendor/fleet' },
        { icon: Users, label: 'Driver Mgmt', path: '/dashboard/vendor/drivers' },
        { icon: MapPin, label: 'Routes', path: '/dashboard/vendor/routes' },
        { icon: Wallet, label: 'Earnings', path: '/dashboard/vendor/earnings' },
    ];

    // Aggressively find the vendor ID
    const getVendorId = (v) => {
        if (!v) return null;
        // Prioritize vendor-specific keys first
        const vendorSpecificKeys = ['vender_id', 'vendor_id', 'vendorId', 'venderId'];
        for (const key of vendorSpecificKeys) {
            if (v[key]) return v[key];
        }

        // Search in nested objects
        const wrappers = ['vendor', 'vender', 'user', 'data', 'profile'];
        for (const w of wrappers) {
            if (v[w] && typeof v[w] === 'object') {
                for (const key of vendorSpecificKeys) {
                    if (v[w][key]) return v[w][key];
                }
            }
        }

        // Fallback to generic IDs
        const genericKeys = ['_id', 'id', 'userId', 'user_id'];
        for (const key of genericKeys) {
            if (v[key]) return v[key];
        }

        return null;
    };

    const vendorId = getVendorId(user);

    if (loading) {
        return (
            <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Owner">
                <div className="h-full min-h-[50vh] flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading Fleet Data...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Owner">
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Fleet Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your vehicles and capacities</p>
                    </div>
                </div>

                {vendorId ? (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                        <VehiclesList vendorId={vendorId} />
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                            <Truck size={32} />
                        </div>
                        <p className="text-red-600 font-semibold text-sm">Unauthorized Access</p>
                        <p className="text-gray-500 text-sm mt-1">Could not identify vendor credentials</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default VendorFleetPage;
