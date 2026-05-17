'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
    RefreshCw,
    ArrowUpRight,
    Clock3,
    CheckCircle2,
    Landmark,
    Wallet,
    CalendarRange
} from 'lucide-react'

import { formatCurrency } from '@/lib/utils'
import { dashboardAPI, purchasesAPI } from '@/lib/api/client'

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.08
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 120,
            damping: 18
        }
    }
}

export default function DashboardOverviewPage() {
    const [summary, setSummary] = useState(null)
    const [purchases, setPurchases] = useState([])
    const [myPayments, setMyPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const loadAllData = useCallback(async (currentUser) => {
        setRefreshing(true)

        try {
            const [summaryData, purchasesData] = await Promise.all([
                dashboardAPI.getSummary().catch(() => ({})),
                purchasesAPI.getMyPurchases().catch(() => ({})),
            ])

            setSummary(summaryData.summary)
            setPurchases(purchasesData.data || [])
        } catch (error) {
            console.log('Fallback local portfolio sync activated')
        }

        const storedPurchases = localStorage.getItem('purchases')
        const storedPayments = localStorage.getItem('payments')

        if (currentUser?.email) {
            const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []
            const allPayments = storedPayments ? JSON.parse(storedPayments) : []

            const userPurchases = allPurchases.filter(
                p => p.buyerEmail === currentUser.email
            )

            const userPayments = allPayments.filter(
                p => p.buyerEmail === currentUser.email
            )

            if (userPurchases.length > 0) setPurchases(userPurchases)
            if (userPayments.length > 0) setMyPayments(userPayments)

            const totalPaid = userPayments
                .filter(p => p.status === 'verified')
                .reduce(
                    (sum, p) =>
                        sum + (Number(p.amountPaid) || Number(p.amount) || 0),
                    0
                )

            const totalRemaining = userPurchases.reduce(
                (sum, p) => sum + (Number(p.remainingBalance) || 0),
                0
            )

            setSummary(prev => ({
                ...prev,
                totalPaid,
                outstandingBalance: totalRemaining,
                activePurchases: userPurchases.length,
                pendingPayments: userPayments.filter(
                    p => p.status === 'pending'
                ).length
            }))
        }

        setLoading(false)
        setRefreshing(false)
    }, [])

    useEffect(() => {
        const userData = localStorage.getItem('user')

        if (userData) {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
            loadAllData(parsedUser)
        }
    }, [loadAllData])

    useEffect(() => {
        const interval = setInterval(() => {
            const userData = localStorage.getItem('user')

            if (userData) {
                loadAllData(JSON.parse(userData))
            }
        }, 15000)

        return () => clearInterval(interval)
    }, [loadAllData])

    const handleRefresh = () => {
        const userData = localStorage.getItem('user')

        if (userData) {
            loadAllData(JSON.parse(userData))
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-9 h-9 border border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 tracking-wide">
                        Loading portfolio...
                    </p>
                </div>
            </div>
        )
    }

    const totalInvested = purchases.reduce(
        (sum, p) => sum + (Number(p.totalPrice) || 0),
        0
    )

    const totalPaidAmount = myPayments
        .filter(
            p =>
                p.status === 'verified' ||
                p.status === 'approved' ||
                p.status === 'success'
        )
        .reduce(
            (sum, p) =>
                sum + (Number(p.amountPaid) || Number(p.amount) || 0),
            0
        )

    const totalPendingAmount = myPayments
        .filter(p => p.status === 'pending')
        .reduce(
            (sum, p) =>
                sum + (Number(p.amountPaid) || Number(p.amount) || 0),
            0
        )

    const outstandingRemainderAmount = Math.max(
        0,
        totalInvested - totalPaidAmount
    )

    return (
        <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden selection:bg-emerald-500/20">

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%)] pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#020617]/20 border-b border-white/5">
                <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                    <div>
                        <p className="text-sm text-slate-400 mb-2 tracking-wide">
                            Portfolio Dashboard
                        </p>

                        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                            Good evening,{' '}
                            <span className="text-emerald-400">
                                {user?.fullName?.split(' ')[0] || 'Investor'}
                            </span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="
                                h-11 px-5 rounded-2xl
                                bg-white/[0.04]
                                hover:bg-white/[0.08]
                                border border-white/10
                                text-sm font-medium
                                transition-all duration-300
                                flex items-center gap-2
                                disabled:opacity-50
                            "
                        >
                            <RefreshCw
                                className={`w-4 h-4 text-emerald-400 ${
                                    refreshing ? 'animate-spin' : ''
                                }`}
                            />
                            Refresh
                        </button>

                        <div className="hidden sm:block text-right">
                            <p className="text-xs text-slate-500 mb-1">
                                Local Time
                            </p>

                            <p className="text-sm font-medium tabular-nums text-slate-200">
                                {new Date().toLocaleTimeString('en-NG', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}{' '}
                                WAT
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10 relative z-10">

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >

                    {/* Main */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Hero */}
                        <motion.div
                            variants={itemVariants}
                            className="
                                relative overflow-hidden
                                rounded-3xl
                                bg-white/[0.03]
                                border border-white/[0.06]
                                backdrop-blur-xl
                                p-8 md:p-10
                                shadow-[0_20px_80px_rgba(0,0,0,0.35)]
                            "
                        >

                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none rounded-3xl" />

                            <div className="relative z-10">

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">

                                    <div>
                                        <p className="text-sm text-slate-400 tracking-wide mb-3">
                                            Portfolio Value
                                        </p>

                                        <h2 className="text-5xl md:text-7xl font-semibold tracking-tight tabular-nums">
                                            {formatCurrency(totalInvested)}
                                        </h2>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 h-fit shadow-[0_8px_30px_rgba(16,185,129,0.12)]">
                                        <ArrowUpRight className="w-4 h-4" />

                                        <span className="text-sm font-medium">
                                            Portfolio Active
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-10 pt-6 border-t border-white/5">
                                    <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                                        Overview of active investments, completed payments,
                                        and outstanding balances across subscribed properties.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >

                            {/* Paid */}
                            <div className="
                                bg-white/[0.03]
                                border border-white/[0.06]
                                backdrop-blur-xl
                                rounded-3xl
                                p-7
                                hover:bg-white/[0.05]
                                hover:border-white/10
                                transition-all duration-300
                            ">
                                <div className="flex items-start gap-4">

                                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        <Wallet className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400 mb-2">
                                            Total Paid
                                        </p>

                                        <h3 className="text-2xl font-semibold tabular-nums">
                                            {formatCurrency(totalPaidAmount)}
                                        </h3>

                                        <p className="text-sm text-emerald-400 mt-2">
                                            Verified payments
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pending */}
                            <div className="
                                bg-white/[0.03]
                                border border-white/[0.06]
                                backdrop-blur-xl
                                rounded-3xl
                                p-7
                                hover:bg-white/[0.05]
                                hover:border-white/10
                                transition-all duration-300
                            ">
                                <div className="flex items-start gap-4">

                                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                        <Clock3 className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400 mb-2">
                                            Pending
                                        </p>

                                        <h3 className="text-2xl font-semibold tabular-nums">
                                            {formatCurrency(totalPendingAmount)}
                                        </h3>

                                        <p className="text-sm text-amber-400 mt-2">
                                            Awaiting confirmation
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Outstanding */}
                            <div className="
                                bg-white/[0.03]
                                border border-white/[0.06]
                                backdrop-blur-xl
                                rounded-3xl
                                p-7
                                hover:bg-white/[0.05]
                                hover:border-white/10
                                transition-all duration-300
                            ">
                                <div className="flex items-start gap-4">

                                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                                        <Landmark className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400 mb-2">
                                            Outstanding Balance
                                        </p>

                                        <h3 className="text-2xl font-semibold tabular-nums">
                                            {formatCurrency(outstandingRemainderAmount)}
                                        </h3>

                                        <p className="text-sm text-red-400 mt-2">
                                            Remaining balance
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Properties */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-5"
                        >

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Active Properties
                                    </h2>

                                    <p className="text-sm text-slate-400 mt-1">
                                        Track payment progress across investments
                                    </p>
                                </div>

                                <Link
                                    href="/properties"
                                    className="text-sm text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2"
                                >
                                    View Properties

                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <AnimatePresence mode="popLayout">

                                {purchases.length > 0 ? (
                                    purchases.map((purchase, idx) => {

                                        const paid = Number(
                                            purchase.amountPaid ||
                                            purchase.totalPaidSoFar ||
                                            0
                                        )

                                        const total = Number(
                                            purchase.totalPrice || 0
                                        )

                                        const progress =
                                            total > 0
                                                ? Math.round((paid / total) * 100)
                                                : 0

                                        return (
                                            <motion.div
                                                key={purchase.id || idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="
                                                    bg-white/[0.03]
                                                    border border-white/[0.06]
                                                    backdrop-blur-xl
                                                    rounded-3xl
                                                    p-7 md:p-8
                                                    hover:bg-white/[0.05]
                                                    hover:border-white/10
                                                    transition-all duration-300
                                                    shadow-[0_20px_80px_rgba(0,0,0,0.25)]
                                                "
                                            >

                                                <div className="flex flex-col xl:flex-row gap-8 xl:items-center justify-between">

                                                    <div className="flex-1">

                                                        <h3 className="text-xl font-semibold tracking-tight mb-4">
                                                            {purchase.propertyTitle}
                                                        </h3>

                                                        <div className="flex flex-wrap items-center gap-3">

                                                            <span className="
                                                                text-[10px]
                                                                font-medium
                                                                rounded-full
                                                                px-3 py-1
                                                                bg-blue-500/10
                                                                border border-blue-500/20
                                                                text-blue-300
                                                            ">
                                                                {purchase.paymentMode || 'Installment'}
                                                            </span>

                                                            <span className={`
                                                                text-[10px]
                                                                font-medium
                                                                rounded-full
                                                                px-3 py-1
                                                                border
                                                                ${
                                                                purchase.status === 'verified'
                                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                                            }
                                                            `}>
                                                                {purchase.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="w-full xl:max-w-sm">

                                                        <div className="flex items-center justify-between mb-3">

                                                            <p className="text-sm text-slate-400">
                                                                Payment Progress
                                                            </p>

                                                            <p className="text-sm font-medium text-emerald-400">
                                                                {progress}%
                                                            </p>
                                                        </div>

                                                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-1000"
                                                                style={{
                                                                    width: `${progress}%`
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="xl:w-64 shrink-0">

                                                        <h4 className="text-2xl font-semibold mb-1 tabular-nums">
                                                            {formatCurrency(paid)}
                                                        </h4>

                                                        {Number(
                                                            purchase.remainingBalance
                                                        ) > 0 ? (
                                                            <>
                                                                <p className="text-sm text-red-400 mb-5">
                                                                    {formatCurrency(
                                                                        purchase.remainingBalance
                                                                    )}{' '}
                                                                    remaining
                                                                </p>

                                                                <Link
                                                                    href={`/purchase/${purchase.propertyId}?continue=${purchase.id}`}
                                                                    className="
                                                                        inline-flex items-center justify-center
                                                                        h-12 px-6 rounded-2xl
                                                                        bg-emerald-500 hover:bg-emerald-400
                                                                        text-sm font-medium
                                                                        transition-all duration-300
                                                                        shadow-[0_10px_40px_rgba(16,185,129,0.15)]
                                                                    "
                                                                >
                                                                    Complete Payment
                                                                </Link>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-emerald-400 font-medium mt-3">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                Payment Complete
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                ) : (
                                    <div className="
                                        bg-white/[0.03]
                                        border border-dashed border-white/10
                                        backdrop-blur-xl
                                        rounded-3xl
                                        py-20 px-8 text-center
                                    ">
                                        <div className="text-5xl mb-5">
                                            🏡
                                        </div>

                                        <h3 className="text-2xl font-semibold mb-3">
                                            No active investments
                                        </h3>

                                        <p className="text-slate-400 mb-6">
                                            Explore available properties and begin building your portfolio.
                                        </p>

                                        <Link
                                            href="/properties"
                                            className="text-emerald-400 hover:text-emerald-300 transition"
                                        >
                                            Browse Properties →
                                        </Link>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4"
                    >

                        <div className="
                            sticky top-28
                            bg-white/[0.03]
                            border border-white/[0.06]
                            backdrop-blur-xl
                            rounded-3xl
                            p-7
                            shadow-[0_20px_80px_rgba(0,0,0,0.35)]
                        ">

                            <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">

                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <CalendarRange className="w-5 h-5 text-emerald-400" />
                                        Recent Transactions
                                    </h3>

                                    <p className="text-sm text-slate-400 mt-1">
                                        Latest payment activity
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard"
                                    className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                                >
                                    View All
                                </Link>
                            </div>

                            {myPayments.length > 0 ? (

                                <div className="space-y-4">

                                    {myPayments.slice(0, 5).map((payment, idx) => (

                                        <div
                                            key={idx}
                                            className="
                                                p-5 rounded-2xl
                                                bg-black/20
                                                border border-white/5
                                                hover:border-white/10
                                                transition-all duration-300
                                            "
                                        >

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="min-w-0">

                                                    <p className="font-medium text-white truncate">
                                                        {payment.propertyTitle || 'Property Payment'}
                                                    </p>

                                                    <p className="text-sm text-slate-400 mt-1">
                                                        {formatCurrency(
                                                            payment.amountPaid ||
                                                            payment.amount
                                                        )}
                                                    </p>
                                                </div>

                                                <div className={`
                                                    text-xs px-3 py-1 rounded-full border whitespace-nowrap
                                                    ${
                                                    payment.status === 'verified' ||
                                                    payment.status === 'approved' ||
                                                    payment.status === 'success'
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                                }
                                                `}>
                                                    {
                                                        payment.status === 'verified' ||
                                                        payment.status === 'approved' ||
                                                        payment.status === 'success'
                                                            ? 'Completed'
                                                            : 'Pending'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="text-slate-500">
                                        No recent transactions
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}