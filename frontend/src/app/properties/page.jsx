'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Search, AlertCircle, Loader2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LandCard from '@/components/lands/LandCard'
import AddPropertyForm from '@/components/admin/AddPropertyForm'
import { propertiesAPI } from '@/lib/api/client'

const locations = ['All', 'Lekki', 'Ibeju-Lekki', 'Ajah', 'Abeokuta']

const priceRanges = [
    { label: 'All Portfolio', min: '', max: '' },
    { label: 'Under ₦5M', min: 0, max: 5000000 },
    { label: '₦5M - ₦15M', min: 5000000, max: 15000000 },
    { label: '₦15M - ₦25M', min: 15000000, max: 25000000 },
    { label: 'High-Value Assets', min: 25000000, max: Infinity },
]

export default function PropertiesPage() {
    const [lands, setLands] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedLocation, setSelectedLocation] = useState('All')
    const [selectedPrice, setSelectedPrice] = useState(priceRanges[0])
    const [searchQuery, setSearchQuery] = useState('')

    // Administrative overlay parameters
    const [isAdmin, setIsAdmin] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProperty, setEditingProperty] = useState(null)

    // Verify authentication clearance levels safely on initial mount
    useEffect(() => {
        const verifyAdministrativeClearance = () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]))
                    if (payload.role === 'admin') {
                        setIsAdmin(true)
                    }
                } catch (e) {
                    setIsAdmin(false)
                }
            }
        }
        verifyAdministrativeClearance()
    }, [])

    const fetchLiveInventory = async () => {
        setLoading(true)
        try {
            const params = {}

            if (searchQuery) {
                params.q = searchQuery
            }
            if (selectedLocation !== 'All') {
                params.location = selectedLocation
            }
            if (selectedPrice.min !== '') {
                params.minPrice = selectedPrice.min
            }
            if (selectedPrice.max !== '' && selectedPrice.max !== Infinity) {
                params.maxPrice = selectedPrice.max
            }

            const data = await propertiesAPI.getAll(params)
            setLands(data.data || [])
        } catch (err) {
            console.error('Failed to load properties:', err)
            setLands([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchLiveInventory()
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [searchQuery, selectedLocation, selectedPrice])

    const openEditDesk = (e, propertyProfile) => {
        e.preventDefault()
        setEditingProperty(propertyProfile)
        setIsFormOpen(true)
    }

    return (
        <div className="bg-[#FBFCFD] min-h-screen selection:bg-emerald-100 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* --- HERO BANNER DESIGN FRAMEWORK --- */}
                <section className="relative h-[45vh] flex items-center overflow-hidden bg-[#020617]">
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.4 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute inset-0"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                            alt="Estate Background"
                            className="w-full h-full object-cover grayscale brightness-50"
                        />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent" />

                    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-2xl"
                        >
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.8em] mb-3 block">
                                Premier Index Selection
                            </span>
                            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight">
                                Exclusive <br />
                                <span className="italic font-light text-slate-300">Territories.</span>
                            </h1>

                            {isAdmin && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[9px] font-black uppercase tracking-widest mt-4 shadow-xl">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    Administrative Layout Modifiers Active
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* --- FILTER CONTROL UTILITY BAR --- */}
                <section className="sticky top-[64px] z-40 px-6 md:px-12 -mt-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] rounded-2xl border border-slate-100 p-2 md:p-3 flex flex-col lg:flex-row items-center gap-4">

                            {/* FUZZY SEARCH INPUT */}
                            <div className="flex-[1.5] w-full relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Search className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by name or location corridor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50/60 border-none rounded-xl pl-14 pr-6 py-4 text-sm font-semibold text-slate-900 outline-none ring-0 focus:bg-slate-50 transition-all"
                                />
                            </div>

                            <div className="hidden lg:block h-8 w-[1px] bg-slate-100" />

                            {/* DROPDOWN SELECTORS */}
                            <div className="flex flex-1 w-full gap-4">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full bg-slate-50/40 lg:bg-transparent px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none border-none cursor-pointer hover:text-emerald-600 transition-colors"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc === 'All' ? 'All Regions' : loc}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedPrice.label}
                                    onChange={(e) => {
                                        const match = priceRanges.find((p) => p.label === e.target.value)
                                        if (match) setSelectedPrice(match)
                                    }}
                                    className="w-full bg-slate-50/40 lg:bg-transparent px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none border-none cursor-pointer hover:text-emerald-600 transition-colors"
                                >
                                    {priceRanges.map((range) => (
                                        <option key={range.label} value={range.label}>{range.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* TOTAL METRICS SLAG COUNT */}
                            <div className="w-full lg:w-auto">
                                <div className="bg-slate-900 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center">
                                    {lands.length} Assets Identified
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- CATALOGUE GRID SECTION --- */}
                <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
                    <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900">Portfolio Index</h2>
                            <p className="text-slate-400 text-[9px] uppercase tracking-[0.3em] font-black mt-1">Available Acquisition Nodes</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Live Inventory Stream</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-32">
                            <Loader2 className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Querying System Ledger...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                {lands.map((land, idx) => {
                                    const assetId = land.id || land._id;
                                    return (
                                        <motion.div
                                            key={assetId}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: idx * 0.03 }}
                                            className="relative group/wrapper"
                                        >
                                            {/* RENDER DYNAMIC CARD CORE CONTAINER */}
                                            <LandCard land={land} />

                                            {/* ADMIN SUPERUSER MANAGEMENT FLOATING DESK OVERLAY */}
                                            {isAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => openEditDesk(e, land)}
                                                    className="absolute bottom-28 right-6 z-30 bg-slate-950 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-2xl border border-white/10 active:scale-95 transition-all"
                                                >
                                                    <Settings className="w-3.5 h-3.5" /> Modify Asset
                                                </button>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {!loading && lands.length === 0 && (
                        <div className="text-center py-32 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="font-serif italic text-xl text-slate-400">No estate allocations found matching parameters.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />

            {/* INTEGRATED EDIT MODAL WRAPPER PANEL */}
            <AddPropertyForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingProperty(null)
                }}
                onRefresh={fetchLiveInventory}
                initialData={editingProperty}
            />
        </div>
    )
}