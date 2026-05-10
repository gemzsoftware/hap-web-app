'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Target, ArrowUpRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

const API_BASE_URL = 'http://localhost:5000/api'

export default function PortfolioTab() {
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`${API_BASE_URL}/purchases/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const json = await res.json()
                // Your backend returns an array in 'data'
                if (json.data) setPurchases(json.data)
            } catch (err) {
                console.error("Error fetching holdings:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPurchases()
    }, [])

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
            <p className="text-xs uppercase tracking-[0.2em]">Synchronizing Assets...</p>
        </div>
    )

    if (purchases.length === 0) return (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] py-20 text-center">
            <p className="text-slate-500 font-medium">No land holdings found in your portfolio.</p>
            <Link href="/properties">
                <button className="mt-4 text-emerald-500 text-xs font-black uppercase tracking-widest hover:underline cursor-pointer">
                    Browse Properties
                </button>
            </Link>
        </div>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {purchases.map((item) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all duration-500"
                >
                    <div className="p-8">
                        {/* Property Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight mb-2">{item.propertyId.title}</h3>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Nigeria</span>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                    {item.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {/* Equity Meter (Progress Bar) */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Ownership Progress</p>
                                <p className="text-xl font-medium">{item.paymentProgress.percentPaid}%</p>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.paymentProgress.percentPaid}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-400"
                                />
                            </div>
                        </div>

                        {/* Financial Details */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                            <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Amount Paid</p>
                                <p className="font-medium text-lg">₦{item.amountPaid.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Balance</p>
                                <p className="font-medium text-lg text-slate-400">₦{item.paymentProgress.outstandingBalance.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="bg-white/5 p-6 flex items-center justify-between group-hover:bg-emerald-500/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <Target className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Project Status: Development</span>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/5 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl transition-all">
                            View Details <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}