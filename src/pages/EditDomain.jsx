import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader } from "lucide-react";

export default function EditDomain() {
  const { domainserviceId } = useParams();
  const navigate = useNavigate();

  const [domainName, setDomainName] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axiosInstance.get("/auth/services");
        const services = res.data.services || [];
        const svc = services.find((s) => s._id === domainserviceId);
        if (!svc) {
          toast.error("Domain service not found");
          navigate(-1);
          return;
        }

        setDomainName(svc.domainName || "");
        setServiceImage(svc.serviceImage || "");
        setPreview(svc.serviceImage || "");
      } catch (err) {
        console.error("Fetch service error:", err);
        toast.error("Failed to load domain service");
      } finally {
        setFetching(false);
      }
    };

    fetchService();
  }, [domainserviceId, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setServiceImage(reader.result);
      setPreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!domainName) {
      toast.error("Please provide a domain name");
      return;
    }

    setLoading(true);

    try {
      const adminToken = localStorage.getItem("token");

      await axiosInstance.put(
        `/admin/domainservice-edit/${domainserviceId}`,
        { domainName, serviceImage },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success("Domain service updated successfully");
      navigate(-1);
    } catch (err) {
      console.error("EditDomain error:", err.response || err.message);
      const message = err?.response?.data?.message || "Failed to update domain service.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <Loader/>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="btn-ghost p-2 rounded-md"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Edit Domain Service</h1>
            <p className="text-sm text-slate-500 mt-1">Update domain name or replace the image.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          <div>
            <label htmlFor="domainName" className="text-sm text-slate-700 font-medium mb-2 block">
              Domain Name
            </label>
            <Inputfield
              id="domainName"
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="e.g. Plumbing, Web Development"
            />
            <p className="text-xs text-slate-400 mt-1">Short, descriptive domain name.</p>
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium mb-2 block">Domain Image</label>

            <div className="border border-dashed border-gray-200 rounded-lg p-4">
              <ImageUpload handleImageChange={handleImageChange} preview={preview} />
              <p className="text-xs text-slate-400 mt-2">PNG/JPG up to 2MB. Recommended ratio 16:9.</p>
            </div>

            {preview && (
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={preview}
                  alt="preview"
                  className="w-28 h-20 object-cover rounded-md shadow-sm border"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">{domainName || "Preview"}</div>
                  <div className="text-xs text-slate-500 mt-1">Preview of selected image</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    setServiceImage("");
                  }}
                  className="btn-ghost text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                // Reset to original preview
                setPreview(serviceImage);
              }}
              className="btn-ghost"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary inline-flex items-center gap-2 ${loading ? "opacity-80 pointer-events-none" : ""}`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}