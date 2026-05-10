'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, LandPlot, Users,
    Receipt, ShieldCheck, Building2,
    LogOut, Settings
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

// Sections
import PropertyHub from '@/components/admin/sections/PropertyHub'
import UserControl from '@/components/admin/sections/UserControl'
import TransactionLedger from '@/components/admin/sections/TransactionLedger'
import CompanySettings from '@/components/admin/sections/CompanySettings'

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState('properties')

    const menuItems = [
        { id: 'properties', label: 'Inventory Hub', icon: LandPlot },
        { id: 'users', label: 'User Control', icon: Users },
        { id: 'transactions', label: 'Finances & Docs', icon: Receipt },
        { id: 'company', label: 'Company Profile', icon: Building2 },
    ]

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex">
            <Navbar /> {/* Existing Navbar */}

            {/* --- ADMIN SIDEBAR --- */}
            <aside className="w-80 border-r border-white/5 pt-32 p-6 flex flex-col gap-2 sticky top-0 h-screen">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4 px-4">Management</p>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                            activeSection === item.id
                                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-900/20'
                                : 'text-slate-500 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </button>
                ))}

                <div className="mt-auto pt-6 border-t border-white/5">
                    <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all w-full">
                        <LogOut className="w-4 h-4" /> Exit Portal
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT VIEWPORT --- */}
            <main className="flex-1 pt-32 p-12 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeSection === 'properties' && <PropertyHub />}
                        {activeSection === 'users' && <UserControl />}
                        {activeSection === 'transactions' && <TransactionLedger />}
                        {activeSection === 'company' && <CompanySettings />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}