import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Search, Sun, Moon, LogOut } from "lucide-react";

export default function AdminNavbar() {
  const { logout, authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="admin-navbar">
      <div className="flex items-center gap-6">
        <div className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">
          GigiMan <span className="text-indigo-600">Admin</span>
        </div>

        <div className="hidden md:flex items-center bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 border border-slate-100 dark:border-slate-700 focus-within:border-indigo-500/30 transition-all shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Search Intelligence..."
            className="bg-transparent outline-none ml-3 text-sm w-72 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 shadow-sm border border-slate-100 dark:border-slate-700"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="flex flex-col items-end hidden sm:flex">
          <div className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
            {authUser?.name || "System Admin"}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {authUser?.role || "Console Access"}
          </div>
        </div>

        <button
          onClick={logout}
          className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all active:scale-95 group shadow-sm"
          title="Terminate Session"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}