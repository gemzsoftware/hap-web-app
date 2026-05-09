'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    MapPin,
    ArrowUpRight,
    Wallet,
    MessageSquare,
    Download,
    Layers
} from 'lucide-react'

export default function MyLands() {
    return (
        <div className="space-y-10 pb-20">
            <header>
                <h2 className="text-4xl font-black italic tracking-tighter text-white">
                    Asset <span className="text-slate-800 text-5xl">Vault</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mt-2">
                    Inventory Management
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Property Card 1 */}
                <PropertyCard
                    id="HA-001"
                    title="Heaven Ark Phase 1"
                    location="Epe, Lagos"
                    image="/land-1.jpg"
                    status="Allocated"
                    totalPrice="5,000,000"
                    amountPaid="3,750,000"
                    progress={75}
                />
                {/* Property Card 2 */}
                <PropertyCard
                    id="HA-002"
                    title="The Cedar Grove"
                    location="Ibeju-Lekki, Lagos"
                    image="/land-2.jpg"
                    status="Pending"
                    totalPrice="8,500,000"
                    amountPaid="2,125,000"
                    progress={25}
                />
            </div>
        </div>
    )
}

function PropertyCard({ title, location, image, status, totalPrice, amountPaid, progress, id }) {
    const remaining = parseInt(totalPrice.replace(/,/g, '')) - parseInt(amountPaid.replace(/,/g, ''));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-[3rem] p-8 group hover:border-emerald-500/30 transition-all backdrop-blur-xl"
        >
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-48 h-48 rounded-[2.5rem] overflow-hidden bg-slate-800 border border-white/5">
                    <img src={image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt={title} />
                </div>

                <div className="flex-1 space-y-4 text-left">
                    <div>
                        <h3 className="text-2xl font-black italic text-white tracking-tighter">{title}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3 text-emerald-500" /> {location}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Paid</p>
                            <p className="text-sm font-bold text-emerald-400">₦{amountPaid}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Balance</p>
                            <p className="text-sm font-bold text-white">₦{remaining.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-emerald-500">{progress}% Ownership</span>
                    <span className="text-slate-500">Status: {status}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/5">
                <ActionButton icon={<ArrowUpRight className="w-3 h-3"/>} label="View Land" href={`/dashboard/lands/${id}`} primary />
                <ActionButton icon={<Wallet className="w-3 h-3"/>} label="Pay" href="/dashboard/payments" />
                <ActionButton icon={<Download className="w-3 h-3"/>} label="Docs" href="/dashboard/documents" />
                <ActionButton icon={<MessageSquare className="w-3 h-3"/>} label="Advisor" href="/dashboard/support" />
            </div>
        </motion.div>
    )
}

function ActionButton({ icon, label, href, primary }) {
    return (
        <Link href={href} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
            primary ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
        }`}>
            {icon} {label}
        </Link>
    )
}