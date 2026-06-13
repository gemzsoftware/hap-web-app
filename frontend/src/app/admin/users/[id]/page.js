'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Loader2, FileText, UploadCloud, CheckCircle2, XCircle,
    Receipt, AlertTriangle, Lock, Key, Ban, Eye, X, ShieldCheck,
    Wallet, Building2, Activity, Sparkles, Download, FolderOpen, BadgeCheck
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { downloadReceipt } from '@/lib/receiptGenerator'
import ReceiptTemplate from '../../../../components/receipt/ReceiptTemplate'

const MAX_STORAGE_SIZE = 4 * 1024 * 1024

const DOCUMENT_TYPES = {
    allocation_letter: 'Allocation Letter',
    deed_of_assignment: 'Deed of Assignment',
    certificate_of_occupancy: 'Certificate of Occupancy (C of O)',
    survey_plan: 'Survey Plan',
    purchase_agreement: 'Purchase Agreement',
    payment_receipt: 'Payment Receipt',
    land_document: 'Land Document',
    other: 'Other Document'
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
}

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
    const [docType, setDocType] = useState('allocation_letter')
    const [fileString, setFileString] = useState('')
    const [fileName, setFileName] = useState('')
    const [fileSize, setFileSize] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [fileError, setFileError] = useState('')

    const [showPasswordReset, setShowPasswordReset] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [resettingPassword, setResettingPassword] = useState(false)
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    const [togglingStatus, setTogglingStatus] = useState(false)
    const [previewReceipt, setPreviewReceipt] = useState(null)

    useEffect(() => {
        if (id) fetchInvestorData()
    }, [id])

    const fetchInvestorData = async () => {
        try {
            setLoading(true)

            const storedUsers = localStorage.getItem('registeredUsers')
            const allUsers = storedUsers ? JSON.parse(storedUsers) : []

            const storedPayments = localStorage.getItem('payments')
            const allPayments = storedPayments ? JSON.parse(storedPayments) : []

            const storedPurchases = localStorage.getItem('purchases')
            const allPurchases = storedPurchases ? JSON.parse(storedPurchases) : []

            const storedDocuments = localStorage.getItem('documents')
            const allDocuments = storedDocuments ? JSON.parse(storedDocuments) : []

            let foundUser = allUsers.find((u) => {
                const possibleIds = [u._id, u.id, u.email]
                return possibleIds.some((v) => v && String(v).toLowerCase() === String(id).toLowerCase())
            })

            if (!foundUser) {
                const token = localStorage.getItem('token')
                const apiUrl = process.env.NEXT_PUBLIC_API_URL
                try {
                    const res = await fetch(`${apiUrl}/admin/users/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (res.ok) {
                        const data = await res.json()
                        foundUser = data.data || data.user || data
                    }
                } catch (err) { console.log('Backend fetch skipped') }
            }

            if (!foundUser) {
                const pm = allPayments.find((p) => String(p.id) === String(id) || String(p.purchaseId) === String(id))
                if (pm?.buyerEmail) {
                    foundUser = allUsers.find((u) => u.email === pm.buyerEmail) || {
                        _id: id, id: id, fullName: pm.buyerName || 'Investor', email: pm.buyerEmail, role: 'investor', status: 'active'
                    }
                }
            }

            if (!foundUser) {
                foundUser = { _id: id, id: id, fullName: 'Unknown User', email: 'No Email', role: 'investor', status: 'active' }
            }

            setInvestor(foundUser)
            const userEmail = foundUser.email

            // STRICT filtering - only by exact email match
            setPayments(
                allPayments.filter(
                    (p) =>
                        p.buyerEmail?.toLowerCase() === userEmail?.toLowerCase() ||
                        p.userEmail?.toLowerCase() === userEmail?.toLowerCase()
                )
            )

            setPurchases(
                allPurchases.filter(
                    (p) =>
                        p.buyerEmail?.toLowerCase() === userEmail?.toLowerCase() ||
                        p.userEmail?.toLowerCase() === userEmail?.toLowerCase()
                )
            )

            setDocuments(
                allDocuments.filter(
                    (d) =>
                        d.userEmail?.toLowerCase() === userEmail?.toLowerCase()
                )
            )
        } catch (error) {
            console.log('FETCH ERROR:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        setPasswordError('')
        if (!newPassword || newPassword.length < 6) { setPasswordError('Password must be at least 6 characters.'); return }
        if (newPassword !== confirmNewPassword) { setPasswordError('Passwords do not match.'); return }
        setResettingPassword(true)

        const su = localStorage.getItem('registeredUsers')
        if (su) {
            const au = JSON.parse(su)
            const up = au.map(u => (u._id === id || u.id === id || u.email === investor?.email) ? { ...u, password: newPassword, passwordChangeRequired: false } : u)
            localStorage.setItem('registeredUsers', JSON.stringify(up))
        }
        setPasswordResetSuccess(true)
        setNewPassword(''); setConfirmNewPassword('')
        setTimeout(() => { setPasswordResetSuccess(false); setShowPasswordReset(false) }, 2500)
        setResettingPassword(false)
    }

    const handleToggleStatus = async () => {
        setTogglingStatus(true)
        const ns = investor?.status === 'active' ? 'suspended' : 'active'
        const su = localStorage.getItem('registeredUsers')
        if (su) {
            const au = JSON.parse(su)
            const up = au.map(u => (u._id === id || u.id === id || u.email === investor?.email) ? { ...u, status: ns } : u)
            localStorage.setItem('registeredUsers', JSON.stringify(up))
        }
        setInvestor(prev => ({ ...prev, status: ns }))
        setTogglingStatus(false)
    }

    const handleFileEncoding = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setFileError(''); setFileName(file.name); setFileSize(file.size)
        if (file.size > 500 * 1024) setFileError('File is large. Only metadata will be saved.')
        const reader = new FileReader()
        reader.onloadend = () => { const b = reader.result; setFileString(b && b.length < 100000 ? b : 'data:placeholder') }
        reader.readAsDataURL(file)
    }

    const handleUploadSubmit = async (e) => {
        e.preventDefault()
        if (!docTitle) return
        setIsUploading(true); setFileError('')
        const ie = investor?.email || 'investor@heavenark.test'

        const cd = localStorage.getItem('documents')
        const cs = cd ? new Blob([cd]).size : 0
        if (cs > MAX_STORAGE_SIZE) { const ad = JSON.parse(cd || '[]'); localStorage.setItem('documents', JSON.stringify(ad.slice(-10))) }

        const sf = fileString && fileString.length < 100000 && !fileString.includes('placeholder')
        const nd = { id: `DOC-${Date.now()}`, userId: id, userEmail: ie, userName: investor?.fullName || 'Investor', title: docTitle.trim(), type: docType, fileUrl: sf ? fileString : null, fileName: fileName || 'document', fileSize: fileSize ? `${Math.round(fileSize / 1024)}KB` : 'Unknown', status: 'available', uploadedAt: new Date().toISOString() }

        try { const sd = localStorage.getItem('documents'); const ad = sd ? JSON.parse(sd) : []; ad.push(nd); localStorage.setItem('documents', JSON.stringify(ad)) } catch (e) { const sd = localStorage.getItem('documents'); const ad = sd ? JSON.parse(sd) : []; const tr = ad.slice(-5); tr.push(nd); localStorage.setItem('documents', JSON.stringify(tr)) }

        setUploadSuccess(true)
        setDocTitle(''); setDocType('allocation_letter'); setFileString(''); setFileName(''); setFileSize(0)
        fetchInvestorData()
        setTimeout(() => setUploadSuccess(false), 3000)
        setIsUploading(false)
    }

    const handleVerifyPayment = (pid) => {
        const sp = localStorage.getItem('payments'); const ap = sp ? JSON.parse(sp) : []
        const up = ap.map(p => {
            if (p.id === pid) {
                const v = { ...p, status: 'verified', verifiedAt: new Date().toISOString(), receiptNumber: `HAP-RCPT-${Date.now()}` }
                if (p.buyerEmail) { const nf = { id: `NOTIF-${Date.now()}`, userEmail: p.buyerEmail, title: 'Payment Verified ✅', message: `Payment of ${formatCurrency(p.amountPaid || p.amount)} verified.`, type: 'payment_verified', read: false, createdAt: new Date().toISOString() }; try { const sn = localStorage.getItem('notifications'); const an = sn ? JSON.parse(sn) : []; an.push(nf); localStorage.setItem('notifications', JSON.stringify(an)) } catch (e) {} }
                return v
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(up)); fetchInvestorData()
    }

    const handleDeclinePayment = (pid) => {
        const sp = localStorage.getItem('payments'); const ap = sp ? JSON.parse(sp) : []
        const up = ap.map(p => {
            if (p.id === pid) {
                if (p.buyerEmail) { const nf = { id: `NOTIF-${Date.now()}`, userEmail: p.buyerEmail, title: 'Payment Declined ❌', message: 'Payment declined.', type: 'payment_declined', read: false, createdAt: new Date().toISOString() }; try { const sn = localStorage.getItem('notifications'); const an = sn ? JSON.parse(sn) : []; an.push(nf); localStorage.setItem('notifications', JSON.stringify(an)) } catch (e) {} }
                return { ...p, status: 'declined', declinedAt: new Date().toISOString() }
            }
            return p
        })
        localStorage.setItem('payments', JSON.stringify(up)); fetchInvestorData()
    }

    const tp = payments.filter((p) => p.status === 'verified').reduce((s, p) => s + (Number(p.amountPaid) || Number(p.amount) || 0), 0)
    const tpe = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + (Number(p.amountPaid) || Number(p.amount) || 0), 0)
    const ti = purchases.reduce((s, p) => s + (Number(p.totalPrice) || 0), 0)
    const ac = purchases.filter((p) => Number(p.remainingBalance) > 0 && p.status !== 'declined').length
    const cc = purchases.filter((p) => Number(p.remainingBalance) <= 0).length

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center">
                        <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-black">Syncing Investor Workspace</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pb-24">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 blur-[140px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-[1700px] mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <button onClick={() => router.push('/admin/users')} className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all">
                        <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-emerald-500/30 transition-all"><ArrowLeft className="w-4 h-4" /></div>
                        <div className="text-left"><p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Return</p><p className="text-sm font-semibold">Investor Directory</p></div>
                    </button>
                    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                        <ShieldCheck className="w-5 h-5" />
                        <div><p className="text-[10px] uppercase tracking-[0.25em] font-black">Secure Admin Session</p><p className="text-xs text-emerald-300/80">Investor Operations Console</p></div>
                    </div>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                    <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8 md:p-10 shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
                        <div className="absolute right-[-80px] top-[-80px] w-[280px] h-[280px] rounded-full bg-emerald-500/10 blur-3xl" />
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center text-4xl font-black shadow-2xl">{investor?.fullName?.charAt(0) || 'U'}</div>
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-[#020617] bg-emerald-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-amber-400" /><span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-black">Premium Investor</span></div>
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">{investor?.fullName || 'Investor'}</h1>
                                    <p className="text-slate-400 mt-2 font-medium">{investor?.email}</p>
                                    <div className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] font-black ${investor?.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}><BadgeCheck className="w-3.5 h-3.5" />{investor?.status || 'active'}</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => { setShowPasswordReset(!showPasswordReset); setPasswordResetSuccess(false); setPasswordError(''); setNewPassword(''); setConfirmNewPassword('') }} className="px-6 py-4 rounded-2xl bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 transition-all text-[11px] font-black uppercase tracking-[0.25em] flex items-center gap-2"><Key className="w-4 h-4" />Reset Password</button>
                                <button onClick={handleToggleStatus} disabled={togglingStatus} className={`px-6 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.25em] flex items-center gap-2 ${investor?.status === 'active' ? 'bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/20'}`}>{togglingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : investor?.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}{investor?.status === 'active' ? 'Suspend' : 'Activate'}</button>
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {showPasswordReset && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                <div className="rounded-[2.5rem] border border-blue-500/20 bg-blue-500/[0.04] backdrop-blur-xl p-8">
                                    <div className="flex items-center gap-4 mb-8"><div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><Lock className="w-6 h-6" /></div><div><h3 className="text-2xl font-black">Secure Password Reset</h3><p className="text-sm text-slate-400 mt-1">Generate a new secure login credential for {investor?.fullName}</p></div></div>
                                    {passwordResetSuccess ? (
                                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 flex items-center gap-3 text-emerald-400"><CheckCircle2 className="w-5 h-5" />Password updated successfully.</div>
                                    ) : (
                                        <form onSubmit={handlePasswordReset} className="space-y-5">
                                            {passwordError && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-center gap-2 text-red-400 text-sm"><AlertTriangle className="w-4 h-4" />{passwordError}</div>}
                                            <div className="grid md:grid-cols-2 gap-5">
                                                <div><label className="block mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black">New Password</label><input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full h-14 rounded-2xl bg-black/40 border border-white/10 px-5 text-white outline-none focus:border-blue-500" placeholder="Minimum 6 characters" /></div>
                                                <div><label className="block mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black">Confirm Password</label><input type="password" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full h-14 rounded-2xl bg-black/40 border border-white/10 px-5 text-white outline-none focus:border-blue-500" placeholder="Re-enter password" /></div>
                                            </div>
                                            <div className="flex flex-wrap gap-3 pt-2">
                                                <button type="submit" disabled={resettingPassword} className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all text-white text-[11px] font-black uppercase tracking-[0.25em]">{resettingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Reset'}</button>
                                                <button type="button" onClick={() => setShowPasswordReset(false)} className="h-14 px-8 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-[11px] font-black uppercase tracking-[0.25em]">Cancel</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {[
                            { title: 'Total Portfolio', value: formatCurrency(ti), icon: Wallet, color: 'emerald' },
                            { title: 'Verified Payments', value: formatCurrency(tp), icon: CheckCircle2, color: 'blue' },
                            { title: 'Pending Clearance', value: formatCurrency(tpe), icon: Activity, color: 'amber' },
                            { title: 'Contracts', value: `${ac} Active • ${cc} Completed`, icon: Building2, color: 'purple' }
                        ].map((item, i) => (
                            <div key={i} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
                                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 ${item.color === 'emerald' ? 'bg-emerald-500' : item.color === 'blue' ? 'bg-blue-500' : item.color === 'amber' ? 'bg-amber-500' : 'bg-purple-500'}`} />
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : item.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : item.color === 'amber' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'}`}><item.icon className="w-6 h-6" /></div>
                                    <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black">Analytics</span>
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black mb-2">{item.title}</p>
                                <h3 className="text-2xl font-black text-white leading-tight">{item.value}</h3>
                            </div>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                        <div className="xl:col-span-4 space-y-8">
                            <motion.form variants={itemVariants} onSubmit={handleUploadSubmit} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7">
                                <div className="flex items-start justify-between gap-4 mb-8">
                                    <div><p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-black mb-2">Secure Vault</p><h3 className="text-2xl font-black">Upload Documents</h3></div>
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center"><FolderOpen className="w-6 h-6" /></div>
                                </div>
                                <div className="space-y-5">
                                    <div><label className="block mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black">Document Title</label><input type="text" required value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Enter document title" className="w-full h-14 rounded-2xl bg-black/40 border border-white/10 px-5 text-white outline-none focus:border-amber-500" /></div>
                                    <div><label className="block mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black">Category</label><select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full h-14 rounded-2xl bg-black/40 border border-white/10 px-5 text-white outline-none focus:border-amber-500">{Object.entries(DOCUMENT_TYPES).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}</select></div>
                                    <div><label className="block mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black">Upload File</label><div onClick={() => fileInputRef.current.click()} className="rounded-[2rem] border-2 border-dashed border-white/10 hover:border-amber-500/40 transition-all bg-black/30 p-8 text-center cursor-pointer"><UploadCloud className="w-10 h-10 text-amber-400 mx-auto mb-4" /><p className="text-sm font-semibold text-white">{fileName || 'Click to select a file'}</p><p className="text-xs text-slate-500 mt-2">PNG, JPG or PDF</p></div><input type="file" ref={fileInputRef} onChange={handleFileEncoding} className="hidden" accept="image/*,application/pdf" />{fileError && <p className="text-red-400 text-xs mt-3">{fileError}</p>}</div>
                                    <button type="submit" disabled={isUploading || !docTitle} className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-black text-[11px] font-black uppercase tracking-[0.25em] transition-all">{isUploading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Upload & Notify'}</button>
                                    {uploadSuccess && <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Document uploaded successfully.</div>}
                                </div>
                            </motion.form>
                        </div>

                        <div className="xl:col-span-8 space-y-8">
                            <motion.div variants={itemVariants} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
                                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5"><div><p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-black mb-2">Secure Files</p><h3 className="text-2xl font-black">Investor Documents</h3></div><div className="text-right"><p className="text-3xl font-black">{documents.length}</p><p className="text-xs text-slate-500">Uploaded</p></div></div>
                                {documents.length === 0 ? (<div className="py-20 text-center text-slate-500">No documents uploaded.</div>) : (
                                    <div className="divide-y divide-white/5">
                                        {documents.map((doc) => (
                                            <div key={doc.id} className="px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-white/[0.02] transition-all">
                                                <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center"><FileText className="w-6 h-6" /></div><div><h4 className="text-lg font-bold">{doc.title}</h4><div className="flex flex-wrap items-center gap-3 mt-2"><span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase tracking-[0.2em] font-black">{DOCUMENT_TYPES[doc.type] || 'Document'}</span><span className="text-xs text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</span></div></div></div>
                                                <div className="flex items-center gap-3"><span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-black">Available</span></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
                                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5"><div><p className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-black mb-2">Transaction Ledger</p><h3 className="text-2xl font-black">Payment Activity</h3></div><div className="text-right"><p className="text-3xl font-black">{payments.length}</p><p className="text-xs text-slate-500">Transactions</p></div></div>
                                <div className="p-5 space-y-3 max-h-[600px] overflow-y-auto">
                                    {payments.length === 0 ? (<div className="py-16 text-center text-slate-500">No payments found.</div>) : (
                                        payments.map((pay) => (
                                            <div key={pay.id} className={`rounded-[2rem] border p-5 transition-all ${pay.status === 'verified' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : pay.status === 'declined' ? 'bg-red-500/[0.04] border-red-500/20' : 'bg-amber-500/[0.04] border-amber-500/20'}`}>
                                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pay.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' : pay.status === 'declined' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>{pay.status === 'verified' ? <CheckCircle2 className="w-6 h-6" /> : pay.status === 'declined' ? <XCircle className="w-6 h-6" /> : <Loader2 className="w-6 h-6" />}</div>
                                                        <div><h4 className="text-lg font-bold">{pay.propertyTitle}</h4><div className="flex flex-wrap items-center gap-3 mt-2"><span className="text-sm text-slate-400">{formatCurrency(pay.amountPaid || pay.amount)}</span><span className="text-xs text-slate-500 uppercase tracking-[0.2em]">{pay.paymentMode}</span><span className="text-xs font-mono text-slate-500">{pay.transactionReference}</span></div></div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-black ${pay.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : pay.status === 'declined' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>{pay.status}</span>
                                                        {pay.status === 'pending' && (<><button onClick={() => handleVerifyPayment(pay.id)} className="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></button><button onClick={() => handleDeclinePayment(pay.id)} className="w-11 h-11 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center"><XCircle className="w-4 h-4" /></button></>)}
                                                        {pay.status === 'verified' && pay.receiptNumber && (<><button onClick={() => setPreviewReceipt(pay)} className="w-11 h-11 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white flex items-center justify-center"><Eye className="w-4 h-4" /></button><button onClick={() => downloadReceipt(pay)} className="w-11 h-11 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white flex items-center justify-center"><Download className="w-4 h-4" /></button></>)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>

                            {purchases.length > 0 && (
                                <motion.div variants={itemVariants} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
                                    <div className="flex items-center justify-between mb-8"><div><p className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-black mb-2">Holdings</p><h3 className="text-2xl font-black">Active Contracts</h3></div><Building2 className="w-8 h-8 text-blue-400" /></div>
                                    <div className="space-y-5">
                                        {purchases.map((purchase) => {
                                            const pa = purchase.totalPaidSoFar || purchase.amountPaid || 0
                                            const pr = purchase.totalPrice > 0 ? Math.round((pa / purchase.totalPrice) * 100) : 0
                                            const rm = (purchase.totalPrice || 0) - pa
                                            return (
                                                <div key={purchase.id} className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
                                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-5"><div><h4 className="text-xl font-bold">{purchase.propertyTitle}</h4><p className="text-sm text-slate-500 mt-1">{formatCurrency(pa)} paid • {formatCurrency(purchase.totalPrice)} total</p></div><span className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-black ${purchase.paymentMode === 'full' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>{purchase.paymentMode}</span></div>
                                                    <div className="flex items-center justify-between mb-2 text-sm"><span className="text-slate-400">Settlement Progress</span><span className="font-black text-emerald-400">{pr}%</span></div>
                                                    <div className="h-2 rounded-full overflow-hidden bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${pr}%` }} /></div>
                                                    <div className="mt-4 flex justify-between text-xs text-slate-500"><span>Remaining</span><span>{formatCurrency(rm)}</span></div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {previewReceipt && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewReceipt(null)} className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ type: 'spring', stiffness: 250, damping: 24 }} onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[92vh] overflow-auto shadow-[0_50px_120px_rgba(0,0,0,0.7)]">
                            <div className="sticky top-0 z-20 bg-white px-6 py-5 flex justify-end border-b border-slate-100"><button onClick={() => setPreviewReceipt(null)} className="w-11 h-11 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-all"><X className="w-5 h-5" /></button></div>
                            <ReceiptTemplate payment={previewReceipt} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}