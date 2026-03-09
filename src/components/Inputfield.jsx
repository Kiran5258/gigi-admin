// ...existing code...
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Inputfield = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`flex flex-col w-full mb-5 ${className}`}>
      {label && (
        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2 ml-1">
          {label}
        </label>
      )}

      <div className={`input-box ${error ? "!border-red-400 !ring-red-500/10" : ""}`}>
        <input
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none focus:text-indigo-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff size={20} className="text-slate-400 hover:text-indigo-500 transition-colors" />
            ) : (
              <Eye size={20} className="text-slate-400 hover:text-indigo-500 transition-colors" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-2 ml-1 animate-pulse">{error}</p>}
    </div>
  );
};