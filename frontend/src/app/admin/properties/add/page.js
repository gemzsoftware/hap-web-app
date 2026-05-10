'use client'

import React, { useState } from 'react'
import {
    Save,
    ArrowLeft,
    ImagePlus,
    CheckCircle,
    Info,
    MapPin,
    LandPlot,
    ShieldCheck,
    Layers
} from 'lucide-react'
import Link from 'next/link'

export default function AddProperty() {
    const [status, setStatus] = useState('Available')
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = (e) => {
        e.preventDefault()
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            alert("Property Initialized Successfully")
        }, 1500)
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 text-left pb-40">

            {/* --- TOP NAVIGATION BAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <Link href="/admin/properties" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-emerald-500 transition-all mb-4">
                        <ArrowLeft className="w-3 h-3" /> Back to Land Folio
                    </Link>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                        Initialize <span className="text-emerald-900 text-5xl">Asset</span>
                    </h2>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full md:w-auto px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? "Syncing..." : <><Save className="w-4 h-4" /> Deploy Property</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* --- LEFT COLUMN: MAIN FORM DATA --- */}
                <div className="lg:col-span-2 space-y-12">

                    {/* SECTION 1: IDENTITY */}
                    <FormSection icon={<Info className="w-4 h-4" />} title="Property Identity">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminInput label="Project Name" placeholder="e.g. Heaven Ark Phase 2" />
                            <AdminInput label="Legal Title" placeholder="e.g. C of O / Governors Consent" />
                            <div className="md:col-span-2">
                                <AdminInput label="Full Address / Landmark" placeholder="Beside Alaro City, Ibeju-Lekki" />
                            </div>
                            <AdminInput label="City" placeholder="Ibeju-Lekki" />
                            <AdminInput label="State" placeholder="Lagos" />
                        </div>
                    </FormSection>

                    {/* SECTION 2: DIMENSIONS & FINANCE */}
                    <FormSection icon={<Layers className="w-4 h-4" />} title="Dimensions & Value">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AdminInput label="Total Valuation (₦)" placeholder="12,500,000" />
                            <AdminInput label="Size (SQM)" placeholder="500" />
                            <AdminInput label="Installment Plan (₦/mo)" placeholder="1,200,000" />
                        </div>
                    </FormSection>

                    {/* SECTION 3: MEDIA ASSETS */}
                    <FormSection icon={<ImagePlus className="w-4 h-4" />} title="Visual Assets">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Main Uploader */}
                            <div className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-slate-800 hover:border-emerald-500/40 hover:bg-emerald-500/5 cursor-pointer transition-all group">
                                <ImagePlus className="w-8 h-8 mb-2 group-hover:text-emerald-500 transition-colors" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-center px-4">Upload Thumbnail</span>
                            </div>
                            {/* Gallery Slots */}
                            {[1,2,3].map(i => (
                                <div key={i} className="aspect-square bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center text-slate-900 font-black text-xl italic">
                                    0{i+1}
                                </div>
                            ))}
                        </div>
                    </FormSection>

                    {/* SECTION 4: NARRATIVE */}
                    <FormSection icon={<LandPlot className="w-4 h-4" />} title="Marketing Narrative">
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-xs font-bold text-white h-48 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-800"
                            placeholder="Describe the soil type, topography, and future ROI potential for investors..."
                        />
                    </FormSection>
                </div>

                {/* --- RIGHT COLUMN: STATUS & QUICK CONTROLS --- */}
                <div className="space-y-8">
                    <div className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-10 shadow-2xl backdrop-blur-sm">

                        {/* MARKET STATUS TOGGLE */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Market Availability</label>
                            </div>
                            <div className="space-y-3">
                                <StatusSelector label="Available" color="emerald" current={status} set={setStatus} />
                                <StatusSelector label="Reserved" color="orange" current={status} set={setStatus} />
                                <StatusSelector label="Sold Out" color="red" current={status} set={setStatus} />
                                <StatusSelector label="Hidden" color="slate" current={status} set={setStatus} />
                            </div>
                        </div>

                        <div className="h-[1px] bg-white/5" />

                        {/* FEATURES CHECKLIST */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-6 px-2">Key Infrastructure</label>
                            <div className="space-y-4 px-2">
                                <FeatureCheckbox label="Perimeter Fencing" />
                                <FeatureCheckbox label="Electricity Grid" />
                                <FeatureCheckbox label="Paved Roadways" />
                                <FeatureCheckbox label="Drainage System" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

/* --- UI COMPONENTS --- */

function FormSection({ icon, title, children }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">{icon}</div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{title}</h3>
            </div>
            {children}
        </div>
    )
}

function AdminInput({ label, placeholder }) {
    return (
        <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-4">{label}</label>
            <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:border-emerald-500/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-slate-800"
                placeholder={placeholder}
            />
        </div>
    )
}

function StatusSelector({ label, color, current, set }) {
    const isActive = current === label
    const colors = {
        emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500',
        orange: 'border-orange-500/40 bg-orange-500/10 text-orange-500',
        red: 'border-red-500/40 bg-red-500/10 text-red-500',
        slate: 'border-white/20 bg-white/5 text-slate-500'
    }

    return (
        <button
            onClick={() => set(label)}
            className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all font-black text-[10px] uppercase tracking-widest ${isActive ? colors[color] : 'border-white/5 bg-transparent text-slate-700 hover:border-white/20'}`}
        >
            {label}
            {isActive && <div className="w-2 h-2 rounded-full bg-current shadow-[0_0_10px_currentColor]" />}
        </button>
    )
}

function FeatureCheckbox({ label }) {
    return (
        <label className="flex items-center gap-4 cursor-pointer group">
            <input type="checkbox" className="w-5 h-5 accent-emerald-500 bg-white/5 border-white/10 rounded" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
        </label>
    )
}