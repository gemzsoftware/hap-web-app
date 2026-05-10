'use client'

import React, { useState } from 'react'
import {
    Plus, Search, MoreVertical, MapPin,
    Trash2, Edit3, CheckCircle2, Bookmark, Ban, EyeOff
} from 'lucide-react'
import Link from 'next/link'

export default function PropertyManager() {
    const [activeMenu, setActiveMenu] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')

    const [properties, setProperties] = useState([
        { id: 'HA-P1-01', title: 'Heaven Ark Phase 1', city: 'Epe', status: 'Available', price: '₦5.5M', image: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800' },
        { id: 'HA-P2-04', title: 'Heritage Extension', city: 'Ibeju', status: 'Reserved', price: '₦12.5M', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
        { id: 'HA-P3-09', title: 'The Palms Estate', city: 'Lekki', status: 'Sold Out', price: '₦45M', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' }
    ])

    const filteredProperties = properties.filter(prop => {
        const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prop.city.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === 'All' || prop.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const updateStatus = (id, newStatus) => {
        setProperties(properties.map(p => p.id === id ? { ...p, status: newStatus } : p))
        setActiveMenu(null)
    }

    const deleteProperty = (id) => {
        if (confirm("Permanently delete this land?")) {
            setProperties(properties.filter(p => p.id !== id))
        }
        setActiveMenu(null)
    }

    return (
        <div className="min-h-screen bg-[#020617] pb-20 text-white font-sans">
            <div className="max-w-7xl mx-auto px-6 pt-10 space-y-12">

                {/* --- HEADER --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                    <div className="space-y-3">
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Inventory Control</p>
                        <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                            LAND <span className="text-emerald-900 text-8xl">FOLIO</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-bold italic">Global Real Estate Asset Management</p>
                    </div>

                    <Link href="/admin/properties/add">
                        <button className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-emerald-950/20">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            ADD NEW ASSET
                        </button>
                    </Link>
                </div>

                {/* --- SEARCH & FILTERS --- */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-emerald-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/10 pl-16 py-5 rounded-[2rem] text-sm font-bold text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all"
                        />
                    </div>

                    <div className="flex gap-2">
                        {['All', 'Available', 'Reserved', 'Sold Out'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all border ${filterStatus === status
                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                                    : 'bg-white/[0.02] border-white/5 text-slate-600 hover:text-white'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- DESKTOP TABLE (Breakout Menu Capable) --- */}
                <div className="hidden md:block bg-white/[0.01] border border-white/5 rounded-[3.5rem] shadow-2xl overflow-visible">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-10 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Property Preview</th>
                            <th className="px-8 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Valuation</th>
                            <th className="px-8 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Status</th>
                            <th className="px-8 py-10 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredProperties.map((prop) => (
                            <tr key={prop.id} className="group hover:bg-white/[0.02] transition-all duration-300">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                                            <img
                                                src={prop.image}
                                                alt={prop.title}
                                                className="w-full h-full object-cover group-hover:scale-110 duration-700 transition-transform"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xl italic uppercase tracking-tighter text-white">{prop.title}</h3>
                                            <div className="flex items-center gap-2 mt-2 text-slate-500">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{prop.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-8 py-8 font-black italic text-2xl text-white">
                                    {prop.price}
                                </td>

                                <td className="px-8 py-8">
                                    <StatusChip status={prop.status} />
                                </td>

                                <td className="px-8 py-8 text-right">
                                    <ActionMenu
                                        prop={prop}
                                        activeMenu={activeMenu}
                                        setActiveMenu={setActiveMenu}
                                        updateStatus={updateStatus}
                                        deleteProperty={deleteProperty}
                                        totalCount={filteredProperties.length}
                                        index={filteredProperties.indexOf(prop)}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* --- MOBILE CARDS --- */}
                <div className="md:hidden space-y-6">
                    {filteredProperties.map((prop) => (
                        <div key={prop.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                            <div className="relative h-64">
                                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                                <div className="absolute top-6 right-6">
                                    <StatusChip status={prop.status} />
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-black italic uppercase text-white">{prop.title}</h3>
                                        <div className="flex items-center gap-2 mt-2 text-slate-500">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                            <span className="text-[10px] font-black tracking-widest">{prop.city}</span>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black italic text-emerald-500">{prop.price}</p>
                                </div>
                                <ActionMenu
                                    prop={prop}
                                    activeMenu={activeMenu}
                                    setActiveMenu={setActiveMenu}
                                    updateStatus={updateStatus}
                                    deleteProperty={deleteProperty}
                                    isMobile={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* --- COMPONENTS --- */

function StatusChip({ status }) {
    const styles = {
        Available: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Reserved: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        'Sold Out': 'bg-red-500/10 text-red-500 border-red-500/20',
        Hidden: 'bg-slate-500/10 text-slate-500 border-white/5'
    }
    return (
        <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {status}
        </span>
    )
}

function ActionMenu({ prop, activeMenu, setActiveMenu, updateStatus, deleteProperty, index, totalCount, isMobile }) {
    // Logic to ensure menu doesn't overflow bottom of container
    const isNearBottom = index >= totalCount - 2;

    return (
        <div className="relative inline-block">
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setActiveMenu(activeMenu === prop.id ? null : prop.id)
                }}
                className={`p-4 rounded-2xl transition-all ${activeMenu === prop.id ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:text-white'}`}
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {activeMenu === prop.id && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                    <div className={`absolute right-0 z-50 w-72 bg-[#0B1220] border border-white/10 rounded-[2.5rem] shadow-2xl py-6 backdrop-blur-3xl animate-in fade-in zoom-in duration-200 ${isNearBottom ? 'bottom-full mb-4' : 'top-full mt-4'}`}>
                        <div className="px-8 text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 mb-4">Management</div>

                        <Link href={`/admin/properties/edit/${prop.id}`} className="flex items-center gap-4 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <Edit3 className="w-4 h-4 text-emerald-500" /> Modify Asset
                        </Link>

                        <div className="h-px bg-white/5 mx-6 my-4" />

                        <div className="px-8 text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 mb-4">Set Status</div>
                        <StatusOption icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} label="Available" onClick={() => updateStatus(prop.id, 'Available')} />
                        <StatusOption icon={<Bookmark className="w-4 h-4 text-orange-500" />} label="Reserved" onClick={() => updateStatus(prop.id, 'Reserved')} />
                        <StatusOption icon={<Ban className="w-4 h-4 text-red-500" />} label="Sold Out" onClick={() => updateStatus(prop.id, 'Sold Out')} />
                        <StatusOption icon={<EyeOff className="w-4 h-4 text-slate-600" />} label="Hidden" onClick={() => updateStatus(prop.id, 'Hidden')} />

                        <div className="h-px bg-white/5 mx-6 my-4" />
                        <button onClick={() => deleteProperty(prop.id)} className="w-full flex items-center gap-4 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
                            <Trash2 className="w-4 h-4" /> Delete Asset
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

function StatusOption({ icon, label, onClick }) {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-4 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            {icon} {label}
        </button>
    )
}