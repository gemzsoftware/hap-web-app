'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UploadCloud, CheckCircle2, FileImage, Camera, Loader2, AlertCircle } from 'lucide-react'
import { adminAPI } from '@/lib/api/client'

export default function AddPropertyForm({ isOpen, onClose, onRefresh, initialData }) {
    const fileInputRef = useRef(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [imageError, setImageError] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        city: 'Lagos',
        state: 'Lagos',
        price: '',
        size: '500 sqm',
        imageUrl: '',
        features: '',
        overview: '',
        initialDeposit: '',
        monthlyAmount: '',
        totalMonths: '12',
        status: 'available'
    })

    useEffect(() => {
        if (initialData) {
            setImagePreview(initialData.imageUrl || initialData.image || null)
            setFormData({
                title: initialData.title || '',
                location: typeof initialData.location === 'string' ? initialData.location : initialData.location?.name || '',
                city: initialData.city || 'Lagos',
                state: initialData.state || 'Lagos',
                price: initialData.price || '',
                size: initialData.size || '500 sqm',
                imageUrl: initialData.imageUrl || initialData.image || '',
                features: Array.isArray(initialData.features) ? initialData.features.join(', ') : '',
                overview: initialData.overview || '',
                initialDeposit: initialData.installmentPlan?.initialDeposit || '',
                monthlyAmount: initialData.installmentPlan?.monthlyAmount || '',
                totalMonths: initialData.installmentPlan?.totalMonths || '12',
                status: initialData.status || 'available'
            })
        } else {
            setImagePreview(null)
            setFormData({
                title: '', location: '', city: 'Lagos', state: 'Lagos', price: '', size: '500 sqm',
                imageUrl: '', features: '', overview: '', initialDeposit: '', monthlyAmount: '', totalMonths: '12', status: 'available'
            })
        }
        setErrorMsg('')
        setImageError('')
    }, [initialData, isOpen])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file size
        if (file.size > 2 * 1024 * 1024) {
            setImageError('Image must be below 2MB. Please compress or choose a smaller file.')
            return
        }

        setImageError('')
        setIsProcessing(true)

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
            setFormData(prev => ({ ...prev, imageUrl: reader.result }))
            setIsProcessing(false)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcessing(true)
        setErrorMsg('')

        const premiumStockFallbacks = [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200"
        ]
        const finalImageString = imagePreview || premiumStockFallbacks[Math.floor(Math.random() * premiumStockFallbacks.length)]

        const payload = {
            title: formData.title,
            location: formData.location,
            city: formData.city,
            state: formData.state,
            price: Number(formData.price),
            size: formData.size,
            status: formData.status,
            imageUrl: finalImageString,
            features: formData.features ? formData.features.split(',').map(f => f.trim()) : ['Verified Land Asset'],
            overview: formData.overview || 'Seamless land banking and strategic immediate ownership transfer guaranteed.',
            legalStatus: 'Verified',
            isFeatured: true,
            installmentPlan: {
                initialDeposit: Number(formData.initialDeposit || 0),
                monthlyAmount: Number(formData.monthlyAmount || 0),
                totalMonths: Number(formData.totalMonths || 12),
                isActive: true
            }
        }

        try {
            const isEditMode = !!initialData
            const targetId = initialData?.id || initialData?._id

            if (isEditMode) {
                await adminAPI.updateProperty(targetId, payload)
            } else {
                await adminAPI.createProperty(payload)
            }

            setIsSuccess(true)
            onRefresh()

            setTimeout(() => {
                setIsSuccess(false)
                onClose()
            }, 2000)
        } catch (err) {
            console.error("Property save failed:", err)
            setErrorMsg(err.message || 'Failed to save property. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0a0f1e] border-l border-white/10 z-[101] p-6 md:p-10 overflow-y-auto text-white selection:bg-emerald-500/30"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter">{initialData ? 'Modify' : 'Register'} <span className="text-emerald-500">Asset</span></h2>
                                <p className="text-[10px] tracking-widest uppercase text-slate-500 font-bold mt-1">
                                    Autonomous Inventory Configuration
                                </p>
                            </div>
                            <button type="button" onClick={onClose} className="text-slate-500 hover:text-white p-2"><X className="w-6 h-6" /></button>
                        </div>

                        {isSuccess ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">Broadcast Successful</h3>
                                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                                    Asset profile attributes mapped and compiled cleanly into database collections.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* General Error Message */}
                                {errorMsg && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-4">
                                    <label className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] block">Media Stream Serialization</label>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                                    {/* Image Size Error */}
                                    {imageError && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                            {imageError}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={() => fileInputRef.current.click()}
                                            className="flex-grow border border-dashed border-white/10 hover:border-emerald-500/50 bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group transition-all min-h-[110px]"
                                        >
                                            {isProcessing ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /> : (
                                                <div className="flex gap-2 items-center">
                                                    <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-emerald-500" />
                                                    <Camera className="w-5 h-5 text-slate-500 group-hover:text-emerald-500" />
                                                </div>
                                            )}
                                            <span className="text-xs font-bold text-slate-400 group-hover:text-white text-center">
                                                {isProcessing ? 'Encoding Image...' : 'Import Asset Photo'}
                                            </span>
                                        </button>
                                        <div className="w-24 h-24 rounded-2xl border border-white/5 bg-slate-900 overflow-hidden flex flex-col items-center justify-center relative flex-shrink-0">
                                            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="" /> : <FileImage className="text-slate-700 w-6 h-6" />}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase px-1">Asset Identity Name</label>
                                        <input type="text" placeholder="Property Title" required className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase px-1">Location Corridor</label>
                                            <input type="text" placeholder="Location Corridor" required className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}/>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase px-1">Valuation Price (₦)</label>
                                            <input type="number" placeholder="Total Valuation Price" required className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-black text-emerald-400 outline-none focus:border-emerald-500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase px-1">Survey Area Size</label>
                                        <input type="text" placeholder="e.g., 500 sqm" required className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})}/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase px-1">Estate Feature Tags</label>
                                        <input type="text" placeholder="Perimeter Fencing, C of O" className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black tracking-wider text-slate-500 uppercase px-1">Detailed Marketing Overview</label>
                                    <textarea placeholder="Describe parameters..." rows={3} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-medium text-white outline-none focus:border-emerald-500 resize-none" value={formData.overview} onChange={e => setFormData({...formData, overview: e.target.value})} />
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Installment & Financing Matrix</span>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input type="number" placeholder="Initial Deposit" required className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500" value={formData.initialDeposit} onChange={e => setFormData({...formData, initialDeposit: e.target.value})}/>
                                        <input type="number" placeholder="Monthly Amount" required className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-emerald-500" value={formData.monthlyAmount} onChange={e => setFormData({...formData, monthlyAmount: e.target.value})}/>
                                        <select className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none cursor-pointer" value={formData.totalMonths} onChange={e => setFormData({...formData, totalMonths: e.target.value})}>
                                            <option value="6">6 Months</option>
                                            <option value="12">12 Months</option>
                                            <option value="18">18 Months</option>
                                            <option value="24">24 Months</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" disabled={isProcessing} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-600/20 transition-all disabled:opacity-50">
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </span>
                                    ) : initialData ? 'Authorize & Synchronize Core Records' : 'Authorize & Broadcast Asset'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}