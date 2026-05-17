'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MapPin, Database, Trash2, Edit3, ShieldAlert, Loader2, AlertTriangle, EyeOff } from 'lucide-react'
import { propertiesAPI, adminAPI } from '@/lib/api/client'
import AddPropertyForm from '@/components/admin/AddPropertyForm'

export default function AdminPropertyPage() {
    const [properties, setProperties] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [updatingId, setUpdatingId] = useState(null)
    const [editingProperty, setEditingProperty] = useState(null)
    const [user, setUser] = useState(null)

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        propertyId: null,
        propertyTitle: ''
    })

    // Check auth on mount
    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        if (!token || !userData) {
            window.location.href = '/login'
            return
        }
        try {
            const parsed = JSON.parse(userData)
            if (parsed.role !== 'admin' && parsed.role !== 'staff') {
                window.location.href = '/dashboard'
                return
            }
            setUser(parsed)
        } catch (e) {
            window.location.href = '/login'
        }
    }, [])

    const fetchProperties = async () => {
        try {
            const data = await propertiesAPI.getAll({ limit: 50 })
            const propertiesList = data.data || (Array.isArray(data) ? data : [])
            if (Array.isArray(propertiesList)) {
                setProperties(propertiesList)
            }
        } catch (err) {
            console.error("Failed to sync portfolio:", err)
        } finally {
            setLoadingData(false)
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [])

    const handleStatusChange = async (propertyId, newStatus) => {
        setUpdatingId(propertyId)
        try {
            await adminAPI.updatePropertyStatus(propertyId, newStatus)
            setProperties(prev => prev.map(p => {
                const targetId = p.id || p._id
                return targetId === propertyId ? { ...p, status: newStatus } : p
            }))
        } catch (err) {
            console.error("Status update failed:", err)
        } finally {
            setUpdatingId(null)
        }
    }

    const openEditDrawer = (propertyProfile) => {
        setEditingProperty(propertyProfile)
        setIsFormOpen(true)
    }

    const openCreateDrawer = () => {
        setEditingProperty(null)
        setIsFormOpen(true)
    }

    const triggerDeleteVerification = (propertyId, propertyTitle) => {
        setDeleteModal({ isOpen: true, propertyId, propertyTitle })
    }

    const executePurgeProtocol = async () => {
        const { propertyId } = deleteModal
        try {
            await adminAPI.deleteProperty(propertyId)
            setProperties(prev => prev.filter(p => (p.id || p._id) !== propertyId))
        } catch (err) {
            console.error("Delete failed:", err)
        } finally {
            setDeleteModal({ isOpen: false, propertyId: null, propertyTitle: '' })
        }
    }

    if (loadingData) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Compiling Full Portfolio Sync...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 pt-6 selection:bg-emerald-500/30 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldAlert className="w-4 h-4 text-emerald-500" />
                            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Master Portfolio Authority</p>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">Global <span className="text-slate-700">Assets</span></h1>
                    </div>
                    <button
                        onClick={openCreateDrawer}
                        className="bg-emerald-600 text-white w-full md:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Register New Land
                    </button>
                </div>

                {properties.length === 0 ? (
                    <div className="text-center py-20">
                        <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-sm">No properties registered yet</p>
                        <button onClick={openCreateDrawer} className="text-emerald-500 text-xs font-bold uppercase tracking-widest mt-2 hover:underline">
                            + Add your first property
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {properties.map((prop) => {
                            const operationalId = prop.id || prop._id
                            const isHidden = prop.status === 'hidden'

                            return (
                                <div
                                    key={operationalId}
                                    className={`bg-white/5 border p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center gap-6 group hover:bg-white/[0.07] transition-all ${
                                        isHidden ? 'border-dashed border-white/10 bg-white/[0.01] opacity-60' : 'border-white/5'
                                    }`}
                                >
                                    <div className="w-full md:w-32 h-36 md:h-24 rounded-2xl overflow-hidden bg-slate-900 relative border border-white/5 flex-shrink-0">
                                        <img src={prop.imageUrl || prop.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef"} className="w-full h-full object-cover" alt="" />
                                        {isHidden && (
                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-slate-400">
                                                <EyeOff className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold tracking-tight">{prop.title}</h3>
                                            {isHidden && <span className="px-2 py-0.5 bg-white/10 rounded text-[8px] font-black tracking-widest text-slate-400 uppercase">Hidden From Public</span>}
                                        </div>
                                        <div className="flex wrap items-center gap-x-4 gap-y-2 mt-2">
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider"><MapPin className="w-3 h-3 text-slate-500" /> {typeof prop.location === 'string' ? prop.location : prop.location?.name || 'Lagos'}</div>
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider"><Database className="w-3 h-3 text-slate-500" /> {prop.size || '500 sqm'}</div>
                                        </div>
                                    </div>

                                    <div className="md:px-4">
                                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Asset Value</p>
                                        <p className="text-xl font-black text-white">₦{prop.price ? Number(prop.price).toLocaleString() : '0'}</p>
                                    </div>

                                    <div className="flex flex-col gap-1 min-w-[150px]">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider px-1">Operational State</label>
                                        <div className="relative flex items-center">
                                            <select
                                                disabled={updatingId === operationalId}
                                                value={prop.status || 'available'}
                                                onChange={(e) => handleStatusChange(operationalId, e.target.value)}
                                                className={`w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer select-none transition-colors ${
                                                    prop.status === 'available' ? 'text-emerald-400 border-emerald-500/20' :
                                                        prop.status === 'reserved' ? 'text-amber-400 border-amber-500/20' :
                                                            prop.status === 'sold' ? 'text-blue-400 border-blue-500/20' : 'text-slate-400 border-white/5'
                                                }`}
                                            >
                                                <option value="available">Available</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="sold">Sold Out</option>
                                                <option value="hidden">Hidden</option>
                                            </select>
                                            {updatingId === operationalId && <Loader2 className="absolute right-3 w-3 h-3 text-emerald-500 animate-spin" />}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:self-center self-end pt-4 md:pt-0">
                                        <button
                                            type="button"
                                            onClick={() => openEditDrawer(prop)}
                                            className="p-4 rounded-xl bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white transition-all border border-blue-500/10"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => triggerDeleteVerification(operationalId, prop.title)}
                                            className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <AddPropertyForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingProperty(null)
                }}
                onRefresh={fetchProperties}
                initialData={editingProperty}
            />

            <AnimatePresence>
                {deleteModal.isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ isOpen: false, propertyId: null, propertyTitle: '' })} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" />
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[201] pointer-events-none">
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#0b1329] border border-red-500/20 max-w-md w-full rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl pointer-events-auto">
                                <div className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6" /></div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black tracking-tight text-white">Confirm Asset Purge</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed px-4">
                                        Are you sure you want to delete &quot;{deleteModal.propertyTitle}&quot;? This will wipe the land from both your dashboard registry and the live client marketplace.
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setDeleteModal({ isOpen: false, propertyId: null, propertyTitle: '' })} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl border border-white/5 transition-all">Cancel</button>
                                    <button type="button" onClick={executePurgeProtocol} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all">Confirm Delete</button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}