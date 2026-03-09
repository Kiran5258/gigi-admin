import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import Loader from "../components/Loader";
import { useDashboardStore } from "../store/useDashboardStore";
import {
  Users,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Download,
  CreditCard,
  Clock,
  Zap,
  MapPin,
  Briefcase,
  Trophy,
  PieChart as PieIcon,
  BarChart3
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, liveBookings, loading, fetchStats, fetchLiveBookings, exportData } = useDashboardStore();

  useEffect(() => {
    fetchStats();
    fetchLiveBookings();

    const timer = setInterval(() => {
      fetchLiveBookings();
    }, 30000);

    return () => clearInterval(timer);
  }, [fetchStats, fetchLiveBookings]);

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Service Revenue",
      value: `₹${stats?.revenueOverview?.totalServiceRevenue?.toLocaleString() || 0}`,
      icon: <Briefcase />,
      trend: "+12.5%",
      positive: true,
      color: "indigo"
    },
    {
      title: "Part Sales",
      value: `₹${stats?.revenueOverview?.totalPartRevenue?.toLocaleString() || 0}`,
      icon: <Zap />,
      trend: "+8.2%",
      positive: true,
      color: "emerald"
    },
    {
      title: "Grand Revenue",
      value: `₹${stats?.revenueOverview?.grandTotalRevenue?.toLocaleString() || 0}`,
      icon: <DollarSign />,
      trend: "+10.1%",
      positive: true,
      color: "amber"
    },
    {
      title: "Live Bookings",
      value: stats?.counts?.totalBookings || 0,
      icon: <Activity />,
      trend: "Operational",
      positive: true,
      color: "rose"
    },
    {
      title: "Platform Base",
      value: stats?.counts?.userCount || 0,
      icon: <Users />,
      trend: "+24.3%",
      positive: true,
      color: "violet",
      path: "/users"
    },
  ];

  const distributionData = stats?.statusDistribution?.map(s => ({
    name: s._id,
    value: s.count
  })) || [];

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Admin Console</h1>
            <p className="text-slate-500 font-medium italic mt-1 flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" /> System throughput and economic velocity overview
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Global Status: Operational</span>
            </div>
            <button
              onClick={exportData}
              className="btn-secondary-premium group"
            >
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              <span>Generate Log</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statCards.map((card, i) => (
            <div
              key={i}
              onClick={() => card.path && navigate(card.path)}
              className={`card-premium !p-6 flex flex-col justify-between h-44 cursor-pointer group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all ${card.path ? '' : 'cursor-default'}`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-[22px] bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100 dark:border-slate-700`}>
                  {React.cloneElement(card.icon, { size: 24, strokeWidth: 2.5 })}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${card.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {card.trend}
                  {card.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{card.title}</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Row - Separated Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Service Revenue Chart */}
          <div className="card-premium !p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">Service Velocity</h2>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 italic">Core service revenue throughput</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Services</span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyTrends || []}>
                  <defs>
                    <linearGradient id="gIndigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '20px', background: 'var(--surface-50)', color: 'var(--text-main)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="serviceRevenue"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fill="url(#gIndigo)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Part Revenue Chart */}
          <div className="card-premium !p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">Equipment Yield</h2>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 italic">Hardware and components liquidation</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">In Stock</span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyTrends || []}>
                  <defs>
                    <linearGradient id="gEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '20px', background: 'var(--surface-50)', color: 'var(--text-main)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="partRevenue"
                    stroke="#10b981"
                    strokeWidth={4}
                    fill="url(#gEmerald)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Status Distribution Row - Moved Under */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 card-premium !p-8 flex flex-col items-center gap-6">
            <div className="w-full">
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-1">Status Allocation</h2>
              <p className="text-xs font-medium text-gray-400 italic">Protocol state distribution</p>
            </div>

            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{stats?.counts?.totalBookings || 0}</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            {distributionData.slice(0, 8).map((entry, index) => (
              <div key={index} className="card-premium !p-8 flex flex-col justify-between hover:border-indigo-200 dark:hover:border-indigo-500/30 duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] truncate">{entry.name}</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{entry.value}</span>
                  <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase mt-2 tracking-widest">Confirmed Registry</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Terminal & Crew Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Live Feed */}
          <div className="card-premium !p-0 overflow-hidden flex flex-col h-[500px]">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]"></span>
                  Operational Stream
                </h2>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 italic mt-1 uppercase tracking-widest">Active session protocol</p>
              </div>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">Live Socket</span>
            </div>

            <div className="flex-1 overflow-auto divide-y divide-slate-50 dark:divide-slate-800 custom-scrollbar p-4 space-y-2">
              {liveBookings.length > 0 ? (
                liveBookings.map((booking) => (
                  <div key={booking._id} className="p-5 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-50 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 rounded-2xl transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <Zap size={22} className="stroke-[2.5px]" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-tight">{booking.user?.fullName || "Ghost User"}</h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                          <Briefcase size={12} className="text-indigo-500" />
                          {booking.serviceCategoryName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.1em] bg-indigo-50 px-3 py-1 rounded-full mb-2">
                        {booking.status}
                      </div>
                      <div className="text-[10px] text-gray-400 font-black flex items-center justify-end gap-1.5 uppercase tracking-widest">
                        <Clock size={12} />
                        {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 opacity-50">
                  <Activity size={48} className="stroke-[1px]" />
                  <p className="text-sm font-black uppercase tracking-widest">No active protocols</p>
                </div>
              )}
            </div>
          </div>

          {/* Crew Distribution */}
          <div className="bg-indigo-600 rounded-[40px] p-10 shadow-2xl text-white relative overflow-hidden flex flex-col h-[500px]">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Infrastructure Crew</h2>
                <p className="text-indigo-100/70 font-medium italic">Human capital distribution network</p>
              </div>

              <div className="flex-1 space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-[0.2em] text-indigo-200/80">
                    <div className="flex items-center gap-3">
                      <Users size={16} />
                      <span>Enterprise Servicers</span>
                    </div>
                    <span className="text-xl text-white">{stats?.counts?.multipleEmployee || 0} Units</span>
                  </div>
                  <div className="w-full bg-indigo-900/40 h-3 rounded-full overflow-hidden border border-indigo-500/20">
                    <div
                      className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-1000"
                      style={{ width: `${(stats?.counts?.multipleEmployee / (stats?.counts?.totalemp || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-[0.2em] text-indigo-200/80">
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} />
                      <span>Independent Contractors</span>
                    </div>
                    <span className="text-xl text-white">{stats?.counts?.singleEmployee || 0} Units</span>
                  </div>
                  <div className="w-full bg-indigo-900/40 h-3 rounded-full overflow-hidden border border-indigo-500/20">
                    <div
                      className="h-full bg-indigo-400 transition-all duration-1000"
                      style={{ width: `${(stats?.counts?.singleEmployee / (stats?.counts?.totalemp || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-[0.2em] text-indigo-200/80">
                    <div className="flex items-center gap-3">
                      <MapPin size={16} />
                      <span>Logistics Centers</span>
                    </div>
                    <span className="text-xl text-white">{stats?.counts?.toolShop || 0} Units</span>
                  </div>
                  <div className="w-full bg-indigo-900/40 h-3 rounded-full overflow-hidden border border-indigo-500/20">
                    <div
                      className="h-full bg-white/20 transition-all duration-1000"
                      style={{ width: `${(stats?.counts?.toolShop / (stats?.counts?.totalemp || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-indigo-500/30 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-indigo-200/60 uppercase tracking-[0.3em] mb-1">Aggregate Network</p>
                  <span className="text-5xl font-black tracking-tighter">{stats?.counts?.totalemp || 0}</span>
                </div>
                <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                  <TrendingUp size={24} className="text-indigo-200" />
                </div>
              </div>
            </div>

            {/* Cyber Background Patterns */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
