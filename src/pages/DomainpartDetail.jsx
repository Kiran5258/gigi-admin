import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

const DomainpartDetail = () => {
  const { DomainpartId } = useParams();
  const navigate = useNavigate();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!DomainpartId) return;
    setLoading(true);
    axiosInstance
      .get(`/parts/showpart/${DomainpartId}`)
      .then((res) => {
        setDomain(res?.data?.domain || res?.data || null);
      })
      .catch((err) => {
        console.error("Failed to fetch domain part:", err);
        setDomain(null);
      })
      .finally(() => setLoading(false));
  }, [DomainpartId]);

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Domain Part</h1>
            <p className="text-sm text-slate-500">Detail view for a domain part.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="btn-ghost">Back</button>
            <Link to={`/edit-domain-part/${DomainpartId}`} className="btn-ghost">Edit</Link>
            <button
              onClick={async () => {
                if (!window.confirm("Delete this domain part permanently?")) return;
                try {
                  await axiosInstance.delete(`/admin/delete-domainpart/${DomainpartId}`);
                  toast.success("Domain part deleted");
                  navigate("/domainparts");
                } catch (err) {
                  console.error(err);
                  toast.error(err?.response?.data?.message || "Delete failed");
                }
              }}
              className="btn-ghost text-red-600 bg-red-50 hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader full />
          </div>
        ) : !domain ? (
          <div className="card p-6 text-center">Domain part not found.</div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{domain.domainPartsName || domain.domainpartname || domain.domainPartName || domain.name || "Unnamed"}</h2>
            <div className="text-sm text-slate-500 mb-4">ID: {domain._id}</div>

            <div className="prose max-w-none text-sm text-slate-700">
              {domain.description ? (
                <div dangerouslySetInnerHTML={{ __html: domain.description }} />
              ) : (
                <div className="text-slate-500">No description provided.</div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Parts</h3>
              {Array.isArray(domain.parts) && domain.parts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {domain.parts.map((p) => (
                    <div key={p._id || `${p.partName}-${p.price}`} className="p-3 border rounded flex items-center justify-between">
                      <div className="text-sm font-medium">{p.partName}</div>
                      <div className="text-sm text-slate-600">₹{p.price}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500">No parts added for this domain part.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DomainpartDetail;
