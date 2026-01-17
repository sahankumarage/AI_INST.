"use client";

import { HeroModel } from "@/components/canvas/HeroModel";
import { ArrowRight } from "lucide-react";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Introduction } from "@/components/home/Introduction";
import { VideoSection } from "@/components/home/VideoSection";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      <HeroModel />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <span className="text-sm font-semibold text-primary tracking-wide">Pioneering the Future of Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-slate-900">
            Vision to Reality with <br />
            <span className="text-gradient">Artificial Intelligence</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-xl mb-10 leading-relaxed">
            We build sophisticated AI solutions that transform businesses. From generative media to intelligent web systems, we bridge today's reality with tomorrow's possibilities.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#ecosystem"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-lg shadow-primary/25 hover:bg-ocean-dark transition-colors flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Services <ArrowRight className="w-5 h-5" />
            </motion.a>

            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-slate-700 rounded-full font-semibold border border-slate-200 hover:border-primary/50 hover:text-primary transition-colors"
              >
                About Us
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Introduction Section */}
      <Introduction />

      {/* Team Video Section */}
      <VideoSection
        videoUrl="/Video/AI_Vision_to_Reality_Video.mp4"
      />

      {/* Ecosystem Section */}
      <Ecosystem />

      {/* Selected Works */}
      <SelectedWorks />
    </main>
  );
}
