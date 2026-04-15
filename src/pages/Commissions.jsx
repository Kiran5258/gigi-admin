import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useCommissionStore } from '../store/useCommissionStore';
import { useEmployeeStore } from '../store/useEmployeeStore';
import { Loader2, DollarSign, Search, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Commissions = () => {
    const { commissions, fetchCommissions, addCommission, loading } = useCommissionStore();
    const { employees, fetchEmployees } = useEmployeeStore();
    const [statusFilter, setStatusFilter] = useState('');
    const [searchName, setSearchName] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Add form state
    const [selectedEmp, setSelectedEmp] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        fetchCommissions(statusFilter, '');
        fetchEmployees(); // Need employees for the Add Modal
    }, [fetchCommissions, fetchEmployees, statusFilter]);

    const handleAddCommission = async (e) => {
        e.preventDefault();
        if (!selectedEmp || !amount) {
            toast.error("Please select a servicer and enter an amount");
            return;
        }
        try {
            await addCommission(selectedEmp, Number(amount));
            setIsAddModalOpen(false);
            setSelectedEmp('');
            setAmount('');
            fetchCommissions(statusFilter, ''); // refresh list
        } catch (error) {
            // Error managed by store
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <DollarSign className="w-6 h-6 text-emerald-500" />
                            Commission Wallet
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Manage and view platform commissions and penalties.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Penalty / Commission
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-wrap gap-4 items-center shadow-sm">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Status</label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                        </select>
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Servicer Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Servicer</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Type/Service</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {loading && commissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                                        </td>
                                    </tr>
                                ) : commissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            No commission records found.
                                        </td>
                                    </tr>
                                ) : (() => {
                                    const filtered = commissions.filter(c => {
                                        if (!searchName.trim()) return true;
                                        const name = (c.empId?.fullname || c.empId?.storeName || '').toLowerCase();
                                        return name.includes(searchName.toLowerCase());
                                    });

                                    if (filtered.length === 0) {
                                        return (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                                    No matching commission records found.
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return filtered.map((c) => (
                                        <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors text-slate-700 dark:text-slate-300">
                                            <td className="px-6 py-4 font-mono text-xs">{c._id.substring(0, 8)}...</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{c.empId?.fullname || c.empId?.storeName || 'Unknown'}</div>
                                                <div className="text-xs text-slate-500">{c.empType}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                                                ₹{c.commissionAmount}
                                            </td>
                                            <td className="px-6 py-4">
                                                {c.serviceId?.serviceName || <span className="text-slate-400 italic">Manual Entry</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                                                    c.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                                                }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-500 text-xs">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ));
                                })()
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                Add Penalty / Manual Charge
                            </h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddCommission} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Select Servicer
                                </label>
                                <select
                                    value={selectedEmp}
                                    onChange={(e) => setSelectedEmp(e.target.value)}
                                    required
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50"
                                >
                                    <option value="" disabled>Choose a Servicer...</option>
                                    {employees.map(e => (
                                        <option key={e._id} value={e._id}>{e.fullname || e.storeName} ({e.phoneNo})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Note: If total unpaid reaches 1000+, the servicer will be automatically blocked.
                                </p>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm & Charge"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Commissions;
