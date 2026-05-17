'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText, Download, Printer, Eye, ShieldCheck, FolderOpen, Lock,
    Receipt, ScrollText, BadgeCheck, FileCheck, Loader2, X
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { downloadReceipt } from '@/lib/receiptGenerator'
import ReceiptTemplate from '@/components/receipt/ReceiptTemplate'

export default function DocumentsPage() {
    const [filter, setFilter] = useState('all')
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [previewDoc, setPreviewDoc] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
            loadDocuments(parsedUser)
        }
    }, [])

    const loadDocuments = (currentUser) => {
        const storedPayments = localStorage.getItem('payments')
        const storedDocs = localStorage.getItem('documents')

        const allPayments = storedPayments ? JSON.parse(storedPayments) : []
        const adminDocs = storedDocs ? JSON.parse(storedDocs) : []

        const docs = []

        // Add verified payment receipts
        const verifiedPayments = allPayments.filter(
            p => p.buyerEmail === currentUser?.email && p.status === 'verified'
        )

        verifiedPayments.forEach((payment, idx) => {
            const uniqueId = `receipt-${payment.id || payment.receiptNumber || idx}-${idx}`
            docs.push({
                id: uniqueId,
                title: `Payment Receipt - ${payment.propertyTitle}`,
                type: 'receipt',
                date: payment.verifiedAt || payment.submittedAt,
                ref: payment.transactionReference || payment.id,
                amount: payment.amountPaid || payment.amount,
                paymentData: payment,
                isReceipt: true,
                previewType: 'receipt'
            })
        })

        // Add admin-uploaded documents
        const userDocs = adminDocs.filter(
            d => d.userEmail === currentUser?.email || d.userId === currentUser?.id
        )

        userDocs.forEach((doc, idx) => {
            docs.push({
                id: doc.id || `admin-doc-${idx}-${Date.now()}`,
                title: doc.title || 'Document',
                type: doc.type || 'document',
                date: doc.uploadedAt || doc.createdAt,
                ref: doc.reference || doc.id,
                fileUrl: doc.fileUrl,
                fileName: doc.fileName || 'document',
                isReceipt: false,
                previewType: 'document'
            })
        })

        docs.sort((a, b) => new Date(b.date) - new Date(a.date))
        setDocuments(docs)
        setLoading(false)
    }

    const handleDownloadReceipt = (doc) => {
        if (doc.paymentData) {
            downloadReceipt(doc.paymentData)
        }
    }

    const filteredDocs = filter === 'all'
        ? documents
        : documents.filter(doc => doc.type === filter)

    const getDocIcon = (type) => {
        switch (type) {
            case 'receipt': return <Receipt className="w-6 h-6" />
            case 'legal': return <ScrollText className="w-6 h-6" />
            case 'agreement': return <FileCheck className="w-6 h-6" />
            case 'ownership': return <BadgeCheck className="w-6 h-6" />
            default: return <FileText className="w-6 h-6" />
        }
    }

    const isImagePreview = (doc) => {
        if (!doc || !doc.fileUrl) return false
        return doc.fileUrl.startsWith('data:image/') ||
            doc.fileUrl.endsWith('.jpg') ||
            doc.fileUrl.endsWith('.jpeg') ||
            doc.fileUrl.endsWith('.png') ||
            doc.fileUrl.endsWith('.gif') ||
            doc.fileUrl.endsWith('.webp')
    }

    const isPDFPreview = (doc) => {
        if (!doc || !doc.fileUrl) return false
        return doc.fileUrl.endsWith('.pdf') || doc.fileUrl.startsWith('data:application/pdf')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 text-left min-h-screen bg-[#020617]">

            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Lock className="w-3.5 h-3.5" style={{ color: '#B59410' }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Official Records</span>
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                        Document <span className="text-slate-800 text-5xl">Vault</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {documents.length} document{documents.length !== 1 ? 's' : ''} available
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Verified & Secure</span>
                </div>
            </header>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-8 overflow-x-auto">
                <FilterTab active={filter === 'all'} onClick={() => setFilter('all')} label={`All (${documents.length})`} />
                <FilterTab active={filter === 'receipt'} onClick={() => setFilter('receipt')} label={`Receipts (${documents.filter(d => d.type === 'receipt').length})`} />
                <FilterTab active={filter === 'legal'} onClick={() => setFilter('legal')} label="Allocation" />
                <FilterTab active={filter === 'agreement'} onClick={() => setFilter('agreement')} label="Agreements" />
                <FilterTab active={filter === 'ownership'} onClick={() => setFilter('ownership')} label="Ownership" />
                <FilterTab active={filter === 'document'} onClick={() => setFilter('document')} label="Other" />
            </div>

            {/* DOCUMENTS GRID */}
            {filteredDocs.length === 0 ? (
                <div className="text-center py-20">
                    <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">No documents found</p>
                    <p className="text-slate-600 text-xs mt-2">
                        {filter === 'receipt'
                            ? 'Receipts will appear here once your payments are verified by admin.'
                            : 'Documents will appear here once uploaded by admin.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredDocs.map((doc) => (
                            <motion.div
                                key={`${doc.type}-${doc.id}-${doc.date}`}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative p-8 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-[#B59410]/40 transition-all flex flex-col justify-between h-[380px] overflow-hidden"
                            >
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 text-white/[0.02] group-hover:text-[#B59410]/5 transition-all duration-500">
                                    {getDocIcon(doc.type)}
                                </div>

                                {doc.isReceipt && (
                                    <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                        Verified
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="p-4 rounded-2xl bg-[#002B5B] border border-white/5 shadow-xl" style={{ color: '#B59410' }}>
                                            {getDocIcon(doc.type)}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                                {doc.isReceipt ? 'Receipt No' : 'Document ID'}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">
                                                {typeof doc.ref === 'string' ? doc.ref.substring(0, 12) : doc.id?.substring(0, 12)}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-white italic tracking-tight line-clamp-2">{doc.title}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                doc.type === 'receipt' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    doc.type === 'legal' ? 'bg-blue-500/10 text-blue-400' :
                                                        doc.type === 'agreement' ? 'bg-purple-500/10 text-purple-400' :
                                                            doc.type === 'ownership' ? 'bg-amber-500/10 text-amber-400' :
                                                                'bg-slate-500/10 text-slate-400'
                                            }`}>
                                                {doc.type}
                                            </span>
                                            {doc.amount && (
                                                <span className="text-[10px] font-bold text-white">
                                                    {formatCurrency(doc.amount)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                                            {new Date(doc.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-6 relative z-10">
                                    {/* Preview Button - For Both Receipts AND Documents */}
                                    <button
                                        onClick={() => setPreviewDoc(doc)}
                                        className="flex-1 py-4 bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-blue-500/20"
                                    >
                                        <Eye className="w-3.5 h-3.5" /> Preview
                                    </button>

                                    {doc.isReceipt ? (
                                        <button
                                            onClick={() => handleDownloadReceipt(doc)}
                                            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Download
                                        </button>
                                    ) : doc.fileUrl ? (
                                        <a href={doc.fileUrl} download={doc.fileName || 'document'} className="flex-1">
                                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/5">
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </button>
                                        </a>
                                    ) : (
                                        <button className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5 cursor-not-allowed">
                                            <Lock className="w-3 h-3" /> Unavailable
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* ========== PREVIEW MODAL ========== */}
            <AnimatePresence>
                {previewDoc && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewDoc(null)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#0B1220] border border-white/10 rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b border-white/5">
                                    <div>
                                        <h3 className="text-lg font-black text-white">{previewDoc.title}</h3>
                                        <p className="text-[10px] text-slate-500">
                                            {previewDoc.isReceipt
                                                ? `Receipt: ${previewDoc.paymentData?.receiptNumber || 'N/A'}`
                                                : previewDoc.fileName || 'Document Preview'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {previewDoc.isReceipt ? (
                                            <button
                                                onClick={() => handleDownloadReceipt(previewDoc)}
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </button>
                                        ) : previewDoc.fileUrl ? (
                                            <a
                                                href={previewDoc.fileUrl}
                                                download={previewDoc.fileName || 'document'}
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </a>
                                        ) : null}
                                        <button
                                            onClick={() => setPreviewDoc(null)}
                                            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 overflow-auto max-h-[70vh] bg-white">
                                    {/* Receipt Preview */}
                                    {previewDoc.isReceipt && previewDoc.paymentData ? (
                                        <ReceiptTemplate payment={previewDoc.paymentData} />
                                    ) : isImagePreview(previewDoc) ? (
                                        <div className="flex items-center justify-center bg-slate-100 rounded-2xl p-4">
                                            <img
                                                src={previewDoc.fileUrl}
                                                alt={previewDoc.title}
                                                className="max-w-full max-h-[60vh] object-contain rounded-xl"
                                            />
                                        </div>
                                    ) : isPDFPreview(previewDoc) ? (
                                        <iframe
                                            src={previewDoc.fileUrl}
                                            title={previewDoc.title}
                                            className="w-full h-[65vh] rounded-2xl"
                                        />
                                    ) : previewDoc.fileUrl?.startsWith('data:') ? (
                                        <div className="text-center py-16 bg-slate-100 rounded-2xl">
                                            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                            <p className="text-slate-600 text-sm font-bold">Preview not available for this file type</p>
                                            <p className="text-slate-500 text-xs mt-1">The file can be downloaded directly</p>
                                            <a
                                                href={previewDoc.fileUrl}
                                                download={previewDoc.fileName || 'document'}
                                                className="text-emerald-600 text-xs font-bold uppercase tracking-wider hover:underline mt-3 inline-block"
                                            >
                                                Click to Download
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-slate-100 rounded-2xl">
                                            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                            <p className="text-slate-600 text-sm font-bold">No preview available</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function FilterTab({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                active
                    ? 'text-white shadow-xl'
                    : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/20'
            }`}
            style={active ? { backgroundColor: '#B59410', borderColor: '#B59410' } : {}}
        >
            {label}
        </button>
    )
}