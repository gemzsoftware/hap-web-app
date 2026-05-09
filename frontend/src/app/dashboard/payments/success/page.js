'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    CheckCircle2,
    FileText,
    ArrowRight,
    Download,
    ShieldCheck,
    RefreshCcw,
    LayoutDashboard
} from 'lucide-react'

export default function PaymentSuccess() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-12">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
            >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                        Payment <span className="text-emerald-500">Confirmed</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        Transaction Verified • Asset Ledger Updated
                    </p>
                </div>
            </motion.div>

            {/* Transaction Card */}
            <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 text-left relative overflow-hidden backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16 relative z-10">
                    <SuccessDetail label="Total Amount Paid" value="₦1,250,000.00" />
                    <SuccessDetail label="Transaction Reference" value="HAR-99201-EP" />
                    <SuccessDetail label="Payment Date" value="May 08, 2026" />
                    <SuccessDetail label="Allocation Goal" value="Heaven Ark Phase 1" />
                </div>

                {/* Document Actions */}
                <div className="mt-12 pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-4 relative z-10">
                    <Link href="/dashboard/payments/receipt/99201" className="flex-1">
                        <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-xl">
                            <FileText className="w-4 h-4" /> Generate Official Receipt
                        </button>
                    </Link>
                    <button className="flex-1 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4" /> Download PDF Statement
                    </button>
                </div>

                {/* Subtle Branding Background */}
                <ShieldCheck className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.02] rotate-12" />
            </div>

            {/* Next Step Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <StatusAction
                    href="/dashboard"
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    title="Dashboard Overview"
                    description="View updated equity and portfolio value."
                />
                <StatusAction
                    href="/dashboard/lands"
                    icon={<RefreshCcw className="w-5 h-5" />}
                    title="Asset Management"
                    description="Track progress toward physical allocation."
                />
            </div>

            {/* Support Note */}
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-8">
                In case of discrepancies, please contact your <Link href="/dashboard/support" className="text-emerald-500 hover:underline">Dedicated Portfolio Manager</Link>.
            </p>
        </div>
    )
}

/* --- REUSABLE UI ELEMENTS --- */

function SuccessDetail({ label, value }) {
    return (
        <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
            <p className="text-lg font-black text-white italic tracking-tight">{value}</p>
        </div>
    )
}

function StatusAction({ href, icon, title, description }) {
    return (
        <Link href={href} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-left hover:border-emerald-500/30 transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {icon}
                </div>
                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">{title}</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">{description}</p>
        </Link>
    )
}