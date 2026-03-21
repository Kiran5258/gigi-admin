import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Loader from "../components/Loader";
import { useDashboardStore } from "../store/useDashboardStore";
import {
    TrendingUp,
    DollarSign,
    Activity,
    Briefcase,
    Zap,
    BarChart3,
    Calendar,
    Layers,
    PieChart as PieIcon
} from "lucide-react";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    Cell,
    PieChart,
    Pie
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

export default function Analytics() {
    const { stats, loading, fetchStats } = useDashboardStore();
    const [timeframe, setTimeframe] = useState("monthly");

    useEffect(() => {
        if (!stats) fetchStats();
    }, [stats, fetchStats]);

    if (loading && !stats) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader />
                </div>
            </AdminLayout>
        );
    }

    const currentTrendData = stats?.trends?.[timeframe] || stats?.monthlyTrends || [];

    const timeframes = [
        { id: 'daily', label: 'Daily' },
        { id: 'weekly', label: 'Weekly' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' },
    ];

    return (
        <AdminLayout>
            <div className="max-w-[1600px] mx-auto space-y-10 pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-tighter">Finance Hub</h1>
                        <p className="text-slate-500 font-medium italic mt-1 flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
                            <TrendingUp size={14} className="text-indigo-500" /> Deep Analytics & Revenue Stream
                        </p>
                    </div>

                    <div className="flex p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        {timeframes.map((tf) => (
                            <button
                                key={tf.id}
                                onClick={() => setTimeframe(tf.id)}
                                className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${timeframe === tf.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detailed Comparison Chart */}
                <div className="card-premium !p-10 space-y-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Aggregate Revenue Matrix</h2>
                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Cross-sectional financial throughput</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Parts Revenue</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[500px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={currentTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    dy={20}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '24px', background: 'var(--surface-50)' }}
                                />
                                <Bar dataKey="serviceRevenue" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={30} />
                                <Bar dataKey="partRevenue" fill="#10b981" radius={[10, 10, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Growth Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="card-premium !p-10 space-y-8">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Revenue Distribution</h2>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={currentTrendData}>
                                    <defs>
                                        <linearGradient id="gCombined" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', background: 'var(--surface-50)' }} />
                                    <Area type="monotone" dataKey="totalRevenue" stroke="#8b5cf6" strokeWidth={4} fill="url(#gCombined)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="card-premium !p-8 flex flex-col justify-center items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/40 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <DollarSign size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Services</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">₹{stats?.revenueOverview?.totalServiceRevenue.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="card-premium !p-8 flex flex-col justify-center items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/40 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Zap size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Parts</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">₹{stats?.revenueOverview?.totalPartRevenue.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="card-premium !p-8 flex flex-col justify-center items-center text-center space-y-4 col-span-2">
                            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/40 rounded-3xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Activity size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Registry Capital</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1">₹{stats?.revenueOverview?.grandTotalRevenue.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
