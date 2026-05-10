'use client'

import { motion } from 'framer-motion'

export default function StatCard({ title, value, subtitle, icon, trend = 'neutral' }) {
    // Strategic Financial Color Mapping
    const statusConfig = {
        positive: {
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-500',
            border: 'border-emerald-500/20',
            indicator: 'bg-emerald-500',
        },
        negative: {
            bg: 'bg-red-500/10',
            text: 'text-red-500',
            border: 'border-red-500/20',
            indicator: 'bg-red-500',
        },
        neutral: {
            bg: 'bg-slate-100',
            text: 'text-slate-500',
            border: 'border-slate-200',
            indicator: 'bg-slate-400',
        }
    }

    const theme = statusConfig[trend] || statusConfig.neutral

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-[2rem] p-7 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden"
        >
            {/* --- TECHNICAL DECOR --- */}
            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '20px 20px' }}
            />

            {/* Top Linear Accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 group-hover:via-emerald-500 transition-all duration-700" />

            <div className="relative z-10 flex flex-col h-full justify-between">

                {/* Upper Section: Header & Icon */}
                <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.indicator} ${trend !== 'neutral' ? 'animate-pulse' : ''}`} />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
                                {title}
                            </p>
                        </div>
                    </div>

                    {icon && (
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-500 ${theme.bg} ${theme.text} ${theme.border} group-hover:rotate-[10deg] group-hover:scale-110`}>
                            <div className="w-5 h-5">
                                {icon}
                            </div>
                        </div>
                    )}
                </div>

                {/* Lower Section: Value & Subtitle */}
                <div className="mt-auto">
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter leading-none mb-3">
                        {value}
                    </h3>

                    {subtitle && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                {subtitle}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Corner Decorative Element */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-slate-50 group-hover:border-emerald-500/20 transition-colors duration-700 rounded-br-[2rem]" />
        </motion.div>
    )
}