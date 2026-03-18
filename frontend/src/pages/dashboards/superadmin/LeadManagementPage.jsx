import React, { useState } from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import LeadsList from '../../../components/Dashboard/LeadsList';
import { 
    Activity, Users, Truck, ShieldCheck, Globe, 
    CreditCard, Database, Settings, Layers 
} from 'lucide-react';

const LeadManagementPage = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Super Admin">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tight">Leads Management</h1>
                        <p className="text-slate-500 text-sm mt-1 ml-4 italic font-medium">Monitor and assign all incoming platform leads</p>
                    </div>
                </div>

                <LeadsList refreshTrigger={refreshTrigger} title="Platform Lead Repository" />
            </div>
        </DashboardLayout>
    );
};

export default LeadManagementPage;
