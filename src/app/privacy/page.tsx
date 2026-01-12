"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                    <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-slate max-w-none"
                >
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, request customer support, or communicate with us.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Contact information (name, email, phone number)</li>
                            <li>Account credentials</li>
                            <li>Payment information</li>
                            <li>Communication preferences</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            We use the information we collect to provide, maintain, and improve our services, including to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Process transactions and send related information</li>
                            <li>Send you technical notices, updates, and support messages</li>
                            <li>Respond to your comments, questions, and requests</li>
                            <li>Personalize and improve the services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Security</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no system is completely secure.
                        </p>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
