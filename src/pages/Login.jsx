import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Inputfield } from "../components/Inputfield";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Email Field */}
          <Inputfield
            label="Email"
            type="email"
            value={email}
            placeholder="admin@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Field */}
          <Inputfield
            label="Password"
            type="password"
            value={password}
            placeholder="•••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full btn-primary"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} Admin Panel
        </p>
      </div>
    </div>
  );
}
