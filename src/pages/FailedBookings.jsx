import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useBookingStore } from '../store/useBookingStore';
import { Loader2, MapPin, AlertCircle, X, CheckCircle, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';

const FailedBookings = () => {
    const { failedBookings, fetchFailedBookings, nearbyServicers, fetchNearbyServicers, manualNotifyServicer, loading } = useBookingStore();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    useEffect(() => {
        fetchFailedBookings();
    }, [fetchFailedBookings]);

    const handleOpenAssignModal = async (booking) => {
        setSelectedBooking(booking);
        setIsAssignModalOpen(true);
        await fetchNearbyServicers(booking._id);
    };

    const handleAssign = async (servicerId, servicerType) => {
        try {
            await manualNotifyServicer(selectedBooking._id, servicerId, servicerType);
            setIsAssignModalOpen(false);
            fetchFailedBookings();
        } catch (error) {
            // Error managed in store
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        Failed Bookings (No Provider)
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Bookings where the auto-assignment failed due to lack of providers.
                    </p>
                </div>

                {loading && failedBookings.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
                    </div>
                ) : failedBookings.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">All good! No failed bookings found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {failedBookings.map((booking) => (
                            <div key={booking._id} className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-800 dark:text-white truncate">
                                                {booking.serviceCategoryName}
                                            </h3>
                                        </div>
                                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold">
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <User className="w-4 h-4" />
                                            <span>{booking.user?.fullName} ({booking.user?.phoneNo})</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">{booking.address}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-500 font-medium">Auto-assign Failed At</span>
                                            <span className="text-slate-700 dark:text-slate-200">
                                                {new Date(booking.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => handleOpenAssignModal(booking)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm"
                                    >
                                        <Search className="w-4 h-4" />
                                        Find Nearby Providers
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Assign Modal */}
            {isAssignModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                    Assign Provider
                                </h2>
                                <p className="text-sm text-slate-500">
                                    For {selectedBooking.serviceCategoryName}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-950/50">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                    <p className="text-slate-500">Scanning for nearby providers...</p>
                                </div>
                            ) : nearbyServicers.length === 0 ? (
                                <div className="text-center py-12">
                                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-600 dark:text-slate-400">No active, available providers found nearby.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {nearbyServicers.map((servicer) => (
                                        <div key={servicer._id.$oid || servicer._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                    <User className="w-6 h-6 text-slate-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                                        {servicer.fullname}
                                                        {servicer.type === "SINGLE_EMPLOYEE" ? (
                                                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 font-bold rounded">SINGLE</span>
                                                        ) : (
                                                            <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 font-bold rounded">TEAM</span>
                                                        )}
                                                    </h4>
                                                    <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            Distance away: {servicer.distance ? `~${(servicer.distance / 1000).toFixed(1)} km` : 'Nearby'}
                                                        </span>
                                                        <span>Phone No: {servicer.phoneNo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAssign(servicer._id.$oid || servicer._id, servicer.type === "SINGLE_EMPLOYEE" ? "single" : "team")}
                                                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-medium rounded-lg transition-colors text-sm shrink-0"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default FailedBookings;
