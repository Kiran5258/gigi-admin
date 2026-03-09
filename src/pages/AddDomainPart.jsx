import { useState } from "react";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Box, Plus, Trash2, IndianRupee, Upload, Info } from "lucide-react";

export default function AddDomainPart() {
  const [domainName, setDomainName] = useState("");
  const [domainImage, setDomainImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([{ partName: "", price: "" }]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setDomainImage(reader.result);
      setPreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!domainName || !domainImage) {
      toast.error("Please provide a name and image");
      return;
    }

    const cleanedParts = (parts || [])
      .map((p) => ({ partName: (p.partName || "").trim(), price: Number(p.price) }))
      .filter((p) => p.partName && !isNaN(p.price));

    if (cleanedParts.length === 0) {
      toast.error("Please add at least one part with a valid price");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/admin/add-domainpart", {
        domainpartname: domainName,
        domainpartimage: domainImage,
        parts: cleanedParts,
      });

      toast.success("Inventory domain created safely!");
      navigate("/domainparts");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add domain part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        {/* Header */}
        <div className="flex items-center gap-6 card-premium !p-8">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-[24px] shadow-sm transition-all group border border-slate-100 dark:border-slate-800"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Provision Parts</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">Create a new domain for spare parts</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card-premium space-y-8">
            {/* Identity & Parts Section */}
            <div className="card-premium space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                  <Box size={20} className="stroke-[3px]" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Part Domain Identity</h2>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Domain Name</label>
                  <input
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="e.g. ELECTRICAL SPARES, AC COMPONENTS..."
                    className="input-premium uppercase dark:bg-slate-900/50"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                    <Plus size={20} className="stroke-[3px]" />
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">part Items</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setParts((s) => [...s, { partName: "", price: "" }])}
                    className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-800"
                  >
                    Add Row
                  </button>
                </div>

                <div className="space-y-4">
                  {parts.map((row, idx) => (
                    <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 items-center animate-in slide-in-from-left-4 duration-300">
                      <div className="flex-1 min-w-[200px] relative group">
                        <input
                          className="input-premium py-3 px-5 text-sm dark:bg-slate-900/50"
                          placeholder="Part Identifier"
                          value={row.partName}
                          onChange={(e) => {
                            const c = [...parts];
                            c[idx].partName = e.target.value;
                            setParts(c);
                          }}
                        />
                      </div>
                      <div className="w-full md:w-40 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase cursor-default">₹</div>
                        <input
                          className="input-premium py-3 pl-10 pr-5 text-sm font-black dark:bg-slate-900/50"
                          placeholder="Price"
                          type="number"
                          value={row.price}
                          onChange={(e) => {
                            const c = [...parts];
                            c[idx].price = e.target.value;
                            setParts(c);
                          }}
                        />
                      </div>
                      {parts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setParts((s) => s.filter((_, i) => i !== idx))}
                          className="p-3 text-rose-300 dark:text-rose-900 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary-premium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-premium min-w-[240px]"
              >
                {loading ? "Provisioning..." : "Initialize parts"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-10">
            {/* Visuals Section */}
            <div className="card-premium space-y-8">
              <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                <Upload size={20} className="stroke-[3px]" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Domain Visual</h2>
              </div>

              <div className="h-80 w-full">
                <ImageUpload handleImageChange={handleImageChange} preview={preview} />
              </div>

              <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-800 flex gap-4">
                <Info size={24} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest mb-1">Stock Logic</p>
                  <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 leading-relaxed italic">
                    All parts added here will be globally available across services associated with this domain. Ensure pricing is accurate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
