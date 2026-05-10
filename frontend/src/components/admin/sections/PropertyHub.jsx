'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Fixed: Added motion import
import {
    Plus,
    MapPin,
    Layers,
    ImageIcon,
    EyeOff,
    CheckCircle,
    Clock,
    Ban,
    Settings2,
    Trash2,
    X
} from 'lucide-react'

export default function PropertyHub() {
    const [view, setView] = useState('list') // 'list' or 'create'

    return (
        <div className="space-y-12">
            {/* --- HEADER --- */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Inventory Control</span>
                    </div>
                    <h2 className="text-5xl font-black italic tracking-tighter text-white">Asset <span className="text-slate-800 text-6xl">Management</span></h2>
                </div>

                <button
                    onClick={() => setView(view === 'list' ? 'create' : 'list')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                >
                    {view === 'list' ? (
                        <> <Plus className="w-4 h-4" /> Create Property </>
                    ) : (
                        <> <X className="w-4 h-4" /> Cancel Entry </>
                    )}
                </button>
            </header>

            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <PropertyGrid />
                    </motion.div>
                ) : (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <CreatePropertyForm />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function PropertyGrid() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AdminLandCard
                title="Heaven Ark Phase 1"
                location="Epe, Lagos"
                price="2,500,000"
                size="600sqm"
                status="Available"
                image="/land-1.jpg"
            />
        </div>
    )
}

function AdminLandCard({ title, location, price, size, status, image }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-6 hover:border-emerald-500/30 transition-all group backdrop-blur-md">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image Section */}
                <div className="w-full md:w-56 h-56 rounded-[2.5rem] overflow-hidden relative border border-white/5">
                    <img src={image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 left-4 bg-emerald-600 text-[8px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                        {status}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold text-white italic">{title}</h3>
                            <button className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2 text-slate-500">
                                <MapPin className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-500/60">
                                <Layers className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{size}</span>
                            </div>
                        </div>
                    </div>

                    {/* STATUS CONTROLS */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        <StatusBtn label="Available" active={status === 'Available'} icon={<CheckCircle className="w-3 h-3" />} />
                        <StatusBtn label="Reserved" active={status === 'Reserved'} icon={<Clock className="w-3 h-3" />} />
                        <StatusBtn label="Sold" active={status === 'Sold'} icon={<Ban className="w-3 h-3" />} />
                        <StatusBtn label="Hidden" active={status === 'Hidden'} icon={<EyeOff className="w-3 h-3" />} />
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-xl font-bold text-white font-mono">₦{price}</p>
                        <div className="flex gap-4">
                            <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white flex items-center gap-2">
                                <ImageIcon className="w-3 h-3"/> Gallery
                            </button>
                            <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white flex items-center gap-2">
                                <Settings2 className="w-3 h-3"/> Features
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CreatePropertyForm() {
    return (
        <div className="max-w-5xl bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                    <AdminInput label="Property Title" placeholder="e.g. Heaven Ark Phase 3" />
                    <AdminInput label="Location" placeholder="e.g. Ibeju-Lekki, Lagos" />
                    <AdminInput label="Base Price (₦)" placeholder="2500000" />
                </div>
                <div className="space-y-6">
                     <AdminInput label="Plot Size" placeholder="e.g. 600sqm" />
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Overview / Description</label>
                        <textarea rows="5" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700" placeholder="Enter property details..." />
                    </div>
                </div>
            </div>

            <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center mb-10 hover:bg-white/[0.02] transition-all cursor-pointer group">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-4 group-hover:text-emerald-500 transition-colors" />
                <p className="text-slate-400 font-medium">Add Gallery Images (Up to 10)</p>
            </div>

            <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-emerald-600/20">
                Initialize Asset
            </button>
        </div>
    )
}

function AdminInput({ label, placeholder }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{label}</label>
            <input type="text" placeholder={placeholder} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700 font-medium text-white" />
        </div>
    )
}

function StatusBtn({ label, active, icon }) {
    return (
        <button className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
            ${active
            ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
            : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}
        `}>
            {icon} {label}
        </button>
    )
}