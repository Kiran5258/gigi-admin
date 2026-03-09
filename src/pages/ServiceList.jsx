import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import {
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Plus,
  Clock,
  Users,
  IndianRupee,
  LayoutGrid,
  Briefcase,
  ChevronRight,
  AlertCircle,
  Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";

const ServiceList = () => {
  const { domainServiceId } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!domainServiceId) return;
    setLoading(true);

    axiosInstance
      .get(`/auth/showsubservice/${domainServiceId}`)
      .then((res) => {
        const data = res.data;
        let list = [];

        if (Array.isArray(data?.services)) {
          list = data.services;
        } else if (Array.isArray(data?.service)) {
          list = data.service;
        } else if (data?.service) {
          list = [data.service];
        } else {
          console.error("Unknown API shape:", data);
          toast.error("Server returned invalid data");
          return;
        }

        setServices(list);
      })
      .catch((err) => {
        console.error("Failed to fetch service list:", err);
        toast.error("Failed to load services");
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, [domainServiceId, refreshKey]);

  const filteredServices = useMemo(() => {
    if (!q.trim()) return services;
    const term = q.toLowerCase();
    return services.map((svc) => ({
      ...svc,
      serviceCategory: (svc.serviceCategory || []).filter((c) =>
        (c.serviceCategoryName || "").toLowerCase().includes(term)
      ),
    }));
  }, [services, q]);

  const handleDeleteCategory = async (serviceId, categoryId) => {
    if (!window.confirm("Delete this category permanently?")) return;
    setDeleting(categoryId);

    try {
      await axiosInstance.delete(`/admin/delete-service-category/${serviceId}/${categoryId}`);
      setServices((prev) =>
        prev.map((s) =>
          s._id === serviceId
            ? { ...s, serviceCategory: (s.serviceCategory || []).filter((c) => c._id !== categoryId) }
            : s
        )
      );
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleEditCategory = (serviceId, categoryId) => {
    navigate(`/service-list/${serviceId}/category/${categoryId}/edit`);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 card-premium !p-10 animate-in fade-in duration-500">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Service Catalog</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">Manage specific service categories and pricing protocols</p>
            </div>
          </div>
          <Link
            to="/add-service-list"
            className="btn-premium !w-auto !px-10"
          >
            <Plus size={20} /> NEW RECORD
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="SEARCH CATALOG IDENTITY..."
              className="input-premium pl-14 uppercase !py-4 dark:bg-slate-950/40"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-8 px-8 py-4 card-premium !p-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Services</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{services.length}</span>
            </div>
            <div className="w-px h-6 bg-slate-100 dark:bg-slate-800"></div>
            <LayoutGrid size={20} className="text-slate-300 dark:text-slate-600" />
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader />
          </div>
        ) : services.length === 0 ? (
          <div className="card-premium !p-32 text-center border-dashed border-2 animate-in scale-in duration-500">
            <Briefcase size={64} className="mx-auto text-slate-100 dark:text-slate-800 mb-8" />
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No Node Data Detected</h3>
            <p className="text-xs text-slate-400 mt-4 font-medium italic">This domain hasn't initialized any base service protocols yet.</p>
            <Link to="/add-domain-service" className="mt-8 btn-secondary-premium !inline-flex !px-10">
              Initialize Domain Registry
            </Link>
          </div>
        ) : (
          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            {filteredServices.map((service) => (
              <div key={service._id} className="space-y-8">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-5">
                    <div className="w-1.5 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)]"></div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{service.serviceName}</h2>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-5 py-2 rounded-full uppercase tracking-widest shadow-sm">
                    {(service.serviceCategory || []).length} SUBLAYERS ACTIVE
                  </span>
                </div>

                {(!service.serviceCategory || service.serviceCategory.length === 0) ? (
                  <div className="bg-slate-50/30 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] p-20 text-center">
                    <p className="text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest italic mb-6">No registry components detected for this service node.</p>
                    <Link to="/add-service-list" className="btn-secondary-premium !inline-flex !px-8">
                      <Plus size={16} /> Assign Primary Component
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-2">
                    {service.serviceCategory.map((cat) => (
                      <div
                        key={cat._id}
                        className="group card-premium !p-0 overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col"
                      >
                        <div className="h-64 bg-white dark:bg-slate-950 relative overflow-hidden border-b border-slate-100 dark:border-slate-800 shadow-inner">
                          {cat.servicecategoryImage ? (
                            <img src={cat.servicecategoryImage} alt={cat.serviceCategoryName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-800">
                              <Briefcase size={80} strokeWidth={1} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                            <p className="text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                              <Calendar size={14} className="text-indigo-400 shadow-sm" />
                              LOG UPDATED: {cat.updatedAt ? new Date(cat.updatedAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-4 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {cat.serviceCategoryName}
                            </h3>
                            <div
                              className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 leading-relaxed italic"
                              dangerouslySetInnerHTML={{ __html: cat.description || "No manual transmission recorded for this component." }}
                            />

                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-3 rounded-2xl flex flex-col items-center justify-center border border-emerald-100 dark:border-emerald-800/40 shadow-sm">
                                <IndianRupee size={12} className="mb-1" />
                                <span className="text-xs font-black tracking-tighter">₹{cat.price || 0}</span>
                              </div>
                              <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 p-3 rounded-2xl flex flex-col items-center justify-center border border-indigo-100 dark:border-indigo-800/40 shadow-sm">
                                <Clock size={12} className="mb-1" />
                                <span className="text-xs font-black tracking-tighter">{cat.durationInMinutes || 0}m</span>
                              </div>
                              <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-3 rounded-2xl flex flex-col items-center justify-center border border-amber-100 dark:border-amber-800/40 shadow-sm">
                                <Users size={12} className="mb-1" />
                                <span className="text-xs font-black tracking-tighter">{cat.employeeCount || 0} NODES</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                            <button
                              onClick={() => handleEditCategory(service._id, cat._id)}
                              className="flex items-center gap-3 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all tracking-[0.2em]"
                            >
                              <Edit size={16} /> INSPECT RECORD
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(service._id, cat._id)}
                              disabled={deleting === cat._id}
                              className="text-slate-200 dark:text-slate-700 hover:text-rose-600 dark:hover:text-rose-500 transition-colors p-2"
                            >
                              {deleting === cat._id ? (
                                <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ServiceList;
