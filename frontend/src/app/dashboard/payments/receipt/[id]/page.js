'use client'

import React, { useRef, use } from 'react'
import {
    Printer,
    Download,
    ArrowLeft,
    User,
    CreditCard,
    Landmark
} from 'lucide-react'

import Link from 'next/link'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function ProfessionalReceiptPortal({ params }) {

    const resolvedParams = use(params)
    const receiptId = resolvedParams?.id
    const receiptRef = useRef(null)

    const navy = '#002B5B'
    const gold = '#B59410'

    /* PRINT */
    const handlePrint = () => {
        window.print()
    }

    /* DOWNLOAD PDF */
    const handleDownloadPDF = async () => {

        try {

            const element = receiptRef.current

            if (!element) return

            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            })

            const imgData = canvas.toDataURL('image/png')

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [800, 1120]
            })

            pdf.addImage(
                imgData,
                'PNG',
                0,
                0,
                800,
                1120
            )

            pdf.save(`HeavenArk-Receipt-${receiptId}.pdf`)

        } catch (error) {
            console.error('PDF Error:', error)
        }
    }

    return (

        <div className="min-h-screen bg-[#020617] py-8 md:py-12 px-4 overflow-x-hidden">

            {/* ACTION BAR */}
            <div className="max-w-[800px] mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-6 print:hidden">

                <Link
                    href="/dashboard/payments"
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all group"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Return to Ledger
                </Link>

                <div className="flex gap-3 w-full md:w-auto">

                    {/* PRINT */}
                    <button
                        onClick={handlePrint}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.05)] text-white border border-[rgba(255,255,255,0.1)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[rgba(255,255,255,0.1)] transition-all"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                    </button>

                    {/* PDF */}
                    <button
                        onClick={handleDownloadPDF}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                    </button>

                </div>

            </div>

            {/* RECEIPT WRAPPER */}
            <div className="w-full overflow-x-auto pb-10 flex justify-start md:justify-center">

                {/* RECEIPT */}
                <div
                    ref={receiptRef}
                    id="receipt-content"
                    className="relative bg-white shadow-2xl print:shadow-none flex flex-col border border-slate-200 shrink-0 overflow-hidden"
                    style={{
                        width: '800px',
                        minHeight: '1120px'
                    }}
                >

                    {/* WATERMARK */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">

                        <h1
                            className="text-[180px] font-black tracking-tight"
                            style={{ color: navy }}
                        >
                            HEAVEN ARK
                        </h1>

                    </div>

                    {/* HEADER */}
                    <div className="relative h-60 w-full overflow-hidden">

                        {/* TOP CURVE */}
                        <div
                            className="absolute top-[-25%] right-[-12%] w-[75%] h-[160%] rounded-bl-[100%]"
                            style={{
                                backgroundColor: navy,
                                borderLeft: `12px solid ${gold}`
                            }}
                        />

                        {/* PATTERN OVERLAY */}
                        <div
                            className="absolute top-0 right-0 w-[70%] h-full opacity-10"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                backgroundSize: '20px 20px'
                            }}
                        />

                        {/* CONTENT */}
                        <div className="relative z-10 p-12 flex flex-col gap-6 text-left">

                            {/* LOGO */}
                            <div className="space-y-1">

                                <h2
                                    className="text-5xl font-black tracking-tighter leading-none"
                                    style={{ color: navy }}
                                >
                                    HEAVEN ARK
                                </h2>

                                <p
                                    className="text-[11px] font-black uppercase tracking-[0.6em] ml-1"
                                    style={{ color: gold }}
                                >
                                    Properties
                                </p>

                            </div>

                            {/* CONTACT */}
                            <div className="space-y-3 text-[11px] font-bold text-slate-700">

                                <p className="flex items-center gap-3">
                                    <span className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-full text-[8px]">
                                        TEL
                                    </span>

                                    +234 (0) 805 867 8439
                                </p>

                                <p className="flex items-center gap-3">
                                    <span className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-full text-[8px]">
                                        EML
                                    </span>

                                    heavenarkproperties@gmail.com
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* TITLE + REFERENCE */}
                    <div className="px-12 mt-10 flex justify-between items-start gap-8">

                        {/* TITLE */}
                        <div
                            className="inline-block text-white px-10 py-5 rounded-tr-[2.5rem] rounded-bl-[2.5rem] shadow-xl"
                            style={{
                                backgroundColor: navy,
                                borderLeft: `10px solid ${gold}`
                            }}
                        >

                            <h1 className="text-lg font-black italic tracking-[0.15em] uppercase">
                                Invoice | Delivery Note
                            </h1>

                        </div>

                        {/* REF BOXES */}
                        <div className="space-y-3">

                            <RefEntry
                                label="Date"
                                value="08/05/2026"
                                gold={gold}
                                navy={navy}
                            />

                            <RefEntry
                                label="Inv No."
                                value={`HAR-${receiptId?.toUpperCase() || '0001'}`}
                                gold={gold}
                                navy={navy}
                            />

                            <RefEntry
                                label="P.O. No."
                                value="PR-0941"
                                gold={gold}
                                navy={navy}
                            />

                        </div>

                    </div>

                    {/* CLIENT INFO */}
                    <div className="p-12 text-left space-y-8 mt-4">

                        <h3
                            className="text-[11px] font-black uppercase tracking-[0.3em]"
                            style={{ color: navy }}
                        >
                            Investor Information
                        </h3>

                        <div className="space-y-6">

                            <div className="border-b-2 border-slate-100 pb-3 text-xs font-bold text-slate-800 uppercase tracking-tight">
                                Client: Verified Account Identity: SEC-ARK-091
                            </div>

                            <div className="border-b-2 border-slate-100 pb-3 text-xs font-bold text-slate-800 uppercase tracking-tight">
                                Description: Installment 04/12 - Heaven Ark Asset
                            </div>

                        </div>

                    </div>

                    {/* TABLE */}
                    <div className="flex-1 px-12 py-6 relative z-10">

                        <table className="w-full border-collapse border border-slate-200">

                            <thead>

                            <tr
                                className="text-white text-[10px] font-black uppercase tracking-widest"
                                style={{ backgroundColor: navy }}
                            >

                                <th className="p-5 border border-slate-700 w-16">
                                    No.
                                </th>

                                <th className="p-5 border border-slate-700 text-left">
                                    Item Description
                                </th>

                                <th className="p-5 border border-slate-700 w-28">
                                    Units
                                </th>

                                <th className="p-5 border border-slate-700 w-32">
                                    Price
                                </th>

                                <th className="p-5 border border-slate-700 w-32">
                                    Amount
                                </th>

                            </tr>

                            </thead>

                            <tbody>

                            <tr
                                className="border-b border-slate-100 align-top"
                                style={{ height: '380px' }}
                            >

                                <td className="p-5 border-x border-slate-200 text-center text-xs font-bold text-slate-400">
                                    01
                                </td>

                                <td className="p-5 border-r border-slate-200 text-xs font-black text-slate-900 uppercase leading-relaxed text-left">
                                    Land Acquisition: Heaven Ark Phase 1 Asset Allocation
                                </td>

                                <td className="p-5 border-r border-slate-200 text-center text-xs font-bold">
                                    01
                                </td>

                                <td className="p-5 border-r border-slate-200 text-center text-xs font-bold">
                                    ₦1,250,000
                                </td>

                                <td
                                    className="p-5 text-center text-xs font-black"
                                    style={{ color: navy }}
                                >
                                    ₦1,250,000
                                </td>

                            </tr>

                            </tbody>

                        </table>

                    </div>

                    {/* PAYMENT DETAILS + TOTAL */}
                    <div
                        className="p-12 grid grid-cols-2 gap-0 border-t-2 relative z-10"
                        style={{ borderColor: gold }}
                    >

                        {/* LEFT */}
                        <div className="space-y-6 border-r border-slate-100 pr-12 text-left">

                            <h4
                                className="text-[11px] font-black uppercase tracking-widest"
                                style={{ color: navy }}
                            >
                                Payment Details
                            </h4>

                            <div className="space-y-4">

                                <BankDetail
                                    icon={<User className="w-3.5 h-3.5" />}
                                    label="Beneficiary"
                                    value="Heaven Ark Properties"
                                    navy={navy}
                                    gold={gold}
                                />

                                <BankDetail
                                    icon={<CreditCard className="w-3.5 h-3.5" />}
                                    label="Acc No."
                                    value="1234567890"
                                    navy={navy}
                                    gold={gold}
                                />

                                <BankDetail
                                    icon={<Landmark className="w-3.5 h-3.5" />}
                                    label="Institution"
                                    value="Access Bank Plc"
                                    navy={navy}
                                    gold={gold}
                                />

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="text-right flex flex-col justify-end">

                            <div className="flex justify-between items-center py-3 px-6 border-b border-slate-100">

                                <span className="text-[10px] font-black uppercase text-slate-400">
                                    Sub Total
                                </span>

                                <span className="text-sm font-bold">
                                    ₦1,250,000.00
                                </span>

                            </div>

                            <div
                                className="flex justify-between items-center py-5 px-8 text-white mt-6 shadow-xl"
                                style={{ backgroundColor: navy }}
                            >

                                <span className="text-[11px] font-black uppercase italic tracking-[0.2em]">
                                    Total NGN
                                </span>

                                <span className="text-2xl font-black italic tracking-tighter">
                                    ₦1,250,000.00
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="relative h-24 w-full mt-auto overflow-hidden">

                        <div
                            className="absolute bottom-0 left-0 w-full h-full rounded-t-[100%] scale-x-125"
                            style={{
                                backgroundColor: navy,
                                borderTop: `8px solid ${gold}`
                            }}
                        />

                        <div className="relative z-10 flex items-center justify-center h-full">

                            <p className="text-white italic font-bold text-[11px] uppercase tracking-[0.3em] flex items-center gap-6">

                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: gold }}
                                />

                                Thank you for your business

                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: gold }}
                                />

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* PRINT STYLES */}
            <style jsx global>{`

                @page {
                    size: A4;
                    margin: 0;
                }

                @media print {

                    html,
                    body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    body * {
                        visibility: hidden;
                    }

                    #receipt-content,
                    #receipt-content * {
                        visibility: visible;
                    }

                    #receipt-content {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 800px !important;
                        min-height: 1120px !important;
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                    }

                    .print\\:hidden {
                        display: none !important;
                    }

                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }

            `}</style>

        </div>

    )
}

/* REFERENCE ENTRY */
function RefEntry({ label, value, gold, navy }) {

    return (

        <div className="flex items-center justify-between w-64 gap-6">

            <span
                className="text-[10px] font-black uppercase tracking-tighter"
                style={{ color: navy }}
            >
                {label}
            </span>

            <div
                className="flex-1 bg-white rounded-xl p-2.5 text-[10px] font-black text-slate-800 flex items-center shadow-sm"
                style={{
                    border: `1.5px solid ${gold}`
                }}
            >
                {value}
            </div>

        </div>

    )
}

/* BANK DETAIL */
function BankDetail({ icon, label, value, navy, gold }) {

    return (

        <div className="flex items-center gap-4">

            <div
                className="p-2 rounded-lg"
                style={{
                    backgroundColor: `${navy}10`,
                    color: gold
                }}
            >
                {icon}
            </div>

            <p className="text-[10px] font-bold">

                <span
                    className="font-black uppercase mr-3"
                    style={{ color: navy }}
                >
                    {label}:
                </span>

                <span className="text-slate-900">
                    {value}
                </span>

            </p>

        </div>

    )
}