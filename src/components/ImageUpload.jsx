import { useRef } from "react";
import { Upload, CheckCircle, RefreshCcw } from "lucide-react";

export default function ImageUpload({ handleImageChange, preview, onRemove }) {
  const fileInputRef = useRef(null);

  return (
    <div className="h-full min-h-[160px]">
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
        className={`w-full h-full border-2 border-dashed rounded-[32px] 
                   flex flex-col justify-center items-center cursor-pointer 
                   transition-all duration-500 relative overflow-hidden group/upload
                   ${preview
            ? "border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-500/5"
            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-500/40 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
        aria-label={preview ? "Change image" : "Upload image"}
      >
        {!preview && (
          <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-700 p-8">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-slate-100 dark:border-slate-700 group-hover/upload:border-indigo-500/50 group-hover/upload:bg-white dark:group-hover/upload:bg-slate-700 transition-all duration-300 shadow-sm">
              <Upload size={32} className="text-slate-400 group-hover/upload:text-indigo-600 dark:group-hover/upload:text-indigo-400" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Upload Image</p>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">PNG/JPG up to 2MB — click to choose</p>
            </div>
          </div>
        )}

        {preview && (
          <>
            <img
              src={preview}
              alt="Selected"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/upload:scale-110"
              aria-hidden
            />
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center text-white p-6 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/30 shadow-2xl">
                <RefreshCcw className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-black uppercase tracking-[.2em]">Asset Replace</p>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-2">Click to modify payload</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
