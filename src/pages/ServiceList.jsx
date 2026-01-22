import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import { Edit, Trash2, ArrowLeft, Search } from "lucide-react";
import { toast } from "react-hot-toast";

const ServiceList = () => {
  const { domainServiceId } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
  if (!domainServiceId) return;
  setLoading(true);

  axiosInstance
    .get(`/auth/service-list/${domainServiceId}`)
    .then((res) => {
      const data = res.data;
      console.log(data);
      let list = [];

      if (Array.isArray(data?.services)) {
        list = data.services;
      } else if (Array.isArray(data?.service)) {
        list = data.service;
      } else if (data?.service) {
        list = [data.service];
      } else {
        console.error("Unknown API shape:", data);
        toast.error("Server returned invalid data");
        return;
      }

      setServices(list);
    })
    .catch((err) => {
      console.error("Failed to fetch service list:", err);
      toast.error("Failed to load services");
      setServices([]);
    })
    .finally(() => setLoading(false));
}, [domainServiceId, refreshKey]);



  const filteredServices = useMemo(() => {
    if (!q.trim()) return services;
    const term = q.toLowerCase();
    return services.map((svc) => ({
      ...svc,
      serviceCategory: (svc.serviceCategory || []).filter((c) =>
        (c.serviceCategoryName || "").toLowerCase().includes(term)
      ),
    }));
  }, [services, q]);

  const handleDeleteCategory = async (serviceId, categoryId) => {
    if (!window.confirm("Delete this category permanently?")) return;
    setDeleting(categoryId);

    try {
      // Adjust endpoint if your backend differs
      await axiosInstance.delete(`/admin/delete-service-category/${serviceId}/${categoryId}`);

      setServices((prev) =>
        prev.map((s) =>
          s._id === serviceId
            ? { ...s, serviceCategory: (s.serviceCategory || []).filter((c) => c._id !== categoryId) }
            : s
        )
      );

      toast.success("Category deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleEditCategory = (serviceId, categoryId) => {
    // navigate to your edit route — adjust path as needed
    navigate(`/service-list/${serviceId}/category/${categoryId}/edit`);
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => navigate(-1)} className="btn-ghost p-2 rounded-md" aria-label="Go back">
              <ArrowLeft size={16} />
            </button>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-slate-800 truncate">Service Categories</h1>
              <p className="text-sm text-slate-500 mt-1 hidden md:block">Browse categories under the selected service domain.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="input-box flex items-center gap-2 w-full md:w-64">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Filter categories..."
                className="bg-transparent outline-none w-full text-sm"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <Link to="/add-service-list" className="btn-primary w-full md:w-auto text-center">
              Add Category
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader full />
          </div>
        ) : services.length === 0 ? (
          <div className="card text-center py-12 text-slate-600">
            No services found for this domain.
            <div className="mt-4">
              <Link to="/add-domain-service" className="btn-ghost">Add Domain</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredServices.map((service) => (
              <div key={service._id}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">{service.serviceName}</h2>
                  <div className="text-sm text-slate-500">{(service.serviceCategory || []).length} categories</div>
                </div>

                {(!service.serviceCategory || service.serviceCategory.length === 0) ? (
                  <div className="card text-center py-8 text-slate-600">
                    No categories available for this service.
                    <div className="mt-4">
                      <Link to="/add-service-list" className="btn-primary">Create Category</Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {service.serviceCategory.map((cat) => {
                      const categoryUpdated = cat.updatedAt || cat.createdAt || service.updatedAt || service.createdAt || null;
                      const updatedLabel = categoryUpdated ? new Date(categoryUpdated).toLocaleDateString() : "-";

                      return (
                        <article
                          key={cat._id}
                          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col"
                        >
                          {cat.servicecategoryImage ? (
                            <img
                              src={cat.servicecategoryImage}
                              alt={cat.serviceCategoryName}
                              className="w-full h-40 object-cover rounded-md mb-3"
                            />
                          ) : (
                            <div className="w-full h-40 bg-slate-50 rounded-md mb-3 flex items-center justify-center text-slate-400">
                              No image
                            </div>
                          )}

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{cat.serviceCategoryName}</h3>

                            <div
                              className="text-sm text-slate-600 mb-3 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: cat.description || "" }}
                            />

                            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                              <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700">₹{cat.price ?? "-"}</span>
                              <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">{cat.durationInMinutes ?? "-"} mins</span>
                              <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">{cat.employeeCount ?? "-"} staff</span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-slate-400">Updated: {updatedLabel}</div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCategory(service._id, cat._id)}
                                className="btn-ghost inline-flex items-center gap-2"
                              >
                                <Edit size={14} /> Edit
                              </button>

                              <button
                                onClick={() => handleDeleteCategory(service._id, cat._id)}
                                className="btn-ghost text-red-600 bg-red-50 hover:bg-red-100 inline-flex items-center gap-2"
                                disabled={deleting === cat._id}
                              >
                                {deleting === cat._id ? "Deleting..." : <><Trash2 size={14} /> Delete</>}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ServiceList;
