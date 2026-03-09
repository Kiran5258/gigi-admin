import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { ArrowLeft, Edit3, Trash2, Layers, Package, Clock, IndianRupee, Info, Plus, ChevronRight } from "lucide-react";

const DomainpartDetail = () => {
  const { DomainpartId } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!DomainpartId) return;
    setLoading(true);
    axiosInstance
      .get(`/parts/showpart/${DomainpartId}`)
      .then((res) => {
        setDomain(res?.data?.domain || res?.data || null);
      })
      .catch((err) => {
        console.error("Failed to fetch domain part:", err);
        setDomain(null);
      })
      .finally(() => setLoading(false));
  }, [DomainpartId]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this domain part permanently?")) return;
    try {
      await axiosInstance.delete(`/admin/delete-domainpart/${DomainpartId}`);
      toast.success("Domain part deleted successfully");
      navigate("/domainparts");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/domainparts')}
              className="p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Registry Detail</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">In-depth view of domain part specifications</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={`/edit-domain-part/${DomainpartId}`}
              className="btn-secondary-premium !py-4"
            >
              <Edit3 size={18} /> Edit parameters
            </Link>
            <button
              onClick={handleDelete}
              className="px-8 py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-500 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all flex items-center gap-2 border border-rose-100 dark:border-rose-900/50 shadow-sm shadow-rose-100 dark:shadow-none"
            >
              <Trash2 size={18} /> Delete node
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader />
          </div>
        ) : !domain ? (
          <div className="card-premium !p-32 text-center border-dashed border-2">
            <Info size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-8" />
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Component Not Detected</h3>
            <button
              onClick={() => navigate('/domainparts')}
              className="mt-6 text-indigo-600 dark:text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:underline"
            >
              Return to Inventory Registry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Basic Info & Image */}
            <div className="lg:col-span-1 space-y-8 animate-in slide-in-from-left-8 duration-700">
              <div className="card-premium !p-0 overflow-hidden">
                <div className="h-72 bg-white dark:bg-slate-950 flex items-center justify-center border-b border-slate-50 dark:border-slate-800">
                  {domain.domainpartimage ? (
                    <img src={domain.domainpartimage} alt={domain.domainpartname} className="w-full h-full object-cover" />
                  ) : (
                    <Layers size={100} className="text-slate-100 dark:text-slate-900" strokeWidth={1} />
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-indigo-100 dark:border-indigo-800">PRODUCT COMPONENT</span>
                    <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 font-mono">#{domain._id?.slice(-8).toUpperCase()}</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase leading-tight mb-3">
                    {domain.domainpartname || domain.domainPartsName || "Unnamed Component"}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest">
                    <Package size={14} className="text-indigo-500" />
                    Physical Inventory Item
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 dark:bg-indigo-900/60 rounded-[40px] p-10 text-white shadow-xl shadow-indigo-100 dark:shadow-none relative overflow-hidden border border-indigo-500/20">
                <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-6">Telemetry & Metrics</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <span className="text-sm font-bold uppercase tracking-widest text-indigo-100">Sub-Registry Units</span>
                      <span className="text-3xl font-black">{domain.parts?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold uppercase tracking-widest text-indigo-100">Average Valuation</span>
                      <span className="text-3xl font-black">
                        ₹{domain.parts?.length
                          ? Math.round(domain.parts.reduce((acc, curr) => acc + (curr.price || 0), 0) / domain.parts.length).toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Layers size={150} className="rotate-12" />
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions & Sub-parts */}
            <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-right-8 duration-700">
              <div className="card-premium !p-12">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 dark:text-indigo-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                    <Info size={16} />
                  </div>
                  System Specification
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  {domain.description ? (
                    <div className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic" dangerouslySetInnerHTML={{ __html: domain.description }} />
                  ) : (
                    <p className="text-slate-400 dark:text-slate-600 italic font-medium">No transmission data received for this component signature.</p>
                  )}
                </div>
              </div>

              <div className="card-premium !p-12">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 dark:text-indigo-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <Layers size={16} />
                    </div>
                    Registry Sub-nodes
                  </h3>
                  {domain.parts?.length > 0 && (
                    <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 shadow-sm">
                      {domain.parts.length} NODES ACTIVE
                    </span>
                  )}
                </div>

                {Array.isArray(domain.parts) && domain.parts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {domain.parts.map((p, idx) => (
                      <div key={p._id || idx} className="group p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-50 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-100/30 dark:hover:shadow-none hover:-translate-y-2 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm border border-slate-100 dark:border-slate-600">
                            <Package size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{p.partName}</h4>
                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Authorized Unit</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-black text-xl">
                            <span className="text-xs mr-0.5">₹</span>
                            {p.price?.toLocaleString() || 0}
                          </div>
                          <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-50 dark:bg-slate-950/50 rounded-[40px] border border-dashed border-slate-100 dark:border-slate-800">
                    <Package size={40} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No Sub-node Registry Detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DomainpartDetail;
