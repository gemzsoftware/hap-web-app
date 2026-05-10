'use client'

import Link from 'next/link'
import { COMPANY, NAV_LINKS } from '@/lib/constants'

// Clean, professional SVG icons for the footer
const FooterIcons = {
    Location: () => (
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Phone: () => (
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    Email: () => (
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Shield: () => (
        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    )
}

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#020617] text-white pt-24 border-t border-white/5">
            <div className="container-custom pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">

                    {/* Brand Identity */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 ring-4 ring-white/5">
                                <img
                                    src="/logo.png"
                                    alt="Heaven Ark"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <span className="font-black text-2xl tracking-tighter font-heading uppercase">
                                Heaven Ark
                            </span>
                        </Link>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                            Building a secure bridge to property ownership through transparency and verified excellence.
                        </p>

                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Reg No.</span>
                            <div className="w-[1px] h-3 bg-white/10" />
                            <span className="text-[10px] font-bold text-slate-300 uppercase">{COMPANY.rcNumber}</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-10">
                            Resources
                        </h3>
                        <ul className="space-y-5">
                            {NAV_LINKS.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-wide transition-all hover:translate-x-1 inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-10">
                            Headquarters
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <FooterIcons.Location />
                                <span className="text-sm text-slate-400 font-medium leading-snug">{COMPANY.address}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <FooterIcons.Phone />
                                <span className="text-sm text-slate-400 font-medium">{COMPANY.phone}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <FooterIcons.Email />
                                <span className="text-sm text-slate-400 font-medium">{COMPANY.email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Verification & Trust */}
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-10">
                            Assurance
                        </h3>
                        <ul className="space-y-5">
                            {[
                                'State Verified Assets',
                                'Secure Payment Escrow',
                                'Instant Digital Receipts',
                                'Legal Deed Handover'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 group">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center transition-colors group-hover:bg-emerald-500/20">
                                        <FooterIcons.Shield />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 bg-black/20">
                <div className="container-custom py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            © {currentYear} {COMPANY.name}
                        </p>
                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                            Official Property Portfolio • All Rights Reserved
                        </p>
                    </div>

                    <div className="flex gap-10">
                        <Link href="/privacy" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-emerald-500 transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-emerald-500 transition-colors">
                            Terms
                        </Link>
                    </div>

                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="group flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/10 transition-all active:scale-95"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back to Top</span>
                        <span className="text-emerald-500 transition-transform group-hover:-translate-y-1">↑</span>
                    </button>
                </div>
            </div>
        </footer>
    )
}