'use client'

import { useState } from 'react'
import { mockAdminData } from '@/data/mockAdminData'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLandsPage() {
    const [lands, setLands] = useState(mockAdminData.lands)
    const [showForm, setShowForm] = useState(false)

    return (
        <div className="space-y-10 pb-20">
            {/* --- 1. TERMINAL HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Inventory Protocol</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Asset Inventory
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Provision, audit, and regulate site-specific property metadata.
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`font-black px-8 py-4 rounded-2xl text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${
                        showForm
                            ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-slate-200/20'
                            : 'bg-slate-950 text-white hover:bg-emerald-600 shadow-slate-900/20'
                    }`}
                >
                    {showForm ? 'Cancel Entry' : '+ Provision Asset'}
                </button>
            </header>

            {/* --- 2. ASSET PROVISIONING FORM --- */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-10 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none"
                             style={{ backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`, backgroundSize: '15px 15px' }}
                        />

                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6">New Asset Specifications</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormInput label="Asset Title" placeholder="e.g. Primrose Estate Ph 1" />
                            <FormInput label="Geographic Coordinates" placeholder="e.g. Epe, Lagos" />
                            <FormInput label="Valuation (₦)" placeholder="0.00" type="number" />
                            <FormInput label="Dimension Units" placeholder="e.g. 600 SQM" />
                            <FormInput label="Initial Clearing" placeholder="₦ 0.00" type="number" />
                            <FormInput label="Monthly Remittance" placeholder="₦ 0.00" type="number" />
                        </div>

                        <div className="pt-4">
                            <button className="bg-slate-950 hover:bg-emerald-600 text-white font-black px-10 py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/20">
                                Commit to Registry
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- 3. ASSET LEDGER TABLE --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Identification</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Value</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Beneficiary</th>
                        <th className="text-right px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {lands.map((land) => (
                        <tr key={land.id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                            <td className="px-8 py-5 text-[12px] font-black text-slate-950 tracking-tight">{land.title}</td>
                            <td className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{land.location}</td>
                            <td className="px-8 py-5 text-[13px] font-black text-slate-950 tracking-tighter">{formatCurrency(land.price)}</td>
                            <td className="px-8 py-5">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded border uppercase tracking-widest flex items-center w-fit gap-2 ${
                                        land.status === 'available'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                        <div className={`w-1 h-1 rounded-full ${land.status === 'available' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                        {land.status}
                                    </span>
                            </td>
                            <td className="px-8 py-5 text-[11px] font-bold text-slate-500">{land.buyer || 'UNALLOCATED'}</td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-6">
                                    <button className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Adjust</button>
                                    <button className="text-[10px] font-black text-slate-300 hover:text-red-600 uppercase tracking-widest transition-colors">Purge</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function FormInput({ label, placeholder, type = "text" }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-bold focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
            />
        </div>
    )
}