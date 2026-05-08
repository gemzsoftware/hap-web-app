'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    CreditCard,
    Download,
    ExternalLink,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react'

const API_BASE_URL = 'http://localhost:5000/api'

export default function PaymentsTab() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`${API_BASE_URL}/admin/payments`, { // Using the payments endpoint
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const json = await res.json()
                if (json.data) setPayments(json.data)
            } catch (err) {
                console.error("Payment fetch error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchPayments()
    }, [])

    const getStatusStyle = (status) => {
        switch (status) {
            case 'successful': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
            case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            default: return 'text-red-500 bg-red-500/10 border-red-500/20'
        }
    }

    if (loading) return <div className="py-20 text-center animate-pulse text-slate-500 uppercase tracking-widest text-xs">Syncing Ledger...</div>

    return (
        <div className="space-y-8">
            {/* --- UPCOMING PAYMENT HEADER --- */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-blue-600/10 border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-1">Installment Reminder</h3>
                    <p className="text-slate-400 text-sm">Keep your property secured by maintaining your monthly schedule.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2">
                    Make a Payment <ExternalLink className="w-3 h-3" />
                </button>
            </div>

            {/* --- TRANSACTION TABLE --- */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <h3 className="font-bold text-lg">Transaction History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Reference</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Type</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Receipt</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {payments.map((pay) => (
                            <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-6 font-mono text-xs text-slate-400">{pay.providerReference || 'HAP-REF-PENDING'}</td>
                                <td className="p-6">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 italic">{pay.type}</span>
                                </td>
                                <td className="p-6 font-medium text-slate-100">₦{pay.amount.toLocaleString()}</td>
                                <td className="p-6">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(pay.status)}`}>
                                        {pay.status === 'successful' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {pay.status}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    {pay.status === 'successful' ? (
                                        <button className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-500 group-hover:scale-110 duration-300">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <span className="text-slate-600"><AlertCircle className="w-4 h-4 inline" /></span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}