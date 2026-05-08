'use client'

import { useState } from 'react'
import {
    Search,
    MoreVertical,
    ExternalLink,
    Download,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react'

export default function InvestorList() {
    // This will eventually be fetched from GET /api/admin/investors
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="space-y-6">
            {/* --- UTILITY BAR --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-[2rem]">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or plot ID..."
                        className="w-full bg-transparent border-none pl-12 pr-4 py-2 text-sm focus:ring-0 outline-none placeholder:text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                        <Filter className="w-3 h-3" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                        <Download className="w-3 h-3" /> Export CSV
                    </button>
                </div>
            </div>

            {/* --- THE LEDGER TABLE --- */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="p-6 text-[10px] uppercase font-black text-slate-500 tracking-widest">Investor</th>
                        <th className="p-6 text-[10px] uppercase font-black text-slate-500 tracking-widest">Active Asset</th>
                        <th className="p-6 text-[10px] uppercase font-black text-slate-500 tracking-widest">Equity Status</th>
                        <th className="p-6 text-[10px] uppercase font-black text-slate-500 tracking-widest">Compliance</th>
                        <th className="p-6 text-[10px] uppercase font-black text-slate-500 tracking-widest text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                    {/* Example Row */}
                    <tr className="group hover:bg-white/[0.01] transition-all">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black">
                                    AO
                                </div>
                                <div>
                                    <p className="font-bold text-slate-200 leading-none">Amaka Obi</p>
                                    <p className="text-[10px] text-slate-600 mt-1 font-mono">ID: HA-88210</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-6">
                            <div>
                                <p className="text-sm font-medium text-slate-300">Heaven Ark Phase 1</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Plot 45, Section B</p>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="flex flex-col gap-1.5">
                                <div className="w-32 bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[75%]" />
                                </div>
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">
                                    ₦4,500,000 <span className="text-slate-700">/ ₦6M</span>
                                </p>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 w-fit px-3 py-1 rounded-lg border border-emerald-500/10">
                                <CheckCircle2 className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Paid Up</span>
                            </div>
                        </td>
                        <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-emerald-500 transition-all">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>

                    {/* Overdue Row Example */}
                    <tr className="group hover:bg-white/[0.01] transition-all">
                        <td className="p-6">
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 font-black">
                                    BK
                                </div>
                                <div>
                                    <p className="font-bold leading-none">Bayo Kola</p>
                                    <p className="text-[10px] text-slate-600 mt-1 font-mono">ID: HA-88211</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-6">
                            <div>
                                <p className="text-sm font-medium text-slate-400 font-italic">Grand View Estate</p>
                                <p className="text-[10px] text-slate-600 uppercase tracking-tighter">Plot 09</p>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="flex flex-col gap-1.5">
                                <div className="w-32 bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full w-[20%]" />
                                </div>
                                <p className="text-[9px] font-black uppercase text-amber-500/70 tracking-tighter">
                                    ₦800,000 <span className="text-slate-700">/ ₦4M</span>
                                </p>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-2 text-amber-500 bg-amber-500/5 w-fit px-3 py-1 rounded-lg border border-amber-500/10">
                                <Clock className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">3 Days Overdue</span>
                            </div>
                        </td>
                        <td className="p-6 text-right">
                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                <p>Showing 2 of 1,204 Active Nodes</p>
                <div className="flex items-center gap-4">
                    <button className="hover:text-white transition-colors cursor-not-allowed">Previous</button>
                    <button className="hover:text-white transition-colors">Next Page</button>
                </div>
            </div>
        </div>
    )
}