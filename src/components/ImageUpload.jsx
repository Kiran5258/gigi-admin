import { useRef } from "react";
import { Upload, CheckCircle } from "lucide-react";

export default function ImageUpload({ handleImageChange, preview }) {
  const fileInputRef = useRef(null);

  return (
    <div>
      {/* Hidden input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current.click()}
        className="w-full h-40 border-2 border-dashed border-gray-400 rounded-xl 
                   flex flex-col justify-center items-center cursor-pointer 
                   hover:bg-gray-100 transition"
      >
        {/* BEFORE UPLOAD */}
        {!preview && (
          <>
            <Upload className="w-10 h-10 text-gray-500 mb-2" />
            <p className="text-lg font-semibold">Upload Image</p>
            <p className="text-sm text-gray-500">Click to choose a file</p>
          </>
        )}

        {/* AFTER UPLOAD */}
        {preview && (
          <>
            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
            <p className="text-lg font-semibold text-green-600">
              Image Selected
            </p>
            <p className="text-sm text-gray-500">Click to change</p>
          </>
        )}
      </div>
    </div>
  );
}
