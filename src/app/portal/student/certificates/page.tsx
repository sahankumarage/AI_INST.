"use client";

import { motion } from "framer-motion";
import { Award, Download, Share2 } from "lucide-react";

// No certificates yet - placeholder
export default function StudentCertificatesPage() {
    const certificates: any[] = []; // Would come from API

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Certificates</h1>
                <p className="text-slate-500">Download and share your achievements</p>
            </div>

            {certificates.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 p-12 text-center"
                >
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Certificates Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Complete your enrolled courses to earn certificates. Each certificate can be downloaded as a PDF or shared on LinkedIn.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                        >
                            {/* Certificate Preview */}
                            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Award className="w-16 h-16 text-white/50" />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-slate-900 mb-1">{cert.courseName}</h3>
                                <p className="text-sm text-slate-500 mb-4">Completed on {cert.completedDate}</p>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                                        <Download size={16} />
                                        Download
                                    </button>
                                    <button className="py-2 px-4 bg-slate-100 text-slate-600 rounded-lg font-medium flex items-center gap-2">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
