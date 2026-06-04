'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
    CheckCircle2,
    XCircle,
    Clock,
    CheckCheck
} from 'lucide-react'
import { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } from '@/lib/notifications'
import { formatCurrency } from '@/lib/utils'

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Lands', href: '/dashboard/lands', icon: Map },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Support', href: '/dashboard/support', icon: LifeBuoy },
    { name: 'Profile', href: '/dashboard/settings', icon: User },

]

export default function DashboardLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const notifRef = useRef(null)

    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            loadNotifications(parsed)
        }

        const interval = setInterval(() => {
            const userData = localStorage.getItem('user')
            if (userData) loadNotifications(JSON.parse(userData))
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    const loadNotifications = (currentUser) => {
        const notifs = getUserNotifications(currentUser?.email)
        setNotifications(notifs.slice(0, 10))
        setUnreadCount(getUnreadCount(currentUser?.email))
    }

    const handleMarkRead = (id) => {
        markAsRead(id)
        const userData = localStorage.getItem('user')
        if (userData) loadNotifications(JSON.parse(userData))
    }

    const handleMarkAllRead = () => {
        if (user) {
            markAllAsRead(user.email)
            loadNotifications(user)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'payment_verified': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            case 'payment_declined': return <XCircle className="w-4 h-4 text-red-400" />
            case 'document_added': return <FileText className="w-4 h-4 text-blue-400" />
            case 'payment_pending': return <Clock className="w-4 h-4 text-amber-400" />
            default: return <Bell className="w-4 h-4 text-slate-400" />
        }
    }

    const getTimeAgo = (date) => {
        const now = new Date()
        const past = new Date(date)
        const diffMins = Math.floor((now - past) / 60000)
        const diffHours = Math.floor((now - past) / 3600000)
        const diffDays = Math.floor((now - past) / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return past.toLocaleDateString()
    }

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

                {/* LOGO */}
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
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                            {user?.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'IN'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white truncate">{user?.fullName || 'Investor'}</p>
                            <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest italic">Verified</p>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
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
                            {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* SEARCH */}
                        <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-emerald-500/50 transition-all group">
                            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
                            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-40 text-white placeholder:text-slate-700" />
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
                                {unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#020617]">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </div>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute top-[120%] right-0 w-80 md:w-96 bg-[#020617]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                                Notifications {unreadCount > 0 && `(${unreadCount})`}
                                            </span>
                                            {unreadCount > 0 && (
                                                <button onClick={handleMarkAllRead} className="text-[8px] font-black uppercase text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                                                    <CheckCheck className="w-3 h-3" /> Mark All Read
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-[350px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <Bell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                                    <p className="text-[10px] text-slate-500">No notifications yet</p>
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <button
                                                        key={n.id}
                                                        onClick={() => handleMarkRead(n.id)}
                                                        className={`w-full text-left p-6 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3 ${
                                                            !n.read ? 'bg-emerald-500/5' : ''
                                                        }`}
                                                    >
                                                        <div className="mt-0.5 flex-shrink-0">
                                                            {getNotificationIcon(n.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`text-[9px] font-black uppercase tracking-tighter ${
                                                                    n.type === 'payment_verified' ? 'text-emerald-400' :
                                                                        n.type === 'payment_declined' ? 'text-red-400' :
                                                                            n.type === 'payment_pending' ? 'text-amber-400' :
                                                                                'text-blue-400'
                                                                }`}>
                                                                    {n.title}
                                                                </span>
                                                                {!n.read && (
                                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 leading-relaxed">{n.message}</p>
                                                            {n.amount && (
                                                                <p className="text-[9px] font-bold text-emerald-400 mt-1">{formatCurrency(n.amount)}</p>
                                                            )}
                                                            <p className="text-[8px] text-slate-600 mt-1">{getTimeAgo(n.createdAt)}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>

                                        <Link href="/dashboard/notifications" onClick={() => setIsNotifOpen(false)} className="block p-4 text-center text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors bg-white/5">
                                            View All Notifications
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
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed inset-y-0 left-0 w-[80%] bg-slate-950 z-[70] lg:hidden p-10 border-r border-white/10 flex flex-col">
                            <div className="flex justify-between items-center mb-16">
                                <span className="font-black text-white uppercase italic text-2xl">Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl"><X className="text-white w-6 h-6"/></button>
                            </div>
                            <nav className="flex-1 space-y-6">
                                {NAV_ITEMS.map((item) => (
                                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <button onClick={handleLogout} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] text-red-400 hover:text-red-300 transition-colors mt-auto">
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}