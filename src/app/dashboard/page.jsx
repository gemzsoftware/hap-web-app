'use client'

import Link from 'next/link'
import { mockDashboardData } from '@/data/mockDashboardData'
import StatCard from '@/components/dashboard/StatCard'
import CountdownTimer from '@/components/dashboard/CountdownTimer'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function DashboardPage() {
    const { stats, properties, payments } = mockDashboardData
    const firstName = mockDashboardData.user.fullName.split(' ')[0]

    return (
        <div className="space-y-10 pb-20">
            {/* --- 1. EXECUTIVE HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Investor Terminal</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Systems Greeting, {firstName}.
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Real-time status of your high-yield asset portfolio.
                    </p>
                </div>

                <div className="text-right hidden md:block">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Local Session Time</p>
                    <p className="text-xs font-bold text-slate-900 uppercase">{new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })} WAT</p>
                </div>
            </header>

            {/* --- 2. CORE PERFORMANCE METRICS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Asset Count"
                    value={stats.totalProperties}
                    type="registry"
                    trend="neutral"
                    subtitle="Units Registered"
                />
                <StatCard
                    title="Portfolio Valuation"
                    value={formatCurrency(stats.portfolioValue)}
                    type="valuation"
                    trend="positive"
                    subtitle="Total Appreciation"
                />
                <StatCard
                    title="Equity Cleared"
                    value={formatCurrency(stats.totalPaid)}
                    type="document"
                    trend="positive"
                    subtitle="Funds Remitted"
                />
                <StatCard
                    title="Outstanding Capital"
                    value={formatCurrency(stats.remainingBalance)}
                    type="ledger"
                    trend="negative"
                    subtitle="Projected Outflow"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* --- 3. ACTIVE PORTFOLIO REGISTRY (Left) --- */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Portfolio Registry</h2>
                        <Link href="/dashboard/properties" className="text-[9px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors">
                            Access Full Directory →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {properties.map((property) => (
                            <div key={property.id} className="group bg-white p-7 rounded-[2rem] border border-slate-100 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-950 tracking-tight mb-1">{property.title}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> {property.location}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            property.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                        }`}>
                                            {property.status}
                                        </div>
                                        <Link
                                            href={`/dashboard/properties/${property.id}`}
                                            className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center hover:bg-emerald-500 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </Link>
                                    </div>
                                </div>

                                {/* Premium Technical Progress */}
                                <div className="mt-8">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Equity Migration</span>
                                        <span className="text-xs font-black text-slate-900 tracking-tighter">{property.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-50 rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${property.progress}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="bg-slate-950 h-full rounded-full relative"
                                        >
                                            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-50 pt-5">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Remitted</span>
                                        <span className="text-xs font-bold text-slate-900">{formatCurrency(property.amountPaid)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Outstanding</span>
                                        <span className="text-xs font-bold text-slate-900">{formatCurrency(property.remainingBalance)}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Instalment</span>
                                        <span className="text-xs font-bold text-emerald-600">{formatCurrency(property.monthlyAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- 4. CAPITAL FLOW SIDEBAR (Right) --- */}
                <div className="lg:col-span-4 space-y-8">

                    <CountdownTimer targetDate={stats.nextPaymentDate} />

                    {/* Next Allocation Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Upcoming Remittance</p>
                        <p className="text-4xl font-black text-slate-950 tracking-tighter mb-2">{formatCurrency(stats.nextPaymentAmount)}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-50 pb-6">
                            Scheduled: {new Date(stats.nextPaymentDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>

                        <button className="w-full mt-8 bg-slate-950 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-[0.3em] py-5 rounded-2xl transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]">
                            Authorize Transfer
                        </button>
                    </div>

                    {/* Ledger Snapshot */}
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6">Recent Ledger Entries</h3>
                        <div className="space-y-4">
                            {payments.slice(0, 3).map((payment) => (
                                <div key={payment.id} className="flex justify-between items-center group">
                                    <div>
                                        <p className="text-xs font-black text-slate-950 tracking-tight">{formatCurrency(payment.amount)}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(payment.date).toLocaleDateString('en-NG')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Cleared</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/dashboard/payments" className="block text-center text-[9px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest mt-8 pt-4 border-t border-slate-200/50 transition-colors">
                            View Full History
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}