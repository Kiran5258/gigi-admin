import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAuthStore } from "../store/useAuthStore";
import { Inputfield } from "../components/Inputfield";
import { toast } from "react-hot-toast";
import { UserPlus, Shield, Check, Copy, AlertCircle, Mail, ArrowRight } from "lucide-react";

const InviteAdmin = () => {
    const { inviteAdmin, getPermissions } = useAuthStore();
    const [email, setEmail] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [availablePermissions, setAvailablePermissions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [inviteResult, setInviteResult] = useState(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            const perms = await getPermissions();
            setAvailablePermissions(perms);
        };
        fetchPermissions();
    }, [getPermissions]);

    const handlePermissionChange = (perm) => {
        if (permissions.includes(perm)) {
            setPermissions(permissions.filter((p) => p !== perm));
        } else {
            setPermissions([...permissions, perm]);
        }
    };

    const toggleAllPermissions = () => {
        const allPerms = Object.values(availablePermissions);
        if (permissions.length === allPerms.length) {
            setPermissions([]);
        } else {
            setPermissions(allPerms);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Link copied to clipboard!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Email is required");
        if (permissions.length === 0) return toast.error("Please select at least one permission");

        setIsLoading(true);
        try {
            const result = await inviteAdmin({ email, permissions });
            setInviteResult(result);
            setEmail("");
            // keep permissions for next invite or clear? clearing for safety
            setPermissions([]);
            toast.success("Invite generated successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                            <UserPlus size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Onboard Administrator</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">Extend agency controls to new platform nodes</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Main Form Section */}
                    <div className="lg:col-span-3 space-y-8">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="relative group">
                                <label className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-3 px-1">
                                    <Mail size={14} className="text-indigo-500" />
                                    RECIPIENT EMAIL IDENTITY
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="Enter administrator email address..."
                                    className="input-premium !py-5 dark:bg-slate-950/40"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-6 px-1">
                                    <label className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                                        <Shield size={14} className="text-indigo-500" />
                                        ACCESS AUTHORIZATION LAYERS
                                    </label>
                                    <button
                                        type="button"
                                        onClick={toggleAllPermissions}
                                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 uppercase tracking-widest transition-colors"
                                    >
                                        {permissions.length === Object.keys(availablePermissions).length ? "SCRUB ALL" : "AUTHORIZE ALL"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(availablePermissions).map(([key, value]) => {
                                        const isActive = permissions.includes(value);
                                        return (
                                            <div
                                                key={value}
                                                onClick={() => handlePermissionChange(value)}
                                                className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 group
                                                    ${isActive
                                                        ? "bg-indigo-600 border-indigo-600 dark:border-indigo-400 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                                                        : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 text-slate-600 dark:text-slate-400"}`}
                                            >
                                                <span className="text-xs font-black uppercase tracking-widest truncate max-w-[140px]">
                                                    {key.replace(/_/g, " ").toLowerCase()}
                                                </span>
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all
                                                    ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40"}`}>
                                                    {isActive && <Check size={14} className="text-white stroke-[4px]" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-premium py-6 flex items-center justify-center gap-4 group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        AUTHORIZE & GENERATE TOKEN
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Sidebar / Info Section */}
                    <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-right-4 duration-500">
                        {inviteResult ? (
                            <div className="bg-emerald-600 dark:bg-emerald-500 text-white p-10 rounded-[40px] shadow-xl shadow-emerald-100 dark:shadow-none relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-white/20 p-3 rounded-2xl">
                                            <Check size={24} className="stroke-[3px]" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Access Token Ready</h3>
                                    </div>

                                    <p className="text-sm font-medium text-emerald-50 mb-8 leading-relaxed italic">
                                        An invitation token has been securely generated. Distribute this unique registry link to <span className="font-black underline decoration-2 underline-offset-4">{inviteResult.email}</span> to authorize registration.
                                    </p>

                                    <div className="bg-black/20 p-6 rounded-3xl mb-8 backdrop-blur-md border border-white/10 group relative">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">TELEMETRY LINK</p>
                                        <p className="text-xs font-mono break-all pr-12 overflow-hidden line-clamp-3 italic opacity-80">
                                            {window.location.origin}/signup-invite?token={inviteResult.token}&email={inviteResult.email}
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(`${window.location.origin}/signup-invite?token=${inviteResult.token}&email=${inviteResult.email}`)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>

                                    <p className="text-[10px] font-bold text-emerald-100/60 uppercase text-center italic">
                                        This link will expire in 24 hours
                                    </p>
                                </div>

                                {/* Abstract background patterns */}
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                            </div>
                        ) : (
                            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 p-8 rounded-3xl space-y-6">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                                    <AlertCircle size={20} />
                                    <h4 className="font-black uppercase text-xs tracking-[0.2em] font-mono">Security Protocol</h4>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic">Invited admins must use the provided email to register their account.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic">Permissions can be modified later from the System Settings panel.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic">Ensure internal compliance standards when granting master permissions.</p>
                                    </li>
                                </ul>
                            </div>
                        )}

                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all shadow-sm">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Active Administrators</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">08</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shadow-inner border border-slate-50 dark:border-slate-800">
                                <Shield size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default InviteAdmin;
