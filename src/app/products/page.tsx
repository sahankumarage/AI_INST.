"use client";

import { motion } from "framer-motion";
import { Activity, Cloud, Key, Smartphone, ArrowRight, Sparkles, Zap, ExternalLink, Car, Stethoscope, PenTool } from "lucide-react";
import Link from "next/link";
import { products } from "@/data/products";

// Icon mapping for products
const iconMap: { [key: string]: React.ReactNode } = {
    "medflow-ai": <Stethoscope className="w-8 h-8" />,
    "flipka-ai": <Car className="w-8 h-8" />,
    "content-engine": <PenTool className="w-8 h-8" />,
    "smart-clinic-manager": <Activity className="w-8 h-8" />,
    "ai-analytics-suite": <Cloud className="w-8 h-8" />,
    "vision-api": <Key className="w-8 h-8" />,
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-white overflow-hidden">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Gradient Mesh Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-100/60 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[180px]" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-medium text-sm mb-6">
                            <Sparkles className="w-4 h-4" />
                            AI-Powered Products
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-slate-900">
                            Software That
                            <br />
                            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                                Thinks Ahead
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                            Enterprise-grade AI products built for scale. From healthcare to analytics, power your business with intelligent software.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products - Bento Grid Style */}
            <section className="px-6 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`group relative ${index === 0 ? 'md:col-span-2' : ''}`}
                            >
                                <Link href={`/products/${product.slug}`} className="block h-full">
                                    <div className={`
                                        relative h-full overflow-hidden rounded-3xl 
                                        bg-white
                                        border-2 border-slate-100 hover:border-emerald-400
                                        shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10
                                        transition-all duration-500
                                        ${index === 0 ? 'p-8 md:p-12' : 'p-8'}
                                    `}>
                                        {/* Corner Glow - Subtle */}
                                        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${product.gradient} opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />

                                        <div className="relative z-10">
                                            {/* Top Row: Icon + Badge */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                    {iconMap[product.slug]}
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${product.badgeColor}`}>
                                                    {product.badge}
                                                </span>
                                            </div>

                                            {/* Title & Subtitle */}
                                            <div className="mb-4">
                                                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block mb-2">
                                                    {product.subtitle}
                                                </span>
                                                <h3 className={`font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
                                                    {product.title}
                                                </h3>
                                            </div>

                                            {/* Description */}
                                            <p className={`text-slate-600 leading-relaxed mb-8 ${index === 0 ? 'text-lg max-w-2xl' : ''}`}>
                                                {index === 0 ? product.longDescription : product.description}
                                            </p>

                                            {/* Features as Pills */}
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {product.features.map((feature, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-sm border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors duration-300"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* CTA */}
                                            <div className="flex items-center gap-2 text-slate-900 font-semibold group-hover:text-emerald-600 transition-colors">
                                                <span>Explore Product</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                            </div>
                                        </div>

                                        {/* Floating External Link Icon */}
                                        <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-emerald-100 transition-all duration-300">
                                            <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Highlight Section */}
            <section className="px-6 pb-24">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                    >
                        <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                                99.9%
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Uptime SLA</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent mb-2">
                                50K+
                            </div>
                            <p className="text-slate-500 text-sm font-medium">API Requests/min</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent mb-2">
                                100+
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Integrations</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent mb-2">
                                24/7
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Support</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 pb-32">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-3xl overflow-hidden"
                    >
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

                        <div className="relative z-10 p-10 md:p-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Need a Custom Solution?
                            </h3>
                            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                                Can't find exactly what you need? Let's build something tailor-made for your business.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-4 rounded-full bg-white text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                    >
                                        Contact Us <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <Link href="/consulting">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-4 rounded-full bg-white/10 text-white font-semibold border border-white/30 hover:bg-white/20 transition-all duration-300"
                                    >
                                        Explore Consulting
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
