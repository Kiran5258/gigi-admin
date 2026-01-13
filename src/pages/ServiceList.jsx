import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";

const ServiceList = () => {
  const { domainServiceId } = useParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!domainServiceId) return;

    setLoading(true);

    axiosInstance
      .get(`/auth/service-list/${domainServiceId}`)
      .then((res) => {
        console.log("Fetched service list:", res.data);

        const service = res.data?.service;

        setServices(service ? [service] : []);
      })
      .catch((err) => {
        console.error("Failed to fetch service list:", err);
        setServices([]);
      })
      .finally(() => setLoading(false));

  }, [domainServiceId]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Service Categories
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500">Loading services...</p>
        )}

        {/* Empty */}
        {!loading && services.length === 0 && (
          <p className="text-gray-500">
            No services found for this domain.
          </p>
        )}

        {/* Services */}
        {!loading &&
          services.map((service) => (
            <div key={service._id} className="mb-8">
              <h2 className="text-xl font-semibold mb-3">
                {service.serviceName}
              </h2>

              {/* No categories */}
              {service.serviceCategory?.length === 0 && (
                <p className="text-gray-500 mb-3">
                  No categories available for this service.
                </p>
              )}

              {/* Categories */}
              {Array.isArray(service.serviceCategory) &&
                service.serviceCategory.map((cat) => (
                  <div
                    key={cat._id}
                    className="mb-4 p-4 border rounded-lg bg-white shadow-sm"
                  >
                    {/* IMAGE */}
                    {cat.servicecategoryImage && (
                      <img
                        src={cat.servicecategoryImage}
                        alt={cat.serviceCategoryName}
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                    )}

                    <h3 className="text-lg font-semibold mb-1">
                      {cat.serviceCategoryName}
                    </h3>

                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{ __html: cat.description }}
                    />

                    <div className="mt-2 text-sm text-gray-500">
                      Price: ₹{cat.price} <br />
                      Duration: {cat.durationInMinutes} mins <br />
                      Employees: {cat.employeeCount}
                    </div>
                  </div>
                ))}

            </div>
          ))}
      </div>
    </AdminLayout>
  );
};

export default ServiceList;
