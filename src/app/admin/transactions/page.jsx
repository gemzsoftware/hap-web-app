'use client'

import { mockDashboardData } from '@/data/mockDashboardData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function AdminTransactionsPage() {
    const { payments } = mockDashboardData

    return (
        <div className="space-y-10 pb-20">
            {/* --- 1. LEDGER HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Global Clearing</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Capital Flow
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Comprehensive ledger of all cross-asset remittance and equity settlements.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all">
                        Download CSV
                    </button>
                    <button className="bg-slate-950 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-950/20">
                        Print Report
                    </button>
                </div>
            </header>

            {/* --- 2. THE MASTER LEDGER --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
                {/* Visual watermark for institutional feel */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zM11 18.82l-5-2.78v-5.41l5 2.78v5.41zm1-6.59l-5-2.78 5-2.78 5 2.78-5 2.78zm6 3.81l-5 2.78v-5.41l5-2.78v5.41z"/>
                    </svg>
                </div>

                <table className="w-full relative z-10">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry ID</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Allocation</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantum</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</th>
                        <th className="text-right px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {payments.map((payment, index) => (
                        <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            key={payment.id}
                            className="group hover:bg-slate-50/50 transition-colors duration-300"
                        >
                            <td className="px-8 py-5 text-[11px] font-mono font-black text-slate-950 uppercase tracking-tighter">
                                {payment.receipt}
                            </td>
                            <td className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                {formatDate(payment.date)}
                            </td>
                            <td className="px-8 py-5 text-xs font-black text-slate-900 tracking-tight">
                                {payment.land}
                            </td>
                            <td className="px-8 py-5 text-[14px] font-black text-slate-950 tracking-tighter">
                                {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                {payment.method}
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-widest">
                                            {payment.status}
                                        </span>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- 3. LEDGER FOOTER / AUDIT NOTE --- */}
            <div className="flex items-center justify-between px-8 py-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        End of Registry. Total items verified: <span className="text-slate-950">{payments.length}</span>
                    </p>
                </div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    Heaven Ark fiscal security active
                </p>
            </div>
        </div>
    )
}