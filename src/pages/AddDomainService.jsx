import { useState } from "react";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, Upload, Trash2, CheckCircle2 } from "lucide-react";
import Loader from "../components/Loader";

export default function AddDomainService() {
  const [domainName, setDomainName] = useState("");
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      toast.error("Sector name is required!");
      return;
    }

    if (!serviceImageFile) {
      toast.error("Visual branding image is required!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("domainName", domainName.trim());
      formData.append("serviceImage", serviceImageFile);

      await axiosInstance.post("/admin/add-domain-service", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Domain service initialized successfully!");
      navigate("/services");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to add domain service.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-[20px] shadow-sm transition-all group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Initialize Domain</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1">Define a new master service sector for the platform hierarchy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card-premium space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-indigo-600">
                  <Layers size={20} className="stroke-[3px]" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Domain Identity</h2>
                </div>

                <div className="space-y-4">
                  <label htmlFor="domainName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Service Sector Name
                  </label>
                  <input
                    id="domainName"
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="e.g. HOME MAINTENANCE, TECH SUPPORT..."
                    className="input-premium uppercase"
                  />
                  <p className="text-[10px] text-gray-400 font-medium italic px-2">Use concise, high-impact names for better visibility.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-indigo-600">
                  <Upload size={20} className="stroke-[3px]" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Visual Branding</h2>
                </div>

                <div className="h-80 w-full">
                  <ImageUpload handleImageChange={handleImageChange} preview={preview} />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-end gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setDomainName("");
                    setServiceImageFile(null);
                    setPreview("");
                  }}
                  className="btn-secondary-premium group"
                >
                  <Trash2 size={16} className="group-hover:text-rose-500 transition-colors" />
                  <span>Clear Entry</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium min-w-[200px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : "Initialize Domain"}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-8">
            <div className="card-premium !p-6 space-y-6 sticky top-8">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-4 flex items-center gap-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Live Preview
              </h3>

              <div className="rounded-[24px] overflow-hidden bg-gray-50 border border-gray-50 shadow-inner">
                <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <Layers size={48} className="text-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h4 className="text-white font-black uppercase text-sm tracking-widest truncate">
                      {domainName || "Domain Name"}
                    </h4>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Platform Ready</p>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-1/3"></div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-3xl p-6 border border-indigo-100/50 dark:border-indigo-900/30">
                <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-2 font-mono">Protocol Note</p>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  Domain initialization establishes the primary node in the catalog hierarchy. Ensure nomenclature is semantically precise.
                </p>
              </div>

              {preview && (
                <button
                  type="button"
                  onClick={() => { setPreview(""); setServiceImageFile(null); }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-rose-500 font-black uppercase text-[10px] tracking-widest border border-rose-100 rounded-xl hover:bg-rose-50 transition-all"
                >
                  <Trash2 size={14} /> Discard Image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
