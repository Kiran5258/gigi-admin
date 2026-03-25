import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Loader from "../components/Loader";

export default function EditDomain() {
  const { domainserviceId } = useParams();
  const navigate = useNavigate();

  const [domainName, setDomainName] = useState("");
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axiosInstance.get("/auth/services");
        const services = res.data.services || [];
        const svc = services.find((s) => s._id === domainserviceId);
        if (!svc) {
          toast.error("Domain service not found");
          navigate(-1);
          return;
        }

        setDomainName(svc.domainName || "");
        setPreview(svc.serviceImage || "");
      } catch (err) {
        console.error("Fetch service error:", err);
        toast.error("Failed to load domain service");
      } finally {
        setFetching(false);
      }
    };

    fetchService();
  }, [domainserviceId, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setServiceImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!domainName.trim()) {
      toast.error("Domain name is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("domainName", domainName.trim());
      if (serviceImageFile) {
        formData.append("serviceImage", serviceImageFile);
      }

      const adminToken = localStorage.getItem("token");

      await axiosInstance.put(
        `/admin/domainservice-edit/${domainserviceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Domain service updated successfully");
      navigate(-1);
    } catch (err) {
      console.error("EditDomain error:", err.response || err.message);
      const message = err?.response?.data?.message || "Failed to update domain service.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <Loader full={true} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Edit Domain Node</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">Update spectral identity and registry parameters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <div className="card-premium bg-white dark:bg-slate-900 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Domain Identity</label>
                <input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="e.g. PLUMBING, WEB DEVELOPMENT..."
                  className="input-premium uppercase dark:bg-slate-950/40"
                />
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-50 dark:border-slate-800">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Visual Branding Signature</label>
                <div className="h-80 w-full">
                  <ImageUpload handleImageChange={handleImageChange} preview={preview} />
                </div>
                <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 mt-2 italic uppercase tracking-widest">Spectral asset for registry representation.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-10">
            <div className="card-premium bg-white dark:bg-slate-900 space-y-8 h-fit">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Registry Actions</h3>
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full !py-6 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synchronizing...</span>
                    </>
                  ) : (
                    "Commit changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary-premium w-full !py-4"
                >
                  Cancel operation
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}