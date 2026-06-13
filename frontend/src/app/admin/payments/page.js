'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, ShieldAlert, CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'
import { addNotification } from '@/lib/notifications'
import { downloadReceipt } from '@/lib/receiptGenerator'
import { formatCurrency } from '@/lib/utils'

export default function AdminPaymentsPage() {
    const [pendingPayments, setPendingPayments] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [approvingId, setApprovingId] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    const fetchPendingPayments = async () => {
        const stored = localStorage.getItem('payments')
        const allPayments = stored ? JSON.parse(stored) : []
        const pending = allPayments.filter(p => p.status === 'pending')
        setPendingPayments(pending)
        setLoadingData(false)

        const token = localStorage.getItem('token')
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL
            const res = await fetch(`${apiUrl}/payments/admin/pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                if (Array.isArray(data) && data.length > 0) {
                    setPendingPayments(data)
                }
            }
        } catch (err) {
            console.log('Using local payments data')
        }
    }

    const handleApprovePayment = async (paymentId) => {
        setApprovingId(paymentId)

        const stored = localStorage.getItem('payments')
        const allPayments = stored ? JSON.parse(stored) : []
        let approvedPayment = null

        const updated = allPayments.map(p => {
            if (p.id === paymentId) {
                approvedPayment = {
                    ...p,
                    status: 'verified',
                    verifiedAt: new Date().toISOString(),
                    receiptNumber: `HAP-RCPT-${Date.now()}`
                }
                return approvedPayment
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(updated))

        if (approvedPayment && approvedPayment.buyerEmail) {
            addNotification(approvedPayment.buyerEmail, {
                title: 'Payment Verified ✅',
                message: `Your payment of ${formatCurrency(approvedPayment.amountPaid || approvedPayment.amount)} for ${approvedPayment.propertyTitle} has been verified and receipt generated.`,
                type: 'payment_verified',
                propertyTitle: approvedPayment.propertyTitle,
                amount: approvedPayment.amountPaid || approvedPayment.amount,
                receiptNumber: approvedPayment.receiptNumber
            })
        }

        setPendingPayments(prev => prev.filter(p => p.id !== paymentId))
        setSuccessMessage('Payment Authorized • Receipt Generated • User Notified')

        if (approvedPayment) {
            setTimeout(() => downloadReceipt(approvedPayment), 500)
        }

        setTimeout(() => setSuccessMessage(''), 2800)
        setApprovingId(null)
    }

    const handleDeclinePayment = async (paymentId) => {
        setApprovingId(paymentId)

        const stored = localStorage.getItem('payments')
        const allPayments = stored ? JSON.parse(stored) : []
        let declinedPayment = null

        const updated = allPayments.map(p => {
            if (p.id === paymentId) {
                declinedPayment = {
                    ...p,
                    status: 'declined',
                    declinedAt: new Date().toISOString(),
                    declineReason: 'Payment verification failed'
                }
                return declinedPayment
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(updated))

        if (declinedPayment && declinedPayment.buyerEmail) {
            addNotification(declinedPayment.buyerEmail, {
                title: 'Payment Declined ❌',
                message: `Your payment of ${formatCurrency(declinedPayment.amountPaid || declinedPayment.amount)} for ${declinedPayment.propertyTitle} was declined. Please contact support.`,
                type: 'payment_declined',
                propertyTitle: declinedPayment.propertyTitle,
                amount: declinedPayment.amountPaid || declinedPayment.amount
            })
        }

        setPendingPayments(prev => prev.filter(p => p.id !== paymentId))
        setSuccessMessage('Payment Declined • User Notified')
        setTimeout(() => setSuccessMessage(''), 2800)
        setApprovingId(null)
    }

    useEffect(() => {
        fetchPendingPayments()
    }, [])

    // Auto-refresh
    useEffect(() => {
        const interval = setInterval(fetchPendingPayments, 10000)
        return () => clearInterval(interval)
    }, [])

    if (loadingData) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-6" />
                    <p className="text-xs font-black tracking-[0.2em] uppercase text-slate-500">SYNCHRONIZING SETTLEMENT LEDGER</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 pt-28">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldAlert className="w-5 h-5 text-amber-500" />
                            <span className="text-amber-500 text-xs font-black tracking-[0.4em] uppercase">Settlement Authority</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter">Incoming Wires</h1>
                        <p className="text-slate-400 mt-2 text-lg">Manual Verification & Asset Release Desk</p>
                    </div>
                    <div className="mt-6 md:mt-0 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-sm font-medium flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        <span>{pendingPayments.length} Pending Confirmation</span>
                    </div>
                </div>

                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`fixed top-8 right-8 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 ${
                                successMessage.includes('Declined') ? 'bg-red-600' : 'bg-emerald-600'
                            } text-white`}
                        >
                            {successMessage.includes('Declined') ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                            {successMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {pendingPayments.length === 0 ? (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl py-32 text-center">
                        <Clock className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                        <h3 className="text-3xl font-light text-slate-400">Audit Desk Clear</h3>
                        <p className="text-slate-500 mt-3 max-w-xs mx-auto">No pending wire transfers require verification at this time.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingPayments.map((txn) => {
                            const transactionId = txn.id || txn._id
                            return (
                                <motion.div
                                    key={transactionId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 backdrop-blur-xl rounded-3xl p-8 flex flex-col lg:flex-row lg:items-center gap-8 transition-all duration-500"
                                >
                                    <div className="flex items-start gap-6 flex-1">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center">
                                            <Landmark className="w-7 h-7 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Depositor</p>
                                            <h3 className="text-2xl font-semibold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                                                {txn.senderName || txn.buyerName || 'Anonymous Client'}
                                            </h3>
                                            {txn.buyerEmail && <p className="text-slate-400 text-xs mt-0.5">{txn.buyerEmail}</p>}
                                            <p className="text-slate-400 mt-1">{txn.bankName || 'External Bank'}</p>
                                        </div>
                                    </div>

                                    <div className="lg:min-w-[220px]">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Transaction Reference</p>
                                        <p className="font-mono text-emerald-400 bg-slate-950 border border-white/10 px-5 py-3.5 rounded-2xl text-sm tracking-widest">
                                            {txn.transactionReference || 'NO-REFERENCE'}
                                        </p>
                                    </div>

                                    <div className="lg:min-w-[160px]">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Amount Received</p>
                                        <p className="text-4xl font-bold tracking-tighter text-white mt-1">
                                            {formatCurrency(txn.amountPaid || txn.amount || 0)}
                                        </p>
                                    </div>

                                    <div className="text-xs text-slate-500 lg:min-w-[120px]">
                                        Property<br />
                                        <span className="text-white text-sm">{txn.propertyTitle || 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={approvingId === transactionId}
                                            onClick={() => handleApprovePayment(transactionId)}
                                            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            {approvingId === transactionId ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                            Verify
                                        </button>
                                        <button
                                            disabled={approvingId === transactionId}
                                            onClick={() => handleDeclinePayment(transactionId)}
                                            className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            <XCircle className="w-3 h-3" />
                                            Decline
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}