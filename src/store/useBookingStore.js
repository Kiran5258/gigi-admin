import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";

export const useBookingStore = create((set, get) => ({
    failedBookings: [],
    nearbyServicers: [],
    loading: false,

    fetchFailedBookings: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/admin/failed-bookings");
            if (res.data.success) {
                set({ failedBookings: res.data.bookings });
            }
        } catch (error) {
            console.error("Error fetching failed bookings:", error);
            toast.error(error.response?.data?.message || "Failed to load failed bookings");
        } finally {
            set({ loading: false });
        }
    },

    fetchNearbyServicers: async (bookingId) => {
        set({ loading: true, nearbyServicers: [] });
        try {
            console.log(bookingId);
            const res = await axiosInstance.get(`/admin/nearby-servicers/${bookingId}`);
            if (res.data.success) {
                console.log(res.data)
                let servicersList = [];
                if (res.data.result && Array.isArray(res.data.result.data)) {
                    // Backend returns { type: 'single' || 'team', data: [...] }
                    servicersList = res.data.result.data.map(s => ({
                        ...s,
                        type: res.data.result.type === 'single' ? 'SINGLE_EMPLOYEE' : 'MULTIPLE_EMPLOYEE',
                        fullname: s.fullname || s.storeName || 'Unknown Provider',
                        phoneNo: s.phoneNo || 'N/A'
                    }));
                } else if (res.data.result && Array.isArray(res.data.result)) {
                    servicersList = res.data.result;
                }
                set({ nearbyServicers: servicersList });
            }
        } catch (error) {
            console.error("Error fetching nearby servicers:", error);
            toast.error(error.response?.data?.message || "Failed to load servicers");
        } finally {
            set({ loading: false });
        }
    },

    manualNotifyServicer: async (bookingId, servicerId, servicerType) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/admin/manual-notify", {
                bookingId,
                servicerId,
                servicerType
            });
            if (res.data.success) {
                toast.success("Notification sent successfully!");
                // Remove the assigned provider from the local UI state temporarily if wanted
                // But generally, the provider accepts/declines, so it remains in "failed" until accepted.
                return res.data;
            }
        } catch (error) {
            console.error("Error manually notifying servicer:", error);
            toast.error(error.response?.data?.message || "Failed to notify servicer");
            throw error;
        } finally {
            set({ loading: false });
        }
    }
}));
