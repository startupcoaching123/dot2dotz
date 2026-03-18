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
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 border-l-8 border-orange-600 pl-6 uppercase tracking-tighter italic">Available Load Assignments</h1>
                        <p className="text-slate-400 text-xs font-bold mt-2 ml-8 uppercase tracking-[0.2em] italic">Review and quote on active leads assigned to your fleet</p>
                    </div>
                </div>

                <VendorLeadsList title="My Incoming Leads" />
            </div>
        </DashboardLayout>
    );
};

export default VendorLoadsPage;
