"use client";

import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import {
    ArrowLeft,
    Check,
    ArrowRight,
    Sparkles,
    Activity,
    Cloud,
    Key,
    Smartphone,
    Zap,
    Shield,
    Layers,
    Code2
} from "lucide-react";
import { getProductBySlug, products } from "@/data/products";
import { UIShowcaseSection } from "@/components/products/UIShowcaseSection";

// Icon mapping for products
const iconMap: { [key: string]: React.ReactNode } = {
    "smart-clinic-manager": <Activity className="w-10 h-10" />,
    "ai-analytics-suite": <Cloud className="w-10 h-10" />,
    "vision-api": <Key className="w-10 h-10" />,
    "content-engine": <Smartphone className="w-10 h-10" />,
};

const benefitIcons = [Zap, Shield, Layers, Code2];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const product = getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className={`relative pt-32 pb-20 px-6 bg-gradient-to-br ${product.gradient} overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Products
                        </Link>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Content */}
                        <div className="flex-1">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${product.badgeColor} mb-4`}
                            >
                                {product.badge}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-bold text-white mb-4"
                            >
                                {product.title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-white/80 mb-8 max-w-xl"
                            >
                                {product.longDescription}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Link href="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold shadow-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    >
                                        Request Demo <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-colors"
                                >
                                    Documentation
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Icon/Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex-shrink-0"
                        >
                            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-2xl">
                                {iconMap[product.slug]}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-primary font-medium tracking-wider text-sm uppercase mb-3 block"
                        >
                            Core Features
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-slate-900"
                        >
                            Everything You Need
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {product.features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center"
                            >
                                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${product.gradient} flex items-center justify-center mb-4`}>
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                                <p className="font-semibold text-slate-900">{feature}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* UI Showcase Section - Scroll-Jacking Feature Tour */}
            <UIShowcaseSection
                showcase={product.uiShowcase}
                gradient={product.gradient}
                productTitle={product.title}
            />

            {/* Benefits Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block"
                        >
                            Why Choose This?
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-slate-900"
                        >
                            Key Benefits
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {product.benefits.map((benefit, i) => {
                            const Icon = benefitIcons[i % benefitIcons.length];
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${product.gradient} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                                        <p className="text-slate-500 leading-relaxed">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Use Cases & Tech Specs */}
            <section className="py-20 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Use Cases */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary font-medium tracking-wider text-sm uppercase mb-3 block">
                                Use Cases
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold mb-8">Perfect For</h3>

                            <div className="space-y-4">
                                {product.useCases.map((useCase, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${product.gradient} flex items-center justify-center`}>
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-lg">{useCase}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Tech Specs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-secondary font-medium tracking-wider text-sm uppercase mb-3 block">
                                Technical
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold mb-8">Specifications</h3>

                            <div className="space-y-4">
                                {product.techSpecs.map((spec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10"
                                    >
                                        <span className="text-slate-400">{spec.label}</span>
                                        <span className="font-semibold">{spec.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`p-12 rounded-3xl bg-gradient-to-r ${product.gradient} text-white`}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                            Transform your business with {product.title}. Contact our team for a personalized demo.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold shadow-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    Contact Sales <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <Link href="/products">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold border border-white/30 hover:bg-white/20 transition-colors"
                                >
                                    View All Products
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
