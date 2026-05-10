'use client'

import { mockDashboardData } from '@/data/mockDashboardData'
import { COMPANY } from '@/lib/constants'
import { motion } from 'framer-motion'

export default function SettingsPage() {
    const { user } = mockDashboardData

    return (
        <div className="space-y-10 pb-20 max-w-3xl">
            {/* --- 1. SETTINGS HEADER --- */}
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Account Security</span>
                </div>
                <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                    Investor Profile
                </h1>
                <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                    Manage institutional identification and contact parameters.
                </p>
            </header>

            {/* --- 2. CORE IDENTITY CONSOLE --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                {/* Subtle Grid Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none"
                     style={{ backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`, backgroundSize: '15px 15px' }}
                />

                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-slate-50">
                    <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center shadow-2xl shadow-slate-900/20 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-black text-3xl tracking-tighter">
                            {user.fullName.charAt(0)}
                        </span>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-xl font-black text-slate-950 tracking-tight">{user.fullName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry ID: {user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Legal Name</label>
                        <input
                            type="text"
                            defaultValue={user.fullName}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-bold focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Email Registry</label>
                        <input
                            type="email"
                            defaultValue={user.email}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-bold focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Mobile Contact</label>
                        <input
                            type="tel"
                            defaultValue={user.phone}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-bold focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="mt-10">
                    <button className="bg-slate-950 hover:bg-emerald-600 text-white font-black px-10 py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                        Update Registry
                    </button>
                </div>
            </div>

            {/* --- 3. SETTLEMENT PROTOCOL (Bank Details) --- */}
            <div className="bg-slate-950 rounded-[2.5rem] p-8 relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(45deg, #1e293b 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

                <div className="relative z-10">
                    <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        Settlement Protocol
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Institution</p>
                            <p className="text-sm font-black text-white">GTBank PLC</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 sm:col-span-2">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Beneficiary Account</p>
                            <p className="text-sm font-black text-white uppercase tracking-tight">{COMPANY.fullName}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/10 border border-emerald-500/30 sm:col-span-3 flex justify-between items-center">
                            <div>
                                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Clearing Number</p>
                                <p className="text-2xl font-black text-white tracking-[0.2em]">0123456789</p>
                            </div>
                            <button className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest px-4 py-2 border border-white/10 rounded-xl">
                                Copy
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                            Crucial: Ensure the transaction reference contains your full legal name for automated ledger synchronization.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}