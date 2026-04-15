import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from "react-hot-toast";

export const useTicketStore = create((set) => ({
    tickets: [],
    loading: false,

    fetchAllTickets: async (params = {}) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/tickets/admin/all", { params });
            set({ tickets: res.data.tickets || [] });
        } catch (error) {
            console.error("Error fetching tickets:", error);
            toast.error("Failed to fetch tickets");
        } finally {
            set({ loading: false });
        }
    },

    replyTicket: async (id, data) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.put(`/tickets/admin/reply/${id}`, data);
            toast.success("Reply sent successfully");
            set((state) => ({
                tickets: state.tickets.map((t) => (t._id === id ? res.data.ticket : t)),
            }));
            return res.data.ticket;
        } catch (error) {
            console.error("Error replying to ticket:", error);
            toast.error("Failed to send reply");
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    updateTicketStatus: async (id, status) => {
        try {
            const res = await axiosInstance.put(`/tickets/admin/status/${id}`, { status });
            toast.success(`Ticket status updated to ${status}`);
            set((state) => ({
                tickets: state.tickets.map((t) => (t._id === id ? res.data.ticket : t)),
            }));
            return res.data.ticket;
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    },

    fetchMessages: async (ticketId) => {
        try {
            const res = await axiosInstance.get(`/tickets/${ticketId}/messages`);
            return res.data.messages || [];
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    },

    sendChatMessage: async (ticketId, message) => {
        try {
            const res = await axiosInstance.post(`/tickets/${ticketId}/messages`, { message });
            return res.data.message;
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            throw error;
        }
    }
}));
