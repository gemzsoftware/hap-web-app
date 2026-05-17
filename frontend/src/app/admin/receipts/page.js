'use client'

import { useState, useEffect } from 'react'
import ReceiptTemplate from '@/components/receipt/ReceiptTemplate'
import { Loader2, FileText, Download, Eye, Search, Receipt, CheckCircle2, Calendar, User } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { downloadReceipt } from '@/lib/receiptGenerator'

export default function AdminReceiptsPage() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadReceipts()
    }, [])

    const loadReceipts = () => {
        const stored = localStorage.getItem('payments')
        const allPayments = stored ? JSON.parse(stored) : []
        const verified = allPayments
            .filter(p => p.status === 'verified')
            .sort((a, b) => new Date(b.verifiedAt || b.submittedAt) - new Date(a.verifiedAt || a.submittedAt))
        setPayments(verified)
        setLoading(false)
    }

    const filteredPayments = payments.filter(p => {
        const search = searchTerm.toLowerCase()
        return (p.buyerName || '').toLowerCase().includes(search) ||
            (p.propertyTitle || '').toLowerCase().includes(search) ||
            (p.receiptNumber || '').toLowerCase().includes(search) ||
            (p.transactionReference || '').toLowerCase().includes(search)
    })

    const totalReceiptValue = payments.reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-40 text-left animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Financial Records</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        RECEIPT <span className="text-emerald-900 text-8xl">VAULT</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-bold italic">
                        {payments.length} Verified Receipt{payments.length !== 1 ? 's' : ''} • Total: {formatCurrency(totalReceiptValue)}
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">All Verified</span>
                </div>
            </div>

            {/* Search */}
            <div className="relative flex-1 group max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by buyer, property or receipt #..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-5 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Receipt View */}
            {selectedPayment ? (
                <div>
                    <button
                        onClick={() => setSelectedPayment(null)}
                        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        ← Back to Receipt List
                    </button>
                    <ReceiptTemplate payment={selectedPayment} />
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[3.5rem]">
                    <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">
                        {searchTerm ? 'No receipts match your search' : 'No verified receipts yet'}
                    </p>
                    <p className="text-slate-600 text-xs mt-2">
                        Receipts are generated when admin verifies a payment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPayments.map((payment) => (
                        <div
                            key={payment.id}
                            className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-8 hover:border-emerald-500/30 transition-all group shadow-2xl flex flex-col"
                        >
                            {/* Icon */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20 text-emerald-500">
                                    <Receipt className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                </div>
                                <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">
                                    Verified
                                </span>
                            </div>

                            {/* Receipt Info */}
                            <div className="space-y-1 mb-4">
                                <p className="font-mono text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">
                                    {payment.receiptNumber}
                                </p>
                                <h3 className="text-xl font-black italic text-white uppercase tracking-tighter line-clamp-2">
                                    {payment.propertyTitle}
                                </h3>
                            </div>

                            {/* Details */}
                            <div className="mt-auto space-y-3 border-t border-white/5 pt-6">
                                <div className="flex justify-between text-[10px]">
                                    <span className="font-black uppercase tracking-widest text-slate-500">Buyer</span>
                                    <span className="font-bold text-white">{payment.buyerName || payment.senderName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="font-black uppercase tracking-widest text-slate-500">Amount</span>
                                    <span className="font-bold text-emerald-400">{formatCurrency(payment.amountPaid || payment.amount)}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="font-black uppercase tracking-widest text-slate-500">Mode</span>
                                    <span className={`font-bold capitalize ${payment.paymentMode === 'full' ? 'text-blue-400' : 'text-purple-400'}`}>
                                        {payment.paymentMode || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="font-black uppercase tracking-widest text-slate-500">Date</span>
                                    <span className="font-bold text-slate-400">
                                        {new Date(payment.verifiedAt || payment.submittedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setSelectedPayment(payment)}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                >
                                    <Eye className="w-4 h-4" /> View
                                </button>
                                <button
                                    onClick={() => downloadReceipt(payment)}
                                    className="flex-1 py-4 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                >
                                    <Download className="w-4 h-4" /> PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}