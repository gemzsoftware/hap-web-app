'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    MapPin, ArrowUpRight, Wallet, MessageSquare, Download, Layers, Loader2, CreditCard
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function MyLands() {
    const [purchases, setPurchases] = useState([])
    const [propertyImages, setPropertyImages] = useState({})
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            loadPurchases(parsed)
        }

        const interval = setInterval(() => {
            const userData = localStorage.getItem('user')
            if (userData) loadPurchases(JSON.parse(userData))
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    // Fetch images for purchased properties
    useEffect(() => {
        purchases.forEach(async (purchase) => {
            if (purchase.propertyId && !propertyImages[purchase.propertyId]) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL
                    const res = await fetch(`${apiUrl}/properties/${purchase.propertyId}`)
                    if (res.ok) {
                        const data = await res.json()
                        const property = data.property || data.data || data
                        if (property?.imageUrl || property?.image) {
                            setPropertyImages(prev => ({
                                ...prev,
                                [purchase.propertyId]: property.imageUrl || property.image
                            }))
                        }
                    }
                } catch (err) {
                    console.log('Could not fetch property image')
                }
            }
        })
    }, [purchases])

    const loadPurchases = (currentUser) => {
        const storedPurchases = localStorage.getItem('purchases')
        const storedPayments = localStorage.getItem('payments')

        const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []

        const userPurchases = allPurchases.filter(p => p.buyerEmail === currentUser?.email)

        const merged = userPurchases.map(purchase => {
            const relatedPayments = allPayments.filter(
                pay => pay.purchaseId === purchase.id && pay.buyerEmail === currentUser?.email
            )
            const verifiedTotal = relatedPayments
                .filter(pay => pay.status === 'verified')
                .reduce((sum, pay) => sum + (Number(pay.amountPaid) || Number(pay.amount) || 0), 0)

            return {
                ...purchase,
                totalPaidSoFar: verifiedTotal || Number(purchase.amountPaid) || 0,
                remainingBalance: (Number(purchase.totalPrice) || 0) - (verifiedTotal || Number(purchase.amountPaid) || 0),
                paymentCount: relatedPayments.length,
                lastPaymentStatus: relatedPayments[relatedPayments.length - 1]?.status || purchase.status
            }
        })

        setPurchases(merged)
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white">
                        Asset <span className="text-slate-800 text-5xl">Vault</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mt-2">
                        Inventory Management • {purchases.length} Properties
                    </p>
                </div>
                <Link href="/properties" className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-5 py-3 rounded-xl transition-all">
                    Browse More Properties →
                </Link>
            </header>

            {purchases.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                    <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">No properties in your vault yet</p>
                    <Link href="/properties" className="text-emerald-400 text-xs hover:underline mt-2 inline-block">
                        Browse available properties →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {purchases.map((purchase) => {
                        const progress = purchase.totalPrice > 0
                            ? Math.round((purchase.totalPaidSoFar / purchase.totalPrice) * 100)
                            : 0
                        const isCompleted = Number(purchase.remainingBalance) <= 0
                        const isDeclined = purchase.lastPaymentStatus === 'declined'

                        return (
                            <PropertyCard
                                key={purchase.id}
                                id={purchase.id}
                                propertyId={purchase.propertyId}
                                title={purchase.propertyTitle || 'Property'}
                                location={purchase.location || 'Lagos, Nigeria'}
                                status={
                                    isCompleted ? 'Completed' :
                                        isDeclined ? 'Declined' :
                                            purchase.lastPaymentStatus === 'pending' ? 'Pending' :
                                                purchase.lastPaymentStatus === 'verified' ? 'Active' : 'Pending'
                                }
                                totalPrice={purchase.totalPrice}
                                amountPaid={purchase.totalPaidSoFar}
                                progress={progress}
                                paymentMode={purchase.paymentMode}
                                image={propertyImages[purchase.propertyId] || null}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function PropertyCard({ title, location, status, totalPrice, amountPaid, progress, id, propertyId, paymentMode, image }) {
    const remaining = (Number(totalPrice) || 0) - (Number(amountPaid) || 0)
    const isCompleted = Number(remaining) <= 0
    const isDeclined = status === 'Declined'

    const statusColors = {
        'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Active': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'Declined': 'bg-red-500/10 text-red-400 border-red-500/20',
    }

    const getStatusIcon = () => {
        if (isCompleted) return '✅'
        if (isDeclined) return '❌'
        if (status === 'Pending') return '⏳'
        return '🔵'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-[3rem] p-8 group hover:border-emerald-500/30 transition-all backdrop-blur-xl"
        >
            <div className="flex flex-col md:flex-row gap-8">
                {/* Property Image */}
                <div className="w-full md:w-48 h-48 rounded-[2.5rem] overflow-hidden bg-slate-800 border border-white/5 flex-shrink-0">
                    {image ? (
                        <img
                            src={image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt={title}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center">
                            <span className="text-6xl opacity-40">🏡</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-4 text-left">
                    <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="text-2xl font-black italic text-white tracking-tighter">{title}</h3>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusColors[status] || 'bg-slate-500/10 text-slate-400'}`}>
                                {getStatusIcon()} {status}
                            </span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3 text-emerald-500" /> {location}
                        </p>
                        {paymentMode && (
                            <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                                paymentMode === 'full' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                            }`}>
                                <CreditCard className="w-2.5 h-2.5" />
                                {paymentMode === 'full' ? 'Full Payment' : 'Installment'}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Total Price</p>
                            <p className="text-sm font-bold text-white">{formatCurrency(totalPrice)}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Paid So Far</p>
                            <p className="text-sm font-bold text-emerald-400">{formatCurrency(amountPaid)}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Remaining</p>
                            <p className={`text-sm font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {isCompleted ? '✓ Complete' : formatCurrency(remaining)}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Progress</p>
                            <p className="text-sm font-bold text-white">{progress}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 space-y-2">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] ${
                            isCompleted ? 'bg-emerald-500' : isDeclined ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/5">
                {!isCompleted && !isDeclined && (
                    <ActionButton icon={<Wallet className="w-3 h-3"/>} label="Continue" href={`/purchase/${propertyId}?continue=${id}`} primary />
                )}
                {isCompleted && (
                    <ActionButton icon={<Download className="w-3 h-3"/>} label="Documents" href="/dashboard/documents" primary />
                )}
                {isDeclined && (
                    <ActionButton icon={<ArrowUpRight className="w-3 h-3"/>} label="Try Again" href={`/purchase/${propertyId}`} primary />
                )}
                <ActionButton icon={<Download className="w-3 h-3"/>} label="Docs" href="/dashboard/documents" />
                <ActionButton icon={<MessageSquare className="w-3 h-3"/>} label="Support" href="/dashboard/support" />
            </div>
        </motion.div>
    )
}

function ActionButton({ icon, label, href, primary }) {
    return (
        <Link href={href} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
            primary ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
        }`}>
            {icon} {label}
        </Link>
    )
}