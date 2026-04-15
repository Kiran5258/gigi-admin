import { ClipboardList, Home, Plus, Settings, User, Image, Users, Layers, Layout, ShieldCheck, Box, TrendingUp, Tag, MessageSquare, AlertCircle, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSiderbar() {
  const { pathname } = useLocation();

  const menuGroups = [
    {
      label: "General",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: <Layout size={20} /> },
        { name: "Finance Hub", path: "/analytics", icon: <TrendingUp size={20} /> },
        { name: "Employees", path: "/employees", icon: <Users size={20} /> },
        { name: "Customers", path: "/users", icon: <User size={20} /> },
        { name: "Complaints", path: "/complaints", icon: <MessageSquare size={20} /> },
        { name: "Failed Bookings", path: "/failed-bookings", icon: <AlertCircle size={20} /> },
        { name: "Commission Wallet", path: "/commissions", icon: <DollarSign size={20} /> },
      ]
    },
    {
      label: "Catalog Management",
      items: [
        { name: "Services", path: "/services", icon: <ClipboardList size={20} /> },
        { name: "Parts", path: "/domainparts", icon: <Box size={20} /> },
        { name: "Service Domains", path: "/add-domain-service", icon: <Layers size={20} /> },
        { name: "Part Domains", path: "/add-domain-part", icon: <Plus size={20} /> },
        { name: "Service Catalog", path: "/add-service-list", icon: <Layout size={20} /> },
        { name: "Banners", path: "/manage-banner", icon: <Image size={20} /> },
        { name: "Coupons", path: "/coupons", icon: <Tag size={20} /> },
      ]
    },
    {
      label: "System",
      items: [

        { name: "Team Invitations", path: "/invite-admin", icon: <ShieldCheck size={20} /> },
        { name: "System Settings", path: "/settings", icon: <Settings size={20} /> },
      ]
    }
  ];

  return (
    <aside className="sidebar-premium scrollbar-hide">
      <div className="p-8 pb-4">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
            <Layout size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">GIGIMAN</h1>
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none">Admin Suite</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-8">
            <h3 className="px-10 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-4">
              {group.label}
            </h3>
            {group.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={isActive ? "sidebar-link-active" : "sidebar-link"}
                >
                  {item.icon}
                  <span className="truncate uppercase text-[11px] tracking-wider">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner">
          <img src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff" alt="admin" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-slate-900 dark:text-white truncate">SENDER ADMIN</p>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Now</p>
        </div>
      </div>
    </aside>
  );
}