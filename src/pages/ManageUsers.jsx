import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader';
import { useUserStore } from '../store/useUserStore';
import { Search, Mail, User as UserIcon, ShieldAlert, ShieldCheck, Phone, MapPin, Calendar, ExternalLink, ArrowRight } from 'lucide-react';

export default function ManageUsers() {
    const { users, loading, fetchUsers } = useUserStore();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = (users || []).filter(u =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phoneNo?.includes(searchTerm)
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">User Registry</h1>
                        <p className="text-slate-500 font-medium italic mt-1">Directory of {users.length} authenticated platform operators</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH BY IDENTITY OR TELEMETRY..."
                            className="input-premium pl-12 uppercase !py-4 dark:bg-slate-900/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading && users.length === 0 ? (
                    <div className="py-40 flex justify-center">
                        <Loader />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="card-premium !p-20 text-center animate-pulse border-dashed border-2 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700">
                            <UserIcon size={40} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching records found</h3>
                            <p className="text-xs text-slate-400 mt-2 font-medium italic">Try adjusting your search parameters.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredUsers.map((user) => (
                            <div key={user._id} className="card-premium !p-0 overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-500 flex flex-col bg-white dark:bg-slate-900">
                                {/* Top Banner/Avatar Section */}
                                <div className="h-24 bg-white dark:bg-slate-800/20 group-hover:bg-indigo-50/30 dark:group-hover:bg-indigo-950/20 transition-colors relative border-b border-slate-50 dark:border-slate-800">
                                    <div className="absolute -bottom-10 left-8">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="" className="w-20 h-20 rounded-3xl object-cover ring-8 ring-white dark:ring-slate-900 shadow-xl shadow-indigo-100/50 dark:shadow-black/20" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-3xl shadow-xl shadow-indigo-100 dark:shadow-black/40 ring-8 ring-white dark:ring-slate-900 transition-transform duration-500 group-hover:rotate-6 border border-slate-100 dark:border-slate-800">
                                                {user.fullName?.[0] || "?"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-6 right-8">
                                        <span className="bg-white/90 dark:bg-slate-800 backdrop-blur-md text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] uppercase font-black border border-white dark:border-slate-700 tracking-widest shadow-sm">
                                            {user.role || "Operator"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 pt-14 flex-1 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase truncate">
                                            {user.fullName || "Gigi Entity"}
                                        </h3>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                            Verified Signature
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/20 group-hover:bg-white dark:group-hover:bg-slate-800/60 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                <Phone size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Telemetry Line</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{user.phoneNo || "N/A"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/20 group-hover:bg-white dark:group-hover:bg-slate-800/60 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                <MapPin size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Geoloc Node</p>
                                                <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic truncate pr-2">{user.address || "Unassigned Zone"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/20 group-hover:bg-white dark:group-hover:bg-slate-800/60 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                <Calendar size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Activation Epoch</p>
                                                <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 pt-0 mt-auto">
                                    <button
                                        onClick={() => navigate(`/user-history/${user._id}`)}
                                        className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white hover:border-indigo-600 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/40 transition-all flex items-center justify-center gap-3"
                                    >
                                        Inspect History <ArrowRight size={14} className="stroke-[3px]" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
