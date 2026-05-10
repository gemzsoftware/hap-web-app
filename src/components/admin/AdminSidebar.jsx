'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { COMPANY } from '@/lib/constants'
import { motion } from 'framer-motion'

const adminLinks = [
    {
        name: 'Executive Overview',
        href: '/admin',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    },
    {
        name: 'Asset Inventory',
        href: '/admin/lands',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    },
    {
        name: 'Investor Registry',
        href: '/admin/users',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    },
    {
        name: 'Capital Flow',
        href: '/admin/transactions',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
    },
    {
        name: 'Inquiry Terminal',
        href: '/admin/enquiries',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-72 bg-[#020617] border-r border-white/5 text-slate-400 min-h-screen hidden lg:flex flex-col">
            {/* --- 1. BRAND TERMINAL --- */}
            <div className="p-8">
                <Link href="/admin" className="group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-500">
                            <span className="text-slate-950 font-black text-2xl tracking-tighter">H</span>
                        </div>
                        <div>
                            <h2 className="font-black text-white text-[10px] uppercase tracking-[0.5em] leading-none mb-1">
                                Systems Admin
                            </h2>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                {COMPANY.name}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* --- 2. CONTROL NAVIGATION --- */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <p className="px-4 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">
                    Management Protocol
                </p>
                {adminLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative group flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all overflow-hidden"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-white shadow-xl shadow-white/5"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <svg
                                className={`relative z-10 w-5 h-5 transition-colors duration-300 ${isActive ? 'text-slate-950' : 'text-slate-500 group-hover:text-white'}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                {link.icon}
                            </svg>

                            <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-slate-950' : 'text-slate-500 group-hover:text-white'}`}>
                                {link.name}
                            </span>

                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* --- 3. SYSTEM EXIT --- */}
            <div className="p-6 border-t border-white/5">
                <Link
                    href="/"
                    className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <span>Exit Terminal</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </Link>

                <div className="mt-6 px-5 flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">System Online</span>
                </div>
            </div>
        </aside>
    )
}