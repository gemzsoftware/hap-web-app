'use client'

import React, { useState } from 'react'
import {
    ArrowLeft, Download, FileText, Calendar, User,
    Home, CreditCard, ExternalLink, ShieldCheck,
    Clock, PlusCircle
} from 'lucide-react'
import Link from 'next/link'

export default function PurchaseDetails() {
    const [purchase] = useState({
        id: 'PUR-24048',
        buyer: 'Amina Yusuf',
        property: 'Heritage Extension - Plot C12',
        amountPaid: '₦3,200,000',
        totalAmount: '₦12,500,000',
        balance: '₦9,300,000',
        mode: 'Installment',
        status: 'Active',
        date: '05 May 2026',
        nextDue: '15 June 2026'
    })

    const installments = [
        { date: '05 May 2026', amount: '₦3,200,000', status: 'Paid', ref: 'BNK-TX-99821' },
        { date: '15 Jun 2026', amount: '₦1,500,000', status: 'Pending', ref: '—' },
        { date: '15 Jul 2026', amount: '₦1,500,000', status: 'Pending', ref: '—' },
    ]

    return (
        <div className="space-y-12 pb-40 text-left animate-in fade-in duration-700">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <Link href="/admin/purchases" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-emerald-500 transition-all mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Folio
                    </Link>
                    <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                        Deal <span className="text-emerald-900 text-6xl text-6xl">Intelligence</span>
                    </h1>
                    <p className="text-emerald-500 font-black text-xs tracking-[0.4em] uppercase mt-2">ID: {purchase.id}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-10 py-5 bg-white/[0.02] border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3">
                        <Download className="w-4 h-4" /> Export Ledger
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* --- MAIN DATA (LHS) --- */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Valuations / Progress Bar */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 shadow-2xl backdrop-blur-sm">
                        <div className="flex justify-between items-end mb-8">
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Equity Breakdown</h3>
                                <p className="text-4xl font-black italic text-white leading-none">25.6% <span className="text-emerald-900 text-2xl tracking-tight">Recovered</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{purchase.amountPaid} Verified</p>
                                <p className="text-[9px] font-bold text-slate-700 uppercase mt-1">Goal: {purchase.totalAmount}</p>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden shadow-inner">
                            <div className="w-[25.6%] h-full bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                        </div>
                    </div>

                    {/* Identity & Asset Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InfoCard icon={<User />} label="Identity" value={purchase.buyer} sub="Premium Investor Profile" />
                        <InfoCard icon={<Home />} label="Asset Allocation" value={purchase.property} sub="Ibeju-Lekki Node • 450 SQM" />
                    </div>

                    {/* Timeline / Ledger */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                                <Clock className="w-4 h-4 text-emerald-500" /> Transaction Timeline
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {installments.map((inst, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${inst.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-700'}`}>
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase italic">{inst.date}</p>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{inst.ref}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <p className="text-lg font-black text-white italic leading-none">{inst.amount}</p>
                                        <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${inst.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                                            {inst.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- MANAGEMENT SIDEBAR (RHS) --- */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-40 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 shadow-2xl">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 mb-6">Contract Status</h3>
                        <div className="mb-10">
                            <StatusBadge status={purchase.status} />
                        </div>

                        <div className="h-px bg-white/5 mb-10" />

                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Digital Archive</h3>
                            <div className="space-y-4">
                                <DocRow name="Signed Contract" date="Verified 08 May" />
                                <DocRow name="Deposit Receipt" date="Verified 05 May" />
                                <DocRow name="Allocation Letter" date="Processing" />
                            </div>

                            <button className="w-full py-5 bg-white/5 border border-white/10 text-emerald-500 rounded-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 hover:text-white transition-all shadow-xl">
                                <PlusCircle className="w-4 h-4" /> Add New Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* --- ATOMIC COMPONENTS --- */

function InfoCard({ icon, label, value, sub }) {
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">{icon}</div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">{label}</p>
            </div>
            <div>
                <p className="text-xl font-black italic text-white uppercase tracking-tighter">{value}</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{sub}</p>
            </div>
        </div>
    )
}

function StatusBadge({ status }) {
    const styles = {
        Active: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
        Completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        'Deposit Pending': 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    }

    return (
        <span className={`block w-full text-center px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.3em] ${styles[status] || 'bg-slate-500/10 text-slate-400'}`}>
            {status}
        </span>
    )
}

function DocRow({ name, date }) {
    return (
        <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group cursor-pointer hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                <div className="min-w-0">
                    <p className="text-[10px] font-black text-white uppercase truncate">{name}</p>
                    <p className="text-[8px] font-bold text-slate-700 uppercase tracking-tighter">{date}</p>
                </div>
            </div>
            <Download className="w-4 h-4 text-slate-800 hover:text-white transition-colors" />
        </div>
    )
}