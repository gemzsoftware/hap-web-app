'use client'

import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

export default function ReceiptTemplate({ payment, purchase }) {
    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Receipt-${payment?.receiptNumber || 'HAP'}`,
    })

    const receiptNumber = payment?.receiptNumber || `HAP-RCPT-${Date.now()}`
    const date = new Date(payment?.verifiedAt || payment?.submittedAt || Date.now())
    const formattedDate = date.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
    const buyerName = payment?.buyerName || payment?.senderName || 'N/A'
    const buyerEmail = payment?.buyerEmail || 'N/A'
    const propertyTitle = payment?.propertyTitle || purchase?.propertyTitle || 'Property'
    const amount = Number(payment?.amountPaid || payment?.amount || 0)
    const paymentMode = payment?.paymentMode || 'installment'
    const transactionRef = payment?.transactionReference || 'N/A'
    const bankName = payment?.bankName || 'Access Bank Plc'
    const totalPrice = Number(payment?.totalPrice || purchase?.totalPrice || 0)

    return (
        <div>
            <button
                onClick={() => handlePrint()}
                className="mb-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all"
            >
                Download / Print Receipt
            </button>

            {/* ==================== RECEIPT DOCUMENT ==================== */}
            <div
                ref={componentRef}
                className="w-[210mm] min-h-[297mm] bg-white text-[#1a2a3a] font-sans relative overflow-hidden mx-auto"
                style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}
            >
                {/* ========== HEADER SECTION ========== */}
                <div className="pt-12 px-12 pb-0">
                    <div className="flex justify-between items-start">
                        {/* Left: Logo + Company Info */}
                        <div className="text-center w-[38%]">
                            {/* Logo - Imported from /logo.png */}
                            <div className="w-20 h-20 mx-auto mb-3 rounded-2xl flex items-center justify-center overflow-hidden">
                                <img
                                    src="/logo.png"
                                    alt="Heaven Ark Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.parentElement.innerHTML = '<span class="text-[#C8A951] font-bold text-3xl" style="font-family:\'Playfair Display\',serif">HA</span>'
                                        e.target.parentElement.className = 'w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] rounded-2xl flex items-center justify-center border-2 border-[#C8A951] shadow-lg'
                                    }}
                                />
                            </div>
                            <h1 className="text-xl font-bold tracking-wider text-[#1e3a5f]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                HEAVEN ARK
                            </h1>
                            <p className="text-sm font-bold tracking-[0.3em] text-[#C8A951] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                                PROPERTIES
                            </p>
                            <div className="mt-3 space-y-1 text-left pl-4">
                                <p className="text-[11px] text-[#1e3a5f] font-medium">
                                    <span className="inline-block w-3 h-3 mr-1">📞</span> +234 800 000 0000
                                </p>
                                <p className="text-[11px] text-[#1e3a5f] font-medium">
                                    <span className="inline-block w-3 h-3 mr-1">✉️</span> info@heavenark.com
                                </p>
                            </div>
                        </div>

                        {/* Right: Invoice Info Boxes */}
                        <div className="w-[30%] space-y-3 mt-4">
                            {[
                                { label: 'Date:', value: formattedDate },
                                { label: 'Inv No.:', value: receiptNumber },
                                { label: 'P.O. No.:', value: transactionRef?.substring(0, 12) || 'N/A' },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold text-[#1e3a5f] text-right w-[60px]">{row.label}</span>
                                    <div className="flex-1 border-2 border-[#1e3a5f]/20 rounded-md px-3 py-1.5 bg-[#f8f9fb]">
                                        <span className="text-[11px] font-medium text-[#1e3a5f]">{row.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ========== INVOICE TITLE BANNER ========== */}
                <div className="mt-8 relative">
                    <div className="bg-[#1e3a5f] text-white py-4 pl-12 pr-20 relative inline-block" style={{ clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)' }}>
                        <h2 className="text-2xl font-bold tracking-widest uppercase text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                            OFFICIAL RECEIPT
                        </h2>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C8A951]" />
                </div>

                {/* ========== CLIENT INFORMATION ========== */}
                <div className="px-12 mt-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e3a5f] mb-3">CLIENT INFORMATION:</p>
                    <div className="space-y-2">
                        <div className="border-b-2 border-[#1e3a5f]/20 pb-2">
                            <p className="text-[13px] font-semibold text-[#1e3a5f]">
                                Name: <span className="font-normal text-[#2a5080]">{buyerName}</span>
                            </p>
                        </div>
                        <div className="border-b-2 border-[#1e3a5f]/20 pb-2">
                            <p className="text-[13px] font-semibold text-[#1e3a5f]">
                                Email: <span className="font-normal text-[#2a5080]">{buyerEmail}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ========== MAIN TABLE ========== */}
                <div className="px-12 mt-8 relative">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-[#1e3a5f] text-white">
                            <th className="py-3 px-3 text-[10px] font-bold uppercase tracking-wider text-center w-[8%] border border-[#2a5080]">No.</th>
                            <th className="py-3 px-3 text-[10px] font-bold uppercase tracking-wider text-left w-[42%] border border-[#2a5080]">Item Description</th>
                            <th className="py-3 px-3 text-[10px] font-bold uppercase tracking-wider text-center w-[15%] border border-[#2a5080]">Units</th>
                            <th className="py-3 px-3 text-[10px] font-bold uppercase tracking-wider text-center w-[15%] border border-[#2a5080]">Price</th>
                            <th className="py-3 px-3 text-[10px] font-bold uppercase tracking-wider text-center w-[20%] border border-[#2a5080]">Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="border-b border-[#1e3a5f]/10 relative">
                            <td className="py-4 px-3 text-center text-[11px] font-medium text-[#1e3a5f]">1</td>
                            <td className="py-4 px-3 text-[11px] font-medium text-[#1e3a5f]">
                                {propertyTitle}
                                <br />
                                <span className="text-[9px] text-[#C8A951] capitalize">{paymentMode} Payment</span>
                            </td>
                            <td className="py-4 px-3 text-center text-[11px] font-medium text-[#1e3a5f]">1</td>
                            <td className="py-4 px-3 text-center text-[11px] font-medium text-[#1e3a5f]">₦{amount.toLocaleString()}</td>
                            <td className="py-4 px-3 text-center text-[11px] font-bold text-[#1e3a5f]">₦{amount.toLocaleString()}</td>
                        </tr>
                        {[...Array(5)].map((_, i) => (
                            <tr key={`empty-${i}`} className="border-b border-[#1e3a5f]/5 h-10">
                                <td colSpan={5}></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Watermark - Logo centered in table */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
                        <img
                            src="/logo.png"
                            alt=""
                            className="w-56 h-56 object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none'
                            }}
                        />
                    </div>
                </div>

                {/* ========== BOTTOM SECTION ========== */}
                <div className="px-12 mt-10 flex justify-between">
                    {/* Left: Payment Details */}
                    <div className="w-[55%]">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e3a5f] mb-4">PAYMENT DETAILS:</h3>
                        <div className="space-y-3">
                            {[
                                { icon: '👤', label: 'Acc Name', value: 'Heaven Ark Properties' },
                                { icon: '💳', label: 'Acc No', value: '1234567890' },
                                { icon: '🏦', label: 'Bank', value: bankName },
                                { icon: '📍', label: 'Branch', value: 'Maitama Branch, Abuja' },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-[#C8A951] text-lg w-8 text-center">{row.icon}</span>
                                    <span className="text-[10px] font-bold text-[#1e3a5f] w-[70px]">{row.label}</span>
                                    <span className="text-[11px] text-[#2a5080] font-medium">→ {row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Totals Box */}
                    <div className="w-[35%] border-2 border-[#1e3a5f]/20 rounded-lg overflow-hidden">
                        <div className="flex justify-between px-4 py-2.5 border-b border-[#1e3a5f]/10 bg-[#f8f9fb]">
                            <span className="text-[10px] font-bold text-[#1e3a5f]">Sub Total:</span>
                            <span className="text-[11px] font-medium text-[#1e3a5f]">₦{amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between px-4 py-2.5 border-b border-[#1e3a5f]/10 bg-[#f8f9fb]">
                            <span className="text-[10px] font-bold text-[#1e3a5f]">Tax:</span>
                            <span className="text-[11px] font-medium text-[#1e3a5f]">₦0.00</span>
                        </div>
                        <div className="flex justify-between px-4 py-3 bg-[#1e3a5f]">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Total:</span>
                            <span className="text-[13px] font-bold text-white">₦{amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* ========== COMPANY STAMP ========== */}
                <div className="px-12 mt-6 flex justify-end">
                    <div className="w-24 h-24 rounded-full border-4 border-[#C8A951] flex flex-col items-center justify-center text-center bg-[#f8f9fb]">
                        <p className="text-[7px] font-bold text-[#1e3a5f] leading-tight">HEAVEN ARK</p>
                        <p className="text-[6px] font-bold text-[#1e3a5f] leading-tight">PROPERTIES</p>
                        <p className="text-[5px] font-bold text-[#C8A951] leading-tight">LTD.</p>
                        <p className="text-[6px] font-bold text-[#1e3a5f] mt-1 leading-tight">CERTIFIED</p>
                    </div>
                </div>

                {/* ========== FOOTER DECORATIVE BANNER ========== */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1200 80" className="w-full" preserveAspectRatio="none">
                        <defs>
                            <pattern id="footerPattern" patternUnits="userSpaceOnUse" width="10" height="10">
                                <rect width="10" height="10" fill="#1e3a5f" />
                                <circle cx="5" cy="5" r="1" fill="#2a5080" opacity="0.5" />
                            </pattern>
                        </defs>
                        <path d="M0,20 Q300,0 600,20 Q900,40 1200,20 L1200,80 L0,80 Z" fill="url(#footerPattern)" />
                        <path d="M0,20 Q300,0 600,20 Q900,40 1200,20" fill="none" stroke="#C8A951" strokeWidth="2" />
                    </svg>
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-[#C8A951] text-lg">✦</span>
                            <p className="text-white text-xs italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Thank you so much for your business
                            </p>
                            <span className="text-[#C8A951] text-lg">✦</span>
                        </div>
                    </div>
                    <div className="h-20 bg-[#1e3a5f]" />
                </div>

                {/* Spacer for footer */}
                <div className="h-24" />
            </div>
        </div>
    )
}