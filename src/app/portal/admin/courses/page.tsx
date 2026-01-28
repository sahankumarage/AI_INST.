"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    X,
    Save,
    Users,
    DollarSign,
    Loader2,
    RefreshCw,
    Database
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAlert } from "@/components/ui/AlertService";
import { useConfirmModal } from "@/components/ui/ConfirmModal";

interface Course {
    _id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    level: string;
    duration: string;
    thumbnail?: string;
    enrolledCount: number;
    isPublished: boolean;
    productId?: string;
    promoCodes?: any[];
}

export default function AdminCoursesPage() {
    const alert = useAlert();
    const { showConfirm, ConfirmModal } = useConfirmModal();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        thumbnail: "",
        price: 0,
        level: "Beginner",
        duration: "",
        isPublished: false,
        productId: "",
        promoCodes: [] as any[]
    });

    const [newPromoCode, setNewPromoCode] = useState("");
    const [newPromoDiscount, setNewPromoDiscount] = useState("");

    // Gradient based on index
    const getGradient = (index: number) => {
        const gradients = [
            "from-indigo-500 to-violet-500",
            "from-blue-500 to-cyan-500",
            "from-rose-500 to-orange-400",
            "from-emerald-500 to-teal-500",
            "from-purple-500 to-pink-500"
        ];
        return gradients[index % gradients.length];
    };

    // Fetch courses
    const fetchCourses = async (showNotification = false) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/courses');
            const data = await res.json();
            setCourses(data.courses || []);
            if (showNotification) {
                alert.success("Courses Loaded", `Found ${data.courses?.length || 0} courses`);
            }
            // Debug logging
            console.log('Fetched courses:', data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            alert.error("Failed to load courses", "Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Seed courses
    const handleSeed = () => {
        showConfirm({
            title: "Seed Database",
            message: "This will add sample courses to the database. This is useful for testing. Continue?",
            type: "warning",
            confirmLabel: "Seed Courses",
            onConfirm: async () => {
                setIsSeeding(true);
                const loadingId = alert.loading("Seeding Courses", "Adding sample courses to database...");
                try {
                    const res = await fetch('/api/courses', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'seed', force: true })
                    });
                    const data = await res.json();
                    alert.dismissAlert(loadingId);
                    alert.success("Seeding Complete", data.message || "Sample courses added successfully");
                    fetchCourses();
                } catch (error) {
                    console.error('Seed error:', error);
                    alert.dismissAlert(loadingId);
                    alert.error("Seeding Failed", "Could not add sample courses");
                } finally {
                    setIsSeeding(false);
                }
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                setFormData(prev => ({ ...prev, thumbnail: ev.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({
            title: "",
            description: "",
            thumbnail: "",
            price: 0,
            level: "Beginner",
            duration: "",
            isPublished: false,
            productId: "",
            promoCodes: []
        });
        setNewPromoCode("");
        setNewPromoDiscount("");
        setIsModalOpen(true);
    };

    const openEditModal = (course: Course) => {
        console.log('Editing course:', course);
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail || "",
            price: course.price,
            level: course.level,
            duration: course.duration,
            isPublished: course.isPublished,
            productId: course.productId || "",
            promoCodes: course.promoCodes || []
        });
        setNewPromoCode("");
        setNewPromoDiscount("");
        setIsModalOpen(true);
    };

    // Simple local handlers for promo codes - saved when course is saved
    const handleAddPromo = () => {
        console.log('handleAddPromo called', { newPromoCode, newPromoDiscount });

        if (!newPromoCode.trim() || !newPromoDiscount.trim()) {
            alert.error("Missing Info", "Please enter both a code and discount amount");
            return;
        }

        const newCode = {
            code: newPromoCode.trim().toUpperCase(),
            discountType: 'percentage',
            discountAmount: Number(newPromoDiscount),
            usedCount: 0
        };

        console.log('Adding promo code:', newCode);

        const updatedPromoCodes = [...(formData.promoCodes || []), newCode];
        console.log('Updated promo codes array:', updatedPromoCodes);

        setFormData({
            ...formData,
            promoCodes: updatedPromoCodes
        });

        setNewPromoCode("");
        setNewPromoDiscount("");

        alert.success("Code Added", `"${newCode.code}" added - click Save to persist`);
    };

    const handleRemovePromo = (index: number) => {
        console.log('handleRemovePromo called', { index });

        const updated = [...(formData.promoCodes || [])];
        const removed = updated.splice(index, 1);
        console.log('Removed code:', removed);

        setFormData({
            ...formData,
            promoCodes: updated
        });

        alert.info("Code Removed", "Click Save to persist changes");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const action = editingCourse ? "Updating" : "Creating";
        const loadingId = alert.loading(`${action} Course`, "Please wait...");

        // Build the payload explicitly
        const payload = {
            ...formData,
            promoCodes: formData.promoCodes || []
        };

        console.log('=== SUBMIT DEBUG ===');
        console.log('formData.promoCodes:', formData.promoCodes);
        console.log('Full payload being sent:', JSON.stringify(payload, null, 2));

        try {
            if (editingCourse) {
                // Update
                const updatePayload = {
                    id: editingCourse._id,
                    ...payload
                };
                console.log('UPDATE payload:', JSON.stringify(updatePayload, null, 2));

                const res = await fetch('/api/admin/courses', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePayload)
                });

                const responseData = await res.json();
                console.log('UPDATE response:', responseData);

                if (!res.ok) throw new Error(responseData.message || 'Failed to update');
                alert.dismissAlert(loadingId);
                alert.success("Course Updated", `"${formData.title}" has been updated successfully`);
            } else {
                // Create
                console.log('CREATE payload:', JSON.stringify(payload, null, 2));

                const res = await fetch('/api/admin/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const responseData = await res.json();
                console.log('CREATE response:', responseData);

                if (!res.ok) throw new Error(responseData.message || 'Failed to create');
                alert.dismissAlert(loadingId);
                alert.success("Course Created", `"${formData.title}" has been created successfully`);
            }

            setIsModalOpen(false);
            fetchCourses();
        } catch (error: any) {
            console.error('Save error:', error);
            alert.dismissAlert(loadingId);
            alert.error(`Failed to ${editingCourse ? 'update' : 'create'} course`, error.message || "Please try again");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string, courseTitle: string) => {
        showConfirm({
            title: "Delete Course",
            message: `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`,
            type: "delete",
            confirmLabel: "Delete Course",
            onConfirm: async () => {
                const loadingId = alert.loading("Deleting Course", "Removing course...");
                try {
                    const res = await fetch(`/api/admin/courses?id=${id}`, {
                        method: 'DELETE'
                    });
                    if (!res.ok) throw new Error('Failed to delete');
                    alert.dismissAlert(loadingId);
                    alert.success("Course Deleted", "The course has been removed successfully");
                    fetchCourses();
                } catch (error) {
                    console.error('Delete error:', error);
                    alert.dismissAlert(loadingId);
                    alert.error("Delete Failed", "Could not delete the course");
                }
            }
        });
    };

    const togglePublish = async (course: Course) => {
        const newStatus = !course.isPublished;
        const statusText = newStatus ? "Published" : "Unpublished";
        try {
            const res = await fetch('/api/admin/courses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: course._id, isPublished: newStatus })
            });
            if (!res.ok) throw new Error('Failed to update');
            alert.success(`Course ${statusText}`, `"${course.title}" is now ${statusText.toLowerCase()}`);
            fetchCourses();
        } catch (error) {
            console.error('Toggle error:', error);
            alert.error("Update Failed", "Could not change publish status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Course Management</h1>
                    <p className="text-slate-500">Create, edit, and manage your courses</p>
                </div>
                <div className="flex gap-3">

                    <button
                        onClick={() => fetchCourses(true)}
                        className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/25"
                    >
                        <Plus size={18} />
                        Create Course
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>
            </div>

            {/* Empty State */}
            {courses.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Courses Yet</h3>
                    <p className="text-slate-500 mb-6">Get started by creating your first course.</p>

                </div>
            )}

            {/* Courses Grid */}
            {courses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, i) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            {/* Thumbnail */}
                            <div className={`h-32 bg-gradient-to-br ${getGradient(i)} relative`}>
                                {course.thumbnail && (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover absolute inset-0" />
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${course.isPublished
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-700 text-white'
                                        }`}>
                                        {course.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} />
                                        {course.enrolledCount || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        LKR {course.price.toLocaleString()}
                                    </span>
                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                                        {course.level}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(course)}
                                        className="flex-1 py-2 px-3 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Edit3 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => togglePublish(course)}
                                        className="flex-1 py-2 px-3 bg-indigo-100 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-200 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Eye size={14} />
                                        {course.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id, course.title)}
                                        className="py-2 px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Add New Course Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={openCreateModal}
                        className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 min-h-[320px] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                    >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-indigo-500">
                            <Plus size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">Add New Course</h3>
                        <p className="text-sm text-slate-500">Create a new course</p>
                    </motion.div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        placeholder="e.g., AI-Driven Web Development"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                                        placeholder="Brief description of the course..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Product ID (Dodo Payments)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.productId}
                                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        placeholder="e.g., prod_..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image</label>
                                    <div className="flex items-start gap-4">
                                        {(formData.thumbnail || editingCourse?.thumbnail) && (
                                            <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100 relative">
                                                <img
                                                    src={formData.thumbnail || editingCourse?.thumbnail}
                                                    alt="Cover"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, thumbnail: "" })}
                                                    className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-md hover:bg-red-600"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-slate-500
                                                    file:mr-4 file:py-2.5 file:px-4
                                                    file:rounded-xl file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100 transition-colors
                                                "
                                            />
                                            <p className="mt-1 text-xs text-slate-400">JPG, PNG or WEBP (Max 2MB)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (LKR)</label>
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="e.g., 8 Weeks"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>

                                {/* Promo Codes Section */}
                                <div className="border-t border-slate-100 pt-5">
                                    <h3 className="text-sm font-bold text-slate-900 mb-3">Promo Codes</h3>

                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Code (e.g. SAVE20)"
                                            value={newPromoCode}
                                            onChange={(e) => setNewPromoCode(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Discount %"
                                            value={newPromoDiscount}
                                            onChange={(e) => setNewPromoDiscount(e.target.value)}
                                            className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddPromo}
                                            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="space-y-2 mb-2">
                                        {formData.promoCodes?.map((promo: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                        %
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{promo.code}</p>
                                                        <p className="text-xs text-slate-500">{promo.discountAmount}% Off</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePromo(idx)}
                                                    className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {(!formData.promoCodes || formData.promoCodes.length === 0) && (
                                            <div className="text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                                <p className="text-xs text-slate-400">No promo codes active</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">
                                        Publish immediately
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        {editingCourse ? 'Save Changes' : 'Create Course'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Modal */}
            <ConfirmModal />
        </div>
    );
}
