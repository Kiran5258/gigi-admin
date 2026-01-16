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
    <div className={`flex flex-col w-full mb-3 ${className}`}>
      {label && <label className="text-sm text-slate-700 mb-1">{label}</label>}

      <div className={`input-box ${error ? "border-red-400" : ""}`}>
        <input
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm"
        />

        {isPassword && (
          showPassword ? (
            <EyeOff size={18} className="cursor-pointer text-slate-500" onClick={() => setShowPassword(false)} />
          ) : (
            <Eye size={18} className="cursor-pointer text-slate-500" onClick={() => setShowPassword(true)} />
          )
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};