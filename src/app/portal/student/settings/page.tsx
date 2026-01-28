"use client";

import { motion } from "framer-motion";
import { User, Mail, Lock, Bell, Save, Loader2, Camera, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAlert } from "@/components/ui/AlertService";

export default function StudentSettingsPage() {
    const alertService = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        avatar: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const userStr = localStorage.getItem("lms_user");
            if (userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);

                // Fetch latest data from API
                try {
                    const res = await fetch(`/api/student/profile?userId=${userData.id}`);
                    const data = await res.json();
                    if (res.ok && data.user) {
                        setUser(data.user);
                        setFormData({
                            firstName: data.user.firstName || "",
                            lastName: data.user.lastName || "",
                            email: data.user.email || "",
                            phone: data.user.phone || "",
                            avatar: data.user.avatar || ""
                        });
                        // Update local storage just in case
                        localStorage.setItem("lms_user", JSON.stringify({ ...userData, ...data.user }));
                    }
                } catch (e) {
                    console.error("Failed to fetch fresh profile", e);
                }
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file size and type if needed
            if (file.size > 5 * 1024 * 1024) {
                alertService.error("File Update", "Image size should be less than 5MB");
                return;
            }

            setIsUploading(true);
            const loadingId = alertService.loading("Uploading Avatar", "Please wait...");

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', 'avatars');

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Upload failed');
                }

                setFormData(prev => ({ ...prev, avatar: data.url }));
                alertService.dismissAlert(loadingId);
                alertService.success("Upload Successful", "Profile image uploaded");
            } catch (error: any) {
                alertService.dismissAlert(loadingId);
                alertService.error("Upload Failed", error.message);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSave = async () => {
        const userId = user?.id || user?._id;
        if (!userId) return;

        setIsLoading(true);
        const loadingId = alertService.loading("Saving Settings", "Updating your profile...");

        try {
            const res = await fetch('/api/student/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    avatar: formData.avatar
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Update failed');
            }

            // Update localStorage
            const updatedUser = { ...user, ...data.user };
            localStorage.setItem("lms_user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            alertService.dismissAlert(loadingId);
            alertService.success("Settings Saved", "Your profile has been updated successfully.");

            // Trigger a page refresh to update sidebar avatar
            window.location.reload();
        } catch (error: any) {
            alertService.dismissAlert(loadingId);
            alertService.error("Save Failed", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
                <p className="text-slate-500">Manage your profile and preferences</p>
            </div>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <User className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                </div>

                <div className="space-y-5">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
                                {formData.avatar ? (
                                    <img
                                        src={formData.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold uppercase">
                                        {formData.firstName?.charAt(0) || 'U'}
                                    </div>
                                )}

                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors"
                            >
                                <Camera size={16} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Your Avatar</h3>
                            <p className="text-sm text-slate-500 mb-3">Upload a picture to make your profile stand out.</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <Upload size={16} />
                                {isUploading ? 'Uploading...' : 'Upload New Image'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                            title="Email cannot be changed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+94 71 744 2222"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Password Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Lock className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
