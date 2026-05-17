'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, ArrowLeft, DownloadCloud, PenTool, ShieldCheck, MapPin, Layers, CheckCircle2, Loader2, Sparkles, HelpCircle, Zap, MessageSquare, UserPlus } from 'lucide-react'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DigitalForm from '@/components/lands/DigitalForm'
import { propertiesAPI } from '@/lib/api/client'
import Link from 'next/link'

export default function PropertyDetailPage() {
    const { id } = useParams()
    const router = useRouter()

    const [land, setLand] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check login status
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData)
                setUser(parsedUser)
                setIsLoggedIn(true)
            } catch (e) {
                setIsLoggedIn(false)
            }
        }

        // Fetch property
        const fetchPropertyProfile = async () => {
            if (!id) return
            try {
                const data = await propertiesAPI.getById(id)
                setLand(data.property || data.data || data.land || data)
            } catch (err) {
                console.error('Failed to load property:', err)
                try {
                    const allData = await propertiesAPI.getAll({ limit: 50 })
                    const arrayList = allData.data || []
                    const match = arrayList.find(item => (item.id === id || item._id === id))
                    if (match) setLand(match)
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchPropertyProfile()
    }, [id])

    if (loading) {
        return (
            <div className="bg-[#020617] min-h-screen flex flex-col items-center justify-center text-white">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Decrypting Asset Metrics...</p>
            </div>
        )
    }

    if (!land) {
        return (
            <div className="bg-[#020617] min-h-screen flex flex-col items-center justify-center text-center px-6 selection:bg-emerald-500/30">
                <p className="font-serif italic text-2xl text-slate-400 mb-6">Allocation Data Mismatch</p>
                <button
                    onClick={() => router.push('/properties')}
                    className="text-emerald-400 hover:text-emerald-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Catalogue
                </button>
            </div>
        )
    }

    const currentStatus = land?.status || 'available'

    return (
        <div className="bg-[#020617] min-h-screen relative overflow-hidden flex flex-col selection:bg-emerald-500/30">
            <Navbar />

            {/* CINEMATIC FULL-BLEED ART BACKDROP */}
            <div className="absolute inset-0 h-[65vh] z-0">
                <img
                    src={land?.imageUrl || land?.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef"}
                    className="w-full h-full object-cover grayscale brightness-[0.2]"
                    alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/10 via-[#020617]/80 to-[#020617]" />
                <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
            </div>

            <main className="container-custom relative z-10 flex-grow pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 w-full">

                {/* BACK NAVIGATION */}
                <button
                    onClick={() => router.push('/properties')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-12 font-bold text-xs uppercase tracking-widest transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Asset Index
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* --- LEFT HAND COLUMN --- */}
                    <div className="lg:col-span-7 space-y-12">

                        {/* Immersive Main Display Card */}
                        <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border border-white/10 group relative">
                            <img
                                src={land?.imageUrl || land?.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                                alt={land.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                        </div>

                        {/* Roster Phase Badges */}
                        <div className="flex flex-wrap gap-3">
                            <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-inner">
                                <ShieldCheck className="w-4 h-4" />
                                {land?.legalStatus || 'C of O Verified'}
                            </div>
                            <div className="px-5 py-2.5 bg-white/[0.03] border border-white/5 text-slate-300 rounded-2xl text-xs font-black tracking-widest uppercase flex items-center gap-2">
                                <Layers className="w-4 h-4 text-slate-500" />
                                {land?.size || '500 sqm'} Available
                            </div>
                        </div>

                        {/* Title Context Architecture */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-tight">
                                {land.title}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold tracking-wide">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <span>{typeof land?.location === 'string' ? land.location : land?.location?.name || 'Lagos, Nigeria'}</span>
                            </div>
                        </div>

                        {/* Detailed Description Block */}
                        <div className="pt-8 border-t border-white/5 space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Strategic Overview</h3>
                            <p className="text-slate-300 leading-relaxed text-base md:text-lg font-light">
                                {land?.overview || 'Exceptional land asset situated in a prime development corridor with full legal documentation and seamless transfer process.'}
                            </p>
                        </div>

                        {/* Dynamic Feature Badges */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Infrastructure Matrix</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {land?.features?.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors group">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="text-slate-200 text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT HAND COLUMN: ACTION TERMINAL --- */}
                    <div className="lg:col-span-5 sticky top-28">
                        <div className="bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Valuation</p>
                                    <h2 className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tighter mt-1">
                                        ₦{land?.price ? Number(land.price).toLocaleString() : '0'}
                                    </h2>
                                </div>
                                <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400">
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                </div>
                            </div>

                            {/* ============================================ */}
                            {/* ACTION BUTTONS - DIFFERENT FOR LOGGED IN VS NOT */}
                            {/* ============================================ */}
                            <div className="pt-6 border-t border-white/5 space-y-4">
                                {currentStatus === 'available' ? (
                                    isLoggedIn ? (
                                        /* ===== LOGGED IN: Full Purchase Options ===== */
                                        <>
                                            {/* Quick Test Purchase */}
                                            <button
                                                onClick={() => router.push(`/purchase/${id}`)}
                                                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl text-center transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
                                            >
                                                <Zap className="w-4 h-4" /> Quick Test Purchase (Skip Form)
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-px bg-white/5" />
                                                <span className="text-[8px] text-slate-600 uppercase tracking-widest">or</span>
                                                <div className="flex-1 h-px bg-white/5" />
                                            </div>

                                            {/* Start Digital Application */}
                                            <button
                                                onClick={() => setIsFormOpen(true)}
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl text-center shadow-xl shadow-emerald-600/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                                            >
                                                <PenTool className="w-4 h-4" /> Start Digital Application
                                            </button>

                                            {/* Download Form */}
                                            <a
                                                href="/heaven_ark_subscription_form.pdf"
                                                download="Heaven_Ark_Subscription_Form.pdf"
                                                className="block w-full border border-white/10 hover:bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl text-center transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                                            >
                                                <DownloadCloud className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> Download Subscription Form
                                            </a>
                                        </>
                                    ) : (
                                        /* ===== NOT LOGGED IN: Enquiry + Create Account + Download ===== */
                                        <>
                                            {/* Price Display */}
                                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 text-center">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Price</p>
                                                <p className="text-3xl font-black text-emerald-400">
                                                    ₦{land?.price ? Number(land.price).toLocaleString() : '0'}
                                                </p>
                                            </div>

                                            {/* Make Enquiry */}
                                            <Link
                                                href="/contact"
                                                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl text-center transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
                                            >
                                                <MessageSquare className="w-4 h-4" /> Make Enquiry
                                            </Link>

                                            {/* Create Account */}
                                            <Link
                                                href="/register"
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl text-center transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/10"
                                            >
                                                <UserPlus className="w-4 h-4" /> Create Account to Purchase
                                            </Link>

                                            {/* Sign In */}
                                            <Link
                                                href="/login"
                                                className="w-full border border-white/10 hover:bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl text-center transition-all flex items-center justify-center gap-2"
                                            >
                                                Already have an account? Sign In
                                            </Link>

                                            {/* Download Form */}
                                            <a
                                                href="/heaven_ark_subscription_form.pdf"
                                                download="Heaven_Ark_Subscription_Form.pdf"
                                                className="block w-full border border-white/10 hover:bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl text-center transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                                            >
                                                <DownloadCloud className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> Download Subscription Form
                                            </a>
                                        </>
                                    )
                                ) : currentStatus === 'reserved' ? (
                                    <div className="bg-amber-500/5 border border-amber-500/10 text-amber-400 rounded-2xl p-6 text-center space-y-2">
                                        <p className="text-xs font-black uppercase tracking-widest">Asset Lock Active</p>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">This allocation is currently pending bank wire audit sign-offs from an earlier application loop submission.</p>
                                    </div>
                                ) : (
                                    <div className="bg-blue-500/5 border border-blue-500/10 text-blue-400 rounded-2xl p-6 text-center space-y-2">
                                        <p className="text-xs font-black uppercase tracking-widest">Registry Closed</p>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">Deed of assignment finalized. This asset base has been successfully claimed and transferred offline.</p>
                                    </div>
                                )}
                            </div>

                            {/* Manual Safety Footer */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-start gap-3.5">
                                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-medium">
                                    All transactions are secured through our proprietary manual audit system. Full title transfer occurs immediately upon validation.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />

            {/* DIGITAL SUBSCRIPTION REGISTRY POPUP OVERLAY - Only for logged in users */}
            {isLoggedIn && (
                <Modal
                    open={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    center
                    classNames={{
                        modal: 'bg-[#0a0f1e] text-white rounded-[3rem] p-6 md:p-10 max-w-3xl w-full border border-white/10 shadow-2xl custom-scrollbar',
                        overlay: 'bg-black/95 backdrop-blur-md z-[200]',
                        closeButton: 'text-slate-500 hover:text-white transition-colors focus:outline-none'
                    }}
                >
                    <DigitalForm land={land} onClose={() => setIsFormOpen(false)} />
                </Modal>
            )}
        </div>
    )
}