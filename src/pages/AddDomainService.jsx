import { useState } from "react";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";

export default function AddDomainService() {
  const [domainName, setDomainName] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert image to Base64 (needed for Cloudinary)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
      const res = await axiosInstance.post("/admin/add-domain-service", {
        domainName,
        serviceImage,
      });

      toast.success("Domain service added successfully!");

      // Reset the form
      setDomainName("");
      setServiceImage("");
      setPreview("");
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add Domain Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Domain Name */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Domain Name
            </label>
            <Inputfield
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="Enter domain name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-gray-700 font-medium mb-1 block">
              Domain Image
            </label>

            <ImageUpload handleImageChange={handleImageChange} preview={preview}    />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-4 w-32 h-32 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg text-lg font-semibold transition 
            ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  );
}
