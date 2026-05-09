'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Phone,
    Mail,
    ShieldCheck,
    Camera,
    Check,
    Lock,
    Save
} from 'lucide-react'

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false)
    const [profile, setProfile] = useState({
        fullName: 'Verified Investor',
        phone: '+234 805 867 8439',
        email: 'investor@heavenark.com',
        accountID: 'ARK-99201-PR'
    })

    const handleUpdate = (e) => {
        e.preventDefault()
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-12 text-left min-h-screen bg-[#020617]">

            {/* --- HEADER --- */}
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Investor Account</span>
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                    Personal <span className="text-emerald-900 text-5xl">Profile</span>
                </h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* --- LEFT: AVATAR & ID --- */}
                <div className="space-y-6">
                    <div className="p-10 rounded-[3.5rem] bg-emerald-500/[0.03] border border-emerald-500/20 flex flex-col items-center text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.02)]">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-emerald-900 rounded-[2.5rem] flex items-center justify-center text-emerald-500 font-black text-4xl border-2 border-emerald-500/20 shadow-2xl">
                                {profile.fullName.charAt(0)}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl border-4 border-[#020617] hover:bg-emerald-500 transition-all">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{profile.fullName}</h3>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">ID: {profile.accountID}</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center gap-4">
                        <Lock className="w-8 h-8 text-slate-800" />
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Privacy Secured</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase">End-to-End Encrypted</p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: FORM --- */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleUpdate} className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileInput
                                label="Full Name"
                                icon={<User className="w-4 h-4" />}
                                value={profile.fullName}
                                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                            />
                            <ProfileInput
                                label="Phone Number"
                                icon={<Phone className="w-4 h-4" />}
                                value={profile.phone}
                                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            />
                            <div className="md:col-span-2">
                                <ProfileInput
                                    label="Email Address"
                                    icon={<Mail className="w-4 h-4" />}
                                    value={profile.email}
                                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
                            >
                                {isSaving ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Save Profile Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

/* --- COMPONENTS --- */

function ProfileInput({ label, icon, value, onChange }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-2">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-emerald-500 transition-colors">
                    {icon}
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
            </div>
        </div>
    )
}