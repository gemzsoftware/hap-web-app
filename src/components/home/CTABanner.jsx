'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTABanner() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden bg-slate-950 rounded-[3rem] border border-white/5 shadow-2xl">

                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />

                    {/* The Grid/Mesh Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                    <div className="relative z-10 px-8 py-20 text-center">
                        {/* Status Chip */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                                Limited Allocation Available
                            </span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-black text-white font-heading tracking-tighter mb-8 leading-tight">
                            Secure Your Piece of <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                                The Future Today.
                            </span>
                        </h2>

                        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
                            Join the elite circle of land owners. Start your journey with a structured
                            payment plan starting as low as <span className="text-white font-bold">₦500,000</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            {/* Primary Button */}
                            <Link
                                href="/register"
                                className="group relative w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative bg-emerald-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl active:scale-95 uppercase text-xs tracking-widest">
                                    Start My Investment
                                </div>
                            </Link>

                            {/* Secondary Button */}
                            <Link
                                href="/properties"
                                className="w-full sm:w-auto bg-white/5 border border-white/10 text-white font-black px-10 py-5 rounded-2xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest backdrop-blur-md"
                            >
                                Browse Properties
                            </Link>
                        </div>

                        {/* Trust Footer */}
                        <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                            <div className="flex items-center gap-2">
                                <span className="text-white text-xs font-bold uppercase tracking-tighter">Verified by</span>
                                <span className="text-white font-black border border-white/20 px-2 py-0.5 rounded text-[10px]">LUC</span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/20" />
                            <p className="text-[10px] text-white font-bold uppercase tracking-widest">Instant Allocation</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}