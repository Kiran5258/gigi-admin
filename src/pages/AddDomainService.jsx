import { useState } from "react";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AddDomainService() {
  const [domainName, setDomainName] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Convert image to Base64 (needed for Cloudinary)
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

    if (!domainName || !serviceImage) {
      toast.error("Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/admin/add-domain-service", {
        domainName,
        serviceImage,
      });

      toast.success("Domain service added successfully!");

      // Reset the form
      setDomainName("");
      setServiceImage("");
      setPreview("");

      navigate("/service"); // go back to service list (adjust route if needed)
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to add domain service.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-semibold text-slate-800">Add Domain Service</h1>
            <p className="text-sm text-slate-500 mt-1">Create a new domain and upload a representative image.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          {/* Domain Name */}
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
            <p className="text-xs text-slate-400 mt-1">Choose a clear, short domain name that describes the service area.</p>
          </div>

          {/* Image Upload */}
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setDomainName("");
                setServiceImage("");
                setPreview("");
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
              {loading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
