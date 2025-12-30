import { ClipboardList, Home, Plus, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom"


export default function AdminSiderbar() {
    const { pathname } = useLocation();
    const menu = [
        { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
        { name: "Employee", path: "/employees", icon: <User size={20} /> },
        { name: "Services", path: "/services", icon: <ClipboardList size={20} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
        { name: "Add Domain", path: "/add-domain-service", icon: <Plus size={20} /> },
        { name: "Add Service", path: "/add-service-list", icon: <ClipboardList size={20} /> },
    ]
    return (
        <div className="w-60 h-screen bg-white shadow-md p-5 fixed left-0 top-0">
            <h2 className="text-xl font-bold text-blue-600 mb-5">Admin Panel</h2>
            <nav className="space-y-4">
                {menu.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 p-2 rounded-lg font-medium cursor-pointer
              ${pathname === item.path
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            }
            `}
                    >
                        {item.icon}
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    )
}
