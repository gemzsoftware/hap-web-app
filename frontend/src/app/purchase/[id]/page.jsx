'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Landmark, ArrowLeft, ShieldCheck, CheckCircle2, Loader2, CreditCard, Wallet } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { addNotification } from '@/lib/notifications'
import { formatCurrency } from '@/lib/utils'

export default function PurchasePage() {
    const { id } = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const continuePurchaseId = searchParams.get('continue')

    const [user, setUser] = useState(null)
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token || !userData) {
            router.push('/login?redirect=' + encodeURIComponent(`/purchase/${id}`))
            return
        }

        try {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
        } catch (e) {
            router.push('/login')
            return
        }

        setAuthChecked(true)
    }, [id, router])

    const [land, setLand] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Payment mode from dossier
    const [paymentMode, setPaymentMode] = useState(null)
    const [dossierData, setDossierData] = useState(null)

    const [senderName, setSenderName] = useState('')
    const [bankName, setBankName] = useState('')
    const [referenceNum, setReferenceNum] = useState('')
    const [amountPaid, setAmountPaid] = useState('')

    useEffect(() => {
        if (user?.fullName) setSenderName(user.fullName)
    }, [user])

    useEffect(() => {
        const fetchLand = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL
                const res = await fetch(`${apiUrl}/properties/${id}`)
                if (!res.ok) throw new Error('Asset missing')
                const json = await res.json()
                setLand(json.property || json.data || json)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (id && authChecked) fetchLand()
    }, [id, authChecked])

    // Read dossier from localStorage
    useEffect(() => {
        const dossier = localStorage.getItem(`dossier_${id}`)
        if (dossier) {
            try {
                const parsed = JSON.parse(dossier)
                setDossierData(parsed)
                if (parsed.paymentType) {
                    setPaymentMode(parsed.paymentType)
                    // Pre-fill amount based on payment type
                    if (parsed.paymentType === 'full') {
                        setAmountPaid(parsed.totalPrice?.toString() || '')
                    } else if (parsed.paymentType === 'installment') {
                        setAmountPaid(parsed.monthlyPayment?.toString() || parsed.initialDeposit?.toString() || '')
                    }
                }
            } catch (e) {
                console.log('No dossier found')
            }
        }
    }, [id])

    const totalPrice = land?.price || 0
    const landDeposit = land?.installmentPlan?.initialDeposit || 0

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const paidAmount = Number(amountPaid)

        const paymentData = {
            id: `PAY-${Date.now()}`,
            purchaseId: continuePurchaseId || `PUR-${Date.now()}`,
            propertyId: id,
            propertyTitle: land?.title || 'Property',
            totalPrice: paymentMode === 'full' ? totalPrice : totalPrice,
            amountPaid: paidAmount,
            amount: paidAmount,
            remainingBalance: paymentMode === 'full' ? 0 : totalPrice - paidAmount,
            paymentMode: paymentMode,
            senderName: senderName.trim() || user?.fullName || 'Unknown',
            buyerEmail: user?.email || '',
            buyerName: user?.fullName || '',
            bankName: bankName.trim(),
            transactionReference: referenceNum.trim(),
            paymentMethod: 'Bank Transfer',
            status: 'pending',
            type: paymentMode === 'full' ? 'full_payment' : 'installment',
            submittedAt: new Date().toISOString(),
            // Include dossier data
            dossierMonths: dossierData?.totalMonths || null,
            dossierMonthlyPayment: dossierData?.monthlyPayment || null
        }

        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        allPayments.push(paymentData)
        localStorage.setItem('payments', JSON.stringify(allPayments))

        if (!continuePurchaseId) {
            const purchaseData = {
                id: paymentData.purchaseId,
                propertyId: id,
                propertyTitle: land?.title || 'Property',
                totalPrice: totalPrice,
                amountPaid: paidAmount,
                remainingBalance: paymentMode === 'full' ? 0 : totalPrice - paidAmount,
                paymentMode: paymentMode,
                buyerEmail: user?.email || '',
                buyerName: user?.fullName || '',
                senderName: senderName.trim(),
                bankName: bankName.trim(),
                transactionReference: referenceNum.trim(),
                status: 'pending',
                submittedAt: new Date().toISOString()
            }
            const storedPurchases = localStorage.getItem('purchases')
            const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []
            allPurchases.push(purchaseData)
            localStorage.setItem('purchases', JSON.stringify(allPurchases))
        } else {
            const storedPurchases = localStorage.getItem('purchases')
            const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []
            const updated = allPurchases.map(p => {
                if (p.id === continuePurchaseId) {
                    const newPaid = (Number(p.amountPaid) || 0) + paidAmount
                    return {
                        ...p,
                        amountPaid: newPaid,
                        remainingBalance: (Number(p.totalPrice) || 0) - newPaid
                    }
                }
                return p
            })
            localStorage.setItem('purchases', JSON.stringify(updated))
        }

        addNotification(user?.email, {
            title: 'Payment Submitted ⏳',
            message: `Your ${paymentMode === 'full' ? 'full payment' : 'installment payment'} of ${formatCurrency(paidAmount)} for ${land?.title} has been submitted and is pending admin verification.`,
            type: 'payment_pending',
            propertyTitle: land?.title,
            amount: paidAmount
        })

        // Clear dossier
        localStorage.removeItem(`dossier_${id}`)

        setIsSubmitting(false)
        setIsSuccess(true)
        setTimeout(() => router.push('/dashboard'), 3000)
    }

    if (!authChecked || loading) {
        return (
            <div className="bg-[#F1F3F6] min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="bg-[#F1F3F6] min-h-screen">
            <Navbar />
            <main className="container-custom pt-32 pb-24 max-w-4xl">

                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold text-xs uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    Purchasing as: {user?.fullName} ({user?.email})
                </div>

                {continuePurchaseId && (
                    <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 flex items-center gap-2 text-xs font-bold text-purple-700">
                        <CreditCard className="w-4 h-4" />
                        Continuing payment for {continuePurchaseId?.substring(0, 12)}...
                    </div>
                )}

                {isSuccess ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3rem] p-16 text-center space-y-6 shadow-xl border border-slate-100">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8" /></div>
                        <h2 className="text-3xl font-serif text-slate-900">Payment Proof Submitted</h2>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">Your {paymentMode === 'full' ? 'full payment' : 'installment payment'} is pending verification. Check your dashboard for updates.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                        {/* BANK DETAILS */}
                        <div className="md:col-span-5 bg-slate-950 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl">
                            <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest"><Landmark className="w-4 h-4" /> Settlement Desk</div>
                            <h3 className="text-2xl font-serif tracking-tight leading-tight">Corporate <br />Allocation Node.</h3>

                            <div className="space-y-4 pt-4 border-t border-white/5 text-xs">
                                <div>
                                    <p className="text-slate-500 font-bold uppercase text-[9px]">Payment Mode</p>
                                    <p className="text-lg font-black text-emerald-400 mt-0.5 uppercase flex items-center gap-2">
                                        {paymentMode === 'full' ? <Wallet className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                        {paymentMode === 'full' ? 'Full Payment' : 'Installment'}
                                    </p>
                                </div>

                                {paymentMode === 'full' ? (
                                    <div>
                                        <p className="text-slate-500 font-bold uppercase text-[9px]">Amount to Pay</p>
                                        <p className="text-lg font-black text-white mt-0.5">{formatCurrency(totalPrice)}</p>
                                    </div>
                                ) : (
                                    <>
                                        {dossierData && (
                                            <>
                                                <div>
                                                    <p className="text-slate-500 font-bold uppercase text-[9px]">Initial Deposit</p>
                                                    <p className="text-lg font-black text-white mt-0.5">{formatCurrency(landDeposit)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 font-bold uppercase text-[9px]">Monthly Payment</p>
                                                    <p className="text-lg font-black text-white mt-0.5">{formatCurrency(dossierData.monthlyPayment)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 font-bold uppercase text-[9px]">Duration</p>
                                                    <p className="text-lg font-black text-white mt-0.5">{dossierData.totalMonths} months</p>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}

                                <div><p className="text-slate-500 font-bold uppercase text-[9px]">Bank</p><p className="text-sm font-bold mt-0.5">Heaven Ark Trust Bank</p></div>
                                <div><p className="text-slate-500 font-bold uppercase text-[9px]">Account</p><p className="text-lg font-mono font-black text-emerald-400 mt-0.5">1024-5582-99</p></div>
                            </div>
                        </div>

                        {/* PAYMENT FORM */}
                        <form onSubmit={handleFormSubmit} className="md:col-span-7 bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl space-y-6">
                            <div>
                                <h2 className="text-2xl font-serif text-slate-900">
                                    {paymentMode === 'full' ? 'Full Payment' : 'Installment Payment'}
                                </h2>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Manual Verification Desk</p>
                            </div>
                            <div className="space-y-4">
                                <input type="text" placeholder="Sender Name" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500" value={senderName} onChange={e => setSenderName(e.target.value)} />
                                <input type="text" placeholder="Bank Name" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500" value={bankName} onChange={e => setBankName(e.target.value)} />
                                <input type="text" placeholder="Transaction Reference" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-mono text-slate-900 outline-none focus:border-emerald-500" value={referenceNum} onChange={e => setReferenceNum(e.target.value)} />
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                                        Amount You Are Paying Now
                                    </label>
                                    <input type="number" placeholder="Enter Amount (₦)" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black text-emerald-600 outline-none focus:border-emerald-500" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all flex items-center justify-center gap-2">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transmit Proof of Payment'}
                            </button>
                        </form>

                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}