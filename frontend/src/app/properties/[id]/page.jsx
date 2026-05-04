'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockLands } from '@/data/mockLands'
import { formatCurrency } from '@/lib/utils'

export default function PropertyDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const land = mockLands.find(l => l.id === id)

    if (!land) {
        return (
            <div className="bg-[#F1F3F6] min-h-screen flex items-center justify-center">
                <h1 className="text-xl font-serif text-slate-900">Asset Not Found</h1>
            </div>
        )
    }

    return (
        <div className="bg-[#F1F3F6] min-h-screen selection:bg-emerald-500/30">
            <Navbar />

            <main>
                {/* --- HERO SECTION: CLEAN BRAND WASH --- */}
                <section className="relative h-[65vh] w-full overflow-hidden bg-[#020617]">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={land.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000"}
                            className="w-full h-full object-cover scale-105 opacity-30 grayscale contrast-125"
                            alt={land.title}
                        />
                    </div>

                    <div className="absolute inset-0 z-10 bg-radial-gradient from-blue-900/40 via-[#020617]/80 to-[#020617]" />

                    <div className="container-custom relative h-full flex flex-col justify-end pb-20 z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <span className="px-4 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-sm">
                                    Asset Verified
                                </span>
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">
                                    Ref: {id?.slice(0, 8)}
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter leading-[0.85] mb-6">
                                {land.title}
                            </h1>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-[1px] bg-emerald-500" />
                                <p className="text-emerald-400/90 text-xl font-light tracking-[0.1em] italic">
                                    {land.location}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="container-custom py-12 relative z-20">

                    {/* --- INTEGRATED BACK NAVIGATION --- */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => router.back()}
                        className="group flex items-center gap-4 mb-10 text-slate-400 hover:text-slate-900 transition-all duration-500"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Back to Portfolio Index</span>
                    </motion.button>

                    <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">

                        {/* LEFT COLUMN: THE ASSET DOSSIER */}
                        <div className="lg:col-span-8">
                            <div className="bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[4rem] p-12 md:p-20 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.04)]">

                                {/* Valuation Header */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-20 border-b border-slate-100 pb-16">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Value</p>
                                        <p className="text-3xl font-serif text-slate-900">{formatCurrency(land.price)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Survey Area</p>
                                        <p className="text-3xl font-light text-slate-600">{land.size}</p>
                                    </div>
                                    <div className="hidden md:block space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                        <p className="text-3xl font-serif text-emerald-600 italic">Available</p>
                                    </div>
                                </div>

                                <div className="max-w-2xl">
                                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] mb-10">Strategic Overview</h3>
                                    <p className="text-slate-600 text-xl leading-relaxed font-light mb-12">
                                        This parcel in <span className="text-slate-900 font-medium">{land.location}</span> represents a strategic land asset.
                                        All statutory documentation is validated and ready for immediate transition.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-16 mt-20">
                                        <div className="space-y-8">
                                            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Asset Provisions</h4>
                                            <ul className="space-y-5">
                                                {land.features.map((f, i) => (
                                                    <li key={i} className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-200/50">
                                            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-8 text-center">Legal Protocol</h4>
                                            <div className="space-y-6">
                                                {['Title Deed', 'C of O Status', 'Governor Consent'].map((item) => (
                                                    <div key={item} className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold">
                                                        <span className="text-slate-400">{item}</span>
                                                        <span className="text-emerald-600">Validated</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: FINANCIAL CONCIERGE */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24">
                                <div className="bg-slate-950 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                    <h3 className="text-3xl font-serif mb-12 leading-tight">Acquisition <br/><span className="text-slate-500 italic font-light tracking-wide">Flow.</span></h3>

                                    <div className="space-y-8 mb-16">
                                        <div className="flex justify-between items-end border-b border-white/5 pb-5">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Initial Deposit</span>
                                            <span className="text-xl font-light text-emerald-400">{formatCurrency(land.installmentPlan.initialDeposit)}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-white/5 pb-5">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Schedule</span>
                                            <span className="text-xl font-light">{formatCurrency(land.installmentPlan.monthlyAmount)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Link
                                            href={`/purchase/${land.id}`}
                                            className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.4em] py-6 rounded-2xl text-center transition-all duration-500 active:scale-95"
                                        >
                                            Initialize Acquisition
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="block w-full border border-white/10 hover:bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.4em] py-6 rounded-2xl text-center transition-all duration-500"
                                        >
                                            Consult Officer
                                        </Link>
                                    </div>

                                    <div className="mt-12 pt-10 border-t border-white/5 flex items-start gap-5">
                                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.955 11.955 0 01-1.218 5.496 11.954 11.954 0 01-5.118 5.758L12 21.25l-3.282-1.996a11.954 11.954 0 01-5.118-5.758 11.955 11.955 0 01-1.218-5.496m17.236 0H3.382" />
                                        </svg>
                                        <p className="text-[9px] text-slate-500 leading-relaxed uppercase tracking-widest">
                                            Guaranteed dispute-free titles via our proprietary verification protocol.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}