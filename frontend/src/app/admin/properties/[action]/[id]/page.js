'use client'

import React, { useState } from 'react'
import { Save, ArrowLeft, ImagePlus, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function LandEditor() {
    const params = useParams()
    const isEdit = params.action === 'edit'

    const [success, setSuccess] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-12 text-left pb-40">
            {/* TOP BAR */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div className="space-y-2">
                    <Link href="/admin/properties" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-emerald-500 transition-all mb-4">
                        <ArrowLeft className="w-3 h-3" /> Back to Assets
                    </Link>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                        {isEdit ? 'Modify' : 'Register'} <span className="text-emerald-900 text-5xl">Land</span>
                    </h2>
                </div>

                <button
                    onClick={handleSubmit}
                    className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-950/20 flex items-center gap-3"
                >
                    {success ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {success ? 'Asset Saved' : 'Commit Changes'}
                </button>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    {/* Basic Info */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">1. Basic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <AdminInput label="Land Title" placeholder="Heaven Ark Phase 1" />
                            <AdminInput label="Location / Landmark" placeholder="Beside Epe Resort" />
                            <AdminInput label="City" placeholder="Epe" />
                            <AdminInput label="State" placeholder="Lagos" />
                        </div>
                    </section>

                    {/* Financials */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">2. Pricing & Size</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <AdminInput label="Total Price (₦)" placeholder="5,500,000" />
                            <AdminInput label="Size" placeholder="500 SQM" />
                            <AdminInput label="Legal Status" placeholder="C of O / Deed" />
                        </div>
                    </section>

                    {/* Description */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">3. Narrative Overview</h3>
                        <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xs font-bold text-white h-40 focus:border-emerald-500/50 outline-none" placeholder="Explain the value proposition, soil type, and neighborhood..."></textarea>
                    </section>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 block mb-4">Main Cover Image</label>
                            <div className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all">
                                <ImagePlus className="w-8 h-8 mb-2" />
                                <span className="text-[8px] font-black uppercase">Upload Image</span>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 block mb-4">Land Features</label>
                            <div className="space-y-2">
                                <FeatureTag label="Perimeter Fencing" />
                                <FeatureTag label="Good Road Network" />
                                <FeatureTag label="Instant Allocation" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

function AdminInput({ label, placeholder }) {
    return (
        <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-2">{label}</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold text-white focus:border-emerald-500/50 outline-none" placeholder={placeholder} />
        </div>
    )
}

function FeatureTag({ label }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 accent-emerald-500 bg-white/5" />
            <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-white">{label}</span>
        </label>
    )
}