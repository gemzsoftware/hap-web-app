'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'

export default function SettingsPage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const [profile, setProfile] = useState({ fullName: '', email: '', phone: '' })
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            setProfile({ fullName: parsed.fullName || '', email: parsed.email || '', phone: parsed.phone || '' })
        }
        setLoading(false)
    }, [])

    const handleProfileUpdate = async (e) => {
        e.preventDefault(); setError(''); setSuccess(''); setSaving(true)
        try {
            const uu = { ...user, fullName: profile.fullName, phone: profile.phone }
            localStorage.setItem('user', JSON.stringify(uu)); setUser(uu)
            const su = localStorage.getItem('registeredUsers')
            if (su) { const au = JSON.parse(su); const up = au.map(u => u.email === user.email ? { ...u, fullName: profile.fullName, phone: profile.phone } : u); localStorage.setItem('registeredUsers', JSON.stringify(up)) }
            setSuccess('Profile updated.'); setTimeout(() => setSuccess(''), 3000)
        } catch (err) { setError('Failed to update profile.') } finally { setSaving(false) }
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault(); setError(''); setSuccess('')
        if (passwords.newPassword !== passwords.confirmPassword) { setError('New passwords do not match.'); return }
        if (passwords.newPassword.length < 6) { setError('New password must be at least 6 characters.'); return }

        // Find current password
        const su = localStorage.getItem('registeredUsers')
        let currentPass = null
        if (su) {
            const au = JSON.parse(su)
            const lu = au.find(u => u.email === user?.email)
            if (lu) currentPass = lu.password
        }
        if (!currentPass && user?.password) currentPass = user.password

        // Only validate if we have a stored password to compare against
        if (currentPass && currentPass !== passwords.currentPassword) {
            setError('Current password is incorrect.'); return
        }

        setSaving(true)
        try {
            if (su) { const au = JSON.parse(su); const up = au.map(u => u.email === user?.email ? { ...u, password: passwords.newPassword, passwordChangeRequired: false } : u); localStorage.setItem('registeredUsers', JSON.stringify(up)) }
            const uu = { ...user, password: passwords.newPassword }; localStorage.setItem('user', JSON.stringify(uu)); setUser(uu)
            setSuccess('Password changed.'); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); setTimeout(() => setSuccess(''), 3000)
        } catch (err) { setError('Failed to update password.') } finally { setSaving(false) }
    }

    if (loading) return (<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>)

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
                <div><h1 className="text-4xl font-bold tracking-tight">Account Settings</h1><p className="text-slate-400 text-sm mt-2">Manage your profile and security</p></div>
                {success && <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-sm"><CheckCircle2 className="w-5 h-5" /> {success}</div>}
                {error && <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm"><AlertCircle className="w-5 h-5" /> {error}</div>}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-8"><div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><User className="w-5 h-5" /></div><div><h2 className="text-xl font-semibold">Profile</h2></div></div>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="space-y-2"><label className="text-xs text-slate-400 uppercase">Full Name</label><input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} required className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-emerald-500/50" /></div>
                        <div className="space-y-2"><label className="text-xs text-slate-400 uppercase">Email</label><input type="email" value={profile.email} disabled className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm text-slate-500 cursor-not-allowed" /></div>
                        <div className="space-y-2"><label className="text-xs text-slate-400 uppercase">Phone</label><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-emerald-500/50" /></div>
                        <button type="submit" disabled={saving} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-2xl font-semibold text-sm">{saving ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Save Changes'}</button>
                    </form>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-8"><div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400"><Lock className="w-5 h-5" /></div><div><h2 className="text-xl font-semibold">Change Password</h2></div></div>
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="space-y-2"><label className="text-xs text-slate-400 uppercase">Current Password</label><div className="relative"><input type={showCurrentPassword ? "text" : "password"} value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required placeholder="Enter current password" className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 pr-12 text-sm text-white outline-none focus:border-amber-500/50 placeholder:text-slate-600" /><button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1">{showCurrentPassword ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>) : (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>)}</button></div></div>
                        <div className="space-y-2"><label className="text-xs text-slate-400 uppercase">New Password</label><div className="relative"><input type={showNewPassword ? "text" : "password"} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={6} placeholder="Min 6 characters" className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 pr-12 text-sm text-white outline-none focus:border-amber-500/50 placeholder:text-slate-600" /><button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1">{showNewPassword ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>) : (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>)}</button></div></div>
                        <div className="space-y-2"><label className="text-xs text-slate-400 uppercase">Confirm Password</label><div className="relative"><input type={showConfirmPassword ? "text" : "password"} value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required placeholder="Re-enter new password" className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 pr-12 text-sm text-white outline-none focus:border-amber-500/50 placeholder:text-slate-600" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1">{showConfirmPassword ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>) : (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>)}</button></div></div>
                        <button type="submit" disabled={saving} className="px-8 py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white rounded-2xl font-semibold text-sm">{saving ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Update Password'}</button>
                    </form>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <div className="text-sm text-slate-400">Status: <span className="text-emerald-400 font-semibold capitalize">{user?.status || 'active'}</span> • Role: <span className="text-emerald-400 font-semibold capitalize">{user?.role || 'investor'}</span></div>
                </motion.div>
            </div>
        </div>
    )
}