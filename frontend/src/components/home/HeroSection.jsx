'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-slate-950 font-heading">

            {/* BACKGROUND IMAGE PLACEMENT */}
            <div className="absolute inset-0">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 12, ease: "easeOut" }}
                    /* FIXED PATH: Removed 'public' and added leading slash */
                    src="/land-1.jpg"
                    alt="Hero Backdrop"
                    className="w-full h-full object-cover opacity-80"
                />

                {/* Gradient Overlays for that Cool Professional Look */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#020617_90%)] opacity-40" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-6 py-24 max-w-5xl mx-auto text-white">

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 bg-emerald-500/10 backdrop-blur-md rounded-full px-5 py-2 border border-emerald-500/20 mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-emerald-400">
                        Verified Land Payment Gateway
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl sm:text-7xl md:text-8xl font-extrabold leading-[0.9] tracking-tighter"
                >
                    Your Future <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400">
                        Is Solid Ground.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
                >
                    Secure land acquisition and transparent rental payments.
                    Built on trust, verified by experts, and delivered digitally.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 flex flex-col sm:flex-row justify-center gap-5"
                >
                    <Link
                        href="/properties"
                        className="bg-white text-slate-950 font-bold px-10 py-4 rounded-xl transition-all hover:bg-emerald-500 hover:text-white shadow-xl active:scale-95"
                    >
                        Explore Lands
                    </Link>

                    <Link
                        href="/register"
                        className="bg-white/5 border border-white/10 hover:border-emerald-500/50 text-white font-semibold px-10 py-4 rounded-xl transition-all backdrop-blur-md"
                    >
                        Get Started
                    </Link>
                </motion.div>

                {/* Minimalist Trust Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-24 pt-8 border-t border-white/5 flex flex-wrap justify-center items-center gap-12 text-[12px] uppercase tracking-widest font-bold text-slate-500"
                >
                    <span className="flex items-center gap-2"><span className="text-emerald-500 text-lg">✦</span> Legally Secure</span>
                    <span className="flex items-center gap-2"><span className="text-emerald-500 text-lg">✦</span> 100% Transparent</span>
                    <span className="flex items-center gap-2"><span className="text-emerald-500 text-lg">✦</span> Asset Growth</span>
                </motion.div>

            </div>
        </section>
    )
}