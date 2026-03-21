import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

export const useCouponStore = create((set) => ({
    coupons: [],
    loading: false,

    getCoupons: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/coupon");
            set({ coupons: res.data.coupons });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to fetch coupons");
        } finally {
            set({ loading: false });
        }
    },

    createCoupon: async (couponData) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/coupon", couponData);
            set((state) => ({ coupons: [res.data.coupon, ...state.coupons] }));
            toast.success("Coupon created successfully");
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create coupon");
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateCoupon: async (id, couponData) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.put(`/coupon/${id}`, couponData);
            set((state) => ({
                coupons: state.coupons.map((coupon) =>
                    coupon._id === id ? res.data.coupon : coupon
                ),
            }));
            toast.success("Coupon updated successfully");
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update coupon");
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));
