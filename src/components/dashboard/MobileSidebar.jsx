'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const sidebarLinks = [
    {
        name: 'Asset Overview',
        href: '/dashboard',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    },
    {
        name: 'Portfolio Registry',
        href: '/dashboard/properties',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    },
    {
        name: 'Capital Ledger',
        href: '/dashboard/payments',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    },
    {
        name: 'Title Documents',
        href: '/dashboard/documents',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    },
    {
        name: 'Transaction Receipts',
        href: '/dashboard/receipts',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    },
    {
        name: 'Account Settings',
        href: '/dashboard/settings',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />,
    },
]

export default function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* --- COMPACT MOBILE HEADER --- */}
            <div className="lg:hidden bg-[#020617] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-[#020617] rounded-sm" />
                    </div>
                    <span className="text-white font-black text-sm uppercase tracking-tighter">Heaven Ark</span>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </button>
            </div>

            {/* --- MOBILE TERMINAL OVERLAY --- */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />

                        {/* Slide-out Terminal */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#020617] shadow-2xl border-r border-white/5 flex flex-col"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 text-emerald-500">Terminal Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <nav className="p-6 space-y-3 flex-grow">
                                {sidebarLinks.map((link) => {
                                    const isActive = pathname === link.href
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                                isActive
                                                    ? 'bg-white text-slate-950 shadow-xl shadow-emerald-500/10'
                                                    : 'text-slate-400 border border-transparent'
                                            }`}
                                        >
                                            <svg
                                                className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-slate-500'}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                {link.icon}
                                            </svg>
                                            {link.name}
                                        </Link>
                                    )
                                })}
                            </nav>

                            {/* Session Security Footer */}
                            <div className="p-8 mt-auto border-t border-white/5">
                                <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Biometric Encrypted Session</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 text-[11px] font-black uppercase tracking-[0.3em] text-red-400 flex items-center justify-center gap-3"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Terminate
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}