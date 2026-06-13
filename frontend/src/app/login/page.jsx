'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [needsPasswordChange, setNeedsPasswordChange] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [changingPassword, setChangingPassword] = useState(false)
    const [changeError, setChangeError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setChangeError('')
        if (newPassword.length < 6) { setChangeError('Password must be at least 6 characters.'); return }
        if (newPassword !== confirmNewPassword) { setChangeError('Passwords do not match.'); return }
        setChangingPassword(true)

        const storedUsers = localStorage.getItem('registeredUsers')
        if (storedUsers) {
            const allUsers = JSON.parse(storedUsers)
            const updated = allUsers.map(u => {
                if (u.email === currentUser.email) return { ...u, password: newPassword, passwordChangeRequired: false }
                return u
            })
            localStorage.setItem('registeredUsers', JSON.stringify(updated))
        }

        const updatedUser = { ...currentUser, password: newPassword, passwordChangeRequired: false }
        const fakeToken = btoa(JSON.stringify({ email: updatedUser.email, role: updatedUser.role || 'investor', fullName: updatedUser.fullName }))
        localStorage.setItem('token', fakeToken)
        localStorage.setItem('user', JSON.stringify(updatedUser))

        setChangingPassword(false)
        setNeedsPasswordChange(false)
        setSuccess(true)
        setTimeout(() => {
            if (updatedUser.role === 'admin' || updatedUser.role === 'staff') router.push('/admin')
            else router.push('/properties')
        }, 1500)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email: formData.email.trim(), password: formData.password }),
            })
            const data = await response.json()

            if (response.ok) {
                if (data.user?.status === 'suspended') {
                    setError('Your account has been suspended. Please contact support.')
                    setLoading(false)
                    return
                }
                if (data.user?.passwordChangeRequired === true) {
                    setCurrentUser(data.user)
                    setNeedsPasswordChange(true)
                    setLoading(false)
                    return
                }
                localStorage.setItem('token', data.token || data.accessToken)
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
                setSuccess(true)
                setTimeout(() => {
                    if (data.user?.role === 'admin' || data.user?.role === 'staff') router.push('/admin')
                    else router.push('/properties')
                }, 1500)
                return
            }
            throw new Error(data.error?.message || data.message || 'Invalid credentials')
        } catch (err) {
            const storedUsers = localStorage.getItem('registeredUsers')
            const allUsers = storedUsers ? JSON.parse(storedUsers) : []
            const localUser = allUsers.find(u => u.email === formData.email.trim() && u.password === formData.password)

            if (localUser) {
                if (localUser.status === 'suspended') { setError('Account suspended.'); setLoading(false); return }
                if (localUser.passwordChangeRequired === true) {
                    setCurrentUser(localUser)
                    setNeedsPasswordChange(true)
                    setLoading(false)
                    return
                }
                const fakeToken = btoa(JSON.stringify({ email: localUser.email, role: localUser.role || 'investor', fullName: localUser.fullName }))
                localStorage.setItem('token', fakeToken)
                localStorage.setItem('user', JSON.stringify({ ...localUser, role: localUser.role || 'investor', status: localUser.status || 'active' }))
                setSuccess(true)
                setTimeout(() => {
                    if (localUser.role === 'admin' || localUser.role === 'staff') router.push('/admin')
                    else router.push('/properties')
                }, 1500)
                return
            }

            const demoAccounts = [
                { email: 'admin@heavenark.test', password: 'AdminPass123', fullName: 'Admin User', role: 'admin', status: 'active' },
                { email: 'investor@heavenark.test', password: 'InvestorPass123', fullName: 'Demo Investor', role: 'investor', status: 'active' }
            ]
            const demoUser = demoAccounts.find(u => u.email === formData.email.trim() && u.password === formData.password)
            if (demoUser) {
                if (demoUser.status === 'suspended') { setError('Account suspended.'); setLoading(false); return }
                const fakeToken = btoa(JSON.stringify({ email: demoUser.email, role: demoUser.role, fullName: demoUser.fullName }))
                localStorage.setItem('token', fakeToken)
                localStorage.setItem('user', JSON.stringify(demoUser))
                setSuccess(true)
                setTimeout(() => { if (demoUser.role === 'admin') router.push('/admin'); else router.push('/properties') }, 1500)
                return
            }
            setError(err.message || 'Invalid email or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            <AnimatePresence>
                {needsPasswordChange && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] max-w-md w-full p-10 shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Change Your Password</h2>
                                <p className="text-sm text-slate-500 mt-2">Your account was created by an administrator. Please set a new password before continuing.</p>
                            </div>
                            {changeError && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold text-center mb-4">{changeError}</div>}
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div><label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">New Password</label><input type="password" placeholder="Min 6 characters" required minLength={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-amber-500" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                                <div><label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Confirm Password</label><input type="password" placeholder="Re-enter password" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-amber-500" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} /></div>
                                <button type="submit" disabled={changingPassword} className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest transition-all">{changingPassword ? 'Updating...' : 'Set New Password & Continue'}</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-grow relative flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[55vh] bg-[#020617] overflow-hidden">
                    <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" alt="Luxury Development" className="w-full h-full object-cover opacity-30 grayscale-[20%]" /><div className="absolute inset-0 bg-[#020617]/60" /></div>
                    <div className="absolute inset-0 opacity-[0.15] z-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`, backgroundSize: '44px 44px' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_70%)] z-20" />
                </div>
                <div className="w-full max-w-lg relative z-30">
                    <div className="text-center mb-10">
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mx-auto w-24 h-24 rounded-full border-4 border-white/10 p-1 bg-slate-950 shadow-[0_30px_60px_rgba(0,0,0,0.5)] mb-8 overflow-hidden"><img src="/logo.png" alt="Heaven Ark" className="w-full h-full object-cover rounded-full" /></motion.div>
                        <h1 className="text-4xl font-black text-white font-heading tracking-tighter mb-3">Investor Portal</h1>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]">Heaven Ark Properties</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-5 mb-8 flex items-center gap-5 border border-white/10 shadow-2xl">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30"><svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
                        <div className="flex flex-col"><span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Authorization Protocol</span><span className="text-[11px] text-white/90 font-bold uppercase tracking-wider">{success ? "Authentication Successful" : "End-to-End Encryption Active"}</span></div>
                    </div>
                    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-[3.5rem] border border-slate-100 p-10 md:p-14 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)]">
                        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 text-[11px] font-black uppercase tracking-widest rounded-lg">{error}</div>}
                        {success && <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-8 text-[11px] font-black uppercase tracking-widest rounded-lg">Identity Verified. Redirecting to Terminal...</div>}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3"><label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 ml-1">Identity (Email)</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-6 py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold tracking-tight" placeholder="investor@heavenark.com" /></div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-1"><label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">Security Key</label><Link href="#" className="text-[10px] uppercase font-black text-emerald-600 tracking-widest hover:underline">Recovery</Link></div>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full px-6 py-5 pr-14 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold tracking-tight" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1">
                                        {showPassword ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>) : (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>)}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading || success} className="w-full group relative mt-4"><div className={`absolute inset-0 ${success ? 'bg-emerald-400' : 'bg-emerald-500'} blur-2xl opacity-10 group-hover:opacity-30 transition-all duration-700`} /><div className={`${success ? 'bg-emerald-600' : 'bg-slate-950'} text-white font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] uppercase text-[11px] tracking-[0.4em]`}>{loading ? 'Processing...' : success ? 'Access Granted' : 'Grant Access'}</div></button>
                        </form>
                        <div className="mt-12 pt-10 border-t border-slate-100 text-center"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">New Institutional Partner?</p><Link href="/register" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-10 py-4 rounded-xl border border-slate-200 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 inline-block">Submit Inquiry</Link></div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}