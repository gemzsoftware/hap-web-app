'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Map,
    CreditCard,
    FileText,
    Bell,
    LifeBuoy,
    User,
    Menu,
    X,
    LogOut,
    Search,
    Globe,
    ArrowLeft,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Lands', href: '/dashboard/lands', icon: Map },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export default function DashboardLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const pathname = usePathname()
    const notifRef = useRef(null)

    // Mock Notifications Data
    const notifications = [
        { id: 1, title: 'Payment Confirmed', desc: 'Installment for Heaven Ark Phase 1 received.', time: '2h ago', type: 'success' },
        { id: 2, title: 'Document Ready', desc: 'Your Deed of Assignment is ready for download.', time: '5h ago', type: 'info' },
        { id: 3, title: 'Upcoming Payment', desc: 'Your next installment is due in 3 days.', time: '1d ago', type: 'warning' },
    ]

    // Close notifications dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-heading selection:bg-emerald-500/30">

            {/* --- 1. SIDEBAR (DESKTOP) --- */}
            <aside className="hidden lg:flex flex-col w-[280px] fixed inset-y-0 left-0 bg-slate-950/40 border-r border-white/5 z-50 backdrop-blur-2xl">

                {/* LOGO / EXIT TERMINAL */}
                <div className="p-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/20 group-hover:rotate-6 transition-all">
                            <span className="text-white font-black text-xl italic">H</span>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-black text-white leading-none tracking-tighter text-lg uppercase group-hover:text-emerald-400 transition-colors">Heaven Ark</span>
                            <span className="text-[8px] font-black tracking-[0.3em] text-emerald-500 uppercase">Return to Site</span>
                        </div>
                    </Link>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 px-6 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                                    isActive
                                        ? 'text-emerald-400 bg-emerald-500/5'
                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,1)]"
                                    />
                                )}
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'group-hover:text-white transition-colors'}`} />
                                {item.name}
                            </Link>
                        )
                    })}

                    <div className="h-px bg-white/5 my-6 mx-4" />

                    <Link href="/" className="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors group">
                        <Globe className="w-4 h-4 group-hover:text-emerald-500" />
                        Main Website
                    </Link>
                </nav>

                {/* USER CARD */}
                <div className="p-6">
                    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
                            <img src="/avatar.jpg" alt="User" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white truncate">INVESTOR_014</p>
                            <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest italic">Verified</p>
                        </div>
                        <button className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- 2. TOP NAVBAR --- */}
            <header className="lg:pl-[280px] fixed top-0 w-full z-40 bg-slate-950/20 backdrop-blur-md border-b border-white/5">
                <div className="h-24 px-8 flex items-center justify-between">

                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white/5 rounded-xl text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-white italic tracking-tight capitalize">
                            {pathname.split('/').pop() || 'Overview'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* SEARCH */}
                        <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-emerald-500/50 transition-all group">
                            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
                            <input type="text" placeholder="Search Node..." className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-40 text-white placeholder:text-slate-700" />
                        </div>

                        {/* NOTIFICATION CENTER */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={`w-10 h-10 rounded-2xl border transition-all flex items-center justify-center relative ${
                                    isNotifOpen
                                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                                }`}
                            >
                                <Bell className="w-4 h-4" />
                                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#020617] shadow-sm animate-pulse" />
                            </button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute top-[120%] right-0 w-80 bg-[#020617]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">System Logs</span>
                                            <button className="text-[8px] font-black uppercase text-emerald-500">Mark Read</button>
                                        </div>

                                        <div className="max-h-[350px] overflow-y-auto">
                                            {notifications.map((n) => (
                                                <div key={n.id} className="p-6 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className={`text-[9px] font-black uppercase tracking-tighter ${
                                                            n.type === 'success' ? 'text-emerald-500' : 'text-amber-500'
                                                        }`}>
                                                            {n.title}
                                                        </span>
                                                        <span className="text-[8px] text-slate-500">{n.time}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-relaxed group-hover:text-slate-200">{n.desc}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <Link href="/dashboard/notifications" onClick={() => setIsNotifOpen(false)} className="block p-4 text-center text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors bg-white/5">
                                            View Archive
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- 3. MAIN CONTENT --- */}
            <main className="lg:pl-[280px] pt-24 min-h-screen">
                <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>

            {/* --- 4. MOBILE DRAWER --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] lg:hidden" />
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed inset-y-0 left-0 w-[80%] bg-slate-950 z-[70] lg:hidden p-10 border-r border-white/10">
                            <div className="flex justify-between items-center mb-16">
                                <span className="font-black text-white uppercase italic text-2xl">Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl"><X className="text-white w-6 h-6"/></button>
                            </div>
                            <nav className="space-y-6">
                                {NAV_ITEMS.map((item) => (
                                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}