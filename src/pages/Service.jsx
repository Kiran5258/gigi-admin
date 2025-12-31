import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { Loader } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

export const Service = () => {
  const [domainService, setDomainService] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/auth/services");
      setDomainService(res.data.services || []);
    } catch (err) {
      console.error("Service fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService=async(id)=>{
    if(!window.confirm("Are you sure you want to delete this service?"))return;
    try{
        await axiosInstance.delete(`/admin/delete-domain-service/${id}`);
        setDomainService(prev=>prev.filter(s=>s._id!==id));
    }
    catch(err){
        console.error("Delete failed",err);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin" />
        </div>
      </AdminLayout>
    );

  if (domainService.length === 0)
    return (
      <AdminLayout>
        <p className="p-6 text-gray-500">No services found</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Service Domains
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domainService.map((service) => (
            <div
              key={service._id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden
                         shadow-sm hover:shadow-xl hover:border-indigo-300
                         transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={service.serviceImage || "/placeholder.png"}
                  alt={service.domainName}
                  className="w-full h-full object-cover
                             group-hover:scale-105 transition-transform duration-300"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {service.domainName}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Domain Service
                </p>

                <div className="h-px bg-gray-100 my-4" />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
                    Active
                  </span>
                  <button className="text-sm font-medium text-red-400"
                 onClick={()=>deleteService(service._id)}>
                    Delete
                  </button>

                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
