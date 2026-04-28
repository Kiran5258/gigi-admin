import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import RichEditor from "../components/RichEditor";
import { ArrowLeft, Box, Plus, Info, LayoutGrid, Clock, Users, IndianRupee } from "lucide-react";

export default function ManageCategory() {
  const { serviceId: paramServiceId, categoryId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(paramServiceId && categoryId);

  const [domains, setDomains] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    DomainServiceId: "",
    serviceId: paramServiceId || "",
    serviceName: "",
    serviceCategoryName: "",
    description: "",
    price: "",
    duration: "",
    employeeCount: "",
    image: null,
  });

  useEffect(() => {
    axiosInstance.get("/auth/services")
      .then((r) => setDomains(r.data.services || []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!form.DomainServiceId) return;
    axiosInstance.get(`/admin/service-categories/${form.DomainServiceId}`)
      .then((r) => setServices(r.data.services || []))
      .catch(() => setServices([]));
  }, [form.DomainServiceId]);
  useEffect(() => {
    if (!isEdit) return;

    setLoading(true);

    axiosInstance
      .get(`auth/service-list/${categoryId}`)
      .then((res) => {
        const data = res.data;

        setForm((p) => ({
          ...p,
          serviceId: paramServiceId,
          serviceName: data.serviceName || "",
          DomainServiceId: data.domainServiceId || "",
          serviceCategoryName: data.serviceCategory.serviceCategoryName || "",
          description: data.serviceCategory.description || "",
          price: data.serviceCategory.price || "",
          duration: data.serviceCategory.durationInMinutes || "",
          employeeCount: data.serviceCategory.employeeCount || "",
          image: data.serviceCategory.servicecategoryImage || null,
        }));

        setPreview(data.serviceCategory.servicecategoryImage || "");
      })
      .catch(() => {
        toast.error("Failed to load category");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [isEdit, categoryId, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) {
      setForm((p) => ({ ...p, image: null }));
      setImageFile(null);
      setPreview("");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({ ...p, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((p) => ({ ...p, image: null }));
    setImageFile(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceCategoryName || !form.description || !form.price || !form.duration || !form.employeeCount) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        const formData = new FormData();
        formData.append("serviceCategoryName", form.serviceCategoryName);
        formData.append("description", form.description);
        formData.append("price", Number(form.price));
        formData.append("durationInMinutes", Number(form.duration));
        formData.append("employeeCount", Number(form.employeeCount));
        
        if (imageFile) {
          formData.append("servicecategoryImage", imageFile);
        }

        await axiosInstance.put(
          `/admin/update-service-category/${paramServiceId}/${categoryId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        toast.success("Category updated");
      } else {
        await axiosInstance.post("/admin/add-service-list", {
          DomainServiceId: form.DomainServiceId,
          serviceId: form.serviceId || undefined,
          serviceName: form.serviceName || undefined,
          serviceCategoryName: form.serviceCategoryName,
          description: form.description,
          price: Number(form.price),
          durationInMinutes: Number(form.duration),
          employeeCount: Number(form.employeeCount),
          servicecategoryImage: form.image,
        });
        toast.success("Category created");
      }
      navigate(-1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex items-center gap-6 card-premium !p-8 animate-in fade-in duration-500">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{isEdit ? "Refine Category" : "Draft Category"}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1 uppercase tracking-widest text-[10px]">{isEdit ? "Update specification and pricing protocols" : "Initialize new registry component under a service node"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 card-premium space-y-10">
            {!isEdit && (
              <div className="space-y-8 pb-10 border-b border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                  <Box size={20} className="stroke-[3px]" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em]">Deployment Context</h2>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Domain Node</label>
                  <select
                    name="DomainServiceId"
                    value={form.DomainServiceId}
                    onChange={(e) => {
                      handleChange(e);
                      setForm((p) => ({ ...p, serviceId: "", serviceName: "" }));
                      setServices([]);
                    }}
                    className="input-premium uppercase dark:bg-slate-950/40"
                  >
                    <option value="">Select Domain Node</option>
                    {domains.map((d) => <option key={d._1d} value={d._id}>{d.domainName}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {services.length > 0 && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Sub-Service Layer</label>
                      <select
                        name="serviceId"
                        value={form.serviceId}
                        onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value, serviceName: "" }))}
                        className="input-premium uppercase dark:bg-slate-950/40"
                      >
                        <option value="">Select Service Layer</option>
                        {services.map((s) => <option key={s._id} value={s._id}>{s.serviceName}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{services.length ? "Alternative Node" : "Service Node Name"}</label>
                    <input
                      name="serviceName"
                      value={form.serviceName}
                      onChange={handleChange}
                      placeholder="INITIATE NEW SERVICE LAYER..."
                      className="input-premium uppercase dark:bg-slate-950/40"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Category Identifier</label>
                <input
                  name="serviceCategoryName"
                  value={form.serviceCategoryName}
                  onChange={handleChange}
                  placeholder="e.g. PREMIUM HYDRAULIC FLUID..."
                  className="input-premium uppercase dark:bg-slate-950/40"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Protocol Specifications</label>
                <div className="rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800">
                  <RichEditor value={form.description} onChange={(html) => setForm((p) => ({ ...p, description: html }))} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Pricing (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="input-premium dark:bg-slate-950/40 font-black" placeholder="0" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Duration (M)</label>
                  <input type="number" name="duration" value={form.duration} onChange={handleChange} className="input-premium dark:bg-slate-950/40 font-black" placeholder="0" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nodes Required</label>
                  <input type="number" name="employeeCount" value={form.employeeCount} onChange={handleChange} className="input-premium dark:bg-slate-950/40 font-black" placeholder="0" />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="card-premium space-y-8">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Visual Spectral Identity</label>
              <div className="h-64 w-full">
                <ImageUpload handleImageChange={handleImageChange} preview={preview} onRemove={handleRemoveImage} />
              </div>
              <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 italic uppercase tracking-widest">Spectral asset for 4:3 catalog representation.</p>
            </div>

            <div className="card-premium space-y-8">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Live Preview</h3>
              <div className="bg-slate-50/50 dark:bg-slate-950/40 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-inner">
                <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xl mb-3">{form.serviceCategoryName || "NODE IDENTITY"}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic mb-6 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: form.description || "Transmitting specification data..." }} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                    <IndianRupee size={14} />
                    <span className="text-lg tracking-tighter">₹{form.price || "0"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500 font-black text-[10px] uppercase">
                    <Clock size={14} />
                    {form.duration || "0"}m protocol
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button type="submit" disabled={loading} onClick={handleSubmit} className="btn-premium w-full !py-6">
                  {loading ? (isEdit ? "SYNCHRONIZING..." : "INITIATING...") : (isEdit ? "COMMIT CHANGES" : "INITIALIZE CATEGORY")}
                </button>
                <button type="button" onClick={() => navigate(-1)} className="btn-secondary-premium w-full !py-4">Cancel</button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </AdminLayout>
  );
}