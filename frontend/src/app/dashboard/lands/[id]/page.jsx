'use client'

import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
    MapPin,
    ShieldCheck,
    Calendar,
    Activity,
    Download,
    Info,
    Navigation,
    MessageCircle,
    ArrowLeft,
    ArrowUpRight
} from 'lucide-react'

export default function PropertyDetails() {
    const params = useParams()
    const id = params.id

    return (
        <div className="space-y-10 pb-20">
            {/* Top Navigation */}
            <Link href="/dashboard/lands" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 flex items-center gap-2 w-fit transition-colors group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Vault
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* LEFT COLUMN: VISUALS & SPECS */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="h-[450px] rounded-[3.5rem] bg-slate-800 overflow-hidden relative border border-white/10 shadow-2xl">
                        <img src="/land-1.jpg" className="w-full h-full object-cover opacity-80" alt="Property Preview" />
                        <div className="absolute bottom-10 left-10 p-8 backdrop-blur-xl bg-black/40 rounded-[2.5rem] border border-white/10 mr-10">
                            <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase">Asset ID: {id}</h2>
                            <p className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                                <MapPin className="w-4 h-4" /> Block A, Plot 24-25 • Epe, Lagos
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoSection title="Legal Status" icon={<ShieldCheck className="w-4 h-4" />}>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Registered Survey & C of O (In Progress). All documents verified by Secure Node protocol.</p>
                        </InfoSection>
                        <InfoSection title="Estate Features" icon={<Navigation className="w-4 h-4" />}>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['Security', 'Gatehouse', 'Green Area', 'Paved Roads'].map(f => (
                                    <span key={f} className="px-3 py-1 rounded-full bg-white/5 text-[8px] font-black text-slate-500 uppercase border border-white/5">{f}</span>
                                ))}
                            </div>
                        </InfoSection>
                    </div>

                    {/* Satellite Preview Placeholder */}
                    <div className="h-72 rounded-[3rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2">
                            <Navigation className="w-6 h-6 animate-pulse" />
                        </div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] z-10">Live Geo-Location Feed</p>
                        <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* RIGHT COLUMN: FINANCIALS & SUPPORT */}
                <div className="space-y-6">
                    <div className="p-8 rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 space-y-8">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Equity</h3>
                            <p className="text-xs text-slate-400">Installment Plan: 12 Months</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-4xl font-black italic text-emerald-500 tracking-tighter">75%</span>
                                <span className="text-[10px] font-black text-slate-500">₦1.25M Balance</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-3/4 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase text-slate-500">Next Due</span>
                                <span className="text-[10px] font-black text-white">May 24, 2026</span>
                            </div>

                            {/* --- SECURE PAYMENT LINK --- */}
                            <Link href="/dashboard/payments" className="block w-full">
                                <button className="w-full py-5 rounded-[2rem] bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 hover:bg-emerald-500 transition-all hover:scale-[1.02] active:scale-95">
                                    Continue Payment
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-white tracking-tight uppercase text-xs">Dedicated Advisor</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">Need help with allocation? Chat with our legal team.</p>
                        <button className="text-[10px] font-black text-emerald-500 uppercase hover:text-white transition-colors">Start Conversation</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoSection({ title, icon, children }) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-3 hover:border-emerald-500/30 transition-colors group">
            <div className="flex items-center gap-3 text-emerald-500">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{title}</span>
            </div>
            {children}
        </div>
    )
}