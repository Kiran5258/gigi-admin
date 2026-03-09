import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import { Search, Plus, Trash2, Edit3, Eye, Package, ArrowLeft, MoreVertical, Layers } from "lucide-react";
import { toast } from "react-hot-toast";

const DomainpartsList = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/parts/showcategories`)
      .then((res) => {
        const list = res?.data?.categories || [];
        setParts(list);
      })
      .catch((err) => {
        console.error("Failed to fetch domain parts:", err);
        setParts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this domain part permanently?")) return;
    try {
      await axiosInstance.delete(`/admin/delete-domainpart/${id}`);
      setParts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Domain part deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return parts;
    const term = q.toLowerCase();
    return parts.filter((p) => {
      const name = (p.domainPartsName || p.domainpartname || p.domainPartName || p.name || "").toLowerCase();
      return name.includes(term);
    });
  }, [parts, q]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Domain Part</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1">Manage and organize service component categories</p>
            </div>
          </div>
          <Link
            to="/add-domain-part"
            className="btn-premium"
          >
            <Plus size={18} /> Add Component
          </Link>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="QUERY REGISTRY..."
              className="input-premium pl-14 uppercase !py-5 dark:bg-slate-900/50"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 px-8 py-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Registry Depth</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{parts.length}</span>
            </div>
            <div className="w-px h-6 bg-slate-100 dark:bg-slate-700"></div>
            <div className="flex items-center gap-2 text-indigo-500">
              <Layers size={18} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-premium !p-32 text-center animate-in fade-in zoom-in duration-500 border-dashed border-2">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-slate-200 dark:text-slate-700">
              <Package size={48} />
            </div>
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">No Components Detected</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 font-medium italic">Adjust query parameters or deploy new page nodes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
            {filtered.map((p) => {
              const name = p.domainpartname || p.domainPartsName || p.name || "Unnamed Component";
              const imageUrl = p.domainpartimage || null;

              return (
                <div key={p._id} className="card-premium !p-0 overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-500 flex flex-col bg-white dark:bg-slate-900">
                  {/* Image/Preview Section */}
                  <div className="h-56 bg-white dark:bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-50 dark:border-slate-800">
                    {imageUrl ? (
                      <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="text-slate-100 dark:text-slate-800 group-hover:text-indigo-50 dark:group-hover:text-indigo-900/30 transition-colors">
                        <Layers size={80} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 group-hover:opacity-100 opacity-0 transition-opacity">
                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-xl text-gray-400">
                        <MoreVertical size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 pb-10">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-indigo-100 dark:border-indigo-800">CATALOG NODE</span>
                        <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 font-mono">#{p._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{name}</h3>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800">
                      <Link
                        to={`/domainpart/${p._id}`}
                        className="p-4 bg-slate-50/50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </Link>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/edit-domain-part/${p._id}`}
                          className="p-4 bg-slate-50/50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
                          title="Edit Component"
                        >
                          <Edit3 size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-4 bg-rose-50/50 dark:bg-rose-900/20 text-rose-400 dark:text-rose-500 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-100 dark:border-rose-900/40 shadow-sm"
                          title="Delete Component"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div >
    </AdminLayout >
  );
};

export default DomainpartsList;
