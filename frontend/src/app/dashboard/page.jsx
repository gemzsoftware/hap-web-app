'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    TrendingUp,
    ShieldCheck,
    Clock,
    ArrowUpRight,
    Wallet,
    MapPin,
    LayoutGrid,
    Activity,
    PlusCircle,
    FileText,
    Headset,
    CreditCard,
    ArrowRight,
    Calendar,
    Bookmark
} from 'lucide-react'

export default function DashboardHome() {
    const [wishlist, setWishlist] = useState([])

    // Sync with your homepage 'wishlist' logic
    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        setWishlist(storedWishlist)
    }, [])

    return (
        <div className="space-y-10 pb-20">

            {/* --- SECTION 1: THE WEALTH OVERVIEW --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Portfolio Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 p-10 rounded-[3rem] bg-gradient-to-br from-emerald-600 to-teal-800 relative overflow-hidden group shadow-2xl shadow-emerald-950/20"
                >
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-200/60">Portfolio Valuation</p>
                                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white">
                                    ₦45.8M<span className="text-2xl opacity-50">.00</span>
                                </h2>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-300" />
                                <span className="text-[10px] font-black text-white">+12.4%</span>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-4">
                            <Link
                                href="/properties"
                                className="bg-white text-emerald-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl"
                            >
                                New Acquisition <PlusCircle className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/dashboard/payments"
                                className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500/30 transition-all flex items-center gap-2"
                            >
                                Continue Payment <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <Activity className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
                </motion.div>

                {/* Quick Action Side Panel */}
                <div className="grid grid-cols-1 gap-4">
                    <ActionButton icon={<CreditCard />} label="Pay Installment" color="emerald" href="/dashboard/payments" />
                    <ActionButton icon={<FileText />} label="View Documents" color="slate" href="/dashboard/documents" />
                    <ActionButton icon={<Headset />} label="Contact Support" color="slate" href="/dashboard/support" />
                </div>
            </div>

            {/* --- SECTION 2: SUMMARY METRICS --- */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                <SummaryCard label="Active Purchases" value="03" sub="Lands" icon={<MapPin />} />
                <SummaryCard label="Amount Paid" value="₦33.6M" sub="78% Total" icon={<Wallet />} />
                <SummaryCard label="Outstanding" value="₦12.2M" sub="Balance" icon={<Activity />} />
                <SummaryCard label="Documents" value="12" sub="Verified" icon={<ShieldCheck />} />
                <SummaryCard label="Next Payment" value="May 12" sub="₦1,250,000" icon={<Calendar />} isAlert />
            </div>

            {/* --- SECTION 3: RECENT ACTIVITY & WATCHLIST --- */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-10">

                    {/* Active Asset Strip */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Active Asset Strip</h3>
                            <Link href="/dashboard/lands" className="text-[10px] font-black uppercase text-emerald-500 hover:underline underline-offset-4">Vault View</Link>
                        </div>
                        <AssetStrip
                            name="Heaven Ark Phase 2"
                            location="Epe, Lagos"
                            image="/land-1.jpg"
                            status="₦2,500,000 / ₦5.0M"
                            statusLabel="Paid Status"
                        />
                    </div>

                    {/* WATCHLIST SECTION */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Bookmark className="w-4 h-4 text-amber-500" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Live Watchlist</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {wishlist.length > 0 ? (
                                wishlist.map((land) => (
                                    <AssetStrip
                                        key={land.id}
                                        name={land.title}
                                        location={land.location}
                                        image={land.image}
                                        status={`₦${land.price.toLocaleString()}`}
                                        statusLabel="Market Price"
                                        isWatchlist
                                        id={land.id}
                                    />
                                ))
                            ) : (
                                <div className="p-12 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-30">
                                    <Bookmark className="w-6 h-6 mb-2 text-slate-500" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Watchlist is currently empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Support Concierge */}
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 h-fit text-left">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Support Concierge</h3>
                    <div className="space-y-4">
                        <p className="text-xs text-slate-400 leading-relaxed italic">Need help with your allocation or payments?</p>
                        <button className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/20">
                            Start Live Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* --- REUSABLE SUB-COMPONENTS --- */

function AssetStrip({ name, location, image, status, statusLabel, isWatchlist, id }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-4 flex items-center gap-6 group hover:border-emerald-500/30 transition-all text-left">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 overflow-hidden relative shrink-0">
                <img src={image || "/land-1.jpg"} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-white italic truncate">{name}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-emerald-500" /> {location}
                </p>
            </div>
            <div className="text-right hidden md:block px-4">
                <p className="text-[9px] font-black text-slate-600 uppercase">{statusLabel}</p>
                <p className={`text-sm font-bold ${isWatchlist ? 'text-amber-500' : 'text-emerald-500'}`}>{status}</p>
            </div>
            <Link href={isWatchlist ? `/properties/${id}` : "/dashboard/lands"} className="p-4 rounded-2xl bg-white/5 text-slate-500 hover:text-white hover:bg-emerald-500 transition-all">
                <ArrowUpRight className="w-4 h-4" />
            </Link>
        </div>
    )
}

function SummaryCard({ label, value, sub, icon, isAlert }) {
    return (
        <div className={`p-6 rounded-[2.5rem] border backdrop-blur-md transition-all hover:scale-105 ${
            isAlert ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5'
        }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                isAlert ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
            }`}>
                {icon}
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
            <h4 className={`text-xl font-black italic tracking-tighter ${isAlert ? 'text-amber-200' : 'text-white'}`}>{value}</h4>
            <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">{sub}</p>
        </div>
    )
}

function ActionButton({ icon, label, color, href }) {
    const isEmerald = color === 'emerald'
    return (
        <Link href={href} className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all group ${
            isEmerald
                ? 'bg-emerald-500 text-white border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
        }`}>
            <div className={`p-3 rounded-xl ${isEmerald ? 'bg-white/20' : 'bg-white/5'}`}>
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            <ArrowUpRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
        </Link>
    )
}