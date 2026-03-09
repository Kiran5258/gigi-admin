import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
    users: [],
    loading: false,

    fetchUsers: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/admin/get-all-users");
            set({ users: res.data.user || [] });
        } catch (error) {
            console.error("User fetch error:", error);
            toast.error("Failed to load users");
        } finally {
            set({ loading: false });
        }
    },

    fetchUserHistory: async (userId) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get(`/admin/user-history/${userId}`);
            return res.data.bookings || [];
        } catch (error) {
            toast.error("Failed to load user history");
            return [];
        } finally {
            set({ loading: false });
        }
    },

    fetchBookingReview: async (bookingId) => {
        try {
            const res = await axiosInstance.get(`/admin/booking-review/${bookingId}`);
            return res.data.review;
        } catch (error) {
            console.error("Review fetch error", error);
            return null;
        }
    }
}));
