import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import RichEditor from "../components/RichEditor";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";

export default function AddServiceList() {
  const [domains, setDomains] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    DomainServiceId: "",
    serviceId: "",
    serviceName: "",
    serviceCategoryName: "",
    description: "",
    price: "",
    duration: "",
    employeeCount: "",
    image: null,
  });

  /* ================= FETCH DOMAINS ================= */
  useEffect(() => {
    axiosInstance
      .get("/auth/services")
      .then((res) => setDomains(res.data.services || []))
      .catch(() => toast.error("Failed to load domains"));
  }, []);

  /* ================= FETCH SERVICES BY DOMAIN ================= */
  useEffect(() => {
    if (!form.DomainServiceId) {
      setServices([]);
      return;
    }

    const data = axiosInstance
      .get(`/admin/service-categories/${form.DomainServiceId}`)
      .then((res) => setServices(res.data.services || []))
      .catch(() => setServices([]));
    console.log(data);
  }, [form.DomainServiceId]);

  /* ================= FETCH CATEGORIES BY SERVICE ================= */
  useEffect(() => {
    if (!form.serviceId) {
      setCategories([]);
      return;
    }

    axiosInstance
      .get(`/auth/show-subservices/${form.serviceId}`)
      .then((res) => setCategories(res.data.serviceCategory || []))
      .catch(() => setCategories([]));
  }, [form.serviceId]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNewService = !form.serviceId;

    if (
      (isNewService && !form.serviceName) ||
      !form.serviceCategoryName ||
      !form.description ||
      !form.price ||
      !form.duration ||
      !form.employeeCount
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        DomainServiceId: form.DomainServiceId,
        serviceId: form.serviceId || undefined,
        serviceName: isNewService ? form.serviceName : undefined,
        serviceCategoryName: form.serviceCategoryName,
        description: form.description,
        price: Number(form.price),
        durationInMinutes: Number(form.duration),
        employeeCount: Number(form.employeeCount),
        servicecategoryImage: form.image,
      };

      await axiosInstance.post("/admin/add-service-list", payload);

      toast.success(
        isNewService
          ? "New service created successfully"
          : "Category added to service"
      );

      setForm({
        DomainServiceId: "",
        serviceId: "",
        serviceName: "",
        serviceCategoryName: "",
        description: "",
        price: "",
        duration: "",
        employeeCount: "",
        image: null,
      });

      setPreview("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Provision Service Node</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1">Create or attach a category to a service within a domain.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-premium space-y-8 bg-white dark:bg-slate-900">
            {/* DOMAIN */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Domain Node</label>
              <select
                name="DomainServiceId"
                value={form.DomainServiceId}
                onChange={(e) => {
                  handleChange(e);
                  // clear dependent fields
                  setForm((prev) => ({ ...prev, serviceId: "", serviceName: "" }));
                  setCategories([]);
                }}
                className="input-premium uppercase dark:bg-slate-900/50"
              >
                <option value="">Select Domain</option>
                {domains.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.domainName}
                  </option>
                ))}
              </select>
            </div>

            {/* SERVICE SELECT / NEW */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.length > 0 ? (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Choose Service</label>
                  <select
                    name="serviceId"
                    value={form.serviceId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => ({ ...prev, serviceId: value, serviceName: "" }));
                    }}
                    className="input-premium uppercase dark:bg-slate-900/50"
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.serviceName}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                  {services.length === 0 ? "Service Name" : "Or create new Service"}
                </label>
                <input
                  name="serviceName"
                  value={form.serviceName}
                  onChange={(e) => setForm((prev) => ({ ...prev, serviceName: e.target.value }))}
                  placeholder="NEW SERVICE IDENTIFIER"
                  className="input-premium uppercase dark:bg-slate-900/50"
                />
              </div>
            </div>

            {/* EXISTING CATEGORIES */}
            {categories.length > 0 && (
              <div className="mt-6 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Existing Registry Categories</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {categories.map((c) => (
                    <span key={c._id} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-widest shadow-sm">
                      {c.serviceCategoryName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* NEW CATEGORY */}
            <div className="mt-8 space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Category Identifier</label>
              <input
                name="serviceCategoryName"
                value={form.serviceCategoryName}
                onChange={handleChange}
                placeholder="E.G. PREMIUM WASH, LASER ALIGNMENT..."
                className="input-premium uppercase dark:bg-slate-900/50"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-4">
              <label className="text-sm text-slate-600 mb-2 block">Description</label>
              <RichEditor
                value={form.description}
                onChange={(html) => setForm((prev) => ({ ...prev, description: html }))}
              />
            </div>

            {/* NUMBERS */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Valuation (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="PRICE"
                  className="input-premium font-black dark:bg-slate-900/50"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tempo (MIN)</label>
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="DURATION"
                  className="input-premium font-black dark:bg-slate-900/50"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Crew Size</label>
                <input
                  type="number"
                  name="employeeCount"
                  value={form.employeeCount}
                  onChange={handleChange}
                  placeholder="COUNT"
                  className="input-premium font-black dark:bg-slate-900/50"
                />
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="card-premium space-y-6">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">Category Visualization</label>
              <div className="h-64 w-full">
                <ImageUpload handleImageChange={handleImageChange} preview={preview} />
              </div>
              <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 italic">Visual asset optimized for 4:3 catalog representation.</p>
            </div>

            <div className="card-premium space-y-6 bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Deployment Preview</p>
              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl p-6 text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg mb-2">{form.serviceCategoryName || "UNCATEGORIZED"}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: form.description || "No transmission data provided..." }} />

                <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valuation</div>
                    <div className="font-black text-indigo-600 dark:text-indigo-400">₹{form.price || "0.00"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tempo</div>
                    <div className="font-black text-slate-900 dark:text-white">{form.duration ? `${form.duration} MIN` : "-"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full !py-5"
              >
                {loading ? "SYNCHRONIZING..." : "PROVISION CATEGORY"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({
                    DomainServiceId: "",
                    serviceId: "",
                    serviceName: "",
                    serviceCategoryName: "",
                    description: "",
                    price: "",
                    duration: "",
                    employeeCount: "",
                    image: null,
                  });
                  setPreview("");
                }}
                className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-rose-500 transition-colors py-2"
              >
                Reset Parameters
              </button>
            </div>
          </aside>
        </form>
      </div>
    </AdminLayout>
  );
}