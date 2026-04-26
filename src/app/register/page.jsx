'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Pro SVG Icons for input fields
const InputIcon = {
    User: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
    ),
    Email: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Phone: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    Lock: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    )
}

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1) // Multistep handling

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Account Passwords mismatched')
            return
        }

        setLoading(true)

        try {
            // Simulated handshake
            await new Promise(resolve => setTimeout(resolve, 1800))
            alert('Registration request queued for verification.')
        } catch (err) {
            setError('Service Interruption. Submission failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow relative flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-hidden">

                {/* --- SHARP ARCHITECTURAL HEADER (Contrast Optimized) --- */}
                <div className="absolute top-0 left-0 w-full h-[55vh] bg-[#020617] overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/land-2.jpg" // Professional Aerial Land Shot
                            alt="Heaven Ark Holdings"
                            className="w-full h-full object-cover opacity-50 grayscale"
                        />
                        <div className="absolute inset-0 bg-[#020617]/50" />
                    </div>
                    {/* Technical Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.1] z-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                    {/* Atmospheric Spotlight */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)] z-20" />
                </div>

                {/* --- REGISTRATION INTERFACE --- */}
                <div className="w-full max-w-xl relative z-30">

                    {/* Brand Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mx-auto w-24 h-24 rounded-full border-4 border-white/10 p-1 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.5)] mb-8 overflow-hidden"
                        >
                            <img src="/logo.png" alt="Heaven Ark" className="w-full h-full object-cover rounded-full" />
                        </motion.div>

                        <h1 className="text-4xl font-black text-white font-heading tracking-tighter mb-3 leading-tight">
                            Investor Application
                        </h1>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.6em]">
                            Heaven Ark Properties
                        </p>
                    </div>

                    {/* Step Progress & Benefits */}
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-6 mb-8 border border-white/10 shadow-2xl flex items-center justify-between gap-6">
                        <div className="text-left">
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">Institutional Benefits</span>
                            <ul className="text-[11px] text-white/90 font-bold uppercase tracking-wider space-y-1">
                                <li>• Secured Asset Management</li>
                                <li>• Instant Document Access</li>
                            </ul>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-4 border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <span className="text-3xl font-black">0{step}</span>
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
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 text-[11px] font-black uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-400 border-b border-slate-100 pb-4 mb-8">Personal Identification</h3>
                                        <InputField id="fullName" label="Legal Full Name" type="text" placeholder="John Doe" value={formData.fullName} Icon={InputIcon.User} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                                        <InputField id="email" label="Official Email" type="email" placeholder="investor@heavenark.com" value={formData.email} Icon={InputIcon.Email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                        <InputField id="phone" label="Primary Phone" type="tel" placeholder="+234 800 000 0000" value={formData.phone} Icon={InputIcon.Phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                        <button type="button" onClick={nextStep} className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.4em] active:scale-95 transition-all">Continue Verification</button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-6"
                                    >
                                        <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-400 border-b border-slate-100 pb-4 mb-8">Account Security</h3>
                                        <InputField id="password" label="Account Password" type="password" placeholder="••••••••" value={formData.password} Icon={InputIcon.Lock} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                        <InputField id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" value={formData.confirmPassword} Icon={InputIcon.Lock} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />

                                        {/* Terms Compliance */}
                                        <label className="flex items-start gap-3 pl-1 pt-2">
                                            <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500" />
                                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wide leading-tight">
                                                I confirm adherence to the{' '}
                                                <Link href="/terms" className="text-emerald-600 hover:underline">Terms</Link>
                                                {' '}and the{' '}
                                                <Link href="/privacy" className="text-emerald-600 hover:underline">Data Policy</Link>
                                            </span>
                                        </label>

                                        <div className="flex gap-4 pt-4">
                                            <button type="button" onClick={prevStep} className="bg-slate-50 text-slate-500 px-6 rounded-2xl font-bold text-sm">Back</button>
                                            <button type="submit" disabled={loading} className="flex-grow bg-slate-950 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.4em] active:scale-95 transition-all">
                                                {loading ? 'Authorizing Request...' : 'Finalize Application'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>

                        {/* Login Link */}
                        <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">
                                Established Account?
                            </p>
                            <Link
                                href="/login"
                                className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-10 py-4 rounded-xl border border-slate-200 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 inline-block"
                            >
                                Secure Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

// Sub-component for clean, consistent inputs
function InputField({ id, label, type, placeholder, value, onChange, Icon }) {
    return (
        <div className="space-y-3 relative">
            <label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 opacity-80 z-10">
                    <Icon />
                </div>
                <input
                    id={id}
                    type={type}
                    required
                    value={value}
                    onChange={onChange}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-900 font-bold tracking-tight text-sm"
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}