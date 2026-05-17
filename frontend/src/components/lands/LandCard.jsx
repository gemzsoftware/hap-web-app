'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import { MapPin, ArrowRight, ShieldCheck, Clock, Lock } from 'lucide-react'

export default function LandCard({ land }) {
    // Extract property operational state parameters safely
    const currentStatus = land?.status || 'available'

    // Secure Visibility Guard: If marked as hidden by an admin, drop out of public render loops
    if (currentStatus === 'hidden') return null

    const assetId = land?.id || land?._id

    return (
        <Link
            href={`/properties/${assetId}`}
            className="group relative rounded-3xl flex flex-col h-full"
        >
            {/* Ambient Glow Aura Layer */}
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 via-amber-400/5 to-transparent rounded-[2.75rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl" />

            {/* Main Interactive structural Container */}
            <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl h-full flex flex-col group-hover:border-emerald-500/30"
            >
                {/* Image & State Banner Frame Section */}
                <div className="relative h-80 overflow-hidden bg-slate-950 flex-shrink-0">
                    <img
                        src={land?.imageUrl || land?.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef"}
                        alt={land?.title || "Heaven Ark Asset"}
                        className="w-full h-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Dark gradient shadow layer inside image framework */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Visual overlay mask dampener for un-available properties */}
                    {currentStatus !== 'available' && (
                        <div className="absolute inset-0 bg-slate-950/40 pointer-events-none z-10 transition-opacity group-hover:opacity-60" />
                    )}

                    {/* PREMIUM LIFECYCLE STATUS BANNERS */}
                    <div className="absolute top-0 left-0 w-full z-20">
                        {currentStatus === 'available' && (
                            <div className="w-full bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.3em] py-3.5 px-6 flex items-center gap-2 border-b border-emerald-500/20 shadow-lg">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                {land?.legalStatus || 'Asset Verified & Available'}
                            </div>
                        )}
                        {currentStatus === 'reserved' && (
                            <div className="w-full bg-amber-500/95 backdrop-blur-md text-slate-950 text-[9px] font-black uppercase tracking-[0.3em] py-3.5 px-6 flex items-center gap-2 border-b border-amber-400/20 shadow-lg animate-pulse">
                                <Clock className="w-3.5 h-3.5" />
                                Temporarily Reserved Lock
                            </div>
                        )}
                        {currentStatus === 'sold' && (
                            <div className="w-full bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.3em] py-3.5 px-6 flex items-center gap-2 border-b border-blue-500/20 shadow-lg">
                                <Lock className="w-3.5 h-3.5" />
                                Complete Acquisition Finalized
                            </div>
                        )}
                    </div>

                    {/* Asset Value Price Badge Tag */}
                    <div className="absolute bottom-6 left-6 z-20">
                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-2xl tracking-tighter shadow-2xl shadow-emerald-900/50">
                            {formatCurrency ? formatCurrency(land?.price) : `₦${Number(land?.price || 0).toLocaleString()}`}
                        </div>
                    </div>
                </div>

                {/* Content Specifications Framework Section */}
                <div className="p-8 flex flex-col flex-grow">
                    <div className="uppercase text-emerald-600 text-xs tracking-[0.2em] font-bold mb-3">
                        {land?.features?.[0] || 'EXCLUSIVE ESTATE'}
                    </div>

                    <h3 className="text-3xl font-semibold text-slate-900 leading-tight tracking-[-0.02em] group-hover:text-emerald-950 transition-colors">
                        {land?.title}
                    </h3>

                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-2 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{typeof land?.location === 'string' ? land.location : land?.location?.name || 'Lagos'}</span>
                    </div>

                    <p className="mt-4 text-slate-600 line-clamp-2 leading-relaxed">
                        {land?.overview || 'Prime land within the exclusive Heaven Ark ecosystem. Fully documented, blockchain-verified ownership, and seamless transfer.'}
                    </p>

                    {/* Array Feature Tags Rendering Loops */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {land?.features?.slice(1, 4).map((feature, index) => (
                            <span
                                key={index}
                                className="text-xs font-semibold tracking-widest px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-500"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* Installment Pricing Projections Footer Section */}
                    <div className="mt-auto pt-8 border-t border-slate-100">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">From</p>
                                <p className="text-2xl font-semibold text-slate-900 tracking-tight">
                                    {land?.installmentPlan?.monthlyAmount
                                        ? (formatCurrency ? formatCurrency(land.installmentPlan.monthlyAmount) : `₦${Number(land.installmentPlan.monthlyAmount).toLocaleString()}`)
                                        : (formatCurrency ? formatCurrency(Math.round((land?.price || 0) / 18)) : `₦${Number(Math.round((land?.price || 0) / 18)).toLocaleString()}`)}
                                    <span className="text-base font-normal text-slate-400">/mo</span>
                                </p>
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-black flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                                <ArrowRight className="w-6 h-6 text-white transition-transform group-hover:-rotate-45" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}