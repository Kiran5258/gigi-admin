import { useState } from "react";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AddDomainPart() {
  const [domainName, setDomainName] = useState("");
  const [domainImage, setDomainImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([{ partName: "", price: "" }]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setDomainImage(reader.result);
      setPreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!domainName || !domainImage) {
      toast.error("Please provide a name and image");
      return;
    }

    // Validate parts
    const cleanedParts = (parts || [])
      .map((p) => ({ partName: (p.partName || "").trim(), price: Number(p.price) }))
      .filter((p) => p.partName && !isNaN(p.price));

    if (cleanedParts.length === 0) {
      toast.error("Please add at least one part with a numeric price");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/admin/add-domainpart", {
        domainpartname: domainName,
        domainpartimage: domainImage,
        parts: cleanedParts,
      });

      toast.success("Domain part added");
      setDomainName("");
      setDomainImage("");
      setPreview("");
      setParts([{ partName: "", price: "" }]);
      navigate("/domainparts");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add domain part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="btn-ghost p-2 rounded-md">
            <ArrowLeft size={16} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Add Domain Part</h1>
            <p className="text-sm text-slate-500 mt-1">Create a new domain part and upload an image.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          <div>
            <label htmlFor="domainName" className="text-sm text-slate-700 font-medium mb-2 block">Domain Part Name</label>
            <Inputfield id="domainName" type="text" value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="e.g. Plumbing Tools" />
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium mb-2 block">Parts</label>
            <div className="space-y-3">
              {parts.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="col-span-6 input"
                    placeholder="Part name"
                    value={row.partName}
                    onChange={(e) => {
                      const c = [...parts];
                      c[idx].partName = e.target.value;
                      setParts(c);
                    }}
                  />
                  <input
                    className="col-span-4 input"
                    placeholder="Price"
                    type="number"
                    value={row.price}
                    onChange={(e) => {
                      const c = [...parts];
                      c[idx].price = e.target.value;
                      setParts(c);
                    }}
                  />
                  <div className="col-span-2 flex gap-2">
                    <button type="button" onClick={() => setParts((s) => s.filter((_, i) => i !== idx))} className="btn-ghost text-red-600">Remove</button>
                  </div>
                </div>
              ))}

              <div>
                <button type="button" onClick={() => setParts((s) => [...s, { partName: "", price: "" }])} className="btn-ghost">Add Row</button>
                <p className="text-xs text-slate-400 mt-2">Add parts (name + numeric price) for this domain part.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium mb-2 block">Image</label>
            <div className="border border-dashed border-gray-200 rounded-lg p-4">
              <ImageUpload handleImageChange={handleImageChange} preview={preview} />
              <p className="text-xs text-slate-400 mt-2">PNG/JPG up to 2MB.</p>
            </div>

            {preview && (
              <div className="mt-4 flex items-center gap-3">
                <img src={preview} alt="preview" className="w-28 h-20 object-cover rounded-md shadow-sm border" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">{domainName || "Preview"}</div>
                  <div className="text-xs text-slate-500 mt-1">Preview of selected image</div>
                </div>
                <button type="button" onClick={() => { setPreview(""); setDomainImage(""); }} className="btn-ghost text-sm">Remove</button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => { setDomainName(""); setDomainImage(""); setPreview(""); }} className="btn-ghost">Reset</button>

            <button type="submit" disabled={loading} className={`btn-primary inline-flex items-center gap-2 ${loading ? "opacity-80 pointer-events-none" : ""}`}>
              {loading ? "Adding..." : "Add Domain Part"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
