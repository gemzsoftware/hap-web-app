'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, UserCircle, UploadCloud, Loader2, Calculator, CreditCard, Wallet, User, Mail, Phone, MapPin, Briefcase, Users, Building2, ShieldCheck, Calendar } from 'lucide-react'
import { inquiriesAPI } from '@/lib/api/client'
import { formatCurrency } from '@/lib/utils'

export default function DigitalForm({ land, onClose }) {
    const fileInputRef = useRef(null)
    const router = useRouter()

    const [imagePreview, setImagePreview] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [showCustomMonths, setShowCustomMonths] = useState(false)
    const [customMonths, setCustomMonths] = useState('')
    const [paymentType, setPaymentType] = useState(null)

    const totalPrice = land?.price || 0
    const landDeposit = land?.installmentPlan?.initialDeposit || 0

    const [formData, setFormData] = useState({
        date: new Date().toISOString().slice(0, 10),
        fullName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        maritalStatus: '',
        residentialAddress: '',
        idNumber: '',
        email: '',
        occupation: '',
        imageUrl: '',
        plotSize: land?.size || '500sqm',
        paymentPlan: '6',
        totalMonths: '6',
        kinName: '',
        kinPhone: '',
        kinRelationship: '',
        kinEmail: '',
        kinAddress: '',
        realtorName: '',
        realtorPhone: '',
        realtorEmail: '',
        realtorGroup: '',
        declarationAgreed: false
    })

    const months = Number(formData.totalMonths) || 1
    const remainingAfterDeposit = totalPrice - landDeposit
    const monthlyPayment = remainingAfterDeposit > 0 ? Math.round(remainingAfterDeposit / months) : 0

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setIsProcessing(true)
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
            setFormData(prev => ({ ...prev, imageUrl: reader.result }))
            setIsProcessing(false)
        }
        reader.readAsDataURL(file)
    }

    const handlePaymentPlanChange = (e) => {
        const value = e.target.value
        if (value === 'other') {
            setShowCustomMonths(true)
            setFormData(prev => ({ ...prev, paymentPlan: 'other', totalMonths: customMonths || '' }))
        } else {
            setShowCustomMonths(false)
            setCustomMonths('')
            setFormData(prev => ({ ...prev, paymentPlan: value, totalMonths: value }))
        }
    }

    const handleCustomMonthsChange = (e) => {
        const value = e.target.value
        if (Number(value) > 0) {
            setCustomMonths(value)
            setFormData(prev => ({ ...prev, totalMonths: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('')
        if (!formData.fullName) { setSubmitError('Please fill in your full name.'); return }
        if (!formData.email) { setSubmitError('Please fill in your email address.'); return }
        if (!formData.phone) { setSubmitError('Please fill in your phone number.'); return }
        if (!formData.declarationAgreed) { setSubmitError('You must agree to the declaration.'); return }

        setIsProcessing(true)

        const dossierData = {
            ...formData, propertyId: land?.id || land?._id, propertyTitle: land?.title,
            totalPrice, paymentType, initialDeposit: paymentType === 'installment' ? landDeposit : totalPrice,
            monthlyPayment: paymentType === 'installment' ? monthlyPayment : 0,
            remainingAfterDeposit: paymentType === 'installment' ? remainingAfterDeposit : 0,
            totalMonths: paymentType === 'installment' ? months : 1,
            submittedAt: new Date().toISOString()
        }

        try {
            await inquiriesAPI.create({
                name: formData.fullName, email: formData.email, phone: formData.phone,
                message: `Subscription for ${land?.title}. Type: ${paymentType}. ${paymentType === 'installment' ? `Deposit: ${formatCurrency(landDeposit)}, Months: ${months}, Monthly: ${formatCurrency(monthlyPayment)}` : `Full Payment: ${formatCurrency(totalPrice)}`}`,
                propertyId: land?.id || land?._id, source: 'property_detail'
            })
        } catch (err) { console.log('Backend inquiry skipped') }

        localStorage.setItem(`dossier_${land?.id || land?._id}`, JSON.stringify(dossierData))
        setIsSuccess(true)
        setTimeout(() => { setIsSuccess(false); onClose(); router.push(`/purchase/${land?.id || land?._id}`) }, 2000)
        setIsProcessing(false)
    }

    return (
        <div className="max-h-[85vh] overflow-y-auto bg-white text-slate-900 rounded-2xl">
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Application Submitted</h3>
                        <p className="text-slate-500">Redirecting to payment portal...</p>
                    </motion.div>
                ) : !paymentType ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-14 px-8 text-center space-y-8">
                        <div>
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Select Payment Method</h2>
                            <p className="text-slate-500 text-sm mt-1">{land?.title}</p>
                            <p className="text-3xl font-bold text-emerald-600 mt-3">{formatCurrency(totalPrice)}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-lg mx-auto">
                            <button type="button" onClick={() => setPaymentType('full')} className="bg-slate-900 hover:bg-emerald-600 text-white rounded-3xl p-8 space-y-3 transition-all group">
                                <Wallet className="w-10 h-10 mx-auto text-emerald-400 group-hover:text-white" />
                                <h3 className="text-lg font-bold uppercase">Full Payment</h3>
                                <p className="text-xs text-slate-400 group-hover:text-white/80">Pay complete amount</p>
                                <p className="text-xl font-bold text-emerald-400 group-hover:text-white">{formatCurrency(totalPrice)}</p>
                            </button>

                            <button type="button" onClick={() => setPaymentType('installment')} className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-3xl p-8 space-y-3 transition-all group">
                                <CreditCard className="w-10 h-10 mx-auto text-slate-400 group-hover:text-emerald-500" />
                                <h3 className="text-lg font-bold uppercase text-slate-900">Installment</h3>
                                <p className="text-xs text-slate-500">Pay deposit + monthly</p>
                                <p className="text-sm font-bold text-emerald-600">Flexible duration</p>
                            </button>
                        </div>

                        <button type="button" onClick={onClose} className="text-slate-400 text-xs font-bold hover:text-slate-600">Cancel</button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="divide-y divide-slate-100">

                        {/* HEADER WITH LOGO */}
                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <img
                                        src="/logo.png"
                                        alt="Heaven Ark"
                                        className="w-12 h-12 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.parentElement.innerHTML = '<span class="text-white font-bold text-xl">HA</span>'
                                        }}
                                    />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-wide">HEAVEN ARK ESTATE</h2>
                                    <p className="text-emerald-200 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Subscription Form</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${paymentType === 'full' ? 'bg-blue-400/20 text-blue-100' : 'bg-purple-400/20 text-purple-100'}`}>
                                    {paymentType === 'full' ? 'Full' : 'Installment'}
                                </span>
                                <div onClick={() => fileInputRef.current.click()} className="w-20 h-20 rounded-xl bg-white/10 border-2 border-dashed border-white/30 hover:border-white flex flex-col items-center justify-center cursor-pointer group transition-all overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Passport" />
                                    ) : (
                                        <div className="text-center">
                                            <UserCircle className="w-6 h-6 text-white/60 mx-auto group-hover:text-white" />
                                            <span className="text-[8px] font-bold text-white/60 group-hover:text-white block mt-0.5">Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>
                        </div>

                        {/* ERROR */}
                        {submitError && (
                            <div className="px-8 py-4 bg-red-50 border-b border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                                <span>⚠️</span> {submitError}
                            </div>
                        )}

                        {/* CHANGE PAYMENT TYPE */}
                        <div className="px-8 py-3 bg-slate-50">
                            <button type="button" onClick={() => setPaymentType(null)} className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                                ← Change Payment Type
                            </button>
                        </div>

                        {/* ==================== PERSONAL INFORMATION ==================== */}
                        <div className="px-8 py-6 space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                                    <p className="text-xs text-slate-500">Fields marked <span className="text-red-500">*</span> are required</p>
                                </div>
                                <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <input type="date" className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-emerald-500" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="Surname First, Middle, and Last Name" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Date of Birth</label>
                                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Gender</label>
                                    <div className="flex gap-6 items-center h-[46px] px-2">
                                        {['Male', 'Female'].map((g) => (
                                            <label key={g} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 text-sm">
                                                <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="accent-emerald-600 w-4 h-4" />
                                                <span>{g}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Phone Number <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="tel" placeholder="+234 800 000 0000" required className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Marital Status</label>
                                    <input type="text" placeholder="Single / Married / Separated" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" value={formData.maritalStatus} onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })} />
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Residential Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <textarea placeholder="Street Location Address" rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none" value={formData.residentialAddress} onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">ID Number</label>
                                    <input type="text" placeholder="NIN / Passport / Driver's Lic." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Email Address <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="email" placeholder="your@email.com" required className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Occupation <span className="text-slate-400 font-normal text-[10px]">(Optional)</span></label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" placeholder="Your Profession" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ==================== FINANCING ==================== */}
                        {paymentType === 'installment' && (
                            <div className="px-8 py-6 space-y-4 bg-slate-50/50">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Calculator className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Financing Plan</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Plot Size</label>
                                        <div className="flex gap-4 h-[46px] items-center px-2">
                                            {['300sqm', '500sqm'].map((sz) => (
                                                <label key={sz} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 text-sm">
                                                    <input type="radio" name="plotSize" value={sz} checked={formData.plotSize.replace(' ', '') === sz} onChange={(e) => setFormData({ ...formData, plotSize: e.target.value })} className="accent-emerald-600 w-4 h-4" />
                                                    <span>{sz}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Initial Deposit</label>
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 font-bold text-lg">
                                            {formatCurrency(landDeposit)}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Duration</label>
                                        <select value={formData.paymentPlan} onChange={handlePaymentPlanChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 cursor-pointer">
                                            <option value="3">3 Months</option>
                                            <option value="6">6 Months</option>
                                            <option value="9">9 Months</option>
                                            <option value="12">12 Months</option>
                                            <option value="other">Custom...</option>
                                        </select>
                                        {showCustomMonths && (
                                            <input type="number" placeholder="Number of months" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 mt-2" value={customMonths} onChange={handleCustomMonthsChange} min="1" />
                                        )}
                                    </div>
                                </div>

                                {monthlyPayment > 0 && (
                                    <div className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-3">
                                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Payment Breakdown</p>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-500">Total Price</span><span className="font-bold">{formatCurrency(totalPrice)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Deposit</span><span className="font-bold text-emerald-600">{formatCurrency(landDeposit)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Remaining</span><span className="font-bold text-amber-600">{formatCurrency(remainingAfterDeposit)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-bold">{months} months</span></div>
                                        </div>
                                        <div className="bg-emerald-50 rounded-xl p-3 flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-700">Monthly Payment</span>
                                            <span className="text-xl font-bold text-emerald-700">{formatCurrency(monthlyPayment)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {paymentType === 'full' && (
                            <div className="px-8 py-6 bg-blue-50/50">
                                <div className="flex items-center gap-3 pb-3 border-b border-blue-200">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Full Payment</h3>
                                </div>
                                <p className="text-sm text-slate-600 mt-3">Complete amount to be paid at once.</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(totalPrice)}</p>
                            </div>
                        )}

                        {/* ==================== NEXT OF KIN ==================== */}
                        <div className="px-8 py-6 space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Next of Kin</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Full Name</label><input type="text" placeholder="Kin Identity Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-amber-500 transition-all" value={formData.kinName} onChange={(e) => setFormData({ ...formData, kinName: e.target.value })} /></div>
                                <div className="space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Phone No</label><input type="tel" placeholder="Kin Phone Contact" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-amber-500 transition-all" value={formData.kinPhone} onChange={(e) => setFormData({ ...formData, kinPhone: e.target.value })} /></div>
                                <div className="space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Relationship <span className="text-slate-400 font-normal text-[10px]">(Optional)</span></label><input type="text" placeholder="e.g., Spouse, Sibling" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-amber-500 transition-all" value={formData.kinRelationship} onChange={(e) => setFormData({ ...formData, kinRelationship: e.target.value })} /></div>
                                <div className="space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Email</label><input type="email" placeholder="Kin Email Address" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-amber-500 transition-all" value={formData.kinEmail} onChange={(e) => setFormData({ ...formData, kinEmail: e.target.value })} /></div>
                                <div className="md:col-span-2 space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Address</label><input type="text" placeholder="Kin Residential Address" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-amber-500 transition-all" value={formData.kinAddress} onChange={(e) => setFormData({ ...formData, kinAddress: e.target.value })} /></div>
                            </div>
                        </div>

                        {/* ==================== REALTOR ==================== */}
                        <div className="px-8 py-6 space-y-4 bg-slate-50/30">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Realtor / Consultant <span className="text-slate-400 font-normal text-xs">(Optional)</span></h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Full Name</label><input type="text" placeholder="Consultant Name" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-purple-500 transition-all" value={formData.realtorName} onChange={(e) => setFormData({ ...formData, realtorName: e.target.value })} /></div>
                                <div className="space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Phone No</label><input type="tel" placeholder="Consultant Contact" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-purple-500 transition-all" value={formData.realtorPhone} onChange={(e) => setFormData({ ...formData, realtorPhone: e.target.value })} /></div>
                                <div className="space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Email</label><input type="email" placeholder="Consultant Email" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-purple-500 transition-all" value={formData.realtorEmail} onChange={(e) => setFormData({ ...formData, realtorEmail: e.target.value })} /></div>
                                <div className="space-y-1.5"><label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Agency</label><input type="text" placeholder="Affiliated Agency" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-purple-500 transition-all" value={formData.realtorGroup} onChange={(e) => setFormData({ ...formData, realtorGroup: e.target.value })} /></div>
                            </div>
                        </div>

                        {/* ==================== DECLARATION ==================== */}
                        <div className="px-8 py-6 space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Declaration</h3>
                            </div>
                            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                <input type="checkbox" required className="accent-emerald-600 w-5 h-5 mt-0.5 flex-shrink-0 cursor-pointer" checked={formData.declarationAgreed} onChange={(e) => setFormData({ ...formData, declarationAgreed: e.target.checked })} />
                                <span className="text-xs text-slate-600 leading-relaxed font-medium select-none">I confirm that the information supplied is authentic, accurate, and true.</span>
                            </label>
                        </div>

                        {/* ==================== SUBMIT ==================== */}
                        <div className="px-8 py-6">
                            <button type="submit" disabled={isProcessing} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98]">
                                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                )}
            </AnimatePresence>
        </div>
    )
}