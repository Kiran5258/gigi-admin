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
    axiosInstance.get("/auth/services")
      .then(res => setDomains(res.data.services || []))
      .catch(() => toast.error("Failed to load domains"));
  }, []);

  /* ================= FETCH SERVICES BY DOMAIN ================= */
  useEffect(() => {
    if (!form.DomainServiceId) {
      setServices([]);
      return;
    }

    axiosInstance
      .get(`/admin/service-categories/${form.DomainServiceId}`)
      .then(res => setServices(res.data.services || []))
      .catch(() => setServices([]));
  }, [form.DomainServiceId]);

  console.log("SERVICES:", services);

  /* ================= FETCH CATEGORIES BY SERVICE ================= */
  useEffect(() => {
    if (!form.serviceId) {
      setCategories([]);
      return;
    }

    axiosInstance
      .get(`/auth/show-subservices/${form.serviceId}`)
      .then(res => setCategories(res.data.serviceCategory || []))
      .catch(() => setCategories([]));
  }, [form.serviceId]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
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
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Add Service Category</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* DOMAIN */}
          <select
            name="DomainServiceId"
            value={form.DomainServiceId}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          >
            <option value="">Select Domain</option>
            {domains.map(d => (
              <option key={d._id} value={d._id}>
                {d.domainName}
              </option>
            ))}
          </select>

          {/* SERVICE NAME (CLICK, NOT TYPE) */}
          {/* SERVICE SELECT (only if services exist) */}
          {services.length > 0 && (
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={(e) => {
                const value = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  serviceId: value,
                  serviceName: "", // clear manual name when selecting
                }));
              }}
              className="w-full p-3 border rounded"
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.serviceName}
                </option>
              ))}
            </select>
          )}

          {/* NEW SERVICE INPUT */}
          {(services.length === 0 || !form.serviceId) && (
            <Inputfield
              name="serviceName"
              placeholder="New Service Name"
              value={form.serviceName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  serviceName: e.target.value,
                }))
              }
            />
          )}


          {/* EXISTING CATEGORIES (READ ONLY) */}
          {categories.length > 0 && (
            <div className="border rounded p-2 text-sm">
              <p className="font-medium mb-1">Existing Categories</p>
              {categories.map(c => (
                <p key={c._id}>• {c.serviceCategoryName}</p>
              ))}
            </div>
          )}

          {/* NEW CATEGORY */}
          <Inputfield
            name="serviceCategoryName"
            placeholder="New Category Name"
            value={form.serviceCategoryName}
            onChange={handleChange}
          />

          {/* DESCRIPTION */}
          <RichEditor
            value={form.description}
            onChange={(html) =>
              setForm(prev => ({ ...prev, description: html }))
            }
          />

          <Inputfield
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <Inputfield
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={handleChange}
          />

          <Inputfield
            type="number"
            name="employeeCount"
            placeholder="Employee Count"
            value={form.employeeCount}
            onChange={handleChange}
          />

          <ImageUpload
            handleImageChange={handleImageChange}
            preview={preview}
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 w-32 h-32 object-cover rounded-lg shadow"
            />
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Category"}
          </button>

        </form>
      </div>
    </AdminLayout>
  );
}
