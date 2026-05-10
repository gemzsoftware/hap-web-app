'use client'

import { useState } from 'react'
import { mockAdminData } from '@/data/mockAdminData'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminEnquiriesPage() {
    const [enquiries, setEnquiries] = useState(mockAdminData.enquiries)

    const markAsReplied = (id) => {
        setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: 'replied' } : e))
    }

    return (
        <div className="space-y-10 pb-20 max-w-5xl">
            {/* --- 1. TERMINAL HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Inbound Protocol</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
                        Inquiry Terminal
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                        Manage strategic communications and high-intent acquisition leads.
                    </p>
                </div>
            </header>

            {/* --- 2. MESSAGE STACK --- */}
            <div className="space-y-6">
                <AnimatePresence mode='popLayout'>
                    {enquiries.map((enquiry, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            key={enquiry.id}
                            className={`group relative bg-white p-8 rounded-[2.5rem] border transition-all duration-500 ${
                                enquiry.status === 'new'
                                    ? 'border-emerald-500/20 shadow-2xl shadow-emerald-500/5'
                                    : 'border-slate-100 opacity-80'
                            }`}
                        >
                            {/* NEW Status Indicator */}
                            {enquiry.status === 'new' && (
                                <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">New Lead</span>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Lead Identifier */}
                                <div className="md:w-64 border-r border-slate-50 pr-8">
                                    <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-2">
                                        {enquiry.name}
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                            {enquiry.email}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {enquiry.phone}
                                        </p>
                                    </div>
                                    <div className="mt-6">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                            Clearance: {new Date(enquiry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className="flex-1">
                                    <div className="bg-slate-50 rounded-3xl p-6 relative">
                                        {/* Quotation mark decoration */}
                                        <div className="absolute top-4 right-6 text-slate-200 text-4xl font-serif select-none italic opacity-50">“</div>
                                        <p className="text-slate-700 text-[13px] leading-relaxed font-medium relative z-10">
                                            {enquiry.message}
                                        </p>
                                    </div>

                                    {/* Action Tray */}
                                    <div className="flex items-center justify-end mt-6 gap-4">
                                        <a
                                            href={`mailto:${enquiry.email}`}
                                            className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-[0.2em] transition-colors"
                                        >
                                            Open Mail Client
                                        </a>
                                        {enquiry.status === 'new' ? (
                                            <button
                                                onClick={() => markAsReplied(enquiry.id)}
                                                className="bg-slate-950 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-8 py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                                            >
                                                Archive Inquiry
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 text-emerald-500">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Protocol Settled</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}