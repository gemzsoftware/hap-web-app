'use client'

import { motion } from 'framer-motion'

const steps = [
    {
        number: '01',
        title: 'Browse & Select',
        description: 'Explore our portfolio of government-verified land listings tailored to your goals.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Secure Allocation',
        description: 'Create your account and pay your initial deposit via our encrypted gateway.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Flexible Payments',
        description: 'Monitor your ownership progress through your dashboard with automated receipts.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        number: '04',
        title: 'Legal Handover',
        description: 'Receive your Survey Plan and Deed of Assignment immediately upon completion.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
]

export default function HowItWorks() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container-custom">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-600 mb-4 block"
                    >
                        Seamless Ownership
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 font-heading tracking-tighter mb-6">
                        The Path to Heaven Ark
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        We’ve removed the complexity from land acquisition. Our 4-step process ensures
                        your investment is legally sound and fully transparent.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="relative">
                    {/* Background Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] bg-slate-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                {/* Icon Container */}
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    {/* The "Step Number" badge */}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-950 text-white rounded-full flex items-center justify-center text-[10px] font-black z-20 border-4 border-white">
                                        {step.number}
                                    </div>

                                    {/* Main Icon Circle */}
                                    <div className="w-full h-full bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-100 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                                        {step.icon}
                                    </div>

                                    {/* Hover Shadow Glow */}
                                    <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                </div>

                                {/* Text Content */}
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Trust Tag */}
                {/* Bottom Trust Tag - Certificate Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 flex justify-center px-6"
                >
                    <div className="relative group">
                        {/* Outer Glow Effect */}
                        <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative flex flex-col md:flex-row items-center gap-6 bg-white border-2 border-dashed border-slate-100 p-2 rounded-[2.5rem] pr-10 pl-3 transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">

                            {/* The "Seal" Icon */}
                            <div className="w-14 h-14 bg-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-slate-900/20 group-hover:bg-emerald-600 transition-colors duration-500">
                                <svg className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>

                            {/* Text Content */}
                            <div className="text-center md:text-left py-2">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-600 mb-1">
                                    Legal Protection Policy
                                </h4>
                                <p className="text-sm font-bold text-slate-800 tracking-tight">
                                    Every transaction is backed by <span className="text-emerald-600">guaranteed legal documentation</span> and physical allocation.
                                </p>
                            </div>

                            {/* Decorative "Verified" Tag */}
                            <div className="hidden md:flex items-center gap-2 border-l border-slate-100 ml-4 pl-8">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Heaven Ark Certified
                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}