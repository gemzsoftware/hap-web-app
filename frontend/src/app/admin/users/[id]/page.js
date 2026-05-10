'use client'

import React, { useState } from 'react'
import {
    ArrowLeft, CreditCard, FileText, Activity, Map,
    ExternalLink, UserX, UserCheck, Edit3, X, Save,
    Download, ShieldAlert, CheckCircle2, Clock
} from 'lucide-react'
import Link from 'next/link'

export default function UserDetails() {
    const [isSuspended, setIsSuspended] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [user, setUser] = useState({
        name: 'Chidi Okoro',
        email: 'chidi@ark.com',
        phone: '+234 803 000 1111',
        tier: 'Premium Investor',
        id: 'ARK-99201-PR'
    })

    const handleSuspendToggle = () => {
        const action = isSuspended ? 'Activate' : 'Suspend';
        if(confirm(`Are you sure you want to ${action} this account?`)) {
            setIsSuspended(!isSuspended)
        }
    }

    return (
        <div className="space-y-12 pb-24 text-left font-sans animate-in fade-in duration-700">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <Link href="/admin/users" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-emerald-500 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back to Registry
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-[2.5rem] border flex items-center justify-center font-black text-3xl shadow-2xl transition-all duration-500 ${isSuspended ? 'bg-red-950/20 border-red-500/20 text-red-500' : 'bg-emerald-900 border-emerald-500/20 text-emerald-500'}`}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h2 className={`text-5xl font-black italic tracking-tighter uppercase leading-none transition-colors ${isSuspended ? 'text-red-500' : 'text-white'}`}>
                                {user.name.split(' ')[0]} <span className={isSuspended ? 'text-red-900' : 'text-emerald-900'}>{user.name.split(' ')[1]}</span>
                            </h2>
                            <div className="flex items-center gap-3 mt-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${isSuspended ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                    {isSuspended ? 'Account Suspended' : 'Active Investor'}
                                </span>
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">ID: {user.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={handleSuspendToggle} className={`px-8 py-5 border rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${isSuspended ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/20' : 'bg-white/5 border-white/10 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                        {isSuspended ? <><UserCheck className="w-4 h-4" /> Activate User</> : <><UserX className="w-4 h-4" /> Suspend User</>}
                    </button>
                    <button onClick={() => setIsEditModalOpen(true)} className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                        <Edit3 className="w-4 h-4 text-emerald-500" /> Edit Profile
                    </button>
                </div>
            </div>

            {/* --- DATA GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* COLUMN 1: FINANCES & ASSETS */}
                <div className="space-y-8">
                    <InsightCard icon={<CreditCard className="w-5 h-5" />} title="Financial Footprint">
                        <div className="space-y-6 pt-4">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Total Portfolio Value</p>
                                <h4 className="text-4xl font-black italic text-white leading-none">₦12.5M</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <p className="text-[8px] font-black text-slate-700 uppercase mb-1">Total Paid</p>
                                    <p className="text-sm font-black text-emerald-500">₦8.2M</p>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <p className="text-[8px] font-black text-slate-700 uppercase mb-1">Balance</p>
                                    <p className="text-sm font-black text-orange-500">₦4.3M</p>
                                </div>
                            </div>
                        </div>
                    </InsightCard>

                    <InsightCard icon={<Map className="w-5 h-5" />} title="Asset Allocations">
                        <div className="space-y-3 pt-4">
                            <AssetItem title="Heaven Ark Phase 1" detail="Plot 42 • Allocated" />
                            <AssetItem title="Heritage Extension" detail="Plot 10 • Pending Verification" warning />
                        </div>
                    </InsightCard>
                </div>

                {/* COLUMN 2 & 3: LEDGER & COMPLIANCE */}
                <div className="lg:col-span-2 space-y-8">
                    <InsightCard icon={<Activity className="w-5 h-5" />} title="Transaction Ledger">
                        <div className="space-y-3 pt-4">
                            <LedgerItem date="12 May 2026" amount="₦1,250,000" type="Installment" status="Verified" />
                            <LedgerItem date="01 Apr 2026" amount="₦2,500,000" type="Initial Deposit" status="Verified" />
                            <LedgerItem date="14 Mar 2026" amount="₦500,000" type="Processing Fee" status="Processing" />
                        </div>
                    </InsightCard>

                    <InsightCard icon={<FileText className="w-5 h-5" />} title="Compliance Documents">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <DocRow title="Government ID" status="Verified" />
                            <DocRow title="Proof of Address" status="Verified" />
                            <DocRow title="Allocation Letter" status="Pending Signature" warning />
                            <DocRow title="Deed of Assignment" status="Not Generated" muted />
                        </div>
                    </InsightCard>
                </div>
            </div>

            {/* --- MODALS --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
                    <form className="relative w-full max-w-xl bg-[#0B1220] border border-white/10 rounded-[3.5rem] p-10 space-y-8 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Edit <span className="text-emerald-500">Investor</span></h3>
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <EditField label="Name" value={user.name} />
                            <EditField label="Email" value={user.email} />
                            <EditField label="Phone" value={user.phone} />
                        </div>
                        <button className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 shadow-xl flex items-center justify-center gap-3">
                            <Save className="w-4 h-4" /> Save Profile
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

/* --- REUSABLE UI COMPONENTS --- */

function InsightCard({ icon, title, children }) {
    return (
        <div className="p-10 rounded-[3.5rem] bg-white/[0.01] border border-white/5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-inner">{icon}</div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">{title}</h3>
            </div>
            {children}
        </div>
    )
}

function AssetItem({ title, detail, warning }) {
    return (
        <div className={`p-6 rounded-[2rem] bg-white/[0.02] border transition-all flex items-center justify-between group cursor-pointer ${warning ? 'border-orange-500/20' : 'border-white/5 hover:border-emerald-500/20'}`}>
            <div>
                <p className="text-xs font-black text-white uppercase italic tracking-tight">{title}</p>
                <p className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter mt-1">{detail}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-800 group-hover:text-emerald-500 transition-colors" />
        </div>
    )
}

function LedgerItem({ date, amount, type, status }) {
    return (
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex justify-between items-center group">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${status === 'Verified' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'}`} />
                <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{date}</p>
                    <p className="text-sm font-black text-white uppercase italic">{type}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-lg font-black text-white italic leading-none mb-1">{amount}</p>
                <p className={`text-[9px] font-black uppercase tracking-widest ${status === 'Verified' ? 'text-emerald-500' : 'text-orange-500'}`}>{status}</p>
            </div>
        </div>
    )
}

function DocRow({ title, status, warning, muted }) {
    return (
        <div className={`p-6 rounded-[2rem] bg-white/[0.02] border flex items-center justify-between ${warning ? 'border-orange-500/20 shadow-orange-950/10' : 'border-white/5'}`}>
            <div className="flex items-center gap-4">
                <FileText className={`w-5 h-5 ${warning ? 'text-orange-500' : muted ? 'text-slate-800' : 'text-emerald-500'}`} />
                <div>
                    <p className="text-[10px] font-black text-white uppercase italic">{title}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-tighter mt-0.5 ${warning ? 'text-orange-500' : 'text-slate-700'}`}>{status}</p>
                </div>
            </div>
            {!muted && <Download className="w-4 h-4 text-slate-800 hover:text-white transition-colors cursor-pointer" />}
        </div>
    )
}

function EditField({ label, value }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-700 ml-4">{label}</label>
            <input type="text" defaultValue={value} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold text-white focus:border-emerald-500/50 outline-none" />
        </div>
    )
}