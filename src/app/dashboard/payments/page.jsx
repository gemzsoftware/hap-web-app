'use client'

import { mockDashboardData } from '@/data/mockDashboardData'
import { formatCurrency, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function PaymentsPage() {
    const { payments } = mockDashboardData

    return (
        <div className="space-y-10 pb-20">
            {/* --- 1. LEDGER HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Audit Registry</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Capital Ledger
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Historical record of all fund remissions and asset equity clearing.
                    </p>
                </div>

                <button className="bg-slate-950 hover:bg-emerald-600 text-white font-black px-8 py-4 rounded-2xl text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                    Initiate Remittance
                </button>
            </header>

            {/* --- 2. DESKTOP LEDGER TABLE --- */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance Date</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Title</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Remitted</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="text-right px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5 text-[11px] font-mono font-bold text-slate-500 group-hover:text-slate-950 tracking-tight">
                                {payment.receipt}
                            </td>
                            <td className="px-8 py-5 text-[12px] font-bold text-slate-900">
                                {formatDate(payment.date)}
                            </td>
                            <td className="px-8 py-5 text-[12px] font-medium text-slate-600">
                                {payment.land}
                            </td>
                            <td className="px-8 py-5 text-[14px] font-black text-slate-950 tracking-tighter">
                                {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100">
                                            {payment.status}
                                        </span>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <button className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors flex items-center gap-2 ml-auto">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Extract
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- 3. MOBILE TRANSACTION CARDS --- */}
            <div className="md:hidden space-y-4">
                {payments.map((payment) => (
                    <div key={payment.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-lg font-black text-slate-950 tracking-tighter">{formatCurrency(payment.amount)}</p>
                                <p className="text-[9px] font-mono font-bold text-slate-400 uppercase mt-0.5">{payment.receipt}</p>
                            </div>
                            <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-100 uppercase tracking-widest">
                                {payment.status}
                            </span>
                        </div>

                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-4">{payment.land}</p>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <span className="text-[10px] font-bold text-slate-400">{formatDate(payment.date)}</span>
                            <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                Extract Receipt
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}