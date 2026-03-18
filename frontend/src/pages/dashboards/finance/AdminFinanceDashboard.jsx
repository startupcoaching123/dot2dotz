import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import {
  IndianRupee, TrendingUp, CreditCard, Receipt,
  FileText, ArrowDownLeft, ArrowUpRight, Wallet
} from 'lucide-react';

const AdminFinanceDashboard = () => {
  const sidebarItems = [
    { icon: TrendingUp, label: 'Analytics', path: '/dashboard/admin-finance' },
    { icon: Wallet, label: 'Income & Expense', path: '/dashboard/admin-finance/ledger' },
    { icon: Receipt, label: 'Client Invoices', path: '/dashboard/admin-finance/invoices' },
    { icon: CreditCard, label: 'Vendor Payments', path: '/dashboard/admin-finance/payments' },
    { icon: FileText, label: 'Tax & Reports', path: '/dashboard/admin-finance/reports' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Finance Admin">
      <div className="space-y-8">
        <DashboardGrid>
          <StatCard title="Total Revenue" value="₹ 4.8M" icon={IndianRupee} trend={18.5} color="green" />
          <StatCard title="Net Profit" value="₹ 1.2M" icon={TrendingUp} trend={5.2} color="blue" />
          <StatCard title="Pending Payments" value="₹ 420K" icon={Receipt} trend={-12} color="orange" />
          <StatCard title="Operating Costs" value="₹ 2.4M" icon={CreditCard} trend={8.3} color="purple" />
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                Cash Flow Overview
              </h3>
              <select className="bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none">
                <option>Last 30 Days</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className="h-72 bg-slate-50 rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="flex gap-4">
                <div className="w-4 h-24 bg-green-400 rounded-t-lg"></div>
                <div className="w-4 h-16 bg-blue-400 rounded-t-lg opacity-50"></div>
                <div className="w-4 h-32 bg-green-400 rounded-t-lg"></div>
                <div className="w-4 h-28 bg-blue-400 rounded-t-lg opacity-50"></div>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Projection Graph</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-slate-900 rounded-full"></span>
              Recent Invoices
            </h3>
            <div className="space-y-6 flex-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                      <ArrowDownLeft size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">INV-4829-{i}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">Client: Globex Corp</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹ 12,400</p>
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-tighter">Paid</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase hover:bg-black transition-all shadow-xl shadow-slate-200">
              View All Invoices
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminFinanceDashboard;
