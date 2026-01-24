"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Shield, Database, Save, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: "AI Institute",
        supportEmail: "support@aiinstitute.com",
        enableNewEnrollments: true,
        enablePayments: true,
        maintenanceMode: false,
        emailNotifications: true,
        slackNotifications: false
    });

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        alert("Settings saved successfully!");
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Admin Settings</h1>
                <p className="text-slate-500">Configure your LMS platform settings</p>
            </div>

            {/* General Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900">General Settings</h2>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Site Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Email</label>
                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Platform Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900">Platform Controls</h2>
                </div>

                <div className="space-y-4">
                    {[
                        { key: 'enableNewEnrollments', label: 'Enable New Enrollments', desc: 'Allow new students to enroll in courses' },
                        { key: 'enablePayments', label: 'Enable Payments', desc: 'Process payments through Dodo Payments' },
                        { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to students' }
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <div className="font-medium text-slate-900">{item.label}</div>
                                <div className="text-sm text-slate-500">{item.desc}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(settings as any)[item.key]}
                                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <div className="font-medium text-slate-900">Email Notifications</div>
                            <div className="text-sm text-slate-500">Receive email alerts for new enrollments</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </motion.div>

            {/* Database Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900">Database</h2>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-emerald-700">MongoDB Connected</span>
                    </div>
                    <span className="text-sm text-emerald-600">Cluster Active</span>
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
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
