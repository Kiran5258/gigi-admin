import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import RichEditor from "../components/RichEditor";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
export default function AddServiceList() {
  const [domainServices, setDomainServices] = useState([]);
  const [DomainServiceId, setDomainServiceId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [preview, setPreview] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [image, setImage] = useState(null);
  const [serviceCategoryName, setServiceCategoryName] = useState("");
  // Fetch domain services
  const fetchDomains = async () => {
    try {
      const res = await axiosInstance.get("/auth/services");
      setDomainServices(res.data.services);
    } catch (err) {
      console.log("Fetch services error:", err);
      toast.error("Failed to load domain services");
    }
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    }
    reader.readAsDataURL(file);
  }
  useEffect(() => {
    fetchDomains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/admin/add-service-list", {
        DomainServiceId,
        serviceName,
        ServiceCategory: {
          serviceCategoryName,
          description,
          price,
          employeeCount,
          durationInMinutes: duration,
          servicecategoryImage: image,
        },
      });

      toast.success("Service added successfully!");

      setServiceCategoryName("");
      setServiceName("");
      setDomainServiceId("");
      setDescription("");
      setPrice("");
      setDuration("");
      setEmployeeCount("");
      setImage(null);
      setPreview("");

    } catch (err) {
      const message = err?.response?.data?.message || "Add service failed";
      toast.error(message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-center align-center">
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-6">Add Service List</h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Domain Dropdown */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Select Domain Service
              </label>

              <select
                value={DomainServiceId}
                onChange={(e) => setDomainServiceId(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">-- Select Domain --</option>

                {domainServices.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.domainName}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Name */}
            <Inputfield
              type="text"
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <Inputfield
              type="text"
              placeholder="Service Category Name"
              value={serviceCategoryName}
              onChange={(e) => setServiceCategoryName(e.target.value)}
              className="w-full p-3 border rounded"
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <RichEditor
                value={description}
                onChange={(html) => setDescription(html)}
              />
            </div>

            {/* Price */}
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <div>
              <label className="text-gray-700 font-medium mb-1 block">
                Sub Service Image
              </label>
              <ImageUpload handleImageChange={handleImageChange} preview={preview} />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-4 w-32 h-32 object-cover rounded-lg shadow"
                />
              )}
            </div>
            {/* Duration */}
            <Inputfield
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <Inputfield
              type="number"
              placeholder="Employee Count"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              className="w-full p-3 border rounded"
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg"
            >
              Add Service
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
