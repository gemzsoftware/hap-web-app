'use client'

import React, { useState, useEffect } from 'react'
import { Search, Upload, Download, Eye, FileText, Calendar, User, Home, PlusCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function Documents() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('All')
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)

    // Quick deployment form
    const [deployDocTitle, setDeployDocTitle] = useState('')
    const [deployUser, setDeployUser] = useState('')
    const [deployFile, setDeployFile] = useState('')
    const [deployFileName, setDeployFileName] = useState('')
    const [deploying, setDeploying] = useState(false)
    const [deploySuccess, setDeploySuccess] = useState(false)

    // Get registered users for dropdown
    const [registeredUsers, setRegisteredUsers] = useState([])

    useEffect(() => {
        loadDocuments()
        loadUsers()
    }, [])

    const loadDocuments = () => {
        const storedDocs = localStorage.getItem('documents')
        const allDocs = storedDocs ? JSON.parse(storedDocs) : []
        setDocuments(allDocs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)))
        setLoading(false)
    }

    const loadUsers = () => {
        const storedUsers = localStorage.getItem('registeredUsers')
        const allUsers = storedUsers ? JSON.parse(storedUsers) : []

        // Also get users from payments/purchases
        const storedPayments = localStorage.getItem('payments')
        const allPayments = storedPayments ? JSON.parse(storedPayments) : []

        const paymentUsers = allPayments
            .filter(p => p.buyerEmail)
            .map(p => ({ email: p.buyerEmail, fullName: p.buyerName || 'Investor' }))

        const uniqueUsers = [...allUsers]
        paymentUsers.forEach(pu => {
            if (!uniqueUsers.find(u => u.email === pu.email)) {
                uniqueUsers.push({ _id: pu.email, email: pu.email, fullName: pu.fullName })
            }
        })

        setRegisteredUsers(uniqueUsers)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setDeployFileName(file.name)
        const reader = new FileReader()
        reader.onloadend = () => {
            setDeployFile(reader.result)
        }
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

        // Save document
        const storedDocs = localStorage.getItem('documents')
        const allDocs = storedDocs ? JSON.parse(storedDocs) : []
        allDocs.push(newDoc)
        localStorage.setItem('documents', JSON.stringify(allDocs))

        // Send notification
        const notification = {
            id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userEmail: userEmail,
            title: 'Document Added 📄',
            message: `A new document "${deployDocTitle.trim()}" has been added to your account. Check your Documents page to download it.`,
            type: 'document_added',
            propertyTitle: deployDocTitle.trim(),
            documentType: deployDocTitle.trim(),
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

    const getDocumentType = (doc) => {
        if (doc.title?.toLowerCase().includes('allocation')) return 'Allocation Letter'
        if (doc.title?.toLowerCase().includes('agreement')) return 'Agreement'
        if (doc.title?.toLowerCase().includes('certificate') || doc.title?.toLowerCase().includes('c of o')) return 'Ownership Document'
        if (doc.title?.toLowerCase().includes('survey')) return 'Survey Plan'
        if (doc.title?.toLowerCase().includes('deed')) return 'Deed of Assignment'
        return 'Document'
    }

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = (doc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === 'All' || getDocumentType(doc) === filterType
        return matchesSearch && matchesType
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
                        {documents.length} Document{documents.length !== 1 ? 's' : ''} Stored
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
                        placeholder="Search document title, buyer name or email..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:border-emerald-500/50 outline-none appearance-none cursor-pointer"
                >
                    <option value="All">All Classifications</option>
                    <option value="Allocation Letter">Allocation Letter</option>
                    <option value="Agreement">Agreement</option>
                    <option value="Ownership Document">Ownership</option>
                    <option value="Survey Plan">Survey Plan</option>
                    <option value="Deed of Assignment">Deed of Assignment</option>
                    <option value="Document">Other</option>
                </select>
            </div>

            {/* GRID */}
            {filteredDocs.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[3.5rem]">
                    <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">No documents found</p>
                    <p className="text-slate-600 text-xs mt-2">Use the quick deployment module below to upload documents.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredDocs.map((doc) => (
                        <div key={doc.id} className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 hover:border-emerald-500/30 transition-all group shadow-2xl flex flex-col h-full">
                            <div className="flex justify-between items-start mb-10">
                                <div className="p-4 bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20 text-emerald-500">
                                    <FileText className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                </div>
                                <span className="px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-full border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                    {doc.status || 'Available'}
                                </span>
                            </div>

                            <div className="space-y-2 flex-grow">
                                <p className="font-mono text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">{doc.id}</p>
                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-tight line-clamp-2">{doc.title}</h3>
                                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/10 text-blue-400">
                                    {getDocumentType(doc)}
                                </span>
                            </div>

                            <div className="mt-10 space-y-4 border-t border-white/5 pt-8">
                                <InfoRow label="Investor" value={doc.userName || 'N/A'} />
                                <InfoRow label="Email" value={doc.userEmail || 'N/A'} />
                                <InfoRow label="Uploaded" value={new Date(doc.uploadedAt).toLocaleDateString()} />
                            </div>

                            <div className="flex gap-4 mt-12">
                                {doc.fileUrl && (
                                    <a href={doc.fileUrl} download={doc.fileName || 'document.pdf'} className="flex-1">
                                        <button className="w-full py-5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                    </a>
                                )}
                                <button
                                    onClick={() => {
                                        const storedDocs = localStorage.getItem('documents')
                                        const allDocs = storedDocs ? JSON.parse(storedDocs) : []
                                        const updated = allDocs.filter(d => d.id !== doc.id)
                                        localStorage.setItem('documents', JSON.stringify(updated))
                                        loadDocuments()
                                    }}
                                    className="flex-1 py-5 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                                >
                                    <XCircle className="w-4 h-4" /> Delete
                                </button>
                            </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Document Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Allocation Letter, Survey Plan"
                                required
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 text-xs font-bold text-white outline-none focus:border-emerald-500/50"
                                value={deployDocTitle}
                                onChange={(e) => setDeployDocTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Assign to User</label>
                            <select
                                required
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 text-xs font-bold text-white outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                                value={deployUser}
                                onChange={(e) => setDeployUser(e.target.value)}
                            >
                                <option value="">Select User...</option>
                                {registeredUsers.map((user, idx) => (
                                    <option key={user._id || idx} value={user.email || user._id}>
                                        {user.fullName || 'User'} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">File Attachment</label>
                            <input
                                type="file"
                                required
                                onChange={handleFileChange}
                                accept="image/*,application/pdf"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 text-xs font-bold text-white outline-none focus:border-emerald-500/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
                            />
                            {deployFileName && (
                                <p className="text-[10px] text-emerald-400 ml-4">Selected: {deployFileName}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={deploying}
                        className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] text-white transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {deploying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalize & Deploy Document'}
                    </button>

                    {deploySuccess && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-bold text-center">
                            Document deployed & user notified!
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center text-[10px]">
            <span className="font-black uppercase tracking-widest text-slate-500">{label}</span>
            <span className="font-bold text-white uppercase truncate ml-4 max-w-[180px]">{value}</span>
        </div>
    )
}