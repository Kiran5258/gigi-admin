import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";

export const useCommissionStore = create((set) => ({
    commissions: [],
    summary: [],
    loading: false,

    fetchCommissions: async (status, empId) => {
        set({ loading: true });
        try {
            const params = {};
            if (status) params.status = status;
            if (empId) params.empId = empId;
            
            const res = await axiosInstance.get("/admin/commissions", { params });
            if (res.data.success) {
                set({ 
                    commissions: res.data.commissions,
                    summary: res.data.summary || []
                });
            }
        } catch (error) {
            console.error("Error fetching commissions:", error);
            toast.error(error.response?.data?.message || "Failed to load commissions");
        } finally {
            set({ loading: false });
        }
    },

    addCommission: async (empId, amount) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/admin/add-commission", { empId, amount });
            if (res.data.success) {
                toast.success(res.data.message || "Commission/Penalty added successfully!");
                if (res.data.isBlocked) {
                    toast.error("Servicer was blocked because total unpaid exceeded 1000.");
                }
                return res.data;
            }
        } catch (error) {
            console.error("Error adding commission:", error);
            toast.error(error.response?.data?.message || "Failed to add commission");
            throw error;
        } finally {
            set({ loading: false });
        }
    }
}));
