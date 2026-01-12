"use client";

import { motion } from "framer-motion";
import { Activity, Cloud, Key, Smartphone, Check, ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { products } from "@/data/products";

// Icon mapping for products
const iconMap: { [key: string]: React.ReactNode } = {
    "smart-clinic-manager": <Activity className="w-7 h-7" />,
    "ai-analytics-suite": <Cloud className="w-7 h-7" />,
    "vision-api": <Key className="w-7 h-7" />,
    "content-engine": <Smartphone className="w-7 h-7" />,
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary tracking-wide">Our Products</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Intelligent Software
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                            Built for Scale
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Scalable, secure, and powerful AI products designed to accelerate your innovation.
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className={`relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xl ${product.shadowColor} hover:shadow-2xl transition-all duration-500`}>

                                {/* Gradient Header */}
                                <div className={`relative h-32 bg-gradient-to-r ${product.gradient} p-6 overflow-hidden`}>
                                    {/* Decorative circles */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                                    <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-white/5 rounded-full" />

                                    {/* Badge */}
                                    <div className="relative flex justify-between items-start">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.badgeColor}`}>
                                            {product.badge}
                                        </span>

                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                            {iconMap[product.slug]}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 pt-6">
                                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">
                                        {product.subtitle}
                                    </p>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                                        {product.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed mb-6">
                                        {product.description}
                                    </p>

                                    {/* Features */}
                                    <div className="grid grid-cols-2 gap-3 mb-8">
                                        {product.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${product.gradient} flex items-center justify-center flex-shrink-0`}>
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Link href={`/products/${product.slug}`} className="block">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full px-6 py-4 rounded-2xl bg-gradient-to-r ${product.gradient} text-white font-semibold shadow-lg ${product.shadowColor} hover:shadow-xl flex items-center justify-center gap-2 transition-all`}
                                        >
                                            Learn More
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold">Need a Custom Solution?</p>
                                <p className="text-sm text-slate-400">Let's build something amazing together.</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
                        >
                            Contact Us <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
