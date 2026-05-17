'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, UserCircle, UploadCloud, Loader2, Calculator, CreditCard, Wallet } from 'lucide-react'
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
    const [paymentType, setPaymentType] = useState(null) // null | 'full' | 'installment'

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

    // Auto-calculate
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
            ...formData,
            propertyId: land?.id || land?._id,
            propertyTitle: land?.title,
            totalPrice: totalPrice,
            paymentType: paymentType,
            initialDeposit: paymentType === 'installment' ? landDeposit : totalPrice,
            monthlyPayment: paymentType === 'installment' ? monthlyPayment : 0,
            remainingAfterDeposit: paymentType === 'installment' ? remainingAfterDeposit : 0,
            totalMonths: paymentType === 'installment' ? months : 1,
            submittedAt: new Date().toISOString()
        }

        try {
            await inquiriesAPI.create({
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                message: `Subscription for ${land?.title}. Type: ${paymentType}. ${paymentType === 'installment' ? `Deposit: ${formatCurrency(landDeposit)}, Months: ${months}, Monthly: ${formatCurrency(monthlyPayment)}` : `Full Payment: ${formatCurrency(totalPrice)}`}`,
                propertyId: land?.id || land?._id,
                source: 'property_detail'
            })
        } catch (err) {
            console.log('Backend inquiry skipped, saving locally')
        }

        localStorage.setItem(`dossier_${land?.id || land?._id}`, JSON.stringify(dossierData))

        setIsSuccess(true)
        setTimeout(() => {
            setIsSuccess(false)
            onClose()
            router.push(`/purchase/${land?.id || land?._id}`)
        }, 2000)
        setIsProcessing(false)
    }

    return (
        <div className="max-h-[85vh] overflow-y-auto custom-scrollbar pr-1 bg-white text-slate-900 rounded-2xl selection:bg-[#347a54]/20">
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-24 text-center px-6">
                        <div className="w-24 h-24 rounded-full bg-[#347a54]/10 border border-[#347a54]/30 flex items-center justify-center mb-8">
                            <CheckCircle2 className="w-12 h-12 text-[#347a54]" />
                        </div>
                        <h3 className="text-4xl font-bold tracking-tighter text-[#1e3d6b] mb-3">Application Documented</h3>
                        <p className="text-slate-500 max-w-sm">Redirecting to payment...</p>
                    </motion.div>
                ) : !paymentType ? (
                    /* ===== STEP 1: CHOOSE PAYMENT TYPE ===== */
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 px-6 text-center space-y-8">
                        <div>
                            <div className="w-16 h-16 bg-[#347a54]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-[#347a54]" />
                            </div>
                            <h2 className="text-2xl font-black text-[#1e3d6b]">Choose Payment Type</h2>
                            <p className="text-slate-500 text-sm mt-2">How would you like to pay for {land?.title}?</p>
                            <p className="text-3xl font-black text-[#347a54] mt-4">{formatCurrency(totalPrice)}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                type="button"
                                onClick={() => setPaymentType('full')}
                                className="bg-[#1e3d6b] hover:bg-[#347a54] text-white rounded-3xl p-8 space-y-3 transition-all group"
                            >
                                <Wallet className="w-10 h-10 mx-auto text-emerald-400 group-hover:text-white" />
                                <h3 className="text-xl font-black uppercase tracking-wider">Full Payment</h3>
                                <p className="text-xs text-slate-300 group-hover:text-white/80">Pay the complete amount at once</p>
                                <p className="text-2xl font-black text-emerald-400 group-hover:text-white">{formatCurrency(totalPrice)}</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentType('installment')}
                                className="bg-white border-2 border-slate-200 hover:border-[#347a54] rounded-3xl p-8 space-y-3 transition-all group"
                            >
                                <CreditCard className="w-10 h-10 mx-auto text-slate-400 group-hover:text-[#347a54]" />
                                <h3 className="text-xl font-black uppercase tracking-wider text-slate-900">Installment</h3>
                                <p className="text-xs text-slate-500">Pay a deposit now, rest over time</p>
                                <p className="text-sm font-bold text-[#347a54]">Flexible payment options</p>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </motion.div>
                ) : (
                    /* ===== STEP 2: THE FORM ===== */
                    <form onSubmit={handleSubmit} className="space-y-8 pb-8">

                        {/* HEADER */}
                        <div className="bg-[#347a54] -mx-10 -mt-10 p-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-b-4 border-[#1e3d6b]">
                            <div className="text-center sm:text-left">
                                <h2 className="text-4xl font-black tracking-tight text-white uppercase">HEAVEN ARK ESTATE</h2>
                                <p className="text-emerald-100 text-xs font-bold tracking-[0.4em] uppercase mt-1">SUBSCRIPTION FORM</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    paymentType === 'full' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                                }`}>
                                    {paymentType === 'full' ? 'Full Payment' : 'Installment'}
                                </span>
                                <div className="relative flex-shrink-0">
                                    <div onClick={() => fileInputRef.current.click()}
                                         className="w-28 h-28 rounded-xl bg-white border-2 border-dashed border-[#1e3d6b]/30 hover:border-[#1e3d6b] flex flex-col items-center justify-center overflow-hidden cursor-pointer group shadow-md transition-all">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Passport" />
                                        ) : (
                                            <div className="text-center p-3">
                                                <UserCircle className="w-8 h-8 text-slate-400 mx-auto mb-1 group-hover:text-[#347a54] transition-colors" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Photo (Optional)</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </div>
                            </div>
                        </div>

                        {submitError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <span>⚠️</span> {submitError}
                            </div>
                        )}

                        {/* PAYMENT TYPE SELECTOR */}
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setPaymentType(null)}
                                    className="text-[10px] font-bold text-slate-400 hover:text-[#347a54] transition-colors">
                                ← Change Payment Type
                            </button>
                        </div>

                        {/* PERSONAL INFORMATION */}
                        <div className="space-y-6 pt-4">
                            <div className="bg-[#1e3d6b] text-white px-6 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-bold text-sm tracking-wide shadow-md">
                                <span className="uppercase tracking-widest text-xs">Personal Information</span>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-slate-300">Date:</span>
                                    <input type="date" className="bg-white text-slate-900 border-none rounded px-3 py-1 font-mono outline-none"
                                           value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="Surname First, Middle, and Last Name" required
                                           className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white transition-all shadow-inner"
                                           value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Date of Birth</label>
                                        <input type="date" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner"
                                               value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block mb-3">Gender</label>
                                        <div className="flex gap-6 items-center h-10 px-1">
                                            {['Male', 'Female'].map((g) => (
                                                <label key={g} className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-sm">
                                                    <input type="radio" name="gender" value={g}
                                                           checked={formData.gender === g} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                           className="accent-[#347a54] w-4 h-4" /><span>{g}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Phone Number <span className="text-red-500">*</span></label>
                                        <input type="tel" placeholder="Mobile Input" required
                                               className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner"
                                               value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Marital Status</label>
                                        <input type="text" placeholder="Single / Married / Separated"
                                               className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner"
                                               value={formData.maritalStatus} onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Residential Address</label>
                                    <input type="text" placeholder="Street Location Address"
                                           className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner"
                                           value={formData.residentialAddress} onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">ID Number</label>
                                        <input type="text" placeholder="NIN / Passport / Driver's Lic."
                                               className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner"
                                               value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Email Address <span className="text-red-500">*</span></label>
                                        <input type="email" placeholder="Active Inbox Email Address" required
                                               className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner"
                                               value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Occupation <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input type="text" placeholder="Your Sector Domain / Profession"
                                           className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner"
                                           value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                                </div>

                                {/* ========== INSTALLMENT FINANCING SECTION - ONLY SHOWS IF INSTALLMENT ========== */}
                                {paymentType === 'installment' && (
                                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl mt-2 shadow-inner space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Calculator className="w-4 h-4 text-[#347a54]" />
                                            <span className="text-[11px] font-black uppercase text-[#1e3d6b] tracking-wider">Financing Payment Plan</span>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Plot Size</span>
                                            <div className="flex gap-6">
                                                {['300sqm', '500sqm'].map((sz) => (
                                                    <label key={sz} className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-sm">
                                                        <input type="radio" name="plotSize" value={sz}
                                                               checked={formData.plotSize.replace(' ', '') === sz}
                                                               onChange={(e) => setFormData({ ...formData, plotSize: e.target.value })}
                                                               className="accent-[#347a54] w-4 h-4" /><span>{sz}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Initial Deposit</label>
                                            <div className="w-full bg-slate-100 border border-slate-200 text-[#347a54] font-black rounded-xl px-5 py-4 text-lg">
                                                {formatCurrency(landDeposit)}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Payment Duration</label>
                                            <select value={formData.paymentPlan} onChange={handlePaymentPlanChange}
                                                    className="w-full bg-white border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] cursor-pointer">
                                                <option value="3">3 Months</option>
                                                <option value="6">6 Months</option>
                                                <option value="9">9 Months</option>
                                                <option value="12">12 Months</option>
                                                <option value="other">Other (Custom)</option>
                                            </select>
                                            {showCustomMonths && (
                                                <input type="number" placeholder="Enter number of months"
                                                       className="w-full bg-white border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] mt-2"
                                                       value={customMonths} onChange={handleCustomMonthsChange} min="1" />
                                            )}
                                        </div>

                                        {monthlyPayment > 0 && (
                                            <div className="bg-[#347a54]/5 border border-[#347a54]/20 rounded-xl p-4 space-y-2">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#1e3d6b]">Payment Breakdown</p>
                                                <div className="flex justify-between text-xs"><span className="text-slate-500">Total Price:</span><span className="font-bold">{formatCurrency(totalPrice)}</span></div>
                                                <div className="flex justify-between text-xs"><span className="text-slate-500">Deposit:</span><span className="font-bold text-[#347a54]">{formatCurrency(landDeposit)}</span></div>
                                                <div className="flex justify-between text-xs"><span className="text-slate-500">Remaining:</span><span className="font-bold text-amber-600">{formatCurrency(remainingAfterDeposit)}</span></div>
                                                <div className="flex justify-between text-xs border-t border-[#347a54]/10 pt-2"><span className="text-slate-500">Duration:</span><span className="font-bold">{months} months</span></div>
                                                <div className="flex justify-between text-sm bg-[#347a54]/10 rounded-lg p-2"><span className="font-black text-[#1e3d6b]">Monthly Payment:</span><span className="font-black text-[#1e3d6b]">{formatCurrency(monthlyPayment)}</span></div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ========== FULL PAYMENT SUMMARY ========== */}
                                {paymentType === 'full' && (
                                    <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl mt-2 shadow-inner">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Wallet className="w-4 h-4 text-blue-600" />
                                            <span className="text-[11px] font-black uppercase text-[#1e3d6b] tracking-wider">Full Payment</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500">You will pay the complete amount at once.</p>
                                        <p className="text-2xl font-black text-[#1e3d6b] mt-2">{formatCurrency(totalPrice)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* NEXT OF KIN */}
                        <div className="space-y-5">
                            <div className="bg-[#1e3d6b] text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest shadow-md">Next Of Kin</div>
                            <div className="grid grid-cols-1 gap-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Full Name</label><input type="text" placeholder="Kin Identity Name" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.kinName} onChange={(e) => setFormData({ ...formData, kinName: e.target.value })} /></div>
                                    <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Phone No</label><input type="tel" placeholder="Kin Phone Contact" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.kinPhone} onChange={(e) => setFormData({ ...formData, kinPhone: e.target.value })} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Relationship <span className="text-slate-400 font-normal">(Optional)</span></label><input type="text" placeholder="e.g., Spouse, Sibling, Child" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.kinRelationship} onChange={(e) => setFormData({ ...formData, kinRelationship: e.target.value })} /></div>
                                    <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Email</label><input type="email" placeholder="Kin Email Address" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.kinEmail} onChange={(e) => setFormData({ ...formData, kinEmail: e.target.value })} /></div>
                                </div>
                                <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Address</label><input type="text" placeholder="Kin Residential Contact Location" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.kinAddress} onChange={(e) => setFormData({ ...formData, kinAddress: e.target.value })} /></div>
                            </div>
                        </div>

                        {/* REALTOR (ALL OPTIONAL) */}
                        <div className="space-y-5">
                            <div className="bg-[#1e3d6b] text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest shadow-md">Realtor / Consultant <span className="text-slate-300 font-normal text-[10px]">(Optional)</span></div>
                            <div className="grid grid-cols-1 gap-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Full Name</label><input type="text" placeholder="Consultant Roster Name" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.realtorName} onChange={(e) => setFormData({ ...formData, realtorName: e.target.value })} /></div>
                                    <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Phone No</label><input type="tel" placeholder="Consultant Contact Number" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.realtorPhone} onChange={(e) => setFormData({ ...formData, realtorPhone: e.target.value })} /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Email Address</label><input type="email" placeholder="Consultant Office Email" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.realtorEmail} onChange={(e) => setFormData({ ...formData, realtorEmail: e.target.value })} /></div>
                                    <div className="space-y-1"><label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e3d6b] block">Realtor Group</label><input type="text" placeholder="Affiliated Agency" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-5 py-4 text-sm outline-none focus:border-[#347a54] focus:bg-white shadow-inner" value={formData.realtorGroup} onChange={(e) => setFormData({ ...formData, realtorGroup: e.target.value })} /></div>
                                </div>
                            </div>
                        </div>

                        {/* DECLARATION */}
                        <div className="space-y-5">
                            <div className="bg-[#1e3d6b] text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest shadow-md">Declaration</div>
                            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-4 shadow-inner">
                                <input type="checkbox" required id="declarationAgreed" className="accent-[#347a54] w-5 h-5 flex-shrink-0 mt-0.5 cursor-pointer" checked={formData.declarationAgreed} onChange={(e) => setFormData({ ...formData, declarationAgreed: e.target.checked })} />
                                <label htmlFor="declarationAgreed" className="text-xs text-slate-600 leading-relaxed font-bold cursor-pointer select-none">I confirm that the information supplied is authentic, accurate, and true.</label>
                            </div>
                        </div>

                        <button type="submit" disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-[#347a54] to-[#2c6646] hover:brightness-110 active:scale-[0.99] text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-[#347a54]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                            {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Authorize & Transmit Subscription Application'}
                        </button>
                    </form>
                )}
            </AnimatePresence>
        </div>
    )
}