import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import AdminLayout from "../components/AdminLayout";

export default function Dashboard() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await axiosInstance.get("/admin/employee-counts");
      setCounts(res.data);
    } catch (err) {
      console.log("Count fetch error:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-3">Welcome Admin</h1>

        {counts ? (
          <div className="grid grid-cols-3 gap-6 mt-6">

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-xl font-semibold">Single Employees</h2>
              <p className="text-4xl font-bold mt-2">{counts.singleEmployee}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-xl font-semibold">Multiple Employees</h2>
              <p className="text-4xl font-bold mt-2">{counts.mulipleEmplyee}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h2 className="text-xl font-semibold">Tool Shops</h2>
              <p className="text-4xl font-bold mt-2">{counts.toolshop}</p>
            </div>

          </div>
        ) : (
          <div className="mt-4">
            <Loader />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
