'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { mockLands } from '@/data/mockLands'
import LandCard from '@/components/lands/LandCard'

export default function FeaturedLands() {
    // Taking the first 3 for the high-end "Curated" feel
    const featuredLands = mockLands.slice(0, 3)

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle background decoration to break the white space */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-50/30 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-slate-50 blur-[100px] rounded-full pointer-events-none" />

            <div className="container-custom relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[10px] uppercase tracking-[0.4em] font-black text-emerald-600 mb-4 block"
                        >
                            Curated Selection
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-950 font-heading tracking-tighter">
                            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 to-slate-500">Investments.</span>
                        </h2>
                        <p className="mt-6 text-slate-500 font-medium leading-relaxed">
                            Thoroughly inspected and legally documented land assets,
                            hand-picked for long-term growth and immediate security.
                        </p>
                    </div>

                    {/* Top Right "View All" - Sophisticated Placement */}
                    <div className="hidden md:block">
                        <Link
                            href="/properties"
                            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-all duration-300"
                        >
                            Explore Collection
                            <span className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                →
                            </span>
                        </Link>
                    </div>
                </div>

                {/* The Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {featuredLands.map((land, index) => (
                        <motion.div
                            key={land.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                        >
                            <LandCard land={land} />
                        </motion.div>
                    ))}
                </div>

                {/* Mobile-only "View All" button */}
                <div className="mt-16 text-center md:hidden">
                    <Link
                        href="/properties"
                        className="inline-flex items-center justify-center w-full bg-slate-950 text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-xs"
                    >
                        View All Properties
                    </Link>
                </div>

                {/* Decorative Bottom Line */}
                <div className="mt-24 h-[1px] w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
            </div>
        </section>
    )
}