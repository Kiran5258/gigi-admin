import { axiosInstance } from "../config/axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isLoggingIn: false,
    isCheckingAuth: true,

    // -------------------- CHECK AUTH --------------------
    checkAuth: async () => {
        set({ isCheckingAuth: true });

        try {
            const res = await axiosInstance.get("/admin/check-auth");
            set({ authUser: res.data.admin });

        } catch (err) {
            set({ authUser: null });
            console.log("Error in checkAuth:", err);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // -------------------- LOGIN --------------------
    login: async (data) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/admin/login", data);

            // Save token
            localStorage.setItem("token", res.data.token);

            // Save admin user
            set({ authUser: res.data.admin });

            toast.success("Logged in successfully!");

        } catch (err) {
            const message =
                err?.response?.data?.message || "Login failed. Please try again.";
            toast.error(message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // -------------------- LOGOUT --------------------
    logout: async () => {
        localStorage.removeItem("token");

        set({ authUser: null });
        toast.success("Logged out successfully!");
    },
}));
