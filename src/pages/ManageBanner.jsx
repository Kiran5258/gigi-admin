import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useBannerStore } from "../store/useBannerStore";
import { Plus, Edit, Trash2, Search, X, Image as ImageIcon, Layout, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

export default function ManageBanner() {
    const { banners, loading, fetchBanners, createBanner, updateBanner, deleteBanner } = useBannerStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null
    });

    const [preview, setPreview] = useState("");

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const handleOpenAdd = () => {
        setEditingBanner(null);
        setFormData({ title: "", description: "", image: null });
        setPreview("");
        setIsFormOpen(true);
    };

    const handleOpenEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            description: banner.description,
            image: null
        });
        setPreview(banner.img);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingBanner(null);
        setFormData({ title: "", description: "", image: null });
        setPreview("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result });
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            toast.error("Title and Description are required");
            return;
        }

        if (!editingBanner && !formData.image) {
            toast.error("Please upload an image");
            return;
        }

        let success = false;
        if (editingBanner) {
            success = await updateBanner(editingBanner._id, formData);
        } else {
            success = await createBanner(formData);
        }

        if (success) {
            handleCloseForm();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this promotional banner?")) {
            await deleteBanner(id);
        }
    };

    const filteredBanners = banners.filter(banner =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-[1600px] mx-auto space-y-10 pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Promotion Hub</h1>
                        <p className="text-slate-500 font-medium italic mt-1 flex items-center gap-2">
                            <Sparkles size={14} className="text-amber-500" /> Curate visual aesthetics for the application landing
                        </p>
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="btn-premium group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span>DEPLOY NEW ASSET</span>
                    </button>
                </div>

                {/* Filters & Stats */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full md:w-[450px] group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="QUERY ASSET REGISTRY..."
                            className="input-premium pl-14 uppercase !py-5 dark:bg-slate-900/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-6 px-8 py-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Layout size={18} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Active Inventory: {banners.length}</span>
                    </div>
                </div>

                {/* Content Grid */}
                {loading && banners.length === 0 ? (
                    <div className="py-40 flex flex-col items-center gap-4">
                        <Loader />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">Syncing assets...</span>
                    </div>
                ) : filteredBanners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredBanners.map((banner) => (
                            <div
                                key={banner._id}
                                className="card-premium !p-0 overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full bg-white dark:bg-slate-900"
                            >
                                <div className="h-64 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <img
                                        src={banner.img}
                                        alt={banner.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                        <div className="flex items-center gap-3 w-full">
                                            <button
                                                onClick={() => handleOpenEdit(banner)}
                                                className="flex-1 bg-white/20 backdrop-blur-md text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all border border-white/20"
                                            >
                                                Modify asset
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner._id)}
                                                className="p-3 bg-rose-500/80 backdrop-blur-md text-white rounded-2xl hover:bg-rose-600 transition-all border border-rose-400/20"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-indigo-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-400/30">
                                            Live Asset
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase truncate mb-3">
                                            {banner.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2">
                                            {banner.description}
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle size={14} className="text-amber-500" />
                                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Public visibility active</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">#{banner._id?.slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card-premium !p-32 text-center flex flex-col items-center gap-8 border-dashed border-2">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center text-slate-200 dark:text-slate-700">
                            <ImageIcon size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Asset Registry Empty</h3>
                            <p className="text-xs text-slate-400 mt-2 font-medium italic px-20">Initialize promotional campaigns by deploying new visual assets to the platform cluster.</p>
                        </div>
                        <button onClick={handleOpenAdd} className="btn-secondary-premium">
                            <Plus size={16} /> INITIALIZE FIRST DEPLOYMENT
                        </button>
                    </div>
                )}

                {/* Backdrop Form */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-500">
                            <div className="flex justify-between items-center p-10 border-b border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        {editingBanner ? "Modify Asset" : "Assemble Asset"}
                                    </h2>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2">Asset Configuration Protocol</p>
                                </div>
                                <button onClick={handleCloseForm} className="p-4 bg-white dark:bg-slate-800 rounded-[20px] text-slate-400 dark:text-slate-500 hover:text-rose-500 shadow-sm transition-all border border-slate-100 dark:border-slate-700 active:scale-95">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Asset Headline</label>
                                            <input
                                                type="text"
                                                className="input-premium uppercase !py-4 dark:bg-slate-800/50"
                                                placeholder="ENTER CAMPAIGN TITLE..."
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contextual Info</label>
                                            <textarea
                                                className="input-premium h-40 resize-none !py-4 italic dark:bg-slate-800/50"
                                                placeholder="DESCRIBE CAMPAIGN OBJECTIVES..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Visual Payload</label>
                                        <div className="h-[285px] relative group">
                                            <ImageUpload
                                                handleImageChange={handleImageChange}
                                                preview={preview}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="px-8 py-5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-premium !py-5 shadow-2xl shadow-indigo-100"
                                    >
                                        {loading ? "INITIALIZING SYNC..." : (editingBanner ? "AUTHORIZE UPDATE" : "AUTHORIZE DEPLOYMENT")}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
