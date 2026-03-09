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

    // -------------------- INVITE ADMIN --------------------
    inviteAdmin: async (data) => {
        try {
            const res = await axiosInstance.post("/admin/invite", data);
            toast.success("Invite sent successfully!");
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to send invite";
            toast.error(message);
            throw err;
        }
    },

    // -------------------- GET PERMISSIONS --------------------
    getPermissions: async () => {
        try {
            const res = await axiosInstance.get("/admin/permissions");
            return res.data.permissions;
        } catch (err) {
            console.log("Error in getPermissions:", err);
            return {};
        }
    },

    // -------------------- SIGNUP WITH INVITE --------------------
    signupWithInvite: async (data) => {
        try {
            const res = await axiosInstance.post("/admin/signup-invite", data);
            toast.success("Account created successfully!");
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || "Signup failed";
            toast.error(message);
            throw err;
        }
    }
}));
