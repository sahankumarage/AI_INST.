"use client";

import { motion } from "framer-motion";

export default function TermsOfService() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                    <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-slate max-w-none"
                >
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            By accessing or using our websites, services, and products, you agree to be bound by these Terms of Service. If you do not agree to these terms, simply do not use our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            Permission is granted to temporarily download one copy of the materials (information or software) on AI_INST.'s website for personal, non-commercial transitory viewing only.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>This is the grant of a license, not a transfer of title.</li>
                            <li>You may not modify or copy the materials.</li>
                            <li>You may not use the materials for any commercial purpose.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Disclaimer</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            The materials on AI_INST.'s website are provided on an 'as is' basis. AI_INST. makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
