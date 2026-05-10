'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

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

export default function DashboardSidebar({ user }) {
    const pathname = usePathname()

    return (
        <aside className="w-72 bg-[#020617] min-h-screen hidden lg:flex flex-col border-r border-white/5">
            {/* --- INSTITUTIONAL BRANDING --- */}
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <div className="w-4 h-4 border-2 border-slate-950 rounded-sm" />
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter uppercase">Heaven Ark</span>
                </div>

                {/* --- USER IDENTITY --- */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-white/10">
                            <span className="text-white font-black text-sm uppercase">
                                {user?.fullName?.charAt(0) || 'A'}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-black text-white text-[11px] uppercase tracking-widest truncate">
                                {user?.fullName || 'Authorized User'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Verified Investor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PRIMARY NAVIGATION --- */}
            <nav className="flex-grow px-6 space-y-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 px-4">Ledger Control</p>
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group relative flex items-center gap-4 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                isActive
                                    ? 'bg-white text-slate-950 border-white'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                            }`}
                        >
                            <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-slate-950' : 'text-slate-500 group-hover:text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {link.icon}
                            </svg>
                            {link.name}

                            {isActive && (
                                <motion.div
                                    layoutId="activePill"
                                    className="absolute left-[-1.5rem] w-1.5 h-6 bg-emerald-500 rounded-r-full"
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* --- SECURITY FOOTER --- */}
            <div className="p-6 mt-auto">
                <div className="mb-4 px-4 py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest text-center">Secure Session: Active</p>
                </div>
                <button
                    onClick={() => console.log('Initiating Secure Logout...')}
                    className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-all border border-transparent hover:border-red-500/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Terminate
                </button>
            </div>
        </aside>
    )
}