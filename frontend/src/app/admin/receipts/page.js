'use client'

import React, { useState } from 'react'
import { Search, Download, Eye, FileText, Calendar, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function Receipts() {
    const [searchTerm, setSearchTerm] = useState('')

    const receipts = [
        {
            id: 'REC-20260512-001',
            txRef: 'TX-99821',
            buyer: 'Amina Yusuf',
            property: 'Heritage Extension - Plot C12',
            amount: '₦3,200,000',
            date: '12 May 2026',
            type: 'Installment Payment'
        },
        {
            id: 'REC-20260508-002',
            txRef: 'TX-99805',
            buyer: 'Chidi Okoro',
            property: 'Heaven Ark Phase 1 - Plot A09',
            amount: '₦5,500,000',
            date: '08 May 2026',
            type: 'Full Payment'
        },
        {
            id: 'REC-20260503-003',
            txRef: 'TX-99789',
            buyer: 'Sarah Williams',
            property: 'The Palms Estate - Plot B05',
            amount: '₦2,100,000',
            date: '03 May 2026',
            type: 'Deposit'
        },
    ]

    const filteredReceipts = receipts.filter(receipt =>
        receipt.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.txRef.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-12 pb-40 text-left animate-in fade-in duration-700">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Financial Archives</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        RECEIPT <span className="text-emerald-900 text-8xl">VAULT</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-bold italic">Official Payment Acknowledgments</p>
                </div>

                <div className="hidden md:flex items-center gap-3 bg-white/[0.02] px-6 py-3 rounded-full border border-white/5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Storage Synchronized</span>
                </div>
            </div>

            {/* --- SEARCH BAR --- */}
            <div className="relative max-w-2xl group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search receipt ID, investor or transaction ref..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* --- RECEIPTS GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredReceipts.map((receipt) => (
                    <div
                        key={receipt.id}
                        className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 hover:border-emerald-500/30 transition-all group shadow-2xl relative overflow-hidden"
                    >
                        {/* Status Tag */}
                        <div className="flex justify-between items-start mb-10">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className="px-5 py-2 bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-white/5 group-hover:border-emerald-500/20 group-hover:text-emerald-500 transition-all">
                                {receipt.type}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="space-y-8">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 mb-2">Receipt Identity</p>
                                <p className="font-black text-xl italic text-white tracking-tighter uppercase leading-none">{receipt.id}</p>
                                <p className="text-[10px] font-bold text-slate-600 mt-2">{receipt.date}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-700 mb-1">Investor</p>
                                    <p className="text-xs font-black text-white uppercase italic truncate">{receipt.buyer}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-700 mb-1">Ref No.</p>
                                    <p className="text-xs font-black text-slate-400 uppercase italic truncate">{receipt.txRef}</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 mb-2">Total Amount Verified</p>
                                <p className="text-4xl font-black italic text-emerald-500 leading-none">{receipt.amount}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-12 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                            <button className="flex-1 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                <Eye className="w-4 h-4" /> Preview
                            </button>

                            <button className="flex-1 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-xl shadow-emerald-950/20">
                                <Download className="w-4 h-4" /> PDF
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredReceipts.length === 0 && (
                <div className="text-center py-40">
                    <p className="text-xl font-black italic text-slate-800 uppercase tracking-tighter">No matching records found in vault</p>
                </div>
            )}
        </div>
    )
}