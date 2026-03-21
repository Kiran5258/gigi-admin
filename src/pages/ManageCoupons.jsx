import React, { useEffect, useState } from "react";
import { Plus, Edit2, CheckCircle, XCircle, Trash2, Tag } from "lucide-react";
import { useCouponStore } from "../store/useCouponStore";
import AdminLayout from "../components/AdminLayout";

const ManageCoupons = () => {
    const { coupons, loading, getCoupons, createCoupon, updateCoupon } = useCouponStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const [formData, setFormData] = useState({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        maxDiscount: "",
        minOrderValue: "0",
        validFrom: "",
        validUntil: "",
        usageLimit: "",
        isActive: true,
    });

    useEffect(() => {
        getCoupons();
    }, [getCoupons]);

    const handleOpenModal = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                maxDiscount: coupon.maxDiscount || "",
                minOrderValue: coupon.minOrderValue || 0,
                validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : "",
                validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : "",
                usageLimit: coupon.usageLimit || "",
                isActive: coupon.isActive,
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: "",
                discountType: "PERCENTAGE",
                discountValue: "",
                maxDiscount: "",
                minOrderValue: "0",
                validFrom: "",
                validUntil: "",
                usageLimit: "",
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format payload
        const payload = {
            ...formData,
            discountValue: Number(formData.discountValue),
            maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
            minOrderValue: Number(formData.minOrderValue),
            usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        };

        if (editingCoupon) {
            const success = await updateCoupon(editingCoupon._id, payload);
            if (success) handleCloseModal();
        } else {
            const success = await createCoupon(payload);
            if (success) handleCloseModal();
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                        Coupons Hub
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Create and manage discount codes
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                >
                    <Plus size={18} />
                    New Coupon
                </button>
            </div>

            {/* Coupons List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Validity</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading && coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading coupons...</td>
                                </tr>
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 font-medium">No coupons found. Create one to get started!</td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    <Tag size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{coupon.code}</p>
                                                    <p className="text-xs font-medium text-slate-500">Min Order: ₹{coupon.minOrderValue || 0}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500">
                                                {coupon.maxDiscount ? `Max: ₹${coupon.maxDiscount}` : 'No Max'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-medium text-slate-900 dark:text-slate-300">
                                                {new Date(coupon.validFrom).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500">
                                                To: {new Date(coupon.validUntil).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none ${coupon.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                                {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleOpenModal(coupon)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                                title="Edit Coupon"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <form id="couponForm" onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Code */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Coupon Code *</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            required
                                            disabled={!!editingCoupon} // Often codes shouldn't be edited once created, but depending on reqs.
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase disabled:opacity-50"
                                            placeholder="e.g. SUMMER50"
                                        />
                                    </div>
                                    
                                    {/* Discount Type */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Discount Type *</label>
                                        <select
                                            name="discountType"
                                            value={formData.discountType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="PERCENTAGE">Percentage (%)</option>
                                            <option value="FLAT">Flat Amount (₹)</option>
                                        </select>
                                    </div>

                                    {/* Discount Value */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Discount Value *</label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={formData.discountValue}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g. 20"
                                        />
                                    </div>

                                    {/* Max Discount */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Max Discount (₹)</label>
                                        <input
                                            type="number"
                                            name="maxDiscount"
                                            value={formData.maxDiscount}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Leave empty for unlimited"
                                        />
                                    </div>

                                    {/* Min Order Value */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Min Order Value (₹)</label>
                                        <input
                                            type="number"
                                            name="minOrderValue"
                                            value={formData.minOrderValue}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g. 500"
                                        />
                                    </div>

                                    {/* Usage Limit */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Usage Limit</label>
                                        <input
                                            type="number"
                                            name="usageLimit"
                                            value={formData.usageLimit}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Total number of times usable"
                                        />
                                    </div>

                                    {/* Valid From */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Valid From *</label>
                                        <input
                                            type="datetime-local"
                                            name="validFrom"
                                            value={formData.validFrom}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    {/* Valid Until */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Valid Until *</label>
                                        <input
                                            type="datetime-local"
                                            name="validUntil"
                                            value={formData.validUntil}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Is Active */}
                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-indigo-500 cursor-pointer"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                        Coupon is Active
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-b-2xl flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={loading}
                                className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="couponForm"
                                disabled={loading}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-70 flex items-center gap-2"
                            >
                                {loading && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                                {editingCoupon ? "Save Changes" : "Create Coupon"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </AdminLayout>
    );
};

export default ManageCoupons;
