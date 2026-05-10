'use client'

import React, { useState } from 'react'
import {
    LayoutDashboard,
    Map,
    CreditCard,
    Users,
    FileStack,
    Bell,
    Ticket,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Globe
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const pathname = usePathname()

    const menu = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'Properties', path: '/admin/properties', icon: <Map className="w-4 h-4" /> },
        { name: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
        { name: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
        { name: 'Documents', path: '/admin/documents', icon: <FileStack className="w-4 h-4" /> },
        { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
        { name: 'Receipts', path: '/admin/receipts', icon: <Ticket className="w-4 h-4" /> },
    ]

    return (
        <div className="flex h-screen overflow-hidden bg-[#020617]">

            {/* --- FIXED STATIC SIDEBAR --- */}
            <aside className="hidden lg:flex w-72 flex-col bg-white/[0.03] border-r border-white/10 backdrop-blur-3xl fixed h-full left-0 top-0 z-50">
                <div className="px-8 pt-10 pb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-3xl flex items-center justify-center border border-emerald-400/30 shadow-xl shadow-emerald-500/20">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white italic tracking-tighter">HEAVEN ARK</h2>
                            <p className="text-[10px] font-bold text-emerald-500 tracking-[2px] uppercase">ADMIN PORTAL</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-8">
                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                                pathname === item.path
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}

                    <div className="pt-8 px-4">
                        <Link
                            href="/"
                            className="flex items-center justify-between px-6 py-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all group"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">Visit Main Site</span>
                            <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </Link>
                    </div>
                </nav>

                <div className="p-6 border-t border-white/10 mt-auto">
                    <button className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-3xl transition-all text-sm font-semibold">
                        <LogOut className="w-4 h-4" />
                        End Session
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col lg:ml-72 min-h-screen overflow-hidden">

                {/* --- NAVBAR --- */}
                <header className="h-24 md:h-28 flex items-center justify-between px-6 md:px-12 border-b border-white/10 bg-[#020617]/95 backdrop-blur-2xl z-40">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="lg:hidden p-4 bg-white/5 hover:bg-white/10 rounded-3xl text-white transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden md:flex items-center gap-3 bg-white/5 px-6 py-3 rounded-3xl border border-white/10">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-[2px] text-emerald-500">LIVE • GLOBAL NODE</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-4 bg-white/5 hover:bg-white/10 rounded-3xl text-slate-400 hover:text-white transition-all border border-white/5">
                            <Bell className="w-5 h-5" />
                            <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#020617]" />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold text-white">Super Admin</p>
                                <p className="text-[10px] text-emerald-600 font-medium">System Root</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-lg shadow-inner">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- MORE SPACIOUS CONTENT AREA --- */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 xl:p-16 max-w-[1480px] w-full mx-auto">
                    {children}
                </div>
            </main>

            {/* --- MOBILE MENU --- */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileOpen(false)} />

                    <aside className="absolute left-0 top-0 bottom-0 w-80 bg-[#020617] border-r border-white/10 p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-9 h-9 text-emerald-500" />
                                <h2 className="text-2xl font-black text-white italic">HEAVEN ARK</h2>
                            </div>
                            <button onClick={() => setIsMobileOpen(false)} className="p-3 text-slate-400">
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-6">
                            {menu.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center gap-4 text-base font-semibold py-3 px-2 transition-all ${
                                        pathname === item.path ? 'text-emerald-500' : 'text-slate-400'
                                    }`}
                                >
                                    {item.icon} {item.name}
                                </Link>
                            ))}
                        </nav>

                        <Link
                            href="/"
                            onClick={() => setIsMobileOpen(false)}
                            className="flex items-center gap-4 text-emerald-500 font-semibold pt-8 border-t border-white/10"
                        >
                            <Globe className="w-5 h-5" /> Visit Main Site
                        </Link>
                    </aside>
                </div>
            )}
        </div>
    )
}