'use client'

import React, { useState } from 'react'
import { Search, Upload, Download, Eye, FileText, Calendar, User, Home, PlusCircle } from 'lucide-react'

export default function Documents() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('All')

    const documents = [
        {
            id: 'DOC-AL-3921',
            title: 'Allocation Letter - Plot C12',
            buyer: 'Amina Yusuf',
            property: 'Heritage Extension',
            type: 'Allocation Letter',
            status: 'Signed',
            date: '10 May 2026',
            fileType: 'PDF'
        },
        {
            id: 'DOC-AG-2918',
            title: 'Purchase Agreement',
            buyer: 'Chidi Okoro',
            property: 'Heaven Ark Phase 1',
            type: 'Agreement',
            status: 'Approved',
            date: '08 May 2026',
            fileType: 'PDF'
        },
        {
            id: 'DOC-TD-7842',
            title: 'Certificate of Occupancy',
            buyer: 'Sarah Williams',
            property: 'The Palms Estate',
            type: 'Ownership Document',
            status: 'Pending',
            date: '02 May 2026',
            fileType: 'PDF'
        },
    ]

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.buyer.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === 'All' || doc.type === filterType
        return matchesSearch && matchesType
    })

    return (
        <div className="space-y-12 pb-40 text-left animate-in fade-in duration-700">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Vault Security</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        DOCUMENT <span className="text-emerald-900 text-8xl">VAULT</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-bold italic">Legal Compliance & Asset Verification</p>
                </div>

                <button className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/20 active:scale-95">
                    <Upload className="w-4 h-4" />
                    Upload Asset
                </button>
            </div>

            {/* --- FILTERS --- */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search document title, buyer or PUR-ID..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:border-emerald-500/50 outline-none appearance-none cursor-pointer"
                >
                    <option value="All">All Classifications</option>
                    <option value="Allocation Letter">Allocation Letter</option>
                    <option value="Agreement">Purchase Agreement</option>
                    <option value="Ownership Document">Certificate of Occupancy</option>
                </select>
            </div>

            {/* --- GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredDocs.map((doc) => (
                    <div key={doc.id} className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 hover:border-emerald-500/30 transition-all group shadow-2xl flex flex-col h-full">
                        <div className="flex justify-between items-start mb-10">
                            <div className="p-4 bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20 text-emerald-500">
                                <FileText className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            </div>
                            <DocumentStatus status={doc.status} />
                        </div>

                        <div className="space-y-2 flex-grow">
                            <p className="font-mono text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">{doc.id}</p>
                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-tight line-clamp-2">{doc.title}</h3>
                        </div>

                        <div className="mt-10 space-y-4 border-t border-white/5 pt-8">
                            <InfoRow label="Investor" value={doc.buyer} />
                            <InfoRow label="Property" value={doc.property} />
                            <InfoRow label="Logged" value={doc.date} />
                        </div>

                        <div className="flex gap-4 mt-12">
                            <button className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                                <Eye className="w-4 h-4" /> Preview
                            </button>
                            <button className="flex-1 py-5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                                <Download className="w-4 h-4" /> PDF
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- QUICK ASSIGNMENT FORM --- */}
            <div className="mt-20 border border-white/5 bg-white/[0.01] rounded-[4rem] p-12 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                    <PlusCircle className="w-40 h-40 text-white" />
                </div>

                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                    <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                    Quick Deployment <span className="text-emerald-900">Module</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 ml-4">Assign to Portfolio</label>
                        <select className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 text-xs font-bold text-white outline-none focus:border-emerald-500/50 appearance-none">
                            <option>PUR-24048 - Amina Yusuf (Heritage Extension)</option>
                            <option>PUR-24051 - Chidi Okoro (Heaven Ark Phase 1)</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 ml-4">Classification</label>
                        <select className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 text-xs font-bold text-white outline-none focus:border-emerald-500/50 appearance-none">
                            <option>Allocation Letter</option>
                            <option>Purchase Agreement</option>
                            <option>Certificate of Occupancy</option>
                            <option>Payment Receipt</option>
                        </select>
                    </div>
                </div>

                <button className="mt-12 w-full py-6 bg-emerald-600 hover:bg-emerald-500 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] text-white transition-all shadow-xl shadow-emerald-950/20 active:scale-[0.98]">
                    Finalize & Deploy Document
                </button>
            </div>
        </div>
    )
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center text-[10px]">
            <span className="font-black uppercase tracking-widest text-slate-700">{label}</span>
            <span className="font-black italic text-white uppercase tracking-tighter">{value}</span>
        </div>
    )
}

function DocumentStatus({ status }) {
    const styles = {
        Signed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Pending: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    }

    return (
        <span className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-full border ${styles[status] || 'bg-slate-500/10 text-slate-400 border-white/5'}`}>
            {status}
        </span>
    )
}