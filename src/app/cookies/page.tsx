"use client";

import { motion } from "framer-motion";

export default function CookiePolicy() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie Policy</h1>
                    <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-slate max-w-none"
                >
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. What Are Cookies</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Cookies</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Account related cookies</li>
                            <li>Login related cookies</li>
                            <li>Site preferences cookies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Disabling Cookies</h2>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
                        </p>
                    </section>
                </motion.div>
            </div>
        </main>
    );
}
