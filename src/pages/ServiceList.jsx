import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";

const ServiceList = () => {
    const { domainServiceId } = useParams();

    const [serviceLists, setServiceLists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`/auth/service-list/${domainServiceId}`).then((res) => {
            console.log("API DATA:", res.data.serviceList);
            setServiceLists(res.data.serviceList || []);
        })
            .catch((err) => {
                console.error(err);
                setServiceLists([]);
            })
            .finally(() => setLoading(false));
    }, [domainServiceId]);

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">
                    Service Categories
                </h1>
                {!loading &&
                    serviceLists.map((service) => (
                        <div key={service._id} className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">
                                {service.serviceName}
                            </h2>

                            {service.serviceCategory?.length === 0 && (
                                <p className="text-gray-500">
                                    No categories available for this service.
                                </p>
                            )}

                            {service.serviceCategory?.map((cat) => (
                                <div
                                    key={cat._id}
                                    className="mb-4 p-4 border rounded-lg bg-white shadow-sm"
                                >
                                    <h3 className="text-lg font-semibold">
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
