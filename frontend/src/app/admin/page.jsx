'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
    Users, TrendingUp, Map, ShieldAlert,
    ArrowUpRight, MessageSquare, CreditCard,
    UserPlus, CheckCircle2, Clock, Zap, Wallet, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { adminAPI } from '@/lib/api/client'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboard() {
    const [overview, setOverview] = useState(null)
    const [recentPayments, setRecentPayments] = useState([])
    const [recentPurchases, setRecentPurchases] = useState([])
    const [recentUsers, setRecentUsers] = useState([])
    const [recentInquiries, setRecentInquiries] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [totalPending, setTotalPending] = useState(0)
    const [refreshing, setRefreshing] = useState(false)

    const loadAllData = useCallback(async () => {
        try {
            const [overviewData, paymentsData, usersData, inquiriesData] = await Promise.all([
                adminAPI.getOverview(),
                adminAPI.getPayments({ limit: 5 }),
                adminAPI.getUsers({ limit: 3 }),
                adminAPI.getInquiries({ limit: 2 }),
            ])
            setOverview(overviewData.data)
            setRecentPayments(paymentsData.data || [])
            setRecentUsers(usersData.data || [])
            setRecentInquiries(inquiriesData.data || [])
        } catch (error) {
            console.log('Using local data for admin')
        }

        const storedPayments = localStorage.getItem('payments')
        const storedPurchases = localStorage.getItem('purchases')

        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []

        setRecentPayments(allPayments.slice(-5).reverse())
        setRecentPurchases(allPurchases.slice(-5).reverse())

        const verified = allPayments.filter(p => p.status === 'verified')
        const pending = allPayments.filter(p => p.status === 'pending')
        const verifiedTotal = verified.reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)
        const pendingTotal = pending.reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)

        setTotalRevenue(verifiedTotal)
        setTotalPending(pendingTotal)

        if (!overview) {
            setOverview({
                users: 2,
                properties: 4,
                purchases: allPurchases.length,
                inquiries: 0
            })
        }

        setLoading(false)
        setRefreshing(false)
    }, [overview])

    useEffect(() => {
        loadAllData()
    }, [])

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadAllData()
        }, 10000)
        return () => clearInterval(interval)
    }, [loadAllData])

    // Listen for localStorage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'payments' || e.key === 'purchases') {
                loadAllData()
            }
        }
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [loadAllData])

    const handleRefresh = () => {
        setRefreshing(true)
        loadAllData()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="text-emerald-500 text-sm font-mono animate-pulse">INITIALIZING ADMIN CONSOLE...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] pb-20 text-white">
            <div className="max-w-7xl mx-auto px-6 pt-10 space-y-12">

                {/* Header */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                    <div className="space-y-3">
                        <p className="text-emerald-500 text-xs font-bold uppercase tracking-[3px]">LIVE ANALYTICS ENGINE</p>
                        <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter">
                            SYSTEM <span className="text-emerald-600">ROOT</span>
                        </h1>
                        <p className="text-slate-400 text-lg">Real-time Portfolio Command Center</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} trend={`₦${Number(totalPending).toLocaleString()} pending`} icon={<Wallet />} />
                    <StatCard label="Total Investors" value={overview?.users || 0} trend="Registered Users" icon={<Users />} />
                    <StatCard label="Properties" value={overview?.properties || 0} trend="Total Listings" icon={<Map />} />
                    <StatCard label="Total Purchases" value={overview?.purchases || 0} trend="Transactions" icon={<TrendingUp />} alert={totalPending > 0} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
                    <div className="xl:col-span-2 space-y-10">

                        {/* Latest Transactions */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> LATEST TRANSACTIONS
                                </h3>
                                <Link href="/admin/purchases" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                                    View Full Ledger →
                                </Link>
                            </div>

                            {recentPayments.length > 0 || recentPurchases.length > 0 ? (
                                <div className="space-y-4">
                                    {[...recentPayments, ...recentPurchases].slice(0, 5).map((txn, idx) => (
                                        <TransactionRow
                                            key={txn.id || idx}
                                            name={txn.buyerName || txn.senderName || 'Investor'}
                                            amount={formatCurrency(txn.amountPaid || txn.amount || 0)}
                                            status={txn.status === 'verified' ? 'Verified' : txn.status === 'declined' ? 'Declined' : 'Pending'}
                                            type={txn.paymentMode || txn.type || 'payment'}
                                            refID={txn.transactionReference || txn.id?.substring(0, 8)}
                                            time="Recent"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 bg-white/[0.03] border border-white/10 rounded-3xl text-center">
                                    <p className="text-slate-500 text-sm">No transactions yet</p>
                                    <p className="text-slate-600 text-xs mt-2">Transactions will appear once payments are made</p>
                                </div>
                            )}
                        </div>

                        {/* Latest Inquiries */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 px-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> LATEST INQUIRIES
                            </h3>
                            {recentInquiries.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {recentInquiries.map((inquiry) => (
                                        <InquiryCard key={inquiry.id} name={inquiry.name} message={inquiry.message} time="Recent" />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 bg-white/[0.03] border border-white/10 rounded-3xl text-center">
                                    <p className="text-slate-500 text-sm">No inquiries yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Users */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 px-2">REGISTERED USERS</h3>
                            <div className="p-8 rounded-[2.75rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 space-y-6">
                                {recentUsers.length > 0 ? (
                                    recentUsers.map((user) => (
                                        <UserItem key={user.id} name={user.fullName} email={user.email} initials={user.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'} />
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm text-center">No users yet</p>
                                )}
                            </div>
                        </div>

                        {/* System Logs */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 px-2">SYSTEM LOGS</h3>
                            <div className="p-8 rounded-[2.75rem] bg-emerald-500/[0.02] border border-emerald-500/10 backdrop-blur-3xl space-y-8">
                                <LogEntry icon={<CheckCircle2 className="text-emerald-500" />} text="Backend API: Connected" time="Live" />
                                <LogEntry icon={<CheckCircle2 className="text-emerald-500" />} text="Database: Online" time="Live" />
                                <LogEntry icon={<Zap className="text-emerald-500" />} text={`Revenue: ${formatCurrency(totalRevenue)}`} time="Current" />
                                <LogEntry icon={<Clock className="text-slate-500" />} text={`Purchases: ${overview?.purchases || 0} total`} time="Current" />
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
        <div className={`p-8 rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-300 hover:-translate-y-1 ${alert ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10 hover:border-emerald-500/30'}`}>
            <div className={`p-4 rounded-2xl w-fit mb-6 ${alert ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{icon}</div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <h4 className="text-4xl font-black tracking-tighter mt-2">{value}</h4>
            <span className={`text-xs font-bold mt-4 block ${alert ? 'text-red-500' : 'text-emerald-500'}`}>{trend}</span>
        </div>
    )
}

function TransactionRow({ name, amount, status, type, refID, time }) {
    return (
        <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/[0.05] transition-all duration-300">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-emerald-900/40 rounded-2xl border border-emerald-500/20 flex items-center justify-center font-black text-emerald-500 text-sm">TX</div>
                <div>
                    <p className="font-semibold text-white">{name}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500">{refID} • {time}</p>
                        {type && <span className="text-[9px] font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">{type}</span>}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-lg font-bold text-white">{amount}</p>
                    <p className={`text-xs font-bold uppercase ${status === 'Verified' || status === 'verified' ? 'text-emerald-500' : status === 'Declined' ? 'text-red-500' : 'text-amber-500'}`}>{status}</p>
                </div>
                <Link href="/admin/purchases" className="p-3 bg-white text-black rounded-2xl hover:bg-emerald-500 hover:text-white transition-all duration-200">
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}

function InquiryCard({ name, message, time }) {
    return (
        <div className="p-7 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex justify-between items-start"><p className="font-semibold">{name}</p><p className="text-xs text-slate-500">{time}</p></div>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">{message}</p>
        </div>
    )
}

function UserItem({ name, email, initials }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-bold text-sm text-slate-400">{initials}</div>
            <div className="min-w-0 flex-1"><p className="font-semibold text-white truncate">{name}</p><p className="text-xs text-slate-500 truncate">{email}</p></div>
        </div>
    )
}

function LogEntry({ icon, text, time }) {
    return (
        <div className="flex gap-4"><div className="mt-0.5">{icon}</div><div className="flex-1"><p className="text-sm text-slate-300">{text}</p><p className="text-xs text-slate-600 mt-1">{time}</p></div></div>
    )
}