'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { COMPANY, NAV_LINKS } from '@/lib/constants'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled
                ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4'
                : 'bg-transparent py-8'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10  rounded-xl flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <span className="text-slate-950 font-bold text-xl">
                            <img src="/logo.png" alt="" className="w-10 h-auto"/>
                        </span>
                    </div>
                    <span className="font-bold text-white tracking-tight text-xl uppercase">
                        {COMPANY.name}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-[13px] tracking-widest font-semibold transition-all hover:text-emerald-400 uppercase ${
                                    isActive ? 'text-emerald-400' : 'text-slate-400'
                                }`}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                </div>

                {/* Buttons */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="text-sm text-white bg-emerald-600 px-7 py-2.5 rounded-lg font-semibold hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
                    >
                        Get Started
                    </Link>
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