import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";

export const useBannerStore = create((set, get) => ({
    banners: [],
    loading: false,

    fetchBanners: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/banners");
            set({ banners: res.data.banners });
        } catch (error) {
            console.error("Error fetching banners:", error);
            toast.error(error.response?.data?.message || "Failed to fetch banners");
        } finally {
            set({ loading: false });
        }
    },

    createBanner: async (bannerData) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/banners/create", bannerData);
            set((state) => ({ banners: [res.data.banner, ...state.banners] }));
            toast.success("Banner created successfully");
            return true;
        } catch (error) {
            console.error("Error creating banner:", error);
            toast.error(error.response?.data?.message || "Failed to create banner");
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateBanner: async (id, bannerData) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.put(`/banners/${id}`, bannerData);
            set((state) => ({
                banners: state.banners.map((b) => (b._id === id ? res.data.banner : b)),
            }));
            toast.success("Banner updated successfully");
            return true;
        } catch (error) {
            console.error("Error updating banner:", error);
            toast.error(error.response?.data?.message || "Failed to update banner");
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteBanner: async (id) => {
        set({ loading: true });
        try {
            await axiosInstance.delete(`/banners/${id}`);
            set((state) => ({
                banners: state.banners.filter((b) => b._id !== id),
            }));
            toast.success("Banner deleted successfully");
        } catch (error) {
            console.error("Error deleting banner:", error);
            toast.error(error.response?.data?.message || "Failed to delete banner");
        } finally {
            set({ loading: false });
        }
    },
}));
