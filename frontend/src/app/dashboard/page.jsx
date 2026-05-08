'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase,
    Bookmark,
    CreditCard,
    FileText,
    ShieldCheck,
    Wallet,
    CalendarClock,
    Scale,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

// Sub-components
import PortfolioTab from '@/components/dashboard/PortfolioTab'
import SavedTab from '@/components/dashboard/SavedTab'
import PaymentsTab from '@/components/dashboard/PaymentsTab'
import DocumentsTab from '@/components/dashboard/DocumentsTab'
import SettingsTab from '@/components/dashboard/SettingsTab' // Ensure this is created

const API_BASE_URL = 'http://localhost:5000/api'

const StatCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] flex-1 flex flex-col justify-between min-h-[220px] group hover:border-emerald-500/30 transition-all duration-500">
        <div className="flex items-start justify-between">
            <div className="space-y-2">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                    {label}
                </p>
                <div className={`h-1 w-6 rounded-full bg-emerald-500/40 group-hover:w-10 transition-all duration-500`} />
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
        </div>

        <div className="mt-auto">
            <p className="text-4xl font-medium tracking-tight text-slate-100 flex items-baseline">
                {unit === '₦' && (
                    <span className="text-slate-500 text-xl mr-1.5 font-light">₦</span>
                )}
                {value?.toLocaleString() || '0'}
                {unit === ' docs' && (
                    <span className="text-xs text-slate-500 ml-2 uppercase tracking-[0.2em] font-bold">
                        {unit}
                    </span>
                )}
            </p>
        </div>
    </div>
)

export default function InvestorTerminal() {
    const [activeTab, setActiveTab] = useState('portfolio')
    const [user, setUser] = useState(null)
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')

        if (storedUser) {
            setUser(JSON.parse(storedUser))
            const fetchSummary = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
                        headers: { 'Authorization': `Bearer ${storedToken}` }
                    })
                    const json = await res.json()
                    if (json.summary) setSummary(json.summary)
                } catch (err) {
                    console.error("Dashboard fetch error:", err)
                } finally {
                    setLoading(false)
                }
            }
            if (storedToken) fetchSummary()
        } else {
            setLoading(false)
        }
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        window.location.href = '/login'
    }

    const tabs = [
        { id: 'portfolio', label: 'Holdings', icon: Briefcase },
        { id: 'saved', label: 'Watchlist', icon: Bookmark },
        { id: 'payments', label: 'Transactions', icon: CreditCard },
        { id: 'documents', label: 'Legal Vault', icon: FileText }
    ]

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-emerald-500/30 overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/5 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">

                {/* --- HEADER WITH IDENTITY & ACTIONS --- */}
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="text-emerald-500 w-4 h-4" />
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]">Encrypted Investor Node</span>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                            Investor <span className="text-slate-800">Terminal</span>
                        </motion.h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* SYSTEM ACTIONS */}
                        <div className="flex items-center gap-2">
                            <button title="Support" className="p-4 bg-white/5 rounded-2xl border border-white/10 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all">
                                <HelpCircle className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`p-4 rounded-2xl border transition-all ${activeTab === 'settings' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>

                        {/* AUTH CARD */}
                        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 p-3 rounded-[2rem] pr-8 shadow-2xl relative group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
                                {user?.fullName?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Authenticated</p>
                                <p className="text-lg font-bold tracking-tight">{user?.fullName}</p>
                            </div>
                            <button onClick={handleLogout} className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <LogOut className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- STATS SECTION --- */}
                <section className="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-[220px] rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                        ))
                    ) : (
                        <>
                            <StatCard icon={Wallet} label="Total Investment" value={summary?.totalPaid} unit="₦" color="emerald" />
                            <StatCard icon={CreditCard} label="Outstanding Balance" value={summary?.outstandingBalance} unit="₦" color="blue" />
                            <StatCard icon={CalendarClock} label="Next Payment" value={summary?.nextPaymentDue?.amount} unit="₦" color="amber" />
                            <StatCard icon={Scale} label="Documents Secured" value={summary?.documentsAvailable} unit=" docs" color="teal" />
                        </>
                    )}
                </section>

                {/* --- TAB NAVIGATION --- */}
                <div className="flex flex-wrap gap-3 mb-12 p-2 bg-white/5 border border-white/5 rounded-[2.5rem] w-fit backdrop-blur-md">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                activeTab === tab.id
                                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* --- TAB VIEWPORT --- */}
                <div className="min-h-[50vh]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                        >
                            {activeTab === 'portfolio' && <PortfolioTab />}
                            {activeTab === 'saved' && <SavedTab />}
                            {activeTab === 'payments' && <PaymentsTab />}
                            {activeTab === 'documents' && <DocumentsTab />}
                            {activeTab === 'settings' && <SettingsTab />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}