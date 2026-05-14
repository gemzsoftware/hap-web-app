'use client'

import React, { useState } from 'react'
import { Search, Filter, ArrowUpRight, CreditCard, Banknote } from 'lucide-react'

export default function Payments() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [typeFilter, setTypeFilter] = useState('All')

    const payments = [
        { id: 'TX-99821', buyer: 'Amina Yusuf', amount: '₦3,200,000', type: 'Installment', status: 'Verified', date: '05 May 2026', ref: 'PUR-24048' },
        { id: 'TX-99805', buyer: 'Chidi Okoro', amount: '₦5,500,000', type: 'Full Payment', status: 'Verified', date: '08 May 2026', ref: 'PUR-24051' },
        { id: 'TX-99789', buyer: 'Sarah Williams', amount: '₦2,100,000', type: 'Installment', status: 'Pending', date: '03 May 2026', ref: 'PUR-24039' },
    ]

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.buyer.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter
        const matchesType = typeFilter === 'All' || p.type === typeFilter
        return matchesSearch && matchesStatus && matchesType
    })

    return (
        <div className="space-y-12 pb-20">
            <div>
                <p className="text-xs font-bold uppercase tracking-[3px] text-emerald-500">Financial Ledger</p>
                <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white">PAYMENTS</h1>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        placeholder="Search transaction or buyer..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-5 pl-16 text-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/[0.03] border border-white/10 rounded-3xl px-8 py-5 text-sm">
                    <option value="All">All Status</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                </select>

                <select onChange={(e) => setTypeFilter(e.target.value)} className="bg-white/[0.03] border border-white/10 rounded-3xl px-8 py-5 text-sm">
                    <option value="All">All Types</option>
                    <option value="Full Payment">Full Payment</option>
                    <option value="Installment">Installment</option>
                </select>
            </div>

            {/* Payments Table */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.75rem] overflow-hidden">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-white/10">
                        <th className="px-10 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Transaction</th>
                        <th className="px-8 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Buyer</th>
                        <th className="px-8 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Type</th>
                        <th className="px-8 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Amount</th>
                        <th className="px-8 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                        <th className="px-8 py-8 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Date</th>
                        <th className="px-10 py-8 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                    {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-white/[0.03] transition-all">
                            <td className="px-10 py-8 font-mono text-white">{payment.id}</td>
                            <td className="px-8 py-8 font-medium">{payment.buyer}</td>
                            <td className="px-8 py-8 text-sm">{payment.type}</td>
                            <td className="px-8 py-8 font-semibold text-emerald-400">{payment.amount}</td>
                            <td className="px-8 py-8">
                                    <span className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${payment.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                        {payment.status}
                                    </span>
                            </td>
                            <td className="px-8 py-8 text-sm text-slate-400">{payment.date}</td>
                            <td className="px-10 py-8 text-right">
                                <button className="p-4 bg-white/5 hover:bg-emerald-600 rounded-2xl transition-all">
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}