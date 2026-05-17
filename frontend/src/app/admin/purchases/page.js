'use client'

import React, { useState, useEffect } from 'react'
import { Search, MoreVertical, Eye, CheckCircle2, Clock, AlertCircle, Ban, ShieldCheck, CreditCard, Wallet, Loader2, ArrowUpRight, XCircle, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function Purchases() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [paymentFilter, setPaymentFilter] = useState('All')
    const [activeMenu, setActiveMenu] = useState(null)
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPurchase, setSelectedPurchase] = useState(null)

    useEffect(() => {
        loadPurchases()
    }, [])

    const loadPurchases = () => {
        const storedPurchases = localStorage.getItem('purchases')
        const storedPayments = localStorage.getItem('payments')

        const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []

        const merged = allPurchases.map(purchase => {
            const relatedPayments = allPayments.filter(
                p => (p.purchaseId === purchase.id) ||
                    (p.propertyId === purchase.propertyId && p.buyerEmail === purchase.buyerEmail)
            )
            const totalPaidSoFar = relatedPayments
                .filter(p => p.status === 'verified')
                .reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)

            return {
                ...purchase,
                totalPaidSoFar: totalPaidSoFar || Number(purchase.amountPaid) || 0,
                remainingBalance: (Number(purchase.totalPrice) || 0) - (totalPaidSoFar || Number(purchase.amountPaid) || 0),
                paymentCount: relatedPayments.length,
                paymentHistory: relatedPayments,
                lastPayment: relatedPayments[relatedPayments.length - 1] || null
            }
        })

        setPurchases(merged)
        setLoading(false)
    }

    const updateStatus = (id, newStatus) => {
        const storedPurchases = localStorage.getItem('purchases')
        const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []
        const updated = allPurchases.map(p => p.id === id ? { ...p, status: newStatus } : p)
        localStorage.setItem('purchases', JSON.stringify(updated))

        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const updatedPayments = allPayments.map(p =>
            (p.purchaseId === id || p.id === id) ? { ...p, status: newStatus } : p
        )
        localStorage.setItem('payments', JSON.stringify(updatedPayments))

        loadPurchases()
        setActiveMenu(null)
    }

    const verifyPayment = (paymentId) => {
        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const updated = allPayments.map(p => {
            if (p.id === paymentId || p.purchaseId === paymentId) {
                return { ...p, status: 'verified', verifiedAt: new Date().toISOString(), receiptNumber: `HAP-RCPT-${Date.now()}` }
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(updated))
        loadPurchases()
    }

    const declinePayment = (paymentId) => {
        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const updated = allPayments.map(p => {
            if (p.id === paymentId || p.purchaseId === paymentId) {
                return { ...p, status: 'declined', declinedAt: new Date().toISOString() }
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(updated))
        loadPurchases()
    }

    const filteredPurchases = purchases.filter(p => {
        const matchesSearch = (p.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.propertyTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.transactionReference || '').toLowerCase().includes(searchTerm.toLowerCase())

        let matchesStatus = true
        if (statusFilter === 'Active') matchesStatus = Number(p.remainingBalance) > 0 && p.status !== 'declined'
        else if (statusFilter === 'Completed') matchesStatus = Number(p.remainingBalance) <= 0 || p.status === 'completed'
        else if (statusFilter === 'Pending') matchesStatus = p.status === 'pending'
        else if (statusFilter === 'Declined') matchesStatus = p.status === 'declined'

        let matchesPayment = true
        if (paymentFilter === 'Full') matchesPayment = p.paymentMode === 'full'
        else if (paymentFilter === 'Installment') matchesPayment = p.paymentMode === 'installment'

        return matchesSearch && matchesStatus && matchesPayment
    })

    // Calculate totals
    const totalRevenue = purchases
        .filter(p => p.status === 'verified' || Number(p.remainingBalance) <= 0)
        .reduce((sum, p) => sum + (p.totalPaidSoFar || 0), 0)
    const totalPending = purchases
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0)
    const activeCount = purchases.filter(p => Number(p.remainingBalance) > 0 && p.status !== 'declined').length
    const completedCount = purchases.filter(p => Number(p.remainingBalance) <= 0 || p.status === 'completed').length

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-24 text-left animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Asset Acquisitions</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
                        PURCHASE <span className="text-emerald-900 text-8xl">FOLIO</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-bold italic">Complete Transaction Ledger</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Total Revenue</p>
                    <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Pending</p>
                    <p className="text-2xl font-black text-amber-400">{formatCurrency(totalPending)}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Active Contracts</p>
                    <p className="text-2xl font-black text-blue-400">{activeCount}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Completed</p>
                    <p className="text-2xl font-black text-emerald-400">{completedCount}</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search buyer, property, reference or Contract ID..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-5 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <div className="flex bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-1.5 gap-2">
                    {['All', 'Active', 'Pending', 'Completed', 'Declined'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Payment Mode Filter */}
                <div className="flex bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-1.5 gap-2">
                    {['All', 'Full', 'Installment'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setPaymentFilter(tab)}
                            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${paymentFilter === tab ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
                        >
                            {tab === 'All' ? 'All Modes' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Purchases List */}
            {filteredPurchases.length === 0 ? (
                <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] py-32 text-center">
                    <Clock className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                    <h3 className="text-3xl font-light text-slate-400">No Purchases Found</h3>
                    <p className="text-slate-500 mt-3">Purchases will appear when users submit payment proofs.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredPurchases.map((purchase) => {
                        const percentPaid = purchase.totalPrice > 0
                            ? Math.round((purchase.totalPaidSoFar / purchase.totalPrice) * 100)
                            : 0
                        const isCompleted = Number(purchase.remainingBalance) <= 0

                        return (
                            <div
                                key={purchase.id}
                                className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-white/10 transition-all"
                            >
                                {/* Main Row */}
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Buyer Info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-14 h-14 bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-500 font-black text-lg border border-emerald-500/10 flex-shrink-0">
                                            {(purchase.buyerName || 'U')[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-black text-white truncate">{purchase.buyerName || 'Unknown Buyer'}</h3>
                                            <p className="text-xs text-slate-500 truncate">{purchase.buyerEmail}</p>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase mt-1 tracking-widest">{purchase.propertyTitle}</p>
                                        </div>
                                    </div>

                                    {/* Payment Mode + Amount */}
                                    <div className="flex items-center gap-4">
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            purchase.paymentMode === 'full'
                                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                        }`}>
                                            {purchase.paymentMode === 'full' ? <Wallet className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                                            {purchase.paymentMode === 'full' ? 'Full Payment' : 'Installment'}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-400">Ref</p>
                                            <p className="text-xs font-mono text-emerald-400">{purchase.transactionReference || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="lg:min-w-[250px]">
                                        <div className="flex justify-between text-[9px] mb-1.5">
                                            <span className="text-slate-500">Paid: {formatCurrency(purchase.totalPaidSoFar)}</span>
                                            <span className="text-white font-bold">{percentPaid}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isCompleted ? 'bg-emerald-500' : percentPaid > 50 ? 'bg-blue-500' : 'bg-amber-500'
                                                }`}
                                                style={{ width: `${percentPaid}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[9px] mt-1.5">
                                            <span className="text-slate-500">Total: {formatCurrency(purchase.totalPrice)}</span>
                                            {isCompleted ? (
                                                <span className="text-emerald-400 font-bold">✓ Completed</span>
                                            ) : (
                                                <span className="text-amber-400 font-bold">Bal: {formatCurrency(purchase.remainingBalance)}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status + Actions */}
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                purchase.status === 'declined' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    purchase.status === 'verified' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {isCompleted ? 'Completed' : purchase.status === 'declined' ? 'Declined' : purchase.status === 'verified' ? 'Active' : 'Pending'}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            {purchase.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => verifyPayment(purchase.id)}
                                                        className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all"
                                                        title="Verify Payment"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => declinePayment(purchase.id)}
                                                        className="p-2.5 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all"
                                                        title="Decline Payment"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => setSelectedPurchase(selectedPurchase?.id === purchase.id ? null : purchase)}
                                                className={`p-2.5 rounded-xl transition-all ${selectedPurchase?.id === purchase.id ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Detail View */}
                                {selectedPurchase?.id === purchase.id && (
                                    <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Payment History</h4>
                                        {purchase.paymentHistory && purchase.paymentHistory.length > 0 ? (
                                            <div className="space-y-2">
                                                {purchase.paymentHistory.map((pay, idx) => (
                                                    <div key={pay.id || idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl text-xs">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-2 h-2 rounded-full ${
                                                                pay.status === 'verified' ? 'bg-emerald-500' :
                                                                    pay.status === 'declined' ? 'bg-red-500' : 'bg-amber-500'
                                                            }`} />
                                                            <span className="text-slate-300">{formatCurrency(pay.amountPaid || pay.amount)}</span>
                                                            <span className="text-slate-500 font-mono">{pay.transactionReference}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-[10px] font-bold uppercase ${
                                                                pay.status === 'verified' ? 'text-emerald-400' :
                                                                    pay.status === 'declined' ? 'text-red-400' : 'text-amber-400'
                                                            }`}>{pay.status}</span>
                                                            <span className="text-slate-600">{pay.submittedAt ? new Date(pay.submittedAt).toLocaleDateString() : ''}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-600">No payment records yet</p>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white px-4 py-2 bg-white/5 rounded-xl transition-all">
                                                <Download className="w-3 h-3 inline mr-1" /> Export Receipt
                                            </button>
                                            <Link href={`/admin/purchases/${purchase.id}`} className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 px-4 py-2 bg-emerald-500/5 rounded-xl transition-all">
                                                View Full Details →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}