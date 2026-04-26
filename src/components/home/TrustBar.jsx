'use client'

import { motion } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

const stats = [
    { value: COMPANY.stats.landsSold, label: 'Lands Sold', suffix: '+' },
    { value: COMPANY.stats.happyClients, label: 'Happy Clients', suffix: '+' },
    { value: COMPANY.stats.yearsExperience, label: 'Years Experience', suffix: '' },
    { value: COMPANY.stats.projectsCompleted, label: 'Projects Completed', suffix: '+' },
]

export default function TrustBar() {
    return (
        <section className="relative py-20 bg-slate-950 overflow-hidden">
            {/* Background Decorative Element - Subtle Emerald Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:bg-white/[0.04]"
                        >
                            {/* Hover Accent Line */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-emerald-500 group-hover:w-1/2 transition-all duration-500" />

                            <div className="text-center">
                                <motion.p
                                    className="text-4xl md:text-5xl font-black font-heading text-white tracking-tighter mb-2"
                                >
                                    {stat.value}{stat.suffix}
                                </motion.p>

                                <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-slate-500 group-hover:text-emerald-400 transition-colors duration-300">
                                    {stat.label}
                                </p>
                            </div>

                            {/* Subtle Glow beneath the text */}
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-full" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}