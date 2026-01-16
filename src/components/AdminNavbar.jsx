// ...existing code...
import { useAuthStore } from "../store/useAuthStore";
import { Search } from "lucide-react";

export default function AdminNavbar() {
  const { logout, authUser } = useAuthStore();

  return (
    <div className="admin-navbar">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold text-slate-800">Gigiman Admin</div>

        <div className="hidden md:flex items-center bg-slate-50 rounded-lg px-3 py-1">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 text-sm w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600 hidden md:block">
          {authUser?.name || authUser?.email || ""}
        </div>

        <button
          onClick={logout}
          className="btn-ghost bg-red-50 text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}