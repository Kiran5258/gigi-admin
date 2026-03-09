import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import { toast } from "react-hot-toast";
import { ArrowLeft, Box, Plus, Trash2, IndianRupee, Layers } from "lucide-react";

export default function EditDomainPart() {
  const { DomainpartId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [existingParts, setExistingParts] = useState([]);
  const [newParts, setNewParts] = useState([{ partName: "", price: "" }]);

  useEffect(() => {
    if (!DomainpartId) return;
    setLoading(true);
    axiosInstance
      .get(`/parts/showpart/${DomainpartId}`)
      .then((res) => {
        const d = res?.data?.domain || res?.data || null;
        if (d) {
          setName(d.domainpartname || "");
          setPreview(d.domainpartimage || d.domainPartImage || d.image || "");
          setExistingParts(Array.isArray(d.parts) ? d.parts : []);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load domain part");
      })
      .finally(() => setLoading(false));
  }, [DomainpartId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setPreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { domainpartname: name };
      if (imageBase64) payload.domainpartimage = imageBase64;

      // prepare parts: only send valid new parts that are not duplicates of existing parts
      const existingLower = new Set(existingParts.map((p) => (p.partName || "").toLowerCase()));
      const validNewParts = newParts
        .map((p) => ({ partName: (p.partName || "").trim(), price: Number(p.price) }))
        .filter((p) => p.partName && !isNaN(p.price));

      const partsToSend = validNewParts.filter((p) => !existingLower.has(p.partName.toLowerCase()));
      if (partsToSend.length > 0) payload.parts = partsToSend;

      await axiosInstance.put(`/admin/domainpart/${DomainpartId}`, payload);
      toast.success("Domain part updated");
      navigate(`/domainpart/${DomainpartId}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto"><Loader full /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        {/* Header */}
        <div className="flex items-center gap-6 card-premium !p-8 animate-in fade-in duration-500">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Edit Domain Node</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">Modify page parameters and registry items</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <div className="card-premium space-y-8">
              <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                <Box size={20} className="stroke-[3px]" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Deployment Identity</h2>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Domain Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium uppercase dark:bg-slate-900/50"
                  placeholder="DOMAIN IDENTIFIER"
                />
              </div>

              <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-4 block italic">Visualization Signature</label>
                <div className="h-72 w-full">
                  <ImageUpload handleImageChange={handleImageChange} preview={preview} />
                </div>
                <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 mt-5 italic uppercase tracking-widest">Leave empty to maintain existing spectral identity.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="card-premium space-y-8">
              <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                <Layers size={20} className="stroke-[3px]" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Active Registry</h2>
              </div>

              {existingParts.length === 0 ? (
                <div className="p-10 bg-slate-50/50 dark:bg-slate-900/50 rounded-[32px] border border-dashed border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Registry Null</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {existingParts.map((p, idx) => (
                    <div key={p._id || idx} className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <div className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-1">PART NODE</div>
                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.partName}</div>
                      </div>
                      <div className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">₹{p.price}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-premium space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                  <Plus size={20} className="stroke-[3px]" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Expansion Slot</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setNewParts((s) => [...s, { partName: "", price: "" }])}
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-800"
                >
                  Append
                </button>
              </div>

              <div className="space-y-4">
                {newParts.map((row, idx) => (
                  <div key={idx} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 relative group animate-in slide-in-from-left-4 duration-300">
                    <input
                      className="input-premium py-3 px-4 text-xs font-bold dark:bg-slate-900/50"
                      placeholder="NEW PART IDENTIFIER"
                      value={row.partName}
                      onChange={(e) => {
                        const copy = [...newParts];
                        copy[idx].partName = e.target.value;
                        setNewParts(copy);
                      }}
                    />
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</div>
                      <input
                        className="input-premium py-3 pl-10 pr-4 text-xs font-black dark:bg-slate-900/50"
                        placeholder="VALUATION"
                        type="number"
                        value={row.price}
                        onChange={(e) => {
                          const copy = [...newParts];
                          copy[idx].price = e.target.value;
                          setNewParts(copy);
                        }}
                      />
                    </div>
                    {newParts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setNewParts((s) => s.filter((_, i) => i !== idx))}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex items-center justify-end gap-6 pt-6">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary-premium">Cancel</button>
            <button type="submit" disabled={saving} className="btn-premium min-w-[200px]">
              {saving ? "SYNCHRONIZING..." : "SAVE PARAMETERS"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
