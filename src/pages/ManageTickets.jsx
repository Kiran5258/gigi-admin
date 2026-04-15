import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import Loader from '../components/Loader';
import { useTicketStore } from '../store/useTicketStore';
import { 
    Search, 
    MessageSquare, 
    Filter, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    User, 
    Briefcase, 
    Phone, 
    Calendar,
    ChevronRight,
    Send,
    Image as ImageIcon,
    X
} from 'lucide-react';

export default function ManageTickets() {
    const { tickets, loading, fetchAllTickets, replyTicket, updateTicketStatus, fetchMessages, sendChatMessage } = useTicketStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState("");
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        const params = {};
        if (searchTerm) params.phoneNo = searchTerm;
        if (typeFilter !== "All") params.type = typeFilter.toLowerCase();
        
        fetchAllTickets(params);
    }, [fetchAllTickets, typeFilter]);

    useEffect(() => {
        if (selectedTicket && selectedTicket.supportType === "Chat") {
            const getMsgs = async () => {
                const msgs = await fetchMessages(selectedTicket._id);
                setMessages(msgs);
            };
            getMsgs();
        }
    }, [selectedTicket, fetchMessages]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchTerm) params.phoneNo = searchTerm;
        if (typeFilter !== "All") params.type = typeFilter.toLowerCase();
        fetchAllTickets(params);
    };

    const filteredTickets = (tickets || []).filter(t => 
        statusFilter === "All" || t.status === statusFilter
    );

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        try {
            setIsReplying(true);
            const updatedTicket = await replyTicket(selectedTicket._id, { 
                adminReply: replyMessage,
                status: "In progress" 
            });
            setSelectedTicket(updatedTicket);
            
            // Refresh messages if it's a chat
            if (selectedTicket.supportType === "Chat") {
                const msgs = await fetchMessages(selectedTicket._id);
                setMessages(msgs);
            }
            
            setReplyMessage("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsReplying(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'In progress': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
            case 'Resolved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Closed': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Support Center</h1>
                        <p className="text-slate-500 font-medium italic mt-1">Managing {tickets.length} active service tickets and complaints</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH BY PHONE NUMBER..."
                            className="input-premium pl-12 uppercase !py-4 dark:bg-slate-900/50 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-100 dark:shadow-none">
                    <div className="flex items-center gap-2 mr-4">
                        <Filter size={16} className="text-indigo-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Filters:</span>
                    </div>
                    
                    <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-700">
                        {["All", "Open", "In progress", "Resolved", "Closed"].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                    statusFilter === status 
                                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-700 ml-auto">
                        {["All", "User", "Servicer"].map(type => (
                            <button
                                key={type}
                                onClick={() => setTypeFilter(type)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                    typeFilter === type 
                                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && tickets.length === 0 ? (
                    <div className="py-40 flex justify-center">
                        <Loader />
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="card-premium !p-20 text-center animate-pulse border-dashed border-2 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700">
                            <MessageSquare size={40} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching tickets found</h3>
                            <p className="text-xs text-slate-400 mt-2 font-medium italic">All queries are currently addressed.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredTickets.map((ticket) => (
                            <div 
                                key={ticket._id} 
                                className={`card-premium !p-0 overflow-hidden group transition-all duration-500 flex flex-col bg-white dark:bg-slate-900 border-l-4 ${
                                    ticket.status === 'Open' ? 'border-l-amber-500' : 
                                    ticket.status === 'In progress' ? 'border-l-indigo-500' : 
                                    'border-l-emerald-500'
                                }`}
                            >
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-2xl ${ticket.raisedByModel === 'User' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                                {ticket.raisedByModel === 'User' ? <User size={20} /> : <Briefcase size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
                                                    {ticket.raisedBy?.fullName || ticket.raisedBy?.name || ticket.raisedBy?.ownerName || "ANONYMOUS ENTITY"}
                                                    <span className="text-[10px] font-black text-slate-400 px-2 py-0.5 border border-slate-100 dark:border-slate-800 rounded-md bg-slate-50 dark:bg-slate-800/50">
                                                        {ticket.raisedByModel.toUpperCase()}
                                                    </span>
                                                </h3>
                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Phone size={10} /> {ticket.raisedBy?.phoneNo || "NO TELEMETRY"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${getStatusColor(ticket.status)} shadow-sm`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority} PRIORITY
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ticket.category}</span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                                            "{ticket.message}"
                                        </p>
                                        {ticket.image && (
                                            <button className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase hover:underline">
                                                <ImageIcon size={14} /> View Attached Evidence
                                            </button>
                                        )}
                                    </div>

                                    {ticket.adminReply && (
                                        <div className="p-5 border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/5 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2">
                                                <CheckCircle2 size={16} className="text-indigo-400" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Admin Response</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm italic pr-4">
                                                {ticket.adminReply}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Calendar size={14} />
                                            {new Date(ticket.createdAt).toLocaleString()}
                                        </div>
                                        <button 
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all flex items-center gap-2 group-hover:shadow-lg"
                                        >
                                            {ticket.adminReply ? "MANAGE" : "RESOLVE"} <ChevronRight size={14} className="stroke-[3px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ticket Management Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        <button 
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-800 hover:rotate-90 transition-all duration-300 z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-10 space-y-8">
                            <div className="flex items-start gap-6">
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl shadow-xl ${
                                    selectedTicket.raisedByModel === 'User' 
                                    ? 'bg-indigo-600 text-white shadow-indigo-200' 
                                    : 'bg-emerald-600 text-white shadow-emerald-200'
                                }`}>
                                    {selectedTicket.raisedBy?.fullName?.[0] || selectedTicket.raisedBy?.name?.[0] || "?"}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                            {selectedTicket.raisedBy?.fullName || selectedTicket.raisedBy?.name || "IDENTITY_ALPHA"}
                                        </h2>
                                        <span className={`text-[9px] font-black uppercase border px-3 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Phone size={12} /> {selectedTicket.raisedBy?.phoneNo}
                                        </p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} /> RAISED {new Date(selectedTicket.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                                            {selectedTicket.supportType === 'Chat' ? 'CONVERSATION FEED' : 'REPORTED INCIDENT'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 italic">#{selectedTicket._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    
                                    {selectedTicket.supportType === 'Chat' ? (
                                        <div className="space-y-4 max-h-60 overflow-y-auto pr-4 scrollbar-hide">
                                            {messages.map((msg, idx) => (
                                                <div key={idx} className={`flex flex-col ${msg.senderModel === 'Admin' ? 'items-end' : 'items-start'}`}>
                                                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium ${
                                                        msg.senderModel === 'Admin' 
                                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-tl-none'
                                                    }`}>
                                                        {msg.message}
                                                    </div>
                                                    <span className="text-[8px] text-slate-400 font-black mt-1 uppercase tracking-tighter">
                                                        {msg.senderModel} • {new Date(msg.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            ))}
                                            {messages.length === 0 && (
                                                <p className="text-slate-700 dark:text-slate-200 font-medium italic leading-relaxed">
                                                    "{selectedTicket.message}"
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-lg text-slate-700 dark:text-slate-200 font-medium italic leading-relaxed">
                                            "{selectedTicket.message}"
                                        </p>
                                    )}
                                    
                                    {selectedTicket.image && (
                                        <div className="mt-6">
                                            <img src={selectedTicket.image} alt="ticket-proof" className="max-h-48 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 px-2">
                                        <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Protocol Response</span>
                                        <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
                                    </div>

                                    <form onSubmit={handleReplySubmit} className="space-y-6">
                                        <div className="relative group">
                                            <textarea 
                                                className="input-premium min-h-[150px] !py-6 !px-8 uppercase !text-xs !leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                                placeholder="ENTER RESOLUTION PROTOCOL OR REPLY..."
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <div className="flex gap-4">
                                            <button 
                                                type="button"
                                                disabled={isReplying}
                                                onClick={() => updateTicketStatus(selectedTicket._id, "Resolved")}
                                                className="flex-1 py-5 bg-emerald-500 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-200 dark:hover:shadow-emerald-900/40 transition-all disabled:opacity-50"
                                            >
                                                MARK AS RESOLVED
                                            </button>
                                            <button 
                                                type="submit"
                                                disabled={isReplying || !replyMessage.trim()}
                                                className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:scale-[1.02] shadow-xl transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                                            >
                                                {isReplying ? "TRANSMITTING..." : (
                                                    <><Send size={16} /> TRANSMIT REPLY</>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
