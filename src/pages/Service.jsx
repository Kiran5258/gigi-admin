import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import AdminLayout from "../components/AdminLayout";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export const Service = () => {
  const [domainService, setDomainService] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/auth/services");
      setDomainService(res.data.services || []);
      console.log("Fetched services:", res.data.services);
    } catch (err) {
      console.error("Service fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const adminToken = localStorage.getItem("token");

      await axiosInstance.delete(
        `/admin/delete-domain-service/${id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setDomainService((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Service Domains</h1>
          <button
            onClick={() => navigate("/add-domain-service")}
            className="btn-primary"
          >
            Add Domain
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader full />
          </div>
        ) : domainService.length === 0 ? (
          <div className="card text-center py-12 text-slate-600">No services found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {domainService.map((service) => (
              <div
                key={service._id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-50">
                  <img
                    src={service.serviceImage || "/placeholder.png"}
                    alt={service.domainName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {service.domainName}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">Domain Service</p>

                  <div className="h-px bg-gray-100 my-4" />

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
                      Active
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/auth/service-list/${service._id}`)}
                        className="btn-ghost"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteService(service._id)}
                        className="btn-ghost text-red-600 bg-red-50 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
