'use client'

import React from 'react'
import {
    Users, TrendingUp, Map, ShieldAlert,
    ArrowUpRight, MessageSquare, CreditCard,
    UserPlus, CheckCircle2, Clock, Zap
} from 'lucide-react'

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-[#020617] pb-20 text-white">
            <div className="max-w-7xl mx-auto px-6 pt-10 space-y-12">

                {/* --- TOP HEADER & QUICK ACTIONS --- */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                    <div className="space-y-3">
                        <p className="text-emerald-500 text-xs font-bold uppercase tracking-[3px]">LIVE ANALYTICS ENGINE</p>
                        <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter">
                            SYSTEM <span className="text-emerald-600">ROOT</span>
                        </h1>
                        <p className="text-slate-400 text-lg">Real-time Portfolio Command Center</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <QuickAction icon={<UserPlus className="w-4 h-4" />} label="New Investor" />
                        <QuickAction icon={<Map className="w-4 h-4" />} label="Manual Allocation" />
                        <QuickAction icon={<Zap className="w-4 h-4" />} label="System Broadcast" />
                    </div>
                </div>

                {/* --- GLOBAL STATISTICS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Net Revenue" value="₦142.8M" trend="+14.2%" icon={<TrendingUp />} />
                    <StatCard label="Total Investors" value="1,204" trend="+12 Today" icon={<Users />} />
                    <StatCard label="Inventory Status" value="482/600" trend="80% Sold" icon={<Map />} />
                    <StatCard label="Pending Approval" value="24" trend="High Priority" icon={<ShieldAlert />} alert />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">

                    {/* --- MAIN CONTENT --- */}
                    <div className="xl:col-span-2 space-y-10">

                        {/* Latest Transactions */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> LATEST TRANSACTIONS
                                </h3>
                                <button className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">View Full Ledger →</button>
                            </div>

                            <div className="space-y-4">
                                <TransactionRow name="Chidi Okoro" amount="₦1,250,000" status="Pending" refID="TX-99201" time="12m ago" />
                                <TransactionRow name="Amina Yusuf" amount="₦2,100,000" status="Verified" refID="TX-99188" time="45m ago" />
                                <TransactionRow name="Sarah Williams" amount="₦850,000" status="Verified" refID="TX-99175" time="2h ago" />
                                <TransactionRow name="Emeka Rolands" amount="₦1,250,000" status="Pending" refID="TX-99162" time="5h ago" />
                            </div>
                        </div>

                        {/* Latest Inquiries */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 px-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> LATEST INQUIRIES
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InquiryCard name="Adeola Johnson" message="Inquiry about Phase 2 availability..." time="1h ago" />
                                <InquiryCard name="Michael Chen" message="Trouble uploading payment proof..." time="3h ago" />
                            </div>
                        </div>
                    </div>

                    {/* --- SIDEBAR --- */}
                    <div className="space-y-10">

                        {/* Recent Onboarding */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 px-2">RECENT ONBOARDING</h3>
                            <div className="p-8 rounded-[2.75rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 space-y-6">
                                <UserItem name="Babatunde Raji" email="b.raji@email.com" initials="BR" />
                                <UserItem name="Uche Nwosu" email="uche_nw@email.com" initials="UN" />
                                <UserItem name="Kemi Adetiba" email="kemi.a@email.com" initials="KA" />
                            </div>
                        </div>

                        {/* System Logs */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 px-2">SYSTEM LOGS</h3>
                            <div className="p-8 rounded-[2.75rem] bg-emerald-500/[0.02] border border-emerald-500/10 backdrop-blur-3xl space-y-8">
                                <LogEntry icon={<CheckCircle2 className="text-emerald-500" />} text="Allocation Letter Gen: Plot 42" time="Just now" />
                                <LogEntry icon={<Clock className="text-slate-500" />} text="Callback Request logged: Chidi" time="14m ago" />
                                <LogEntry icon={<Zap className="text-emerald-500" />} text="Database Backup successful" time="2h ago" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

/* ====================== COMPONENTS ====================== */

function StatCard({ label, value, trend, icon, alert }) {
    return (
        <div className={`p-8 rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-300 hover:-translate-y-1 ${alert
            ? 'bg-red-500/5 border-red-500/20'
            : 'bg-white/5 border-white/10 hover:border-emerald-500/30'}`}>

            <div className={`p-4 rounded-2xl w-fit mb-6 ${alert ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {icon}
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <h4 className="text-4xl font-black tracking-tighter mt-2">{value}</h4>
            <span className={`text-xs font-bold mt-4 block ${alert ? 'text-red-500' : 'text-emerald-500'}`}>
                {trend}
            </span>
        </div>
    )
}

function TransactionRow({ name, amount, status, refID, time }) {
    return (
        <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/[0.05] transition-all duration-300">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-emerald-900/40 rounded-2xl border border-emerald-500/20 flex items-center justify-center font-black text-emerald-500 text-sm">TX</div>
                <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-500">{refID} • {time}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-lg font-bold text-white">{amount}</p>
                    <p className={`text-xs font-bold uppercase ${status === 'Verified' ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {status}
                    </p>
                </div>
                <button className="p-3 bg-white text-black rounded-2xl hover:bg-emerald-500 hover:text-white transition-all duration-200">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

function InquiryCard({ name, message, time }) {
    return (
        <div className="p-7 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex justify-between items-start">
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-slate-500">{time}</p>
            </div>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">{message}</p>
            <button className="mt-5 text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-emerald-400 transition-colors">
                REPLY <ArrowUpRight className="w-3 h-3" />
            </button>
        </div>
    )
}

function UserItem({ name, email, initials }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-bold text-sm text-slate-400">
                {initials}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-white truncate">{name}</p>
                <p className="text-xs text-slate-500 truncate">{email}</p>
            </div>
        </div>
    )
}

function LogEntry({ icon, text, time }) {
    return (
        <div className="flex gap-4">
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1">
                <p className="text-sm text-slate-300">{text}</p>
                <p className="text-xs text-slate-600 mt-1">{time}</p>
            </div>
        </div>
    )
}

function QuickAction({ icon, label }) {
    return (
        <button className="group flex items-center gap-3 px-7 py-4 bg-white/5 border border-white/10 hover:bg-emerald-600 hover:border-emerald-500 rounded-3xl text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all duration-300">
            {icon}
            {label}
        </button>
    )
}