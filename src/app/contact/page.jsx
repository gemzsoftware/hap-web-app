'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { COMPANY } from '@/lib/constants'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="bg-[#020617] min-h-screen selection:bg-emerald-500/30">
            <Navbar />

            <main className="relative">
                <div className="flex flex-col lg:flex-row min-h-screen">

                    {/* --- LEFT SIDE: THE ARCHITECTURAL MOOD --- */}
                    <section className="relative lg:w-5/12 h-[30vh] lg:h-screen overflow-hidden border-r border-white/5">
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000"
                                className="w-full h-full object-cover"
                                alt="Modern Estate"
                            />
                            {/* Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-slate-950/60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        </div>

                        <div className="relative h-full flex flex-col justify-end p-10 lg:p-20 z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                                    Secure your <br />
                                    <span className="italic font-light text-slate-400 text-3xl md:text-4xl">Private Holdings.</span>
                                </h1>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                                    {COMPANY.name} Corporate Division
                                </p>
                            </motion.div>
                        </div>
                    </section>

                    {/* --- RIGHT SIDE: GLASSMORPHISM WORKSPACE --- */}
                    <section className="relative lg:w-7/12 flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-hidden">

                        {/* Background Decorative Elements for Glassmorphism depth */}
                        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-600/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full max-w-2xl z-10"
                        >
                            {/* The Glass Card */}
                            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl">
                                <div className="mb-12">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">
                                            Priority Channel
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-serif text-white">Initialize Consultation</h2>
                                </div>

                                {submitted ? (
                                    <div className="py-16 text-center">
                                        <div className="text-5xl mb-6">✨</div>
                                        <h3 className="text-xl font-serif text-white mb-2">Request Transmitted</h3>
                                        <p className="text-slate-300 text-sm">Our officers are reviewing your parameters.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-transparent border-b border-white/10 py-4 text-white outline-none focus:border-emerald-500/50 transition-all text-sm placeholder:text-slate-400"
                                                    placeholder="Principal Name"
                                                />
                                                <label className="absolute -top-4 left-0 text-[9px] font-black uppercase tracking-widest text-white">Identification</label>
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-transparent border-b border-white/10 py-4 text-white outline-none focus:border-emerald-500/50 transition-all text-sm placeholder:text-slate-400"
                                                    placeholder="Email Address"
                                                />
                                                <label className="absolute -top-4 left-0 text-[9px] font-black uppercase tracking-widest text-white">Communications</label>
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full bg-transparent border-b border-white/10 py-4 text-white outline-none focus:border-emerald-500/50 transition-all text-sm resize-none placeholder:text-slate-400"
                                                placeholder="Specify property requirements or portfolio objectives..."
                                            />
                                            <label className="absolute -top-4 left-0 text-[9px] font-black uppercase tracking-widest text-white">Briefing Notes</label>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8">
                                            <div className="text-[9px] text-white font-medium tracking-wide uppercase">
                                                By submitting, you agree to our <br />
                                                <span className="text-slate-300">Professional Privacy Protocol.</span>
                                            </div>

                                            <button
                                                type="submit"
                                                className="relative group overflow-hidden bg-white text-slate-950 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:pr-14"
                                            >
                                                <span className="relative z-10">Transmit Request</span>
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">→</span>
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Minimal Legal Footer on the Glass side */}
                            <div className="mt-12 flex justify-between items-center px-8 text-[9px] font-black tracking-[0.2em] text-white uppercase">
                                <span>Ref: {COMPANY.rcNumber}</span>
                                <span>Verified Encryption</span>
                                <span>©{new Date().getFullYear()}</span>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}