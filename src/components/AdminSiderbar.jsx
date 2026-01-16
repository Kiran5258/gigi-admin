// ...existing code...
import { ClipboardList, Home, Plus, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSiderbar() {
  const { pathname } = useLocation();
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { name: "Employee", path: "/employees", icon: <User size={18} /> },
    { name: "Services", path: "/services", icon: <ClipboardList size={18} /> },
    { name: "Add Domain", path: "/add-domain-service", icon: <Plus size={18} /> },
    { name: "Add Service", path: "/add-service-list", icon: <ClipboardList size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">Gigiman</div>
      <nav className="px-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-md mb-1 text-sm ${pathname === item.path ? "active" : ""}`}
          >
            {item.icon}
            <span className="truncate-2">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}