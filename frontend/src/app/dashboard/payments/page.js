'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import {
    RefreshCw,
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    XCircle,
    CreditCard,
    Wallet,
    Receipt,
} from 'lucide-react'

import { formatCurrency } from '@/lib/utils'

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
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

export default function PaymentsPage() {

    const [payments, setPayments] = useState([])
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [filter, setFilter] = useState('all')
    const [refreshing, setRefreshing] = useState(false)

    const loadData = () => {

        const userData = localStorage.getItem('user')

        if (!userData) return

        const parsedUser = JSON.parse(userData)

        setUser(parsedUser)

        const storedPayments = localStorage.getItem('payments')
        const storedPurchases = localStorage.getItem('purchases')

        const allPayments = storedPayments
            ? JSON.parse(storedPayments)
            : []

        const allPurchases = storedPurchases
            ? JSON.parse(storedPurchases)
            : []

        const userPayments = allPayments
            .filter(p => p.buyerEmail === parsedUser.email)
            .sort(
                (a, b) =>
                    new Date(b.submittedAt) -
                    new Date(a.submittedAt)
            )

        const userPurchases = allPurchases.filter(
            p => p.buyerEmail === parsedUser.email
        )

        setPayments(userPayments)
        setPurchases(userPurchases)

        setLoading(false)
        setRefreshing(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        const interval = setInterval(loadData, 10000)

        return () => clearInterval(interval)
    }, [])

    const filteredPayments = payments.filter(p => {

        if (filter === 'verified') {
            return p.status === 'verified'
        }

        if (filter === 'pending') {
            return p.status === 'pending'
        }

        if (filter === 'declined') {
            return p.status === 'declined'
        }

        return true
    })

    const totalPaid = payments
        .filter(p => p.status === 'verified')
        .reduce(
            (sum, p) =>
                sum + (Number(p.amountPaid) || Number(p.amount) || 0),
            0
        )

    const totalPending = payments
        .filter(p => p.status === 'pending')
        .reduce(
            (sum, p) =>
                sum + (Number(p.amountPaid) || Number(p.amount) || 0),
            0
        )

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060816] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-9 h-9 border border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />

                    <p className="text-sm text-slate-400 tracking-wide">
                        Loading payment records...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#060816] text-white relative overflow-hidden selection:bg-emerald-500/20">

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%)] pointer-events-none" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-10 py-10">

                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5 mb-10">

                    <div>

                        <p className="text-sm text-slate-400 tracking-wide mb-3">
                            Financial Overview
                        </p>

                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            Payment History
                        </h1>

                        <p className="text-slate-400 mt-3 max-w-2xl leading-relaxed">
                            Complete overview of verified transactions,
                            pending payments, and installment activity
                            across your investment portfolio.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setRefreshing(true)
                            loadData()
                        }}
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
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    {/* Verified */}
                    <div className="
                        bg-white/[0.03]
                        border border-white/[0.06]
                        backdrop-blur-xl
                        rounded-3xl
                        p-7
                        shadow-[0_20px_80px_rgba(0,0,0,0.25)]
                    ">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm text-slate-400 mb-3">
                                    Verified Payments
                                </p>

                                <h2 className="text-3xl font-semibold tracking-tight tabular-nums text-emerald-400">
                                    {formatCurrency(totalPaid)}
                                </h2>
                            </div>

                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <CheckCircle2 className="w-5 h-5" />
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
                        shadow-[0_20px_80px_rgba(0,0,0,0.25)]
                    ">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm text-slate-400 mb-3">
                                    Pending Payments
                                </p>

                                <h2 className="text-3xl font-semibold tracking-tight tabular-nums text-amber-400">
                                    {formatCurrency(totalPending)}
                                </h2>
                            </div>

                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                <Clock3 className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="
                        bg-white/[0.03]
                        border border-white/[0.06]
                        backdrop-blur-xl
                        rounded-3xl
                        p-7
                        shadow-[0_20px_80px_rgba(0,0,0,0.25)]
                    ">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm text-slate-400 mb-3">
                                    Total Transactions
                                </p>

                                <h2 className="text-3xl font-semibold tracking-tight tabular-nums">
                                    {payments.length}
                                </h2>
                            </div>

                            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <Receipt className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8">

                    {['all', 'verified', 'pending', 'declined'].map((f) => (

                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                                h-11 px-5 rounded-2xl
                                text-sm font-medium
                                capitalize transition-all duration-300
                                border
                                ${
                                filter === f
                                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_10px_40px_rgba(16,185,129,0.15)]'
                                    : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.06] hover:text-white'
                            }
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Payments */}
                {filteredPayments.length === 0 ? (

                    <div className="
                        bg-white/[0.03]
                        border border-dashed border-white/10
                        backdrop-blur-xl
                        rounded-3xl
                        py-24 px-8 text-center
                    ">

                        <Clock3 className="w-14 h-14 text-slate-600 mx-auto mb-5" />

                        <h3 className="text-2xl font-semibold mb-3">
                            No payments found
                        </h3>

                        <p className="text-slate-400 mb-6">
                            There are no transactions matching the selected filter.
                        </p>

                        <Link
                            href="/properties"
                            className="text-emerald-400 hover:text-emerald-300 transition"
                        >
                            Browse Properties →
                        </Link>
                    </div>

                ) : (

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-5"
                    >

                        {filteredPayments.map((payment) => {

                            const verified =
                                payment.status === 'verified'

                            const declined =
                                payment.status === 'declined'

                            return (

                                <motion.div
                                    key={payment.id}
                                    variants={itemVariants}
                                    className="
                                        bg-white/[0.03]
                                        border border-white/[0.06]
                                        backdrop-blur-xl
                                        rounded-3xl
                                        p-7
                                        hover:bg-white/[0.05]
                                        hover:border-white/10
                                        transition-all duration-300
                                        shadow-[0_20px_80px_rgba(0,0,0,0.25)]
                                    "
                                >

                                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">

                                        {/* Left */}
                                        <div className="flex items-start gap-5 flex-1">

                                            <div className={`
                                                w-14 h-14 rounded-2xl
                                                flex items-center justify-center
                                                border shrink-0
                                                ${
                                                verified
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                    : declined
                                                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                            }
                                            `}>

                                                {verified ? (
                                                    <CheckCircle2 className="w-6 h-6" />
                                                ) : declined ? (
                                                    <XCircle className="w-6 h-6" />
                                                ) : (
                                                    <Clock3 className="w-6 h-6" />
                                                )}
                                            </div>

                                            <div className="min-w-0">

                                                <h3 className="text-xl font-semibold tracking-tight">
                                                    {payment.propertyTitle}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-3 mt-4">

                                                    <span className={`
                                                        inline-flex items-center gap-2
                                                        text-xs font-medium
                                                        rounded-full px-3 py-1
                                                        border
                                                        ${
                                                        payment.paymentMode === 'full'
                                                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                                                            : 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                                                    }
                                                    `}>

                                                        {payment.paymentMode === 'full' ? (
                                                            <Wallet className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <CreditCard className="w-3.5 h-3.5" />
                                                        )}

                                                        {payment.paymentMode === 'full'
                                                            ? 'Full Payment'
                                                            : 'Installment'}
                                                    </span>

                                                    <span className="text-sm text-slate-500 font-mono">
                                                        {payment.transactionReference}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="xl:text-right">

                                            <h3 className="text-3xl font-semibold tracking-tight tabular-nums">
                                                {formatCurrency(
                                                    payment.amountPaid ||
                                                    payment.amount
                                                )}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-2">
                                                {payment.submittedAt
                                                    ? new Date(
                                                        payment.submittedAt
                                                    ).toLocaleDateString()
                                                    : ''
                                                }
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="flex flex-col xl:items-end gap-3">

                                            <span className={`
                                                inline-flex items-center
                                                h-10 px-4 rounded-full
                                                text-sm font-medium
                                                border
                                                ${
                                                verified
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                                    : declined
                                                        ? 'bg-red-500/10 border-red-500/20 text-red-300'
                                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                            }
                                            `}>
                                                {payment.status}
                                            </span>

                                            {verified && payment.receiptNumber && (
                                                <span className="text-sm font-mono text-emerald-400">
                                                    {payment.receiptNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Continue Payment */}
                                    {payment.paymentMode === 'installment' &&
                                        payment.status === 'verified' && (

                                            <div className="mt-6 pt-6 border-t border-white/5">

                                                <Link
                                                    href={`/purchase/${payment.propertyId}?continue=${payment.purchaseId}`}
                                                    className="
                                                    inline-flex items-center gap-2
                                                    text-sm text-emerald-400
                                                    hover:text-emerald-300
                                                    transition
                                                "
                                                >
                                                    Continue Payment

                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        )}
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}

                {/* Purchases */}
                {purchases.length > 0 && (

                    <div className="mt-14">

                        <div className="mb-6">

                            <h2 className="text-3xl font-semibold tracking-tight">
                                Active Purchases
                            </h2>

                            <p className="text-slate-400 mt-2">
                                Monitor progress across installment plans and completed investments.
                            </p>
                        </div>

                        <div className="space-y-5">

                            {purchases.map((purchase) => {

                                const percentPaid =
                                    purchase.totalPrice > 0
                                        ? Math.round(
                                            (
                                                (
                                                    purchase.amountPaid ||
                                                    purchase.totalPaidSoFar ||
                                                    0
                                                ) /
                                                purchase.totalPrice
                                            ) * 100
                                        )
                                        : 0

                                const isCompleted =
                                    Number(purchase.remainingBalance) <= 0

                                return (

                                    <div
                                        key={purchase.id}
                                        className="
                                            bg-white/[0.03]
                                            border border-white/[0.06]
                                            backdrop-blur-xl
                                            rounded-3xl
                                            p-7
                                            shadow-[0_20px_80px_rgba(0,0,0,0.25)]
                                        "
                                    >

                                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">

                                            <div className="flex-1">

                                                <h3 className="text-xl font-semibold tracking-tight mb-2">
                                                    {purchase.propertyTitle}
                                                </h3>

                                                <p className="text-slate-400">
                                                    {formatCurrency(
                                                        purchase.amountPaid ||
                                                        purchase.totalPaidSoFar ||
                                                        0
                                                    )}{' '}
                                                    paid of{' '}
                                                    {formatCurrency(
                                                        purchase.totalPrice
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex-1 max-w-md">

                                                <div className="flex items-center justify-between mb-3">

                                                    <p className="text-sm text-slate-400">
                                                        Payment Progress
                                                    </p>

                                                    <p className="text-sm font-medium text-emerald-400">
                                                        {percentPaid}%
                                                    </p>
                                                </div>

                                                <div className="h-2 rounded-full bg-white/5 overflow-hidden">

                                                    <div
                                                        className={`
                                                            h-full rounded-full transition-all duration-1000
                                                            ${
                                                            isCompleted
                                                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-300'
                                                                : 'bg-gradient-to-r from-blue-400 to-blue-300'
                                                        }
                                                        `}
                                                        style={{
                                                            width: `${percentPaid}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="xl:text-right">

                                                {isCompleted ? (

                                                    <div className="inline-flex items-center gap-2 text-emerald-400 font-medium">

                                                        <CheckCircle2 className="w-4 h-4" />

                                                        Completed
                                                    </div>

                                                ) : (

                                                    <Link
                                                        href={`/purchase/${purchase.propertyId}?continue=${purchase.id}`}
                                                        className="
                                                            inline-flex items-center justify-center
                                                            h-11 px-5 rounded-2xl
                                                            bg-emerald-500 hover:bg-emerald-400
                                                            text-sm font-medium
                                                            transition-all duration-300
                                                            shadow-[0_10px_40px_rgba(16,185,129,0.15)]
                                                        "
                                                    >
                                                        Continue Payment
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}