'use client'

import { mockDashboardData } from '@/data/mockDashboardData'
import { motion } from 'framer-motion'

export default function DocumentsPage() {
    const { documents } = mockDashboardData

    return (
        <div className="space-y-10 pb-20">
            {/* --- 1. VAULT HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Digital Asset Vault</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Legal Registry
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Verified title deeds, certifications, and compliance documentation.
                    </p>
                </div>
            </header>

            {/* --- 2. DOCUMENT GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={doc.id}
                        className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-slate-950/10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden"
                    >
                        {/* Security Background Texture */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity"
                             style={{ backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`, backgroundSize: '15px 15px' }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-slate-950 group-hover:bg-white transition-all duration-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">
                                        Verified
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-black text-slate-900 text-[13px] uppercase tracking-wider truncate">{doc.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {doc.type} • {doc.size}
                                </p>
                                <p className="text-[9px] font-medium text-slate-400">
                                    Archived: {new Date(doc.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                            </div>

                            <button className="w-full mt-8 bg-slate-50 border border-slate-200 text-slate-900 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] transition-all duration-300">
                                Download Registry
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* --- 3. REQUEST PROTOCOL --- */}
            <div className="relative bg-[#020617] rounded-[2.5rem] p-10 text-center overflow-hidden">
                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                <div className="relative z-10 max-w-lg mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em]">Administrative Request</span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tighter mb-4 uppercase">
                        Missing Documentation?
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mb-8 tracking-wide">
                        Initiate a formal request for specific title deeds, site plans, or payment schedules from our administrative department.
                    </p>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-10 py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
                        Open Request Protocol
                    </button>
                </div>
            </div>
        </div>
    )
}