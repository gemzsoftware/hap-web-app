'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LandCard from '@/components/lands/LandCard'
import { mockLands } from '@/data/mockLands'

// Premium Font Stack (Ensure these are imported in your layout.tsx or globals.css)
// Headings: 'Playfair Display', serif
// UI/Body: 'Inter', sans-serif

const locations = ['All', 'Lekki', 'Ibeju-Lekki', 'Ajah', 'Abeokuta']
const priceRanges = [
    { label: 'All Portfolio', min: 0, max: Infinity },
    { label: 'Under ₦5M', min: 0, max: 5000000 },
    { label: '₦5M - ₦15M', min: 5000000, max: 15000000 },
    { label: '₦15M - ₦25M', min: 15000000, max: 25000000 },
    { label: 'High-Value Assets', min: 25000000, max: Infinity },
]

export default function PropertiesPage() {
    const [selectedLocation, setSelectedLocation] = useState('All')
    const [selectedPrice, setSelectedPrice] = useState(priceRanges[0])
    const [searchQuery, setSearchQuery] = useState('')

    // Note: If mockLands only has 4 items, you should duplicate them in your
    // mockLands.ts file to see the full effect of this 3-column grid.
    const filteredLands = mockLands.filter((land) => {
        const matchesLocation = selectedLocation === 'All' || land.location.includes(selectedLocation)
        const matchesPrice = land.price >= selectedPrice.min && land.price <= selectedPrice.max
        const matchesSearch = land.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            land.location.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesLocation && matchesPrice && matchesSearch
    })

    return (
        <div className="bg-[#FBFCFD] min-h-screen selection:bg-emerald-100">
            <Navbar />

            {/* Removed the large pt-72 to eliminate top white space */}
            <main className="flex-grow">

                {/* --- HERO: IMMERSIVE ARCHITECTURAL HEADER --- */}
                <section className="relative h-[55vh] flex items-center overflow-hidden bg-[#020617]">
                    <motion.div
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <img
                            src="/land-1.jpg"
                            className="w-full h-full object-cover grayscale brightness-50"
                            alt="Estate Background"
                        />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/20 to-transparent" />

                    <div className="container-custom relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-2xl"
                        >
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.8em] mb-4 block">
                                Premier Selection
                            </span>
                            <h1 className="text-6xl md:text-8xl font-serif text-white leading-[0.9] mb-6">
                                Exclusive <br />
                                <span className="italic font-light text-slate-300">Territories.</span>
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* --- FILTER BAR: CLEANER INTEGRATION --- */}
                <section className="sticky top-[64px] z-40 px-4 -mt-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl border border-slate-100 p-2 md:p-3 flex flex-col lg:flex-row items-center gap-4">

                            {/* Search Field */}
                            <div className="flex-[1.5] w-full relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by name or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50/50 border-none rounded-xl pl-14 pr-6 py-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                            </div>

                            {/* Divider */}
                            <div className="hidden lg:block h-8 w-[1px] bg-slate-100" />

                            {/* Selectors */}
                            <div className="flex flex-1 w-full gap-4">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full bg-transparent px-4 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-700 outline-none cursor-pointer hover:text-emerald-600 transition-colors"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedPrice.label}
                                    onChange={(e) => {
                                        const selected = priceRanges.find(p => p.label === e.target.value)
                                        setSelectedPrice(selected)
                                    }}
                                    className="w-full bg-transparent px-4 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-700 outline-none cursor-pointer hover:text-emerald-600 transition-colors"
                                >
                                    {priceRanges.map((range) => (
                                        <option key={range.label} value={range.label}>{range.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full lg:w-auto">
                                <div className="bg-slate-900 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center">
                                    {filteredLands.length} Assets Found
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- PROPERTY GRID --- */}
                <section className="py-24 container-custom">
                    <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
                        <div>
                            <h2 className="text-4xl font-serif text-slate-900">Portfolio Index</h2>
                            <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-bold mt-2">Available Acquisitions</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="w-10 h-[1px] bg-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verification Active</span>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
                        >
                            {/* If you have few cards in data, they will repeat here for visual fullness */}
                            {filteredLands.map((land, idx) => (
                                <motion.div
                                    key={`${land.id}-${idx}`}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                                >
                                    <LandCard land={land} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Empty State */}
                    {filteredLands.length === 0 && (
                        <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[3rem]">
                            <p className="font-serif italic text-2xl text-slate-300">No assets matching your search criteria.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}