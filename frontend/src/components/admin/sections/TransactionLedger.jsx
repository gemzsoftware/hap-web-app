'use client'

import { useState } from 'react'
import {
    Receipt,
    FilePlus,
    Search,
    CheckCircle2,
    Clock,
    MapPin,
    Layers,
    ArrowUpRight,
    Filter
} from 'lucide-react'

export default function TransactionLedger() {
    const [view, setView] = useState('purchases')

    return (
        <div className="space-y-12">
            {/* --- HEADER --- */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Ledger Terminal</span>
                    </div>
                    <h2 className="text-5xl font-black italic tracking-tighter text-white">Financial <span className="text-slate-800 text-6xl">Intelligence</span></h2>
                </div>

                <div className="flex gap-2 p-2 bg-white/5 border border-white/10 rounded-3xl w-fit backdrop-blur-xl">
                    <button
                        onClick={() => setView('purchases')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'purchases' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Acquisitions
                    </button>
                    <button
                        onClick={() => setView('payments')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'payments' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Cash Flow
                    </button>
                </div>
            </header>

            {/* --- SUB-VIEW CONTENT --- */}
            {view === 'purchases' ? <AcquisitionsTable /> : <PaymentsTable />}
        </div>
    )
}

function AcquisitionsTable() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-md">
            <table className="w-full text-left">
                <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Investor Node</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Property Details</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Equity Tracking</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Vault</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                <tr className="group hover:bg-white/[0.01] transition-all">
                    {/* INVESTOR INFO */}
                    <td className="p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black">
                                CO
                            </div>
                            <div>
                                <p className="font-bold text-slate-200">Chisom Okafor</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">ID: #INV-00912</p>
                            </div>
                        </div>
                    </td>

                    {/* PROPERTY DETAILS (MIRRORING LANDCARD) */}
                    <td className="p-8">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-200">Heaven Ark Phase 2</p>
                            <div className="flex items-center gap-2 text-slate-500">
                                <MapPin className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Epe, Lagos</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-500/60">
                                <Layers className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest italic">Plot 115 • 600sqm</span>
                            </div>
                        </div>
                    </td>

                    {/* EQUITY PROGRESS */}
                    <td className="p-8">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[9px] font-black uppercase text-emerald-500">75% Complete</span>
                                <span className="text-[9px] font-black uppercase text-slate-600 font-mono">₦4.5M Paid</span>
                            </div>
                            <div className="w-40 bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[75%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
                    </td>

                    {/* LEGAL STATUS */}
                    <td className="p-8">
                        <div className="flex gap-2">
                            <DocIndicator label="Deed" active={true} />
                            <DocIndicator label="Survey" active={false} />
                            <DocIndicator label="Alloc" active={false} />
                        </div>
                    </td>

                    {/* ACTION */}
                    <td className="p-8 text-right">
                        <button className="bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 text-emerald-500 hover:text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ml-auto group">
                            <FilePlus className="w-3 h-3" /> Issue Docs
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

function PaymentsTable() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-md">
            <table className="w-full text-left">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <tr>
                    <th className="p-8">Transaction Ref</th>
                    <th className="p-8">Investor</th>
                    <th className="p-8">Asset Linked</th>
                    <th className="p-8">Amount</th>
                    <th className="p-8">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                <tr className="hover:bg-white/[0.01]">
                    <td className="p-8 font-mono text-xs text-slate-500 font-bold tracking-tighter">ARK-PAY-2900-X</td>
                    <td className="p-8 font-medium">Bayo Kola</td>
                    <td className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ark Phase 1 (Plot 12)</td>
                    <td className="p-8 font-bold text-emerald-500 font-mono">₦1,250,000</td>
                    <td className="p-8">
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Confirmed</span>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

function DocIndicator({ label, active }) {
    return (
        <div className={`
            px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter border
            ${active
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500'
            : 'bg-white/5 border-white/10 text-slate-700'}
        `}>
            {label}
        </div>
    )
}