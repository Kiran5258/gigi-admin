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

    const data=axiosInstance
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
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Add Service Category</h1>
            <p className="text-sm text-slate-500 mt-1">Create or attach a category to a service within a domain.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
            {/* DOMAIN */}
            <label className="text-sm text-slate-600 mb-2 block">Domain</label>
            <select
              name="DomainServiceId"
              value={form.DomainServiceId}
              onChange={(e) => {
                handleChange(e);
                // clear dependent fields
                setForm((prev) => ({ ...prev, serviceId: "", serviceName: "" }));
                setCategories([]);
              }}
              className="input-box"
            >
              <option value="">Select Domain</option>
              {domains.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.domainName}
                </option>
              ))}
            </select>

            {/* SERVICE SELECT / NEW */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.length > 0 ? (
                <div>
                  <label className="text-sm text-slate-600 mb-2 block">Choose Service</label>
                  <select
                    name="serviceId"
                    value={form.serviceId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => ({ ...prev, serviceId: value, serviceName: "" }));
                    }}
                    className="input-box"
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

              <div>
                <label className="text-sm text-slate-600 mb-2 block">
                  {services.length === 0 ? "Service Name" : "Or create new Service"}
                </label>
                <Inputfield
                  name="serviceName"
                  value={form.serviceName}
                  onChange={(e) => setForm((prev) => ({ ...prev, serviceName: e.target.value }))}
                  placeholder="New Service Name"
                />
              </div>
            </div>

            {/* EXISTING CATEGORIES */}
            {categories.length > 0 && (
              <div className="mt-4 bg-slate-50 p-3 rounded border">
                <p className="font-medium text-sm mb-2">Existing Categories</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {categories.map((c) => (
                    <span key={c._id} className="px-2 py-1 bg-white border rounded text-slate-700 shadow-xs">
                      {c.serviceCategoryName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* NEW CATEGORY */}
            <div className="mt-4">
              <label className="text-sm text-slate-600 mb-2 block">Category Name</label>
              <Inputfield
                name="serviceCategoryName"
                value={form.serviceCategoryName}
                onChange={handleChange}
                placeholder="e.g. Premium Wash"
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Inputfield
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
              />
              <Inputfield
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Duration (minutes)"
              />
              <Inputfield
                type="number"
                name="employeeCount"
                value={form.employeeCount}
                onChange={handleChange}
                placeholder="Employee Count"
              />
            </div>
          </div>

          <aside className="bg-white p-6 rounded-xl shadow space-y-4">
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Category Image</label>
              <div className="border border-dashed rounded p-3">
                <ImageUpload handleImageChange={handleImageChange} preview={preview} />
                <p className="text-xs text-slate-400 mt-2">PNG/JPG up to 2MB. Recommended 4:3 ratio.</p>
              </div>
              {preview && (
                <img src={preview} alt="preview" className="mt-3 w-full h-40 object-cover rounded-md border" />
              )}
            </div>

            <div>
              <p className="text-sm text-slate-600 mb-2">Preview</p>
              <div className="bg-slate-50 rounded p-3 text-sm text-slate-700">
                <div className="font-medium">{form.serviceCategoryName || "Category title"}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: form.description || "Short description" }} />
                <div className="mt-3 text-xs text-slate-500">Price: <span className="font-medium text-slate-700">₹{form.price || "-"}</span></div>
                <div className="text-xs text-slate-500">Duration: <span className="font-medium text-slate-700">{form.duration ? `${form.duration} min` : "-"}</span></div>
              </div>
            </div>

            <div className="pt-2">
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
                className="btn-ghost w-full"
              >
                Reset
              </button>

              <button
                disabled={loading}
                type="submit"
                className="btn-primary w-full mt-2"
              >
                {loading ? "Saving..." : "Add Category"}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </AdminLayout>
  );
}