'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, MapPin, Trash2, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function SavedTab() {
    const [savedLands, setSavedLands] = useState([])
    const [loading, setLoading] = useState(true)

    const syncWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        setSavedLands(wishlist)
        setLoading(false)
    }

    useEffect(() => {
        syncWishlist()
        window.addEventListener('storage', syncWishlist)
        return () => window.removeEventListener('storage', syncWishlist)
    }, [])

    const removeItem = (id) => {
        const updated = savedLands.filter(item => item.id !== id)
        localStorage.setItem('wishlist', JSON.stringify(updated))
        syncWishlist()
    }

    if (loading) return (
        <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-[10px] font-black animate-pulse">
            Scanning Watchlist...
        </div>
    )

    if (savedLands.length === 0) return (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] py-24 text-center">
            <Bookmark className="w-8 h-8 text-slate-700 mx-auto mb-6" />
            <p className="text-slate-500 font-medium">Your watchlist is currently empty.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
                {savedLands.map((land) => (
                    <motion.div
                        layout
                        key={land.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-500"
                    >
                        {/* 1. Thumbnail & Basic Info */}
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10">
                                <img
                                    src={land.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef"}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-100 mb-1">{land.title}</h4>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{land.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Financial Summary (Compact) */}
                        <div className="hidden md:flex flex-col items-end gap-1 px-8 border-x border-white/5">
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Starting From</p>
                            <p className="text-xl font-medium text-emerald-500 italic">{formatCurrency(land.price)}</p>
                        </div>

                        <div className="hidden lg:flex flex-col items-start gap-1 px-8">
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Installment</p>
                            <p className="text-sm font-bold text-slate-300">
                                {formatCurrency(land.installmentPlan?.monthlyAmount)} <span className="text-[10px] text-slate-600">/MO</span>
                            </p>
                        </div>

                        {/* 3. Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => removeItem(land.id)}
                                className="p-4 bg-white/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <Link href={`/properties/${land.id}`}>
                                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/10">
                                    Finalize Plot <ArrowRight className="w-3 h-3" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}