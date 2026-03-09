import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import AdminLayout from "../components/AdminLayout";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit3, Trash2, Layers, ChevronRight, Search } from "lucide-react";

export const Service = () => {
  const [domainService, setDomainService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/auth/services");
      setDomainService(res.data.services || []);
    } catch (err) {
      console.error("Service fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service domain?")) return;

    try {
      await axiosInstance.delete(`/admin/delete-domain-service/${id}`);
      setDomainService((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredServices = domainService.filter(s =>
    s.domainName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 card-premium !p-10 animate-in fade-in duration-500">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none animate-float">
              <Layers size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Service Domains</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">Manage top-level service categories and their underlying catalogs</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/add-domain-service")}
            className="btn-premium !w-auto !px-10"
          >
            <Plus size={20} /> Initialize Domain
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="FILTER DOMAINS BY NAME..."
              className="input-premium pl-14 uppercase !py-4 dark:bg-slate-950/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Global Domains</p>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{domainService.length}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] py-32 text-center">
            <Layers size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase">No Domains Found</h3>
            <p className="text-slate-400 mt-2 font-medium">Try adding a new service domain to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group card-premium !p-0 overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
                  <img
                    src={service.serviceImage || "/placeholder.png"}
                    alt={service.domainName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-indigo-600 dark:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-indigo-500/20">MASTER DOMAIN</span>
                      <span className="text-[10px] font-bold text-white/50 font-mono tracking-widest uppercase">NODE ACTIVE</span>
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight truncate">
                      {service.domainName}
                    </h3>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
                    Access and manage all sub-services, pricing models, and specialized categories for this domain.
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/auth/showsubservice/${service._id}`)}
                      className="flex items-center gap-2 group/btn text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-all font-black"
                    >
                      Explore Catalog <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/edit-domain-service/${service._id}`)}
                        className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all"
                        title="Edit Domain"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        onClick={() => deleteService(service._id)}
                        className="p-3 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-2xl transition-all"
                        title="Delete Domain"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
