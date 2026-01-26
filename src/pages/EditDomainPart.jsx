import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { axiosInstance } from "../config/axios";
import Loader from "../components/Loader";
import { Inputfield } from "../components/Inputfield";
import ImageUpload from "../components/ImageUpload";
import { toast } from "react-hot-toast";

export default function EditDomainPart() {
  const { DomainpartId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [existingParts, setExistingParts] = useState([]);
  const [newParts, setNewParts] = useState([{ partName: "", price: "" }]);

  useEffect(() => {
    if (!DomainpartId) return;
    setLoading(true);
    axiosInstance
      .get(`/parts/showpart/${DomainpartId}`)
      .then((res) => {
        const d = res?.data?.domain || res?.data || null;
        if (d) {
          setName(d.domainpartname || "");
          setPreview(d.domainpartimage || d.domainPartImage || d.image || "");
          setExistingParts(Array.isArray(d.parts) ? d.parts : []);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load domain part");
      })
      .finally(() => setLoading(false));
  }, [DomainpartId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setPreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { domainpartname: name };
      if (imageBase64) payload.domainpartimage = imageBase64;

      // prepare parts: only send valid new parts that are not duplicates of existing parts
      const existingLower = new Set(existingParts.map((p) => (p.partName || "").toLowerCase()));
      const validNewParts = newParts
        .map((p) => ({ partName: (p.partName || "").trim(), price: Number(p.price) }))
        .filter((p) => p.partName && !isNaN(p.price));

      const partsToSend = validNewParts.filter((p) => !existingLower.has(p.partName.toLowerCase()));
      if (partsToSend.length > 0) payload.parts = partsToSend;

      await axiosInstance.put(`/admin/domainpart/${DomainpartId}`, payload);
      toast.success("Domain part updated");
      navigate(`/domainpart/${DomainpartId}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto"><Loader full /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Edit Domain Part</h1>

        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          <div>
            <label className="text-sm text-slate-700 font-medium mb-2 block">Domain Part Name</label>
            <Inputfield value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium mb-2 block">Image</label>
            <div className="border border-dashed border-gray-200 rounded-lg p-4">
              <ImageUpload handleImageChange={handleImageChange} preview={preview} />
              <p className="text-xs text-slate-400 mt-2">Leave blank to keep existing image.</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium mb-2 block">Existing Parts</label>
            {existingParts.length === 0 ? (
              <div className="text-xs text-slate-500">No parts yet.</div>
            ) : (
              <ul className="space-y-2">
                {existingParts.map((p) => (
                  <li key={p._id || `${p.partName}-${p.price}`} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                    <div className="text-sm font-medium">{p.partName}</div>
                    <div className="text-sm text-slate-600">₹{p.price}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-700 font-medium mb-2 block">Add New Parts</label>
            <div className="space-y-3">
              {newParts.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="col-span-6 input"
                    placeholder="Part name"
                    value={row.partName}
                    onChange={(e) => {
                      const copy = [...newParts];
                      copy[idx].partName = e.target.value;
                      setNewParts(copy);
                    }}
                  />
                  <input
                    className="col-span-4 input"
                    placeholder="Price"
                    type="number"
                    value={row.price}
                    onChange={(e) => {
                      const copy = [...newParts];
                      copy[idx].price = e.target.value;
                      setNewParts(copy);
                    }}
                  />
                  <div className="col-span-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewParts((s) => s.filter((_, i) => i !== idx))}
                      className="btn-ghost text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div>
                <button
                  type="button"
                  onClick={() => setNewParts((s) => [...s, { partName: "", price: "" }])}
                  className="btn-ghost"
                >
                  Add Row
                </button>
                <p className="text-xs text-slate-400 mt-2">Only new parts (non-duplicates) will be added.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className={`btn-primary ${saving ? "opacity-80 pointer-events-none" : ""}`}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
