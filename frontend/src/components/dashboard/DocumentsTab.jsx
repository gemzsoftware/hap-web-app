'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FileCheck,
    Lock,
    Download,
    FileText,
    ShieldAlert,
    ExternalLink
} from 'lucide-react'

const API_BASE_URL = 'http://localhost:5000/api'

export default function DocumentsTab() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`${API_BASE_URL}/documents/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const json = await res.json()
                if (json.data) setDocuments(json.data)
            } catch (err) {
                console.error("Docs fetch error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchDocs()
    }, [])

    if (loading) return <div className="py-20 text-center animate-pulse text-slate-500 uppercase tracking-widest text-xs">Accessing Vault...</div>

    return (
        <div className="space-y-10">
            {/* --- LEGAL DISCLAIMER HEADER --- */}
            <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-3xl flex items-start gap-4">
                <ShieldAlert className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                    <h4 className="text-sm font-bold text-blue-100">Verified Legal Repository</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        All documents stored here are digitally verified copies of your land titles.
                        Physical copies can be collected at our head office once 100% payment is confirmed.
                    </p>
                </div>
            </div>

            {/* --- DOCUMENT GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.length > 0 ? (
                    documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-500"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                                    <FileCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-100">{doc.title}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Status: {doc.status}</p>
                                </div>
                            </div>

                            <a
                                href={`${API_BASE_URL}${doc.fileUrl}`}
                                target="_blank"
                                className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all group-hover:scale-110"
                            >
                                <Download className="w-4 h-4" />
                            </a>
                        </div>
                    ))
                ) : (
                    /* --- LOCKED/EMPTY STATE PREVIEW --- */
                    <>
                        <LockedDoc title="Contract of Sale" requirement="50% Payment" />
                        <LockedDoc title="Deed of Assignment" requirement="100% Payment" />
                        <LockedDoc title="Survey Plan" requirement="Allocation Phase" />
                        <LockedDoc title="Allocation Letter" requirement="100% Payment" />
                    </>
                )}
            </div>
        </div>
    )
}

// Helper component for documents that aren't ready yet
function LockedDoc({ title, requirement }) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between opacity-60">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-500">{title}</h4>
                    <p className="text-[9px] text-emerald-500/50 uppercase tracking-widest mt-1">Requires {requirement}</p>
                </div>
            </div>
            <div className="p-4 text-slate-700">
                <Download className="w-4 h-4" />
            </div>
        </div>
    )
}