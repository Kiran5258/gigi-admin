import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";

export const useEmployeeStore = create((set) => ({
    employees: [],
    loading: false,

    fetchEmployees: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/admin/get-all-employee");
            set({ employees: res.data.employee || [] });
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error(error.response?.data?.message || "Failed to fetch employees");
        } finally {
            set({ loading: false });
        }
    },

    blockEmployee: async (id, type, until) => {
        try {
            await axiosInstance.put(`/admin/block-servicer/${id}`, {
                servicerType: type,
                blockedUntil: until
            });
            toast.success("Employee blocked successfully");

            // Refresh local state
            set((state) => ({
                employees: state.employees.map(emp =>
                    emp._id === id ? { ...emp, isBlocked: true, blockedUntil: until } : emp
                )
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to block employee");
        }
    },

    unblockEmployee: async (id, type) => {
        try {
            await axiosInstance.put(`/admin/unblock-servicer/${id}`, {
                servicerType: type
            });
            toast.success("Employee unblocked successfully");

            // Refresh local state
            set((state) => ({
                employees: state.employees.map(emp =>
                    emp._id === id ? { ...emp, isBlocked: false, blockedUntil: null } : emp
                )
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unblock employee");
        }
    }
}));
