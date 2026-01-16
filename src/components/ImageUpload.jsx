import { useRef } from "react";
import { Upload, CheckCircle } from "lucide-react";

export default function ImageUpload({ handleImageChange, preview }) {
  const fileInputRef = useRef(null);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        aria-hidden
      />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl 
                   flex flex-col justify-center items-center cursor-pointer 
                   hover:bg-gray-50 transition relative overflow-hidden"
        aria-label={preview ? "Change image" : "Upload image"}
      >
        {!preview && (
          <div className="text-center">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-lg font-semibold text-slate-800">Upload Image</p>
            <p className="text-sm text-slate-500">PNG/JPG up to 2MB — click to choose</p>
          </div>
        )}

        {preview && (
          <>
            <img
              src={preview}
              alt="Selected"
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden
            />
            <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center text-center text-white p-3">
              <CheckCircle className="w-10 h-10 text-green-300 mb-2" />
              <p className="font-semibold">Image Selected</p>
              <p className="text-xs opacity-80">Click anywhere to change</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
