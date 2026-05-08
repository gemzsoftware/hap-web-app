'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { COMPANY, NAV_LINKS } from '@/lib/constants'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [user, setUser] = useState(null)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
        setIsProfileOpen(false)
        window.location.href = '/'
    }

    const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'

    // Logic to determine where the "Dashboard" link goes
    const dashboardLink = user?.role === 'admin' ? '/admin' : '/dashboard'
    const dashboardLabel = user?.role === 'admin' ? 'Admin Portal' : 'Dashboard'

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled
                ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 py-4'
                : 'bg-transparent py-8'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <img src="/logo.png" alt="Logo" className="w-10 h-auto"/>
                    </div>
                    <span className="font-bold text-white tracking-tight text-xl uppercase">
                        {COMPANY.name}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-[11px] tracking-[0.2em] font-black transition-all hover:text-emerald-400 uppercase ${
                                pathname === link.href ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Dynamic Auth Section */}
                <div className="hidden md:flex items-center gap-6">
                    {!user ? (
                        <>
                            <Link href="/login" className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="text-[10px] text-white bg-emerald-600 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
                            >
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            {/* Premium Profile Trigger */}
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border border-white/20 shadow-xl ${
                                    user.role === 'admin'
                                        ? 'bg-gradient-to-tr from-red-600 to-orange-500 shadow-red-900/20'
                                        : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-900/20'
                                }`}>
                                    <span className="text-white font-black text-sm">{userInitial}</span>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-20 overflow-hidden"
                                        >
                                            {/* User Info Header */}
                                            <div className="px-5 py-5 border-b border-white/5 bg-white/5">
                                                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 ${
                                                    user.role === 'admin' ? 'text-red-500' : 'text-emerald-500'
                                                }`}>
                                                    {user.role === 'admin' ? 'System Administrator' : 'Investor Verified'}
                                                </p>
                                                <p className="text-sm text-white font-bold truncate mb-0.5">{user.fullName}</p>
                                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    href={dashboardLink}
                                                    className="flex items-center px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    {dashboardLabel}
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
                    <div className="w-6 h-5 flex flex-col justify-between">
                        <span className={`h-0.5 w-full bg-emerald-500 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`h-0.5 w-full bg-emerald-500 transition-all ${isOpen ? 'opacity-0' : ''}`} />
                        <span className={`h-0.5 w-full bg-emerald-500 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>
            </div>
        </nav>
    )
}