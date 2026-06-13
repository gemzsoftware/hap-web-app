'use client'

import React, { useState, useEffect } from 'react'
import {
    Search, Upload, Download, FileText, Loader2, CheckCircle2, XCircle,
    ChevronDown, ChevronRight, Mail, Receipt, PlusCircle
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { downloadReceipt } from '@/lib/receiptGenerator'

export default function Documents() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('All')
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedUsers, setExpandedUsers] = useState({})
    const [userGroups, setUserGroups] = useState({})

    const [deployDocTitle, setDeployDocTitle] = useState('')
    const [deployUser, setDeployUser] = useState('')
    const [deployFile, setDeployFile] = useState('')
    const [deployFileName, setDeployFileName] = useState('')
    const [deploying, setDeploying] = useState(false)
    const [deploySuccess, setDeploySuccess] = useState(false)
    const [registeredUsers, setRegisteredUsers] = useState([])

    useEffect(() => {
        loadDocuments()
        loadUsers()
    }, [])

    const loadDocuments = () => {
        const storedDocs = localStorage.getItem('documents')
        const allDocs = storedDocs ? JSON.parse(storedDocs) : []

        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const verifiedReceipts = allPayments
            .filter(p => p.status === 'verified')
            .map(p => ({
                id: `receipt-${p.id}`,
                userId: p.buyerEmail,
                userEmail: p.buyerEmail,
                userName: p.buyerName || 'Investor',
                title: `Payment Receipt - ${p.propertyTitle}`,
                type: 'Receipt',
                fileUrl: null,
                fileName: `Receipt-${p.receiptNumber}.pdf`,
                status: 'available',
                uploadedAt: p.verifiedAt || p.submittedAt,
                isReceipt: true,
                amount: p.amountPaid || p.amount,
                receiptNumber: p.receiptNumber,
                paymentData: p
            }))

        const allDocuments = [...allDocs, ...verifiedReceipts]
        setDocuments(allDocuments.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)))

        const groups = {}
        allDocuments.forEach(doc => {
            const key = doc.userEmail || doc.userId || 'unknown'
            if (!groups[key]) {
                groups[key] = {
                    email: key,
                    userName: doc.userName || 'Unknown User',
                    documents: [],
                    totalDocs: 0
                }
            }
            groups[key].documents.push(doc)
            groups[key].totalDocs++
        })

        setUserGroups(groups)
        const allExpanded = {}
        Object.keys(groups).forEach(key => { allExpanded[key] = true })
        setExpandedUsers(allExpanded)
        setLoading(false)
    }

    const loadUsers = () => {
        const storedUsers = localStorage.getItem('registeredUsers')
        const allUsers = storedUsers ? JSON.parse(storedUsers) : []

        if (allUsers.length === 0) {
            const token = localStorage.getItem('token')
            const apiUrl = process.env.NEXT_PUBLIC_API_URL

            fetch(`${apiUrl}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    const users = data.data || data.users || []
                    const filtered = users.filter(u => u.role !== 'admin' && u.role !== 'staff')
                    setRegisteredUsers(filtered.length > 0 ? filtered : [
                        { _id: 'investor_001', email: 'investor@heavenark.test', fullName: 'Demo Investor', role: 'investor' }
                    ])
                })
                .catch(() => {
                    setRegisteredUsers([
                        { _id: 'investor_001', email: 'investor@heavenark.test', fullName: 'Demo Investor', role: 'investor' }
                    ])
                })
        } else {
            const filtered = allUsers.filter(u => u.role !== 'admin' && u.role !== 'staff')
            setRegisteredUsers(filtered.length > 0 ? filtered : [
                { _id: 'investor_001', email: 'investor@heavenark.test', fullName: 'Demo Investor', role: 'investor' }
            ])
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setDeployFileName(file.name)
        const reader = new FileReader()
        reader.onloadend = () => { setDeployFile(reader.result) }
        reader.readAsDataURL(file)
    }

    const handleDeployDocument = async (e) => {
        e.preventDefault()
        if (!deployDocTitle || !deployUser || !deployFile) return
        setDeploying(true)

        const selectedUser = registeredUsers.find(u => (u._id === deployUser || u.email === deployUser))
        const userEmail = selectedUser?.email || deployUser
        const userName = selectedUser?.fullName || 'Investor'

        const newDoc = {
            id: `DOC-${Date.now()}`,
            userId: deployUser,
            userEmail: userEmail,
            userName: userName,
            title: deployDocTitle.trim(),
            type: 'legal',
            fileUrl: deployFile,
            fileName: deployFileName,
            status: 'available',
            uploadedAt: new Date().toISOString()
        }

        const storedDocs = localStorage.getItem('documents')
        const allDocs = storedDocs ? JSON.parse(storedDocs) : []
        allDocs.push(newDoc)
        localStorage.setItem('documents', JSON.stringify(allDocs))

        const notification = {
            id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userEmail: userEmail,
            title: 'Document Added 📄',
            message: `A new document "${deployDocTitle.trim()}" has been added to your account.`,
            type: 'document_added',
            propertyTitle: deployDocTitle.trim(),
            read: false,
            createdAt: new Date().toISOString()
        }
        const storedNotifs = localStorage.getItem('notifications')
        const allNotifs = storedNotifs ? JSON.parse(storedNotifs) : []
        allNotifs.push(notification)
        localStorage.setItem('notifications', JSON.stringify(allNotifs))

        setDeploySuccess(true)
        setDeployDocTitle('')
        setDeployUser('')
        setDeployFile('')
        setDeployFileName('')
        loadDocuments()
        setTimeout(() => setDeploySuccess(false), 3000)
        setDeploying(false)
    }

    const toggleUserExpand = (email) => {
        setExpandedUsers(prev => ({ ...prev, [email]: !prev[email] }))
    }

    const deleteDocument = (docId) => {
        const storedDocs = localStorage.getItem('documents')
        const allDocs = storedDocs ? JSON.parse(storedDocs) : []
        const updated = allDocs.filter(d => d.id !== docId)
        localStorage.setItem('documents', JSON.stringify(updated))
        loadDocuments()
    }

    const getDocumentType = (doc) => {
        if (doc.isReceipt) return 'Receipt'
        if (doc.title?.toLowerCase().includes('allocation')) return 'Allocation Letter'
        if (doc.title?.toLowerCase().includes('agreement')) return 'Agreement'
        if (doc.title?.toLowerCase().includes('certificate') || doc.title?.toLowerCase().includes('c of o')) return 'Ownership'
        if (doc.title?.toLowerCase().includes('survey')) return 'Survey Plan'
        if (doc.title?.toLowerCase().includes('deed')) return 'Deed of Assignment'
        return 'Document'
    }

    const filteredGroups = {}
    Object.entries(userGroups).forEach(([email, group]) => {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = !searchTerm ||
            group.userName.toLowerCase().includes(searchLower) ||
            email.toLowerCase().includes(searchLower) ||
            group.documents.some(d => d.title?.toLowerCase().includes(searchLower))

        if (matchesSearch) {
            const filteredDocs = filterType === 'All'
                ? group.documents
                : group.documents.filter(d => getDocumentType(d) === filterType)

            if (filteredDocs.length > 0) {
                filteredGroups[email] = { ...group, documents: filteredDocs }
            }
        }
    })

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
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Vault Security</p>
                    <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        DOCUMENT <span className="text-emerald-900 text-8xl">VAULT</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-bold italic">
                        {Object.keys(userGroups).length} Users • {documents.length} Documents
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Secure Storage</span>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by user name, email or document title..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:border-emerald-500/50 outline-none appearance-none cursor-pointer"
                >
                    <option value="All">All Types</option>
                    <option value="Allocation Letter">Allocation Letter</option>
                    <option value="Agreement">Agreement</option>
                    <option value="Ownership">Ownership</option>
                    <option value="Survey Plan">Survey Plan</option>
                    <option value="Deed of Assignment">Deed of Assignment</option>
                    <option value="Receipt">Receipt</option>
                    <option value="Document">Other</option>
                </select>
            </div>

            {/* GROUPED DOCUMENTS */}
            {Object.keys(filteredGroups).length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[3.5rem]">
                    <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">No documents found</p>
                    <p className="text-slate-600 text-xs mt-2">Use the quick deployment module below to upload documents.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(filteredGroups).map(([email, group]) => (
                        <div key={email} className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden">
                            <button
                                onClick={() => toggleUserExpand(email)}
                                className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg">
                                        {(group.userName || 'U')[0].toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-black text-white">{group.userName}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {email}</span>
                                            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {group.totalDocs} document{group.totalDocs !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{group.documents.length} showing</span>
                                    {expandedUsers[email] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                                </div>
                            </button>

                            {expandedUsers[email] && (
                                <div className="border-t border-white/5">
                                    {group.documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-4 px-8 border-b border-white/5 last:border-b-0 hover:bg-white/[0.01] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${doc.isReceipt ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                    {doc.isReceipt ? <Receipt className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{doc.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${doc.isReceipt ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                            {getDocumentType(doc)}
                                                        </span>
                                                        {doc.amount && <span className="text-[10px] text-slate-400">{formatCurrency(doc.amount)}</span>}
                                                        <span className="text-[10px] text-slate-600">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {doc.fileUrl && (
                                                    <a href={doc.fileUrl} download={doc.fileName || 'document'} className="p-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl transition-all">
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {doc.isReceipt && doc.paymentData && (
                                                    <button onClick={() => downloadReceipt(doc.paymentData)} className="p-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl transition-all">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {!doc.isReceipt && (
                                                    <button onClick={() => deleteDocument(doc.id)} className="p-3 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* QUICK DEPLOYMENT FORM */}
            <div className="mt-20 border border-white/5 bg-white/[0.01] rounded-[4rem] p-12 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                    <PlusCircle className="w-40 h-40 text-white" />
                </div>

                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                    <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                    Quick Deployment <span className="text-emerald-900">Module</span>
                </h3>

                <form onSubmit={handleDeployDocument} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Document Title</label>
                            <input type="text" placeholder="e.g., Allocation Letter" required
                                   className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 text-xs font-bold text-white outline-none focus:border-emerald-500/50"
                                   value={deployDocTitle} onChange={(e) => setDeployDocTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Assign to User</label>
                            <select required
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 text-xs font-bold text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                                    value={deployUser} onChange={(e) => setDeployUser(e.target.value)}>
                                <option value="">Select User...</option>
                                {registeredUsers.map((user, idx) => (
                                    <option key={user._id || idx} value={user.email || user._id}>
                                        {user.fullName || 'User'} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">File</label>
                            <input type="file" required onChange={handleFileChange} accept="image/*,application/pdf"
                                   className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 text-xs font-bold text-white outline-none file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white" />
                            {deployFileName && <p className="text-[10px] text-emerald-400 ml-4">📎 {deployFileName}</p>}
                        </div>
                    </div>

                    <button type="submit" disabled={deploying}
                            className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        {deploying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deploy Document & Notify User'}
                    </button>

                    {deploySuccess && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-bold text-center">
                            ✅ Document deployed & user notified!
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}