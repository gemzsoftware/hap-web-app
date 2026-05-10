'use client'

import { useState } from 'react'
import { mockDashboardData } from '@/data/mockDashboardData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { generateReceiptPDF } from '@/lib/pdf/receiptGenerator'
import { motion, AnimatePresence } from 'framer-motion'

export default function ReceiptsPage() {
    const { payments } = mockDashboardData
    const [downloading, setDownloading] = useState(null)

    const handleDownload = (payment) => {
        setDownloading(payment.id)
        setTimeout(() => {
            generateReceiptPDF({
                receiptNumber: payment.receipt,
                date: payment.date,
                amount: payment.amount,
                property: payment.land,
                method: payment.method,
                status: payment.status,
                description: 'Land Payment',
                customerName: mockDashboardData.user.fullName,
                customerEmail: mockDashboardData.user.email,
                customerPhone: mockDashboardData.user.phone,
            })
            setDownloading(null)
        }, 1200)
    }

    return (
        <div className="space-y-10 pb-20">
            {/* --- 1. ARCHIVE HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Documents</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Fiscal Receipts
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Validated payment certifications with institutional seal and signature.
                    </p>
                </div>
            </header>

            {/* --- 2. AUTHENTICATION NOTICE --- */}
            <div className="relative bg-slate-950 rounded-[2rem] p-8 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-1">Institutional Seal Active</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                            All PDF exports are auto-stamped with the <span className="text-white font-bold underline decoration-emerald-500/50 underline-offset-4">Heaven Ark Certification</span>.
                            These documents are legally compliant for banking, tax, and property title clearance.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- 3. LEDGER TABLE --- */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serial #</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="text-center px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5 text-[11px] font-mono font-black text-slate-950 tracking-tighter uppercase">{payment.receipt}</td>
                            <td className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{formatDate(payment.date)}</td>
                            <td className="px-8 py-5 text-xs font-black text-slate-900 tracking-tight">{payment.land}</td>
                            <td className="px-8 py-5 text-[13px] font-black text-slate-950">{formatCurrency(payment.amount)}</td>
                            <td className="px-8 py-5">
                                    <span className="text-[9px] font-black text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100 uppercase tracking-widest flex items-center w-fit gap-1.5">
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                        {payment.status}
                                    </span>
                            </td>
                            <td className="px-8 py-5 text-center">
                                <button
                                    onClick={() => handleDownload(payment)}
                                    disabled={downloading === payment.id}
                                    className="relative bg-slate-950 hover:bg-emerald-600 disabled:bg-slate-200 text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 overflow-hidden"
                                >
                                    <AnimatePresence mode="wait">
                                        {downloading === payment.id ? (
                                            <motion.span
                                                key="loading"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-2 justify-center"
                                            >
                                                <div className="w-2 h-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                Compiling...
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="idle"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            >
                                                Export PDF
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- 4. TECHNICAL SPECIFICATION --- */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8">Document Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <SpecItem
                        icon={<path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                        title="Encryption"
                        desc="Digital integrity stamp included on all exports."
                    />
                    <SpecItem
                        icon={<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        title="Compliance"
                        desc="Authorized for state & federal documentation."
                    />
                    <SpecItem
                        icon={<path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />}
                        title="Availability"
                        desc="Immediate generation upon ledger clearance."
                    />
                </div>
            </div>
        </div>
    )
}

function SpecItem({ icon, title, desc }) {
    return (
        <div className="flex flex-col items-start gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-500 border border-slate-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}