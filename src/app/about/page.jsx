'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { COMPANY } from '@/lib/constants'

export default function AboutPage() {
    return (
        <div className="bg-[#020617] min-h-screen">
            <Navbar />

            <main>
                {/* --- HEADER: CINEMATIC DARK (The "Hook") --- */}
                <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/port-3.jpg"
                            className="w-full h-full object-cover grayscale opacity-90"
                            alt="Corporate Vision"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-[#020617]" />
                    </div>

                    <div className="container-custom relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto"
                        >
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] mb-8 block">
                                The New Standard
                            </span>
                            <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-[1.1] mb-8">
                                Secure Ownership. <br />
                                <span className="italic font-light text-slate-500">Zero Friction.</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                                We've eliminated the archaic stress of land acquisition. At {COMPANY.name},
                                legal verification and secure payments converge into a single, seamless sitting.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* --- TRANSITION & WHITE CONTENT AREA --- */}
                {/* This section starts the white background that continues to the footer */}
                <section className="bg-white rounded-t-[4rem] md:rounded-t-[6rem] relative z-20 pt-24 pb-32">
                    <div className="container-custom">

                        {/* 01. The "One-Sitting" Promise */}
                        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-8">
                                    Land Acquisition, <br />
                                    <span className="text-emerald-600 italic">Simplified.</span>
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                    Buying land shouldn't be a test of endurance. We have re-engineered the entire payment
                                    and documentation lifecycle. From the moment you select a plot to the issuance of
                                    your digital deed, our platform handles the legal heavy lifting in the background.
                                </p>
                                <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                                    <div>
                                        <p className="text-2xl font-serif text-slate-900">Instant</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Allocation</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-serif text-slate-900">Verified</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Legal Titles</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="relative">
                                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"
                                        className="w-full h-full object-cover"
                                        alt="Secure Office"
                                    />
                                </div>
                                {/* Floating Trust Badge */}
                                <div className="absolute -bottom-10 -left-10 bg-slate-950 p-8 rounded-3xl text-white shadow-xl max-w-[240px]">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Legal Security</p>
                                    <p className="text-sm font-light leading-relaxed">Every asset is pre-vetted by our internal legal council before listing.</p>
                                </div>
                            </div>
                        </div>

                        {/* 02. The Corporate Integrity Section */}
                        <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20">
                            <div className="max-w-3xl">
                                <h3 className="text-3xl md:text-5xl font-serif text-slate-900 mb-8">A Legacy of Trust.</h3>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Our Identity</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {COMPANY.fullName} is a fully incorporated entity under the Corporate Affairs Commission (RC: {COMPANY.rcNumber}).
                                            We operate with total transparency, ensuring every kobo of your investment is tracked and protected.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">The "One Sitting" Method</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            By integrating fintech with real estate law, we allow investors to complete
                                            the entire acquisition process from their home or office. No stress. No ambiguity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 03. Professional Service Standards */}
                        <div className="mt-32 grid md:grid-cols-3 gap-12">
                            {[
                                { title: "Secure Payments", desc: "Military-grade encryption for all capital transfers and automated receipt generation." },
                                { title: "Legal Shield", desc: "We handle the land registry checks so you don't have to deal with government bureaucracy." },
                                { title: "Swift Delivery", desc: "Physical allocation and survey documents delivered within specified professional timelines." }
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <div className="w-12 h-1 bg-emerald-500 mb-6 group-hover:w-full transition-all duration-500" />
                                    <h5 className="font-black text-[11px] uppercase tracking-[0.3em] text-slate-900 mb-4">{item.title}</h5>
                                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <div className="bg-white">
                <Footer />
            </div>
        </div>
    )
}