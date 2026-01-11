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
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col w-full mb-3">
      {label && (
        <label className="text-gray-700 font-medium mb-1">
          {label}
        </label>
      )}

      <div
        className={`flex items-center border rounded-lg px-3 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <input
          name={name}                    
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value ?? ""}            
          onChange={onChange}
          placeholder={placeholder}
          className="w-full py-2 focus:outline-none"
        />

        {isPassword && (
          <>
            {showPassword ? (
              <EyeOff
                size={20}
                className="cursor-pointer text-gray-600"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                size={20}
                className="cursor-pointer text-gray-600"
                onClick={() => setShowPassword(true)}
              />
            )}
          </>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
