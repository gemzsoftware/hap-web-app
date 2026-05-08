'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

export default function LandCard({ land }) {
    const [isSaved, setIsSaved] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) setUser(JSON.parse(storedUser))

        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        setIsSaved(wishlist.some(item => item.id === land.id))
    }, [land.id])

    const toggleFavorite = (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            alert('Identity Unverified. Please login to secure this opportunity to your portal.')
            return
        }

        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')

        if (isSaved) {
            wishlist = wishlist.filter(item => item.id !== land.id)
        } else {
            wishlist.push(land)
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist))
        setIsSaved(!isSaved)
    }

    return (
        <Link
            href={`/properties/${land.id}`}
            className="group relative rounded-[2rem] flex flex-col h-full transition-all duration-500 will-change-transform"
        >
            <div className="absolute inset-4 rounded-[2rem] bg-slate-900/10 blur-2xl opacity-0 group-hover:opacity-100 group-hover:inset-0 transition-all duration-500" />
            <div className="absolute inset-0 rounded-[2rem] shadow-[0_0_0_0_rgba(16,185,129,0)] group-hover:shadow-[0_40px_80px_-15px_rgba(16,185,129,0.15)] transition-all duration-500" />

            <div className="relative z-10 bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-500 group-hover:border-emerald-500/20">

                <div className="relative h-64 overflow-hidden">
                    <img
                        src={`${land.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef"}?w=1200&auto=format&fit=crop&q=75`}
                        alt={land.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* --- PROFESSIONAL BOOKMARK BUTTON --- */}
                    <button
                        onClick={toggleFavorite}
                        className="absolute top-5 right-5 z-30 w-11 h-11 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/20 transition-all active:scale-90 overflow-hidden shadow-2xl"
                        style={{ backgroundColor: isSaved ? '#10b981' : 'rgba(2, 6, 23, 0.4)' }}
                    >
                        <motion.svg
                            animate={{ y: isSaved ? [0, -2, 0] : 0 }}
                            className={`w-5 h-5 ${isSaved ? 'text-white' : 'text-white/70'}`}
                            fill={isSaved ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </motion.svg>
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-5 left-5">
                        <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200/50">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-800">
                                Verified Title
                            </span>
                        </div>
                    </div>

                    <div className="absolute bottom-5 left-5">
                        <div className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black text-xl shadow-[0_10px_20px_-5px_rgba(5,150,105,0.4)]">
                            {formatCurrency(land.price)}
                        </div>
                    </div>
                </div>

                <div className="p-8 flex flex-col flex-grow space-y-5">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-600">
                            {land.features[0] || 'Premium Estate'}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="text-emerald-500 text-lg">📍</span>
                            <span className="text-[11px] font-bold uppercase tracking-wider">{land.location}</span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300 font-heading tracking-tight leading-tight">
                        {land.title}
                    </h3>

                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        Securely managed property under the Heaven Ark framework. Guaranteed documentation and seamless ownership transfer.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {land.features.slice(1, 3).map((feature, index) => (
                            <span
                                key={index}
                                className="text-[9px] uppercase tracking-widest font-black bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1.5 rounded-lg"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    <div className="flex-grow" />

                    <div className="pt-6 border-t border-slate-100/80 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1.5">
                                Monthly Plan
                            </p>
                            <p className="text-lg font-black text-slate-950">
                                {formatCurrency(land.installmentPlan.monthlyAmount)}
                                <span className="text-slate-400 font-medium text-xs tracking-normal"> / mo</span>
                            </p>
                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-all duration-500 group-hover:bg-emerald-600 group-hover:border-emerald-500 group-hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)]">
                            <span className="text-slate-400 group-hover:text-white transition-colors text-2xl font-bold">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}