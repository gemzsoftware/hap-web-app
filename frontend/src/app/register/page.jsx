'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

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
    const router = useRouter()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [step, setStep] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    password: formData.password
                }),
            })

            if (response.ok) {
                const data = await response.json()
                saveToLocalStorage(data.user || data)
                setSuccess(true)
                setTimeout(() => router.push('/login'), 2500)
                return
            }

            const data = await response.json()
            throw new Error(data.error?.message || data.message || 'Registration failed')

        } catch (err) {
            console.log('Backend registration skipped, saving locally')

            const storedUsers = localStorage.getItem('registeredUsers')
            const allUsers = storedUsers ? JSON.parse(storedUsers) : []
            const existingUser = allUsers.find(u => u.email === formData.email.trim())

            if (existingUser) {
                setError('An account with this email already exists.')
                setLoading(false)
                return
            }

            saveToLocalStorage()
            setSuccess(true)
            setTimeout(() => router.push('/login'), 2500)
        } finally {
            setLoading(false)
        }
    }

    const saveToLocalStorage = (backendUser = null) => {
        const newUser = {
            _id: backendUser?.id || `user_${Date.now()}`,
            id: backendUser?.id || `user_${Date.now()}`,
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            role: 'investor',
            status: 'active',
            source: backendUser ? 'backend' : 'local',
            // NO passwordChangeRequired for self-registered users
            createdAt: new Date().toISOString()
        }

        const storedUsers = localStorage.getItem('registeredUsers')
        const allUsers = storedUsers ? JSON.parse(storedUsers) : []
        allUsers.push(newUser)
        localStorage.setItem('registeredUsers', JSON.stringify(allUsers))
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow relative flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[55vh] bg-[#020617] overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src="/land-2.jpg" alt="Heaven Ark Holdings" className="w-full h-full object-cover opacity-50 grayscale" />
                        <div className="absolute inset-0 bg-[#020617]/50" />
                    </div>
                    <div className="absolute inset-0 opacity-[0.1] z-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)] z-20" />
                </div>

                <div className="w-full max-w-xl relative z-30">
                    <div className="text-center mb-10">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto w-24 h-24 rounded-full border-4 border-white/10 p-1 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.5)] mb-8 overflow-hidden">
                            <img src="/logo.png" alt="Heaven Ark" className="w-full h-full object-cover rounded-full" />
                        </motion.div>
                        <h1 className="text-4xl font-black text-white font-heading tracking-tighter mb-3 leading-tight">Investor Application</h1>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.6em]">Heaven Ark Properties</p>
                    </div>

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

                    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-[3.5rem] border border-slate-100 p-10 md:p-14 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)]">
                        {success ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-4">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">Registration Successful</h2>
                                <p className="text-slate-500 text-sm">Your account has been created. Redirecting to login...</p>
                            </motion.div>
                        ) : (
                            <>
                                {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 text-[11px] font-black uppercase tracking-widest text-center">{error}</div>}
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <AnimatePresence mode="wait">
                                        {step === 1 && (
                                            <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                                                <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-400 border-b border-slate-100 pb-4 mb-8">Personal Identification</h3>
                                                <InputField id="fullName" label="Legal Full Name" type="text" placeholder="John Doe" value={formData.fullName} Icon={InputIcon.User} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                                                <InputField id="email" label="Official Email" type="email" placeholder="investor@heavenark.com" value={formData.email} Icon={InputIcon.Email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                                <InputField id="phone" label="Primary Phone" type="tel" placeholder="+234 800 000 0000" value={formData.phone} Icon={InputIcon.Phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                                <button type="button" onClick={nextStep} className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.4em] active:scale-95 transition-all">Continue Verification</button>
                                            </motion.div>
                                        )}
                                        {step === 2 && (
                                            <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                                <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-400 border-b border-slate-100 pb-4 mb-8">Account Security</h3>
                                                <div className="space-y-3 relative">
                                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-1">Account Password</label>
                                                    <div className="relative">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 opacity-80 z-10"><InputIcon.Lock /></div>
                                                        <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-16 pr-14 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold tracking-tight text-sm" placeholder="••••••••" />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1">
                                                            {showPassword ? (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 relative">
                                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-1">Confirm Password</label>
                                                    <div className="relative">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 opacity-80 z-10"><InputIcon.Lock /></div>
                                                        <input type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full pl-16 pr-14 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold tracking-tight text-sm" placeholder="••••••••" />
                                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1">
                                                            {showConfirmPassword ? (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <label className="flex items-start gap-3 pl-1 pt-2">
                                                    <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500" />
                                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wide leading-tight">I confirm adherence to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms</Link> and the <Link href="/privacy" className="text-emerald-600 hover:underline">Data Policy</Link></span>
                                                </label>
                                                <div className="flex gap-4 pt-4">
                                                    <button type="button" onClick={prevStep} className="bg-slate-50 text-slate-500 px-6 rounded-2xl font-bold text-sm">Back</button>
                                                    <button type="submit" disabled={loading} className="flex-grow bg-slate-950 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.4em] active:scale-95 transition-all">{loading ? 'Creating Account...' : 'Finalize Application'}</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </>
                        )}
                        <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Established Account?</p>
                            <Link href="/login" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-10 py-4 rounded-xl border border-slate-200 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 inline-block">Secure Login</Link>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

function InputField({ id, label, type, placeholder, value, onChange, Icon }) {
    return (
        <div className="space-y-3 relative">
            <label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-1">{label}</label>
            <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 opacity-80 z-10"><Icon /></div>
                <input id={id} type={type} required value={value} onChange={onChange} className="w-full pl-16 pr-6 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-900 font-bold tracking-tight text-sm" placeholder={placeholder} />
            </div>
        </div>
    )
}