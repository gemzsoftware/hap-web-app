'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MessageCircle,
    Phone,
    PhoneIncoming,
    User,
    ChevronDown,
    ShieldCheck,
    Clock,
    Headphones
} from 'lucide-react'

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState(null)

    const faqs = [
        {
            q: "How do I access my Allocation Letter?",
            a: "Your allocation letter is automatically generated once your 4th installment is verified. You can find it under the 'Documents' section of your dashboard."
        },
        {
            q: "Can I pay more than the monthly installment?",
            a: "Yes. Any amount paid above your monthly requirement is automatically credited to your principal balance, shortening your payment plan duration."
        },
        {
            q: "Is my proof of payment secure?",
            a: "Absolutely. All uploaded documents are encrypted and processed through our Secure Asset Protocol (SAP) for manual verification."
        }
    ]

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-12 text-left min-h-screen bg-[#020617]">

            {/* --- HEADER --- */}
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <Headphones className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Concierge & Assistance</span>
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                            Investor <span className="text-emerald-900 text-5xl">Support</span>
                        </h2>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* --- LEFT: ADVISOR & CONTACT --- */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Advisor Card */}
                            <div className="p-8 rounded-[3rem] bg-emerald-500/[0.03] border border-emerald-500/20 flex items-center gap-6 shadow-[0_0_50px_rgba(16,185,129,0.02)][cite: 2]">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Sarah Adeleke</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Senior Portfolio Advisor</p>
                                    <div className="flex items-center gap-2 pt-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Available Now • Verified Human Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ContactCard
                            icon={<MessageCircle className="w-5 h-5" />}
                            title="WhatsApp Business"
                            value="+234 (0) 805 867 8439"
                            sub="Average response: < 5 mins"
                        />
                        <ContactCard
                            icon={<Phone className="w-5 h-5" />}
                            title="Priority Voice"
                            value="0800-HEAVEN-ARK"
                            sub="Mon - Fri, 8am - 6pm"
                        />
                    </div>

                    {/* Callback Form */}
                    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8">
                        <div className="space-y-1">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Request a Callback</h3>
                            <p className="text-[10px] text-slate-600 italic">An advisor will reach out to you within 24 hours.</p>
                        </div>
                        <div className="space-y-4">
                            <SupportInput placeholder="Full Name" />
                            <SupportInput placeholder="Phone Number" />
                            <SupportInput placeholder="Preferred Time (e.g. Morning, Afternoon)" />
                            <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20[cite: 2]">
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: FAQ --- */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <ShieldCheck className="w-4 h-4 text-emerald-500/40" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Frequently Asked</h3>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full p-6 text-left flex justify-between items-center group transition-all"
                                >
                                    <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${openFaq === index ? 'text-emerald-500' : 'text-slate-400 group-hover:text-white'}`}>
                                        {faq.q}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-emerald-500' : 'text-slate-600'}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-6 pb-6"
                                        >
                                            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-white/5">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center text-center space-y-4[cite: 2]">
                        <Clock className="w-6 h-6 text-emerald-500" />
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                            Support response times are currently<br />
                            <span className="text-emerald-500 italic">faster than average</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* --- COMPONENTS --- */

function ContactCard({ icon, title, value, sub }) {
    return (
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-4 hover:border-emerald-500/20 transition-all group[cite: 2]">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit group-hover:bg-emerald-500 group-hover:text-white transition-all[cite: 2]">
                {icon}
            </div>
            <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">{title}</h4>
                <p className="text-sm font-black text-white italic">{value}</p>
                <p className="text-[9px] font-bold text-slate-700 uppercase mt-1">{sub}</p>
            </div>
        </div>
    )
}

function SupportInput({ placeholder }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-colors[cite: 2]"
        />
    )
}