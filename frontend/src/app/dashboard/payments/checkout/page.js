'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
    ArrowLeft,
    CreditCard,
    Landmark,
    ShieldCheck,
    Lock,
    Building2,
    Upload,
    FileCheck,
    X
} from 'lucide-react'

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [file, setFile] = useState(null)

    // Card State for Validation
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    })

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    // Professional Card Formatting Logic
    const handleCardInput = (e) => {
        const { name, value } = e.target
        let formattedValue = value

        if (name === 'number') {
            // Remove non-digits and limit to 16 digits
            const digits = value.replace(/\D/g, '').substring(0, 16)
            // Add spaces every 4 digits: 0000 0000 0000 0000
            formattedValue = digits.match(/.{1,4}/g)?.join(' ') || digits
        }

        if (name === 'expiry') {
            // Remove non-digits and limit to 4 digits (MMYY)
            const digits = value.replace(/\D/g, '').substring(0, 4)
            if (digits.length > 2) {
                formattedValue = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`
            } else {
                formattedValue = digits
            }
        }

        if (name === 'cvv') {
            // Strictly digits and max 3
            formattedValue = value.replace(/\D/g, '').substring(0, 3)
        }

        setCardData({ ...cardData, [name]: formattedValue })
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <div className="max-w-6xl mx-auto py-10 px-4 space-y-10 text-left">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard/payments" className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">
                        <ArrowLeft className="w-3 h-3" /> Back to Ledger
                    </Link>
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                        <Lock className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Secure TLS 1.3</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT: PAYMENT SELECTION */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase tracking-tight">Financial <span className="text-slate-800 text-4xl">Settlement</span></h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <PaymentOption
                                    active={paymentMethod === 'card'}
                                    onClick={() => setPaymentMethod('card')}
                                    icon={<CreditCard className="w-5 h-5" />}
                                    title="Instant Card"
                                    description="Visa, Mastercard, Verve"
                                />
                                <PaymentOption
                                    active={paymentMethod === 'bank'}
                                    onClick={() => setPaymentMethod('bank')}
                                    icon={<Landmark className="w-5 h-5" />}
                                    title="Bank Transfer"
                                    description="Corporate Account Deposit"
                                />
                            </div>
                        </section>

                        <AnimatePresence mode="wait">
                            {paymentMethod === 'card' ? (
                                <motion.div
                                    key="card"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-8"
                                >
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Card Processor</h3>
                                            <div className="flex gap-2 grayscale opacity-50">
                                                <div className="w-8 h-5 bg-slate-700 rounded-sm" />
                                                <div className="w-8 h-5 bg-slate-700 rounded-sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <CardInput
                                                label="Cardholder Name"
                                                name="name"
                                                value={cardData.name}
                                                onChange={handleCardInput}
                                                placeholder="JOHN DOE"
                                            />
                                            <CardInput
                                                label="Card Number"
                                                name="number"
                                                value={cardData.number}
                                                onChange={handleCardInput}
                                                placeholder="0000 0000 0000 0000"
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <CardInput
                                                    label="Expiry Date"
                                                    name="expiry"
                                                    value={cardData.expiry}
                                                    onChange={handleCardInput}
                                                    placeholder="MM / YY"
                                                />
                                                <CardInput
                                                    label="CVV"
                                                    name="cvv"
                                                    value={cardData.cvv}
                                                    onChange={handleCardInput}
                                                    placeholder="***"
                                                />
                                            </div>
                                        </div>

                                        <Link href="/dashboard/payments/success">
                                            <button className="w-full py-5 bg-[#002B5B] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#003d82] transition-all shadow-2xl mt-4">
                                                Process Transaction ₦1,250,000
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="bank"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-8">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#B59410]">Designated Bank Accounts</h3>
                                        <div className="space-y-4">
                                            <BankCard bank="Access Bank Plc" accNo="1234567890" name="Heaven Ark Properties" />
                                            <BankCard bank="GTBank" accNo="0987654321" name="Heaven Ark Properties" />
                                        </div>
                                    </div>

                                    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Proof of Payment</h3>

                                        {!file ? (
                                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:bg-white/5 hover:border-[#B59410]/30 transition-all group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-[#B59410] transition-colors mb-3" />
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select receipt or drag & drop</p>
                                                    <p className="text-[9px] text-slate-600 mt-1 uppercase">Images or PDF accepted</p>
                                                </div>
                                                <input type="file" className="hidden" onChange={handleFileChange} />
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                                <div className="flex items-center gap-4">
                                                    <FileCheck className="w-6 h-6 text-emerald-500" />
                                                    <div>
                                                        <p className="text-xs font-black text-white uppercase truncate max-w-[200px]">{file.name}</p>
                                                        <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-tighter">Document uploaded successfully</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setFile(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        <Link href="/dashboard/payments/success">
                                            <button
                                                disabled={!file}
                                                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl ${
                                                    file ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-700 cursor-not-allowed'
                                                }`}
                                            >
                                                Submit for Verification
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="space-y-6">
                        <div className="p-8 rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 space-y-8">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Asset Summary</h3>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-xl bg-[#002B5B] flex items-center justify-center shrink-0 border border-white/5">
                                    <Building2 className="w-8 h-8 text-[#B59410]" />
                                </div>
                                <div className="min-w-0 text-left">
                                    <h4 className="text-sm font-black text-white italic truncate">Heaven Ark Phase 1</h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Epe, Lagos State</p>
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-white/5 pt-6 text-[11px] font-bold uppercase tracking-tight">
                                <div className="flex justify-between text-slate-500">
                                    <span>Allocation Plot 24</span>
                                    <span className="text-white">₦1,250,000.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-black italic text-emerald-500 pt-2 border-t border-white/5">
                                    <span>Total Payable</span>
                                    <span>₦1,250,000.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 flex items-center gap-4">
                            <ShieldCheck className="w-8 h-8 text-[#B59410]/40" />
                            <div className="text-left">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Verified Portal</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase">Secure Transaction Node</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* --- COMPONENTS --- */

function PaymentOption({ active, onClick, icon, title, description }) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-[2rem] border text-left transition-all group ${
                active
                    ? 'bg-[#B59410]/10 border-[#B59410] shadow-[0_0_20px_rgba(181,148,16,0.1)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
        >
            <div className={`p-3 rounded-xl mb-4 w-fit ${active ? 'bg-[#B59410] text-white' : 'bg-white/10 text-slate-400'}`}>
                {icon}
            </div>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${active ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
            <p className="text-[10px] font-medium text-slate-500 italic">{description}</p>
        </button>
    )
}

function CardInput({ label, name, value, onChange, placeholder }) {
    return (
        <div className="space-y-2 text-left">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">{label}</label>
            <input
                name={name}
                value={value}
                onChange={onChange}
                type="text"
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-[#B59410]/50 transition-colors"
            />
        </div>
    )
}

function BankCard({ bank, accNo, name }) {
    return (
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-[#B59410]/30 transition-all text-left">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-[#002B5B] rounded-xl text-white">
                    <Building2 className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{bank}</p>
                    <p className="text-lg font-black text-[#B59410] italic tracking-tighter">{accNo}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[8px] font-black text-slate-700 uppercase">Account Holder</p>
                <p className="text-[9px] font-black text-slate-400 uppercase">{name}</p>
            </div>
        </div>
    )
}