import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Loader from '../components/Loader';
import { useUserStore } from '../store/useUserStore';
import {
    Clock,
    ArrowLeft,
    ChevronRight,
    MapPin,
    DollarSign,
    User as UserIcon,
    Star,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Briefcase
} from 'lucide-react';

export default function UserHistory() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { fetchUserHistory, fetchBookingReview } = useUserStore();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        const loadHistory = async () => {
            const data = await fetchUserHistory(userId);
            setBookings(data);
            setLoading(false);
        };
        loadHistory();
    }, [userId, fetchUserHistory]);

    const handleViewReview = async (bookingId) => {
        setReviewLoading(true);
        const review = await fetchBookingReview(bookingId);
        setSelectedReview(review);
        setReviewLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
            case 'CANCELLED': return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800';
            case 'IN_PROGRESS': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800';
            default: return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800';
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col gap-6 pb-20">
                {/* Header */}
                <div className="flex items-center gap-6 card-premium !p-8 sticky top-0 z-20">
                    <button
                        onClick={() => navigate('/users')}
                        className="p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Operational Ledger</h1>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2">
                            Node Identity: <span className="font-mono text-indigo-600 dark:text-indigo-400">{userId}</span>
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center"><Loader /></div>
                ) : bookings.length === 0 ? (
                    <div className="card-premium !p-32 text-center border-dashed border-2 flex flex-col items-center gap-8">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-800 shadow-inner">
                            <Calendar size={48} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No protocol activity detected</h3>
                            <p className="text-xs text-slate-400 mt-2 font-medium italic">This node hasn't authorized any services in the current epoch.</p>
                        </div>
                        <button
                            onClick={() => navigate('/users')}
                            className="text-indigo-600 dark:text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:underline"
                        >
                            Return to Registry
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="card-premium hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-2xl transition-all duration-500 group"
                            >
                                <div className="flex flex-col lg:flex-row gap-8 justify-between">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800">
                                                    <Briefcase size={22} className="stroke-[2.5px]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{booking.serviceCategoryName}</h3>
                                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                                                        Log ID: <span className="font-mono">{booking._id?.slice(-12).toUpperCase()}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)} shadow-sm`}>
                                                {booking.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">Epoch Timestamp</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                                                        {new Date(booking.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-slate-700">
                                                    <DollarSign size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">Economic Yield</p>
                                                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">₹{booking.totalPrice?.toLocaleString() || 0}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 border border-slate-100 dark:border-slate-700">
                                                    <UserIcon size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">Technician Node</p>
                                                    <p className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase truncate">
                                                        {booking.primaryEmployee?.fullname || booking.servicerCompany?.storeName || "UNASSIGNED"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-5 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100/30 dark:border-indigo-800/20 shadow-inner">
                                            <MapPin size={16} className="text-indigo-400 dark:text-indigo-500 mt-0.5 shrink-0" />
                                            <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 leading-relaxed italic">
                                                {booking.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center lg:w-56 gap-4 border-t lg:border-t-0 lg:border-l border-slate-50 dark:border-slate-800 pt-8 lg:pt-0 lg:pl-8">
                                        {booking.status === 'COMPLETED' && (
                                            <button
                                                onClick={() => handleViewReview(booking._id)}
                                                className="btn-secondary-premium w-full shadow-sm !py-4"
                                            >
                                                <Star size={14} /> View Review
                                            </button>
                                        )}
                                        <button className="btn-premium w-full !py-4">
                                            Details <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Review Section (Conditionally Expanded) */}
                                {selectedReview?._id === booking._id && (
                                    <div className="mt-8 p-10 bg-amber-50 dark:bg-amber-900/20 rounded-[40px] border border-amber-100 dark:border-amber-800/40 animate-in slide-in-from-top-4 duration-300 relative overflow-hidden shadow-inner">
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest">Protocol Feedback</h4>
                                                <div className="flex gap-1 bg-white dark:bg-amber-900/40 p-2 rounded-xl border border-amber-100 dark:border-amber-800 shadow-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            fill={i < selectedReview.rating ? "#f59e0b" : "none"}
                                                            className={i < selectedReview.rating ? "text-amber-500" : "text-amber-200/40"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-lg text-amber-900 dark:text-amber-200 font-bold italic leading-relaxed text-center py-4">
                                                "{selectedReview.comment || "No transmission feedback received..."}"
                                            </p>
                                            <div className="mt-6 flex items-center justify-center gap-3 text-[10px] text-amber-600 dark:text-amber-500 font-black uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                                Verified Operational Quality
                                            </div>
                                        </div>
                                        {/* Decorative Icon */}
                                        <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] dark:opacity-[0.1] pointer-events-none rotate-12">
                                            <Star size={200} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Backdrop Loader for Review Fetch */}
            {reviewLoading && (
                <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <Loader />
                </div>
            )}
        </AdminLayout>
    );
}
