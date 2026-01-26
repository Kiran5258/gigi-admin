import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import { Search } from "lucide-react";
import { toast } from "react-hot-toast";

const DomainpartsList = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/parts/showcategories`)
      .then((res) => {
        const list = res?.data?.categories || [];
        setParts(list);
      })
      .catch((err) => {
        console.error("Failed to fetch domain parts:", err);
        setParts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this domain part permanently?")) return;
    try {
      await axiosInstance.delete(`/admin/delete-domainpart/${id}`);
      setParts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Domain part deleted");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return parts;
    const term = q.toLowerCase();
    return parts.filter((p) => {
      const name = (p.domainPartsName || p.domainpartname || p.domainPartName || p.name || "").toLowerCase();
      return name.includes(term);
    });
  }, [parts, q]);

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => navigate(-1)} className="btn-ghost p-2 rounded-md">
              Back
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-slate-800 truncate">Domain Parts</h1>
              <p className="text-sm text-slate-500 mt-1 hidden md:block">Browse and inspect domain parts.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="input-box flex items-center gap-2 w-full md:w-64">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search domain parts..."
                className="bg-transparent outline-none w-full text-sm"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <Link to="/add-domain-part" className="btn-primary w-full md:w-auto text-center">
              Add Domain
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader full />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12 text-slate-600">No domain parts found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => {
              const name = p.domainpartname || p.domainPartsName || p.name || "Unnamed";
              return (
                <article key={p._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{name}</h3>
                  <div className="text-sm text-slate-500 mb-4">ID: {p._id}</div>
                  <div className="flex items-center justify-between">
                    <Link to={`/domainpart/${p._id}`} className="btn-ghost">View</Link>
                    <div className="flex items-center gap-2">
                      <Link to={`/edit-domain-part/${p._id}`} className="btn-ghost">Edit</Link>
                      <button onClick={() => handleDelete(p._id)} className="btn-ghost text-red-600 bg-red-50 hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DomainpartsList;
