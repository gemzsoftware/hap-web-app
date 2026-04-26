'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            alert('Identity verified. Accessing Heaven Ark secure nodes...')
        } catch (err) {
            setError('Access Denied. Please verify your investor credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow relative flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-hidden">

                {/* --- SHARP ARCHITECTURAL HEADER (No White Gradient) --- */}
                <div className="absolute top-0 left-0 w-full h-[55vh] bg-[#020617] overflow-hidden">

                    {/* 1. Background Image with Deep Contrast */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
                            alt="Luxury Development"
                            className="w-full h-full object-cover opacity-30 grayscale-[20%]"
                        />
                        {/* Solid Dark Overlay for Navbar Contrast */}
                        <div className="absolute inset-0 bg-[#020617]/60" />
                    </div>

                    {/* 2. Technical Dot-Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.15] z-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
                            backgroundSize: '44px 44px'
                        }}
                    />

                    {/* 3. Central Atmospheric Spotlight */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_70%)] z-20" />
                </div>

                {/* --- LOGIN INTERFACE --- */}
                <div className="w-full max-w-lg relative z-30">

                    {/* Brand Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mx-auto w-24 h-24 rounded-full border-4 border-white/10 p-1 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.5)] mb-8 overflow-hidden"
                        >
                            <img
                                src="/logo.png"
                                alt="Heaven Ark"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </motion.div>

                        <h1 className="text-4xl font-black text-white font-heading tracking-tighter mb-3">
                            Investor Portal
                        </h1>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]">
                            Heaven Ark Properties
                        </p>
                    </div>

                    {/* Glassmorphic Security Banner */}
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-5 mb-8 flex items-center gap-5 border border-white/10 shadow-2xl">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Authorization Protocol</span>
                            <span className="text-[11px] text-white/90 font-bold uppercase tracking-wider">End-to-End Encryption Active</span>
                        </div>
                    </div>

                    {/* Main Auth Card */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[3.5rem] border border-slate-100 p-10 md:p-14 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)]"
                    >
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 text-[11px] font-black uppercase tracking-widest">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-1">Identity (Email)</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold tracking-tight"
                                    placeholder="investor@heavenark.com"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">Security Key</label>
                                    <Link href="#" className="text-[10px] uppercase font-black text-emerald-600 tracking-widest hover:underline">Recovery</Link>
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-6 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold tracking-tight"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative mt-4"
                            >
                                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-10 group-hover:opacity-30 transition-all duration-700" />
                                <div className="relative bg-slate-950 text-white font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] uppercase text-[11px] tracking-[0.4em]">
                                    {loading ? 'Processing...' : 'Grant Access'}
                                </div>
                            </button>
                        </form>

                        <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">
                                New Institutional Partner?
                            </p>
                            <Link
                                href="/register"
                                className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-10 py-4 rounded-xl border border-slate-200 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 inline-block"
                            >
                                Submit Inquiry
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}