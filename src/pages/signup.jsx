import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Inputfield } from '../components/Inputfield';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ fullname, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-slate-950">
      <div className="w-full max-w-md card-premium animate-float">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-4">
            Master Registry
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic uppercase tracking-widest text-[10px]">Initialize administrative node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Inputfield
            label="Formal Identity"
            type="text"
            value={fullname}
            placeholder="ENTER FULL NAME..."
            onChange={(e) => setFullname(e.target.value)}
          />

          <Inputfield
            label="Email Identity"
            type="email"
            value={email}
            placeholder="ADMIN@ORGANIZATION.COM"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Inputfield
            label="Security Protocol"
            type="password"
            value={password}
            placeholder="••••••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full btn-premium mt-4"
          >
            {isSigningUp ? "Initializing..." : "Register Master Admin"}
          </button>
        </form>

        <div className="mt-8 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-6">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest text-center">
            © {new Date().getFullYear()} GigiMan Administrative Suite
          </p>
        </div>
      </div>
    </div>
  );
};

export default signup