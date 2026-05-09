'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    Download,
    Printer,
    Eye,
    ShieldCheck,
    FolderOpen,
    Lock
} from 'lucide-react'
import Link from 'next/link'

export default function DocumentsPage() {
    const [filter, setFilter] = useState('all')

    // Data mapped to your asset structure
    const documents = [
        { id: 'AL-9920', title: 'Allocation Letter', type: 'legal', date: 'May 05, 2026', ref: 'HAR-EPE-01' },
        { id: 'RC-8812', title: 'Payment Receipt - Inst. 04', type: 'receipt', date: 'May 08, 2026', ref: 'INV-99201' },
        { id: 'SA-7721', title: 'Purchase Agreement', type: 'agreement', date: 'April 12, 2026', ref: 'CON-8822' },
        { id: 'CO-1102', title: 'Certificate of Ownership', type: 'ownership', date: 'Pending', ref: 'OWN-PENDING' },
    ]

    const filteredDocs = filter === 'all' ? documents : documents.filter(doc => doc.type === filter)

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 text-left min-h-screen bg-[#020617]">

            {/* HEADER SECTION */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Lock className="w-3.5 h-3.5" style={{ color: '#B59410' }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Official Records</span>
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                        Legal <span className="text-slate-800 text-5xl">Documents</span>
                    </h2>
                </div>

                <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Security Verified</span>
                </div>
            </header>

            {/* FILTER CONTROLS */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-8 overflow-x-auto">
                <FilterTab active={filter === 'all'} onClick={() => setFilter('all')} label="All Documents" />
                <FilterTab active={filter === 'legal'} onClick={() => setFilter('legal')} label="Allocation" />
                <FilterTab active={filter === 'agreement'} onClick={() => setFilter('agreement')} label="Agreements" />
                <FilterTab active={filter === 'receipt'} onClick={() => setFilter('receipt')} label="Receipts" />
                <FilterTab active={filter === 'ownership'} onClick={() => setFilter('ownership')} label="Ownership" />
            </div>

            {/* DOCUMENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredDocs.map((doc) => (
                        <motion.div
                            key={doc.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group relative p-8 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-[#B59410]/40 transition-all flex flex-col justify-between h-[340px] overflow-hidden"
                        >
                            {/* Graphic Decoration */}
                            <FileText className="absolute -bottom-10 -right-10 w-40 h-40 text-white/[0.02] group-hover:text-[#B59410]/5 transition-all duration-500" />

                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 rounded-2xl bg-[#002B5B] border border-white/5 shadow-xl" style={{ color: '#B59410' }}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Document ID</p>
                                        <p className="text-[10px] font-bold text-slate-400">{doc.ref}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-white italic tracking-tight">{doc.title}</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{doc.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-6 relative z-10">
                                <Link href={doc.type === 'receipt' ? `/dashboard/payments/receipt/${doc.id}` : '#'} className="flex-1">
                                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/5 backdrop-blur-md">
                                        <Eye className="w-3.5 h-3.5" /> Preview
                                    </button>
                                </Link>
                                <button className="p-4 rounded-2xl text-white hover:opacity-90 transition-all shadow-lg" style={{ backgroundColor: '#B59410' }}>
                                    <Download className="w-4 h-4" />
                                </button>
                                <button onClick={() => window.print()} className="p-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all border border-white/5 backdrop-blur-md">
                                    <Printer className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* PLACEHOLDER FOR UPCOMING DOCS */}
                <div className="p-8 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center space-y-4 hover:border-white/10 transition-all cursor-pointer group">
                    <div className="p-5 rounded-full bg-white/5 group-hover:bg-white/10 transition-all">
                        <FolderOpen className="w-8 h-8 text-slate-600 group-hover:text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Additional Records</p>
                        <p className="text-[9px] text-slate-700 italic uppercase mt-1">Status: Processing</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* HELPER COMPONENTS */

function FilterTab({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                active
                    ? 'text-white shadow-xl'
                    : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/20'
            }`}
            style={active ? { backgroundColor: '#B59410', borderColor: '#B59410' } : {}}
        >
            {label}
        </button>
    )
}