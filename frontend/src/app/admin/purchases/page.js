'use client'

import React, { useState } from 'react'
import { Search, Filter, MoreVertical, Eye, MapPin, User, ArrowUpRight, CheckCircle2, Clock, AlertCircle, Ban } from 'lucide-react'
import Link from 'next/link'

export default function Purchases() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [activeMenu, setActiveMenu] = useState(null)

    const [purchases, setPurchases] = useState([
        {
            id: 'PUR-24051',
            buyer: 'Chidi Okoro',
            property: 'Heaven Ark Phase 1',
            amountPaid: '₦5,500,000',
            balance: '₦0',
            mode: 'Full Payment',
            status: 'Completed',
            date: '08 May 2026'
        },
        {
            id: 'PUR-24048',
            buyer: 'Amina Yusuf',
            property: 'Heritage Extension',
            amountPaid: '₦3,200,000',
            balance: '₦9,300,000',
            mode: 'Installment',
            status: 'Active',
            date: '05 May 2026'
        },
        {
            id: 'PUR-24039',
            buyer: 'Sarah Williams',
            property: 'The Palms Estate',
            amountPaid: '₦12,000,000',
            balance: '₦33,000,000',
            mode: 'Installment',
            status: 'Deposit Pending',
            date: '28 Apr 2026'
        },
    ])

    const updateStatus = (id, newStatus) => {
        setPurchases(purchases.map(p => p.id === id ? { ...p, status: newStatus } : p))
        setActiveMenu(null)
    }

    const filteredPurchases = purchases.filter(p => {
        const matchesSearch = p.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-12 pb-24 text-left animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Asset Acquisitions</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
                        PURCHASE <span className="text-emerald-900 text-8xl">FOLIO</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-bold italic">Portfolio Contract Tracking</p>
                </div>
            </div>

            {/* Search & Global Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search buyer, property or PUR-ID..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-5 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-1.5 gap-2 overflow-x-auto custom-scrollbar">
                    {['All', 'Active', 'Completed', 'Defaulted'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Table Interface */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] overflow-visible shadow-2xl">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b border-white/5">
                        <th className="px-10 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Contract ID</th>
                        <th className="px-8 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Investor Detail</th>
                        <th className="px-8 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Valuation Gap</th>
                        <th className="px-8 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Status</th>
                        <th className="px-10 py-10 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {filteredPurchases.map((purchase, index) => (
                        <tr key={purchase.id} className="group hover:bg-white/[0.02] transition-all duration-300">
                            <td className="px-10 py-10">
                                <p className="font-black italic text-sm text-white tracking-widest">{purchase.id}</p>
                                <p className="text-[9px] font-bold text-slate-700 uppercase mt-2 tracking-tighter">{purchase.date}</p>
                            </td>
                            <td className="px-8 py-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-500 font-black italic border border-emerald-500/10">
                                        {purchase.buyer[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-white italic uppercase leading-none">{purchase.buyer}</p>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase mt-1 tracking-widest">{purchase.property}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-10">
                                <p className="text-sm font-black text-white italic">{purchase.amountPaid} Paid</p>
                                <p className="text-[10px] font-bold text-orange-500 uppercase mt-1 tracking-widest">Bal: {purchase.balance}</p>
                            </td>
                            <td className="px-8 py-10">
                                <PurchaseStatus status={purchase.status} />
                            </td>
                            <td className="px-10 py-10 text-right relative">
                                <div className="flex items-center justify-end gap-3">
                                    <Link href={`/admin/purchases/${purchase.id}`}>
                                        <button className="p-4 bg-white/5 text-slate-500 hover:text-white rounded-[1.5rem] transition-all border border-white/5">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === purchase.id ? null : purchase.id)}
                                        className={`p-4 rounded-[1.5rem] transition-all border border-white/5 ${activeMenu === purchase.id ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                {activeMenu === purchase.id && (
                                    <PurchaseActionMenu
                                        purchase={purchase}
                                        updateStatus={updateStatus}
                                        setActiveMenu={setActiveMenu}
                                        index={index}
                                        total={filteredPurchases.length}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/* --- SUPPORTING COMPONENTS --- */

function PurchaseStatus({ status }) {
    const styles = {
        Completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Active: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Deposit Pending': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
        Defaulted: 'bg-red-600/10 text-red-500 border-red-600/30'
    }

    return (
        <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || 'bg-slate-500/10 text-slate-400'}`}>
            {status}
        </span>
    )
}

function PurchaseActionMenu({ purchase, updateStatus, setActiveMenu, index, total }) {
    const statuses = [
        { label: 'Active', icon: <CheckCircle2 className="w-4 h-4 text-blue-500" /> },
        { label: 'Completed', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
        { label: 'Deposit Pending', icon: <Clock className="w-4 h-4 text-orange-500" /> },
        { label: 'Cancelled', icon: <Ban className="w-4 h-4 text-red-500" /> },
        { label: 'Defaulted', icon: <AlertCircle className="w-4 h-4 text-yellow-500" /> }
    ]

    const isNearBottom = index >= total - 2;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
            <div className={`absolute right-0 z-50 w-72 bg-[#0B1220] border border-white/10 rounded-[2.5rem] py-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in zoom-in duration-200 text-left ${isNearBottom ? 'bottom-full mb-4' : 'top-full mt-4'}`}>
                <div className="px-8 text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 mb-4">Set Deal Status</div>
                {statuses.map(s => (
                    <button
                        key={s.label}
                        onClick={() => updateStatus(purchase.id, s.label)}
                        className="w-full px-8 py-4 flex items-center gap-4 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                    >
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>
        </>
    )
}