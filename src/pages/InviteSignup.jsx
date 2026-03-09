import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Inputfield } from "../components/Inputfield";
import { toast } from "react-hot-toast";

const InviteSignup = () => {
    const { signupWithInvite } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        token: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get("token") || "";
        const email = query.get("email") || "";
        setFormData(prev => ({ ...prev, token, email }));
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullname, email, password, token } = formData;

        if (!fullname || !email || !password || !token) {
            return toast.error("All fields are required");
        }

        setIsLoading(true);
        try {
            await signupWithInvite(formData);
            navigate("/login");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4 py-12">
            <div className="w-full max-w-lg card-premium animate-float">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">Complete Onboarding</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic uppercase tracking-widest text-[10px]">Initialize your administrator credentials</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Inputfield
                        label="Full Name"
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        placeholder="John Doe"
                        onChange={handleChange}
                    />

                    <Inputfield
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="admin@example.com"
                        onChange={handleChange}
                        disabled={!!new URLSearchParams(location.search).get("email")}
                    />

                    <Inputfield
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="•••••••••"
                        onChange={handleChange}
                    />

                    <Inputfield
                        label="Invite Token"
                        type="text"
                        name="token"
                        value={formData.token}
                        placeholder="Enter your invitation token"
                        onChange={handleChange}
                        disabled={!!new URLSearchParams(location.search).get("token")}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-premium !py-6 mt-6"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : "INITIALIZE MASTER ACCOUNT"}
                    </button>

                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            © {new Date().getFullYear()} Gigiman Administrative Suite
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteSignup;
