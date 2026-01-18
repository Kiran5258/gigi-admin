import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import RichEditor from "../components/RichEditor";

export default function ManageCategory() {
  const { serviceId: paramServiceId, categoryId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(paramServiceId && categoryId);

  const [domains, setDomains] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

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
      .catch(() => {});
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
    axiosInstance.get(`/auth/showsubservice/${paramServiceId}`)
      .then((res) => {
        const cats = res.data.serviceCategory || [];
        const cat = cats.find((c) => String(c._id) === String(categoryId));
        if (!cat) {
          toast.error("Category not found");
          navigate(-1);
          return;
        }
        setForm((p) => ({
          ...p,
          serviceId: paramServiceId,
          serviceName: res.data.serviceName || "",
          serviceCategoryName: cat.serviceCategoryName || "",
          description: cat.description || "",
          price: cat.price || "",
          duration: cat.durationInMinutes || "",
          employeeCount: cat.employeeCount || "",
          image: cat.servicecategoryImage || null,
        }));
        setPreview(cat.servicecategoryImage || "");
      })
      .catch(() => {
        toast.error("Failed to load category");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [isEdit, paramServiceId, categoryId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) {
      setForm((p) => ({ ...p, image: null }));
      setPreview("");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({ ...p, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((p) => ({ ...p, image: null }));
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
        await axiosInstance.put(
          `/admin/update-service-category/${paramServiceId}/${categoryId}`,
          {
            serviceCategoryName: form.serviceCategoryName,
            description: form.description,
            price: Number(form.price),
            durationInMinutes: Number(form.duration),
            employeeCount: Number(form.employeeCount),
            servicecategoryImage: form.image,
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
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">{isEdit ? "Edit Category" : "Create Category"}</h1>
          <p className="text-sm text-slate-500 mt-1">{isEdit ? "Update category details" : "Create a new category under a service"}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow space-y-4">
            {!isEdit && (
              <>
                <label className="text-sm text-slate-600 block">Domain</label>
                <select
                  name="DomainServiceId"
                  value={form.DomainServiceId}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((p) => ({ ...p, serviceId: "", serviceName: "" }));
                    setServices([]);
                  }}
                  className="input-box"
                >
                  <option value="">Select Domain</option>
                  {domains.map((d) => <option key={d._1d} value={d._id}>{d.domainName}</option>)}
                </select>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.length > 0 && (
                    <div>
                      <label className="text-sm text-slate-600 block">Choose Service</label>
                      <select
                        name="serviceId"
                        value={form.serviceId}
                        onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value, serviceName: "" }))}
                        className="input-box"
                      >
                        <option value="">Select Service</option>
                        {services.map((s) => <option key={s._id} value={s._id}>{s.serviceName}</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-slate-600 block">{services.length ? "Or create new Service" : "Service Name"}</label>
                    <Inputfield name="serviceName" value={form.serviceName} onChange={handleChange} placeholder="New service name" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-slate-600 block">Category Name</label>
              <Inputfield name="serviceCategoryName" value={form.serviceCategoryName} onChange={handleChange} placeholder="e.g. Premium Wash" />
            </div>

            <div>
              <label className="text-sm text-slate-600 block">Description</label>
              <RichEditor value={form.description} onChange={(html) => setForm((p) => ({ ...p, description: html }))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Inputfield type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" />
              <Inputfield type="number" name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (minutes)" />
              <Inputfield type="number" name="employeeCount" value={form.employeeCount} onChange={handleChange} placeholder="Employee Count" />
            </div>
          </div>

          <aside className="bg-white p-6 rounded-xl shadow space-y-4">
            <div>
              <label className="text-sm text-slate-600 block mb-2">Category Image</label>
              <div className="border border-dashed rounded p-3">
                <ImageUpload handleImageChange={handleImageChange} preview={preview} onRemove={handleRemoveImage} />
                <p className="text-xs text-slate-400 mt-2">PNG/JPG up to 2MB. Recommended 4:3 ratio.</p>
              </div>
              {preview && <img src={preview} alt="preview" className="mt-3 w-full h-40 object-cover rounded-md border" />}
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
              <button type="button" onClick={() => navigate(-1)} className="btn-ghost w-full">Cancel</button>
              <button type="submit" disabled={loading} onClick={handleSubmit} className="btn-primary w-full mt-2">
                {loading ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Category")}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </AdminLayout>
  );
}