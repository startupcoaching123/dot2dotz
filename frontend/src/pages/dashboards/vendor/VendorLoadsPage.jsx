import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import VendorLeadsList from '../../../components/Dashboard/VendorLeadsList';
import {
    LayoutDashboard, Briefcase, Truck, Users, Wallet, Settings, Globe, MapPin
} from 'lucide-react';

const VendorLoadsPage = () => {
    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/vendor' },
        { icon: Briefcase, label: 'Available Loads', path: '/dashboard/vendor/loads' },
        { icon: Truck, label: 'Fleet Status', path: '/dashboard/vendor/fleet' },
        { icon: Users, label: 'Driver Mgmt', path: '/dashboard/vendor/drivers' },
        { icon: MapPin, label: 'Routes', path: '/dashboard/vendor/routes' },
        { icon: Wallet, label: 'Earnings', path: '/dashboard/vendor/earnings' },
        { icon: Settings, label: 'Settings', path: '/dashboard/vendor/settings' },
    ];

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Owner">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Available Load Assignments</h1>
                        <p className="text-sm text-gray-500 mt-1">Review and quote on active leads assigned to your fleet</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                    <VendorLeadsList title="My Incoming Leads" />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VendorLoadsPage;