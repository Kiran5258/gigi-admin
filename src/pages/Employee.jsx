import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader';
import EmployeeSection from '../components/EmployeeSection';
import { useEmployeeStore } from '../store/useEmployeeStore';
import { Mail, FileDown, Search } from 'lucide-react';

export const Employee = () => {
    const { employees, loading, fetchEmployees, blockEmployee, unblockEmployee } = useEmployeeStore();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const normalizeEmployee = (emp) => {
        switch (emp.employeeType) {
            case "single_employee":
                return {
                    id: emp.empId,
                    dbId: emp._id,
                    name: emp.fullname,
                    phoneNo: emp.phoneNo,
                    team: emp.teamAccepted,
                    typeLabel: "Single Employee",
                    typeKey: "single_employee",
                    createdAt: emp.createdAt,
                    isBlocked: emp.isBlocked,
                    blockedUntil: emp.blockedUntil,
                    capabilities: emp.capabilities || []
                };

            case "multiple_employee":
                return {
                    id: emp.TeamId,
                    dbId: emp._id,
                    name: emp.ownerName,
                    storeName: emp.storeName,
                    members: emp.members?.length || 0,
                    phoneNo: emp.phoneNo,
                    typeLabel: "Multiple Employee",
                    typeKey: "multiple_employee",
                    createdAt: emp.createdAt,
                    isBlocked: emp.isBlocked,
                    blockedUntil: emp.blockedUntil,
                    capabilities: emp.capabilities || []
                };

            case "tool_shop":
                return {
                    id: emp.toolShopId,
                    dbId: emp._id,
                    name: emp.ownerName,
                    storeName: emp.shopName,
                    gstNo: emp.gstNo,
                    phoneNo: emp.phoneNo,
                    typeLabel: "Tool Shop",
                    typeKey: "tool_shop",
                    createdAt: emp.createdAt,
                    isBlocked: emp.isBlocked,
                    blockedUntil: emp.blockedUntil,
                    capabilities: emp.capabilities || []
                };

            default:
                return null;
        }
    };

    const handleBlock = async (id, type) => {
        // Fixed duration for now, can be extended to a modal later
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        if (window.confirm(`Are you sure you want to block this servicer until ${nextMonth.toLocaleDateString()}?`)) {
            await blockEmployee(id, type, nextMonth);
        }
    };

    const handleUnblock = async (id, type) => {
        if (window.confirm("Unblock this servicer?")) {
            await unblockEmployee(id, type);
        }
    };

    const normalizedEmployees = (employees || [])
        .map(normalizeEmployee)
        .filter(Boolean)
        .filter(emp =>
            emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.phoneNo?.includes(searchTerm) ||
            emp.id?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const singleEmployees = normalizedEmployees.filter(e => e.typeKey === "single_employee");
    const multipleEmployees = normalizedEmployees.filter(e => e.typeKey === "multiple_employee");
    const toolshopEmployees = normalizedEmployees.filter(e => e.typeKey === "tool_shop");

    return (
        <AdminLayout>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Infrastructure Crew</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">Directory of authenticated platform servicers</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn-premium !w-auto !px-8">
                            <Mail size={18} />
                            <span>Invite Node</span>
                        </button>
                        <button className="btn-secondary-premium group !w-auto !px-8">
                            <FileDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
                            <span>Export Registry</span>
                        </button>
                    </div>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="SEARCH BY IDENTITY OR TELEMETRY..."
                        className="input-premium pl-14 uppercase !py-4 dark:bg-slate-900/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading && employees.length === 0 ? (
                    <div className="py-16 flex items-center justify-center">
                        <Loader />
                    </div>
                ) : normalizedEmployees.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-500">
                        No employees found matching your search.
                    </div>
                ) : (
                    <div className="space-y-10">
                        <EmployeeSection
                            title="Single Employees"
                            data={singleEmployees}
                            onBlock={handleBlock}
                            onUnblock={handleUnblock}
                        />
                        <EmployeeSection
                            title="Multiple Employee Teams"
                            data={multipleEmployees}
                            onBlock={handleBlock}
                            onUnblock={handleUnblock}
                        />
                        <EmployeeSection
                            title="Tool Shops"
                            data={toolshopEmployees}
                            onBlock={handleBlock}
                            onUnblock={handleUnblock}
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
