import React, { useState } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
    LayoutDashboard, Briefcase, Truck, Users, Wallet, MapPin,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import DriversList from '../../../components/Dashboard/DriversList';

const DriverManagementPage = () => {
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
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Verifying Credentials...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Owner">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Driver Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage your fleet personnel and documentation</p>
                </div>

                {vendorId ? (
                    <DriversList vendorId={vendorId} />
                ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={32} />
                        </div>
                        <p className="text-red-600 font-bold uppercase text-xs">Unauthorized Access</p>
                        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mt-2">Could not identify vendor credentials</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DriverManagementPage;
