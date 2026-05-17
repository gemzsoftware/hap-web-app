'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Loader2, CreditCard, Wallet, MapPin, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function PurchaseDetailPage() {
    const { id } = useParams()
    const router = useRouter()

    const [purchase, setPurchase] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPurchase = () => {
            const storedPurchases = localStorage.getItem('purchases')
            const storedPayments = localStorage.getItem('payments')

            const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []
            const allPayments = storedPayments ? JSON.parse(storedPayments) : []

            // Find purchase by ID
            const found = allPurchases.find(p => p.id === id)

            if (found) {
                const relatedPayments = allPayments.filter(
                    p => p.purchaseId === id || (p.propertyId === found.propertyId && p.buyerEmail === found.buyerEmail)
                )

                const totalPaidSoFar = relatedPayments
                    .filter(p => p.status === 'verified')
                    .reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)

                setPurchase({
                    ...found,
                    totalPaidSoFar: totalPaidSoFar || Number(found.amountPaid) || 0,
                    remainingBalance: (Number(found.totalPrice) || 0) - (totalPaidSoFar || Number(found.amountPaid) || 0),
                    paymentHistory: relatedPayments
                })
            }

            setLoading(false)
        }

        if (id) fetchPurchase()
    }, [id])

    const verifyPayment = (paymentId) => {
        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const updated = allPayments.map(p => {
            if (p.id === paymentId || p.purchaseId === paymentId || p.purchaseId === id) {
                return { ...p, status: 'verified', verifiedAt: new Date().toISOString(), receiptNumber: `HAP-RCPT-${Date.now()}` }
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(updated))
        window.location.reload()
    }

    const declinePayment = (paymentId) => {
        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const updated = allPayments.map(p => {
            if (p.id === paymentId || p.purchaseId === paymentId || p.purchaseId === id) {
                return { ...p, status: 'declined', declinedAt: new Date().toISOString() }
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(updated))
        window.location.reload()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    if (!purchase) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-center px-6">
                <p className="text-2xl font-light text-slate-400 mb-6">Purchase Not Found</p>
                <button onClick={() => router.push('/admin/purchases')} className="text-emerald-400 hover:text-emerald-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Purchases
                </button>
            </div>
        )
    }

    const percentPaid = purchase.totalPrice > 0
        ? Math.round((purchase.totalPaidSoFar / purchase.totalPrice) * 100)
        : 0
    const isCompleted = Number(purchase.remainingBalance) <= 0

    return (
        <div className="min-h-screen bg-[#020617] text-white pb-20">
            <div className="max-w-5xl mx-auto px-6 pt-10">

                <button onClick={() => router.push('/admin/purchases')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 font-bold text-xs uppercase tracking-widest transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Purchase Folio
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2">Contract Detail</p>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{purchase.id?.substring(0, 12)}</h1>
                        <p className="text-slate-500 text-sm mt-2">{purchase.submittedAt ? new Date(purchase.submittedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                        isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            purchase.status === 'declined' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                purchase.status === 'verified' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                        {isCompleted ? 'Completed' : purchase.status === 'declined' ? 'Declined' : purchase.status === 'verified' ? 'Active' : 'Pending'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Investor Details</h3>
                            <div className="flex items-center gap-5 mb-6">
                                <div className="w-16 h-16 bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-500 font-black text-2xl border border-emerald-500/10">
                                    {(purchase.buyerName || 'U')[0]}
                                </div>
                                <div>
                                    <p className="text-xl font-black">{purchase.buyerName || 'Unknown'}</p>
                                    <p className="text-sm text-slate-400">{purchase.buyerEmail}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-slate-900/50 rounded-xl p-4">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Bank</p>
                                    <p className="font-bold">{purchase.bankName || 'N/A'}</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-xl p-4">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Reference</p>
                                    <p className="font-mono text-emerald-400 text-sm">{purchase.transactionReference || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Property Details</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-emerald-500" />
                                <p className="text-xl font-bold">{purchase.propertyTitle || 'Property'}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Price</p>
                                    <p className="font-bold text-white">{formatCurrency(purchase.totalPrice)}</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Paid So Far</p>
                                    <p className="font-bold text-emerald-400">{formatCurrency(purchase.totalPaidSoFar)}</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Remaining</p>
                                    <p className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {isCompleted ? '✓ Complete' : formatCurrency(purchase.remainingBalance)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Payment Mode</h3>
                            <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${
                                purchase.paymentMode === 'full'
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                                {purchase.paymentMode === 'full' ? <Wallet className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                {purchase.paymentMode === 'full' ? 'Full Payment' : 'Installment'}
                            </span>
                        </div>

                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Payment Progress</h3>
                            <p className="text-3xl font-black text-white mb-3">{percentPaid}%</p>
                            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : percentPaid > 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                     style={{ width: `${percentPaid}%` }} />
                            </div>
                        </div>

                        {purchase.status === 'pending' && (
                            <div className="space-y-3">
                                <button onClick={() => verifyPayment(purchase.id)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
                                    <CheckCircle2 className="w-4 h-4" /> Verify Payment
                                </button>
                                <button onClick={() => declinePayment(purchase.id)}
                                        className="w-full bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
                                    <XCircle className="w-4 h-4" /> Decline Payment
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {purchase.paymentHistory && purchase.paymentHistory.length > 0 && (
                    <div className="mt-10 bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Payment History</h3>
                        <div className="space-y-3">
                            {purchase.paymentHistory.map((pay, idx) => (
                                <div key={pay.id || idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <span className={`w-3 h-3 rounded-full ${pay.status === 'verified' ? 'bg-emerald-500' : pay.status === 'declined' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                        <div>
                                            <p className="font-semibold text-white">{formatCurrency(pay.amountPaid || pay.amount)}</p>
                                            <p className="text-xs text-slate-500 font-mono">{pay.transactionReference}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-bold uppercase ${pay.status === 'verified' ? 'text-emerald-400' : pay.status === 'declined' ? 'text-red-400' : 'text-amber-400'}`}>{pay.status}</span>
                                        <span className="text-xs text-slate-600">{pay.submittedAt ? new Date(pay.submittedAt).toLocaleDateString() : ''}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}