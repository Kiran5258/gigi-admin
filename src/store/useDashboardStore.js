import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";

export const useDashboardStore = create((set) => ({
    stats: null,
    liveBookings: [],
    loading: false,

    fetchStats: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/admin/dashboard-stats");
            set({ stats: res.data });
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            toast.error("Failed to load dashboard statistics");
        } finally {
            set({ loading: false });
        }
    },

    fetchLiveBookings: async () => {
        try {
            const res = await axiosInstance.get("/admin/live-bookings");
            set({ liveBookings: res.data.bookings || [] });
        } catch (error) {
            console.error("Error fetching live bookings:", error);
        }
    },

    exportData: async () => {
        try {
            const response = await axiosInstance.get("/admin/export-dashboard", {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'gigiman_financial_report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("CSV exported successfully");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export data");
        }
    }
}));
