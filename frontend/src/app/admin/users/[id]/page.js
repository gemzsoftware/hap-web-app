'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Loader2, Landmark, FileText,
    UploadCloud, CreditCard, CheckCircle2, XCircle,
    Receipt
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { downloadReceipt } from '@/lib/receiptGenerator'

export default function InvestorManagementHubPage() {
    const { id } = useParams()
    const router = useRouter()
    const fileInputRef = useRef(null)

    const [investor, setInvestor] = useState(null)
    const [payments, setPayments] = useState([])
    const [purchases, setPurchases] = useState([])
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)

    const [docTitle, setDocTitle] = useState('')
    const [fileString, setFileString] = useState('')
    const [fileName, setFileName] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)

    useEffect(() => {
        if (id) fetchInvestorData()
    }, [id])

    const fetchInvestorData = () => {
        // Find user from localStorage registered users
        const storedUsers = localStorage.getItem('registeredUsers')
        const allUsers = storedUsers ? JSON.parse(storedUsers) : []

        const defaultUsers = [
            { _id: 'admin_001', id: 'admin_001', fullName: 'Admin User', email: 'admin@heavenark.test', role: 'admin', status: 'active' },
            { _id: 'investor_001', id: 'investor_001', fullName: 'Demo Investor', email: 'investor@heavenark.test', role: 'investor', status: 'active' }
        ]

        const searchUsers = allUsers.length > 0 ? allUsers : defaultUsers
        const found = searchUsers.find(u => (u._id === id || u.id === id))

        if (found) {
            setInvestor(found)
        } else {
            // Try to find by email match in payments
            const storedPayments = localStorage.getItem('payments')
            const allPayments = storedPayments ? JSON.parse(storedPayments) : []
            const userPayment = allPayments.find(p => p.id === id || p.purchaseId === id)
            if (userPayment) {
                setInvestor({
                    _id: id,
                    id: id,
                    fullName: userPayment.buyerName || 'Investor',
                    email: userPayment.buyerEmail || '',
                    role: 'investor',
                    status: 'active'
                })
            } else {
                // Last fallback - use the ID to create basic profile
                setInvestor({
                    _id: id,
                    id: id,
                    fullName: 'Investor',
                    email: 'investor@heavenark.test',
                    role: 'investor',
                    status: 'active'
                })
            }
        }

        // Get payments
        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const userPayments = allPayments.filter(p =>
            p.buyerEmail === found?.email ||
            p.id === id ||
            p.purchaseId === id
        )
        setPayments(userPayments)

        // Get purchases
        const storedPurchases = localStorage.getItem('purchases')
        const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []
        const userPurchases = allPurchases.filter(p =>
            p.buyerEmail === found?.email ||
            p.id === id
        )
        setPurchases(userPurchases)

        // Get documents
        const storedDocs = localStorage.getItem('documents')
        const allDocs = storedDocs ? JSON.parse(storedDocs) : []
        const userDocs = allDocs.filter(d =>
            d.userEmail === found?.email ||
            d.userId === id
        )
        setDocuments(userDocs)

        setLoading(false)
    }

    const handleFileEncoding = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setFileName(file.name)
        const reader = new FileReader()
        reader.onloadend = () => {
            setFileString(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleUploadSubmit = async (e) => {
        e.preventDefault()
        if (!fileString || !docTitle) return

        setIsUploading(true)

        const investorEmail = investor?.email || 'investor@heavenark.test'
        const investorName = investor?.fullName || 'Investor'

        console.log('Uploading document for:', investorEmail)

        // Create document
        const newDoc = {
            id: `DOC-${Date.now()}`,
            userId: id,
            userEmail: investorEmail,
            userName: investorName,
            title: docTitle.trim(),
            type: 'legal',
            fileUrl: fileString,
            fileName: fileName,
            status: 'available',
            uploadedAt: new Date().toISOString()
        }

        // Save document to localStorage
        const storedDocs = localStorage.getItem('documents')
        const allDocs = storedDocs ? JSON.parse(storedDocs) : []
        allDocs.push(newDoc)
        localStorage.setItem('documents', JSON.stringify(allDocs))
        console.log('Document saved to localStorage:', newDoc)

        // Create notification
        const notification = {
            id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userEmail: investorEmail,
            title: 'Document Added 📄',
            message: `A new document "${docTitle.trim()}" has been added to your account. Check your Documents page to download it.`,
            type: 'document_added',
            propertyTitle: docTitle.trim(),
            documentType: docTitle.trim(),
            read: false,
            createdAt: new Date().toISOString()
        }

        // Save notification to localStorage
        const storedNotifs = localStorage.getItem('notifications')
        const allNotifs = storedNotifs ? JSON.parse(storedNotifs) : []
        allNotifs.push(notification)
        localStorage.setItem('notifications', JSON.stringify(allNotifs))
        console.log('Notification saved to localStorage:', notification)
        console.log('Total notifications for', investorEmail, ':', allNotifs.filter(n => n.userEmail === investorEmail).length)

        setUploadSuccess(true)
        setDocTitle('')
        setFileString('')
        setFileName('')
        fetchInvestorData()
        setTimeout(() => setUploadSuccess(false), 3000)
        setIsUploading(false)
    }

    const handleVerifyPayment = (paymentId) => {
        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const updated = allPayments.map(p => {
            if (p.id === paymentId) {
                const verified = {
                    ...p,
                    status: 'verified',
                    verifiedAt: new Date().toISOString(),
                    receiptNumber: `HAP-RCPT-${Date.now()}`
                }

                // Send notification
                if (p.buyerEmail) {
                    const notif = {
                        id: `NOTIF-${Date.now()}`,
                        userEmail: p.buyerEmail,
                        title: 'Payment Verified ✅',
                        message: `Your payment of ${formatCurrency(p.amountPaid || p.amount)} for ${p.propertyTitle} has been verified.`,
                        type: 'payment_verified',
                        propertyTitle: p.propertyTitle,
                        amount: p.amountPaid || p.amount,
                        receiptNumber: verified.receiptNumber,
                        read: false,
                        createdAt: new Date().toISOString()
                    }
                    const storedNotifs = localStorage.getItem('notifications')
                    const allNotifs = storedNotifs ? JSON.parse(storedNotifs) : []
                    allNotifs.push(notif)
                    localStorage.setItem('notifications', JSON.stringify(allNotifs))
                }
                return verified
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(updated))
        fetchInvestorData()
    }

    const handleDeclinePayment = (paymentId) => {
        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const updated = allPayments.map(p => {
            if (p.id === paymentId) {
                const declined = {
                    ...p,
                    status: 'declined',
                    declinedAt: new Date().toISOString()
                }
                if (p.buyerEmail) {
                    const notif = {
                        id: `NOTIF-${Date.now()}`,
                        userEmail: p.buyerEmail,
                        title: 'Payment Declined ❌',
                        message: `Your payment of ${formatCurrency(p.amountPaid || p.amount)} for ${p.propertyTitle} was declined. Please contact support.`,
                        type: 'payment_declined',
                        propertyTitle: p.propertyTitle,
                        amount: p.amountPaid || p.amount,
                        read: false,
                        createdAt: new Date().toISOString()
                    }
                    const storedNotifs = localStorage.getItem('notifications')
                    const allNotifs = storedNotifs ? JSON.parse(storedNotifs) : []
                    allNotifs.push(notif)
                    localStorage.setItem('notifications', JSON.stringify(allNotifs))
                }
                return declined
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(updated))
        fetchInvestorData()
    }

    // Calculate stats
    const totalPaid = payments
        .filter(p => p.status === 'verified')
        .reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)
    const totalPending = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (Number(p.amountPaid) || Number(p.amount) || 0), 0)
    const totalInvested = purchases.reduce((sum, p) => sum + (Number(p.totalPrice) || 0), 0)
    const activeContracts = purchases.filter(p => Number(p.remainingBalance) > 0 && p.status !== 'declined').length
    const completedContracts = purchases.filter(p => Number(p.remainingBalance) <= 0).length

    if (loading) {
        return (
            <div className="bg-[#020617] min-h-screen flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Accessing Vault Metrics...</p>
            </div>
        )
    }

    if (!investor) {
        return (
            <div className="bg-[#020617] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="text-2xl font-light text-slate-400 mb-4">User Not Found</p>
                <button onClick={() => router.push('/admin/users')} className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    ← Back to Users
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-24 text-left animate-in fade-in duration-700">
            {/* Back Button */}
            <button
                onClick={() => router.push('/admin/users')}
                className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Return To Directory
            </button>

            {/* Profile Banner */}
            <div className="bg-white/[0.01] border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-serif font-black text-2xl">
                        {investor?.fullName?.charAt(0) || 'I'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{investor?.fullName || 'Investor'}</h1>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{investor?.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            investor?.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                            {investor?.status || 'active'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col text-left md:text-right text-xs">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Role</span>
                    <span className="font-bold text-white text-sm mt-0.5 capitalize">{investor?.role || 'investor'}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Total Invested</p>
                    <p className="text-xl font-black mt-1 text-white">{formatCurrency(totalInvested)}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Verified Paid</p>
                    <p className="text-xl font-black mt-1 text-emerald-400">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Pending</p>
                    <p className="text-xl font-black mt-1 text-amber-400">{formatCurrency(totalPending)}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Contracts</p>
                    <p className="text-xl font-black mt-1 text-white">{activeContracts} active • {completedContracts} done</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT: Upload Document */}
                <form onSubmit={handleUploadSubmit} className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 space-y-6 shadow-xl">
                    <div>
                        <h3 className="text-lg font-bold text-white">Dispatch Legal Document</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mt-0.5">Upload & notify investor instantly</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 pl-1">Document Label</label>
                            <input type="text" placeholder="e.g., Deed of Assignment, Survey Plan" required
                                   className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-amber-500 transition-colors"
                                   value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 pl-1">File Attachment</label>
                            <div onClick={() => fileInputRef.current.click()}
                                 className="border-2 border-dashed border-white/10 bg-slate-950 rounded-2xl p-6 text-center cursor-pointer hover:border-amber-500 transition-colors group">
                                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-amber-400 transition-colors mb-2 mx-auto" />
                                <span className="text-xs font-bold text-slate-300 block">{fileName || 'Click to choose file'}</span>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileEncoding} className="hidden" accept="image/*,application/pdf" />
                        </div>
                    </div>

                    <button type="submit" disabled={isUploading || !fileString}
                            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transmit Document & Notify'}
                    </button>

                    <AnimatePresence>
                        {uploadSuccess && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 justify-center">
                                <CheckCircle2 className="w-4 h-4" /> Document added & user notified.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>

                {/* RIGHT: Documents + Payments */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Documents */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider">Dispatched Documents ({documents.length})</h3>
                        <div className="bg-slate-950 border border-white/5 rounded-2xl overflow-hidden">
                            {documents.length === 0 ? (
                                <p className="p-8 text-center text-slate-600 font-bold uppercase tracking-wider">No documents dispatched yet.</p>
                            ) : (
                                documents.map((doc) => (
                                    <div key={doc.id} className="p-4 border-b border-white/5 flex justify-between items-center text-xs hover:bg-white/[0.01] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <p className="font-bold text-white text-sm">{doc.title}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Available
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Payments */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Payment History ({payments.length})</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {payments.length === 0 ? (
                                <p className="p-4 text-center text-slate-600 text-xs">No payments yet.</p>
                            ) : (
                                payments.map((pay) => (
                                    <div key={pay.id} className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
                                        pay.status === 'verified' ? 'bg-emerald-500/5 border-emerald-500/20' :
                                            pay.status === 'declined' ? 'bg-red-500/5 border-red-500/20' :
                                                'bg-amber-500/5 border-amber-500/20'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${
                                                pay.status === 'verified' ? 'bg-emerald-500' :
                                                    pay.status === 'declined' ? 'bg-red-500' : 'bg-amber-500'
                                            }`} />
                                            <div>
                                                <p className="font-bold text-white">{pay.propertyTitle}</p>
                                                <p className="text-slate-400">{formatCurrency(pay.amountPaid || pay.amount)} • {pay.paymentMode}</p>
                                                <p className="text-[10px] text-slate-500 font-mono">{pay.transactionReference}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold uppercase ${
                                                pay.status === 'verified' ? 'text-emerald-400' :
                                                    pay.status === 'declined' ? 'text-red-400' : 'text-amber-400'
                                            }`}>{pay.status}</span>
                                            {pay.status === 'pending' && (
                                                <div className="flex gap-1">
                                                    <button onClick={() => handleVerifyPayment(pay.id)}
                                                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    </button>
                                                    <button onClick={() => handleDeclinePayment(pay.id)}
                                                            className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-600 hover:text-white">
                                                        <XCircle className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                            {pay.status === 'verified' && pay.receiptNumber && (
                                                <button onClick={() => downloadReceipt(pay)}
                                                        className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white">
                                                    <Receipt className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Purchases Summary */}
                    {purchases.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-black uppercase text-blue-400 tracking-wider">Active Contracts ({purchases.length})</h3>
                            {purchases.map((purchase) => {
                                const paidAmount = purchase.totalPaidSoFar || purchase.amountPaid || 0
                                const progress = purchase.totalPrice > 0
                                    ? Math.round((paidAmount / purchase.totalPrice) * 100)
                                    : 0
                                const remaining = (purchase.totalPrice || 0) - paidAmount
                                return (
                                    <div key={purchase.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-bold text-white text-sm">{purchase.propertyTitle}</p>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                purchase.paymentMode === 'full' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                                            }`}>{purchase.paymentMode}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                            <span>Paid: {formatCurrency(paidAmount)}</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2">
                                            Total: {formatCurrency(purchase.totalPrice)} • Remaining: {formatCurrency(remaining)}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}