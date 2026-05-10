'use client'

import { mockAdminData } from '@/data/mockAdminData'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

const StatCard = ({ title, value, subtitle, trend, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 overflow-hidden relative"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] -mr-8 -mt-8 group-hover:bg-emerald-50 transition-colors duration-500" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</p>
                </div>

                <p className="text-3xl font-black text-slate-950 tracking-tighter mb-1">{value}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
                    {trend && (
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default function AdminPage() {
    const { stats, revenueChart, users } = mockAdminData

    return (
        <div className="space-y-12 pb-20">
            {/* --- 1. COMMAND HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Global Operations</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Executive Overview
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Real-time intelligence and fiscal performance metrics.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all">
                        Generate Audit
                    </button>
                    <button className="bg-slate-950 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-950/20">
                        Asset Control
                    </button>
                </div>
            </header>

            {/* --- 2. INTELLIGENCE GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard index={0} title="Investor Base" value={stats.totalUsers} subtitle={`${stats.activeUsers} Active Nodes`} trend="+12%" />
                <StatCard index={1} title="Gross Revenue" value={formatCurrency(stats.totalRevenue)} subtitle="Consolidated" trend="Stables" />
                <StatCard index={2} title="Inventory State" value={stats.availableLands} subtitle={`${stats.soldLands} Units Settled`} />
                <StatCard index={3} title="Capital Pipeline" value={stats.pendingPayments} subtitle="Pending Clearance" trend="Priority" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- 3. REVENUE ANALYTICS --- */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Monthly Performance</h2>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">Fiscal Year 2026</span>
                    </div>

                    <div className="space-y-6">
                        {revenueChart.map((item) => (
                            <div key={item.month} className="group flex items-center gap-6">
                                <span className="text-[10px] font-black text-slate-400 w-10 uppercase tracking-widest">{item.month}</span>
                                <div className="flex-1 bg-slate-50 rounded-2xl h-10 overflow-hidden relative border border-slate-100/50">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.amount / 15000000) * 100}%` }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        className="bg-slate-950 h-full rounded-2xl flex items-center justify-end px-4 group-hover:bg-emerald-600 transition-colors duration-500 shadow-lg"
                                    >
                                        <span className="text-white text-[10px] font-black tracking-tighter">{formatCurrency(item.amount)}</span>
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- 4. RECENT REGISTRATIONS --- */}
                <div className="bg-slate-950 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-950/40 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#fff 1.5px, transparent 1.5px)`, backgroundSize: '15px 15px' }} />

                    <div className="relative z-10 h-full flex flex-col">
                        <h2 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-8">Registry Activity</h2>

                        <div className="flex-1 space-y-6">
                            {users.slice(0, 5).map((user) => (
                                <div key={user.id} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-500">
                                        <span className="text-white group-hover:text-slate-950 font-black text-xs">{user.name.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-black text-white uppercase tracking-wider truncate">{user.name}</p>
                                        <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{user.email}</p>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                                </div>
                            ))}
                        </div>

                        <a href="/admin/users" className="mt-10 block text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                            View Full Registry
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}