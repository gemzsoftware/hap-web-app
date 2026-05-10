'use client'

import { mockAdminData } from '@/data/mockAdminData'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function AdminUsersPage() {
    const { users } = mockAdminData

    return (
        <div className="space-y-10 pb-20">
            {/* --- 1. REGISTRY HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Database Protocol</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Investor Registry
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Verified profiles of stakeholders and institutional capital contributors.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Valuation</p>
                        <p className="text-sm font-black text-slate-950">
                            {formatCurrency(users.reduce((acc, user) => acc + user.totalPaid, 0))}
                        </p>
                    </div>
                </div>
            </header>

            {/* --- 2. THE MASTER LEDGER --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
                <table className="w-full relative z-10">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stakeholder</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication Detail</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assets Held</th>
                        <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Equity Contribution</th>
                        <th className="text-right px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {users.map((user, index) => (
                        <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={user.id}
                            className="group hover:bg-slate-50/50 transition-colors duration-300"
                        >
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-950/20 group-hover:bg-emerald-600 transition-colors duration-500">
                                        <span className="font-black text-xs">{user.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-950 tracking-tight uppercase">{user.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <p className="text-[11px] font-bold text-slate-600 truncate max-w-[180px]">{user.email}</p>
                                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{user.phone}</p>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-900">{user.properties}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Properties</span>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-[13px] font-black text-slate-950 tracking-tighter">
                                {formatCurrency(user.totalPaid)}
                            </td>
                            <td className="px-8 py-5 text-right">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded border uppercase tracking-widest inline-flex items-center gap-2 ${
                                        user.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                        <div className={`w-1 h-1 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        {user.status}
                                    </span>
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- 3. SYSTEM SECURITY FOOTER --- */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    Registry Auth: HS-2026-X
                </p>
                <div className="flex gap-8">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Encrypted Storage Active</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">GDPR Compliant Data Layer</p>
                </div>
            </div>
        </div>
    )
}