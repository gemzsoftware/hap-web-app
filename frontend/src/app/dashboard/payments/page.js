'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Wallet,
    ArrowUpRight,
    Download,
    History,
    CreditCard,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight
} from 'lucide-react'

export default function PaymentLedger() {
    return (
        <div className="space-y-10 pb-20 text-left">
            {/* --- HEADER --- */}
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                        Financial <span className="text-slate-800 text-5xl">Ledger</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mt-2">
                        Account Statement & Transaction History
                    </p>
                </div>
            </header>

            {/* --- FINANCIAL OVERVIEW CARDS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Total Equity Card */}
                <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Portfolio Equity</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-4xl font-black text-white italic tracking-tighter">78.5%</h3>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '78.5%' }}
                                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            />
                        </div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">₦33,650,000.00 Total Paid</p>
                </div>

                {/* Outstanding Balance Card */}
                <div className="p-8 rounded-[3rem] bg-[#002B5B] border border-white/10 shadow-2xl shadow-blue-900/20 flex flex-col justify-between group">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-widest">Outstanding Balance</p>
                        <h3 className="text-4xl font-black text-white italic tracking-tighter">₦12,250,000</h3>
                    </div>
                    <Link href="/dashboard/payments/checkout" className="mt-6">
                        <button className="w-full py-4 bg-[#B59410] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#c9a614] transition-all flex items-center justify-center gap-2">
                            Pay Now <CreditCard className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {/* Next Installment Card */}
                <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Due Date</p>
                            <h3 className="text-2xl font-black text-white italic">May 24, 2026</h3>
                        </div>
                        <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Amount: ₦1,250,000.00</p>
                    </div>
                </div>
            </div>

            {/* --- TRANSACTION TABLE --- */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <History className="w-4 h-4 text-slate-500" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Transaction History</h3>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Transaction Date</th>
                            <th className="p-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Reference ID</th>
                            <th className="p-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset Details</th>
                            <th className="p-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                            <th className="p-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="p-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Documents</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        <TransactionRow
                            date="May 08, 2026"
                            id="HAR-99201-EP"
                            asset="Heaven Ark Phase 1"
                            amount="₦1,250,000.00"
                            status="verified"
                        />
                        <TransactionRow
                            date="April 08, 2026"
                            id="HAR-98744-EP"
                            asset="Heaven Ark Phase 1"
                            amount="₦1,250,000.00"
                            status="verified"
                        />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function TransactionRow({ date, id, asset, amount, status }) {
    return (
        <tr className="hover:bg-white/[0.02] transition-colors group">
            <td className="p-6 text-xs font-bold text-slate-400">{date}</td>
            <td className="p-6 text-[10px] font-black text-white tracking-widest uppercase">{id}</td>
            <td className="p-6 text-xs font-bold text-slate-400 italic">{asset}</td>
            <td className="p-6 text-sm font-black text-white">{amount}</td>
            <td className="p-6">
                <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                    <CheckCircle2 className="w-3 h-3" /> {status}
                </span>
            </td>
            <td className="p-6 text-right">
                <Link href={`/dashboard/payments/receipt/${id}`} className="inline-flex p-3 rounded-xl bg-white/5 text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                    <Download className="w-4 h-4" />
                </Link>
            </td>
        </tr>
    )
}