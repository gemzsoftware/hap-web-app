'use client'

import { useRef } from 'react'
import { ShieldCheck, Printer, FileText, Landmark } from 'lucide-react'

export default function ReceiptDocument({ receiptData, landData }) {
    const printAreaRef = useRef()

    const handlePrintDownload = () => {
        const printContent = printAreaRef.current.innerHTML
        const printWindow = window.open('', '', 'height=1000,width=850')
        printWindow.document.write('<html><head><title>Heaven Ark Properties - Invoice/Receipt</title>')

        // CSS rules specifically designed to match the uploaded physical copy layout 1:1 on print
        printWindow.document.write(`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 20px; background: #fff; color: #1e293b; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .invoice-container { border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; position: relative; background: #fff; overflow: hidden; min-height: 950px; display: flex; flex-col; justify-content: space-between; }
                
                /* Top Luxury Wave Styling imitating image layout */
                .top-bar-wave { display: flex; justify-content: space-between; items-start; border-bottom: 2px dashed #e2e8f0; padding-bottom: 30px; margin-bottom: 25px; }
                .logo-section img { height: 75px; object-fit: contain; }
                .logo-section h2 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 8px 0 2px 0; letter-spacing: -0.5px; }
                .contact-line { font-size: 11px; color: #64748b; font-weight: 600; margin: 2px 0; }
                
                /* Stacked Right Side Fields matching boxes */
                .meta-boxes { display: flex; flex-direction: column; gap: 8px; width: 260px; }
                .meta-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 12px; font-weight: 700; color: #1e3d6b; }
                .meta-box-input { border: 1px solid #cca43b; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-family: monospace; color: #334155; min-width: 160px; background: #fff; text-align: right; font-weight: bold; }
                
                /* Big Accent Blue Bar Header Strip */
                .invoice-title-strip { background: #1e3d6b; color: #fff; padding: 12px 25px; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; border-left: 5px solid #cca43b; border-radius: 4px; margin-bottom: 20px; }
                .client-info-block { font-size: 12px; color: #1e3d6b; font-weight: 800; margin-bottom: 30px; border-bottom: 1px solid #cbd5e1; padding-bottom: 15px; }
                .client-info-block span { color: #334155; font-weight: 700; margin-left: 10px; text-transform: uppercase; }
                
                /* Grid Grid Grid Table Structure */
                .grid-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 1px solid #1e3d6b; border-radius: 6px; overflow: hidden; }
                .grid-table th { background: #1e3d6b; color: #fff; font-size: 11px; font-weight: 800; padding: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .grid-table td { padding: 14px 12px; font-size: 12px; color: #334155; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: bold; }
                .grid-table tr:last-child td { border-bottom: none; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                
                /* Bottom Footer Alignment - Payment Details vs Totals split */
                .footer-grid { display: flex; justify-content: space-between; gap: 30px; margin-top: auto; padding-top: 20px; }
                .bank-details-box { width: 50%; font-size: 11px; color: #334155; font-weight: 600; }
                .bank-title { font-size: 12px; font-weight: 800; color: #1e3d6b; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid #cca43b; padding-bottom: 4px; display: inline-block; }
                .bank-row { display: flex; margin: 4px 0; }
                .bank-label { color: #64748b; width: 85px; font-weight: 700; }
                .bank-value { color: #0f172a; font-weight: 700; }
                
                .totals-box { width: 45%; display: flex; flex-direction: column; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
                .totals-row { display: flex; justify-content: space-between; padding: 10px 15px; font-size: 11px; font-weight: 700; color: #64748b; border-bottom: 1px solid #e2e8f0; }
                .totals-row.grand { background: #1e3d6b; color: #fff; font-size: 14px; font-weight: 800; border-bottom: none; }
                .totals-value { font-weight: bold; color: #0f172a; }
                .totals-row.grand .totals-value { color: #fff; font-family: monospace; }
                
                .thank-you-bar { text-align: center; font-size: 12px; font-style: italic; color: #1e3d6b; font-weight: 700; border-top: 1px dashed #cbd5e1; margin-top: 40px; padding-top: 15px; }
            </style>
        `);

        printWindow.document.write('</head><body><div class="invoice-container">')
        printWindow.document.write(printContent)
        printWindow.document.write('</div></body></html>')
        printWindow.document.close()
        printWindow.print()
    }

    // Default calculations to match invoice blocks automatically
    const baseValue = Number(receiptData?.amount || landData?.price || 0)
    const subTotal = baseValue
    const taxAmount = 0 // Stays clean as placeholder unless assigned
    const totalValue = subTotal + taxAmount

    return (
        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 md:p-10 max-w-4xl mx-auto text-white shadow-2xl space-y-6 selection:bg-emerald-500/20">

            {/* Header Form Controllers */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-wider">
                    <FileText className="w-4 h-4 text-amber-400" /> Print Alignment Module
                </div>
                <button
                    onClick={handlePrintDownload}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest px-5 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-600/10"
                >
                    <Printer className="w-4 h-4" /> Print / Save Corporate Form
                </button>
            </div>

            {/* LIVE DATA INJECTION ENGINE MATED TO PRINT WINDOW WRAPPERS */}
            <div ref={printAreaRef} className="hidden-from-screen-but-readable-by-ref">

                {/* Section 1: Logo & Header Metadata Boxes */}
                <div className="top-bar-wave">
                    <div className="logo-section">
                        {/* Pulls logo explicitly from public root directory references */}
                        <img src="/logo.png" alt="" onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=150"}} />
                        <h2>HEAVEN ARK PROPERTIES</h2>
                        <div className="contact-line">📞 +234 (0) 805 867 8439</div>
                        <div className="contact-line">✉️ heavenarkproperties@gmail.com</div>
                    </div>

                    <div className="meta-boxes">
                        <div className="meta-row">
                            <span>Date:</span>
                            <div className="meta-box-input">{new Date(receiptData?.issuedAt || receiptData?.createdAt || Date.now()).toLocaleDateString('en-NG')}</div>
                        </div>
                        <div className="meta-row">
                            <span>Inv No.:</span>
                            <div className="meta-box-input">{receiptData?.serialNumber || `INV-${Date.now().toString().slice(-6)}`}</div>
                        </div>
                        <div className="meta-row">
                            <span>P.O. No.:</span>
                            <div className="meta-box-input">{receiptData?.transactionReference ? receiptData.transactionReference.slice(0,8).toUpperCase() : 'PO-ARK-99'}</div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Header Identifier Label Bar */}
                <div className="invoice-title-strip">
                    Invoice | Delivery Note
                </div>

                {/* Section 3: Client Identity Target Line */}
                <div className="client-info-block">
                    CLIENT INFORMATION: <span>{receiptData?.senderName || 'Verified Investor Account Pool'}</span>
                </div>

                {/* Section 4: Line Item Data Grid Table Matrix */}
                <table className="grid-table">
                    <thead>
                    <tr>
                        <th style={{ width: '8%' }} className="text-center">No.</th>
                        <th style={{ width: '52%' }}>Item Description</th>
                        <th style={{ width: '12%' }} className="text-center">Units</th>
                        <th style={{ width: '14%' }} className="text-right">Price</th>
                        <th style={{ width: '14%' }} className="text-right">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="text-center">1</td>
                        <td>Land Allocation: Real Estate Infrastructure Plot — <strong>{landData?.title || 'Heaven Ark Parcel'}</strong> ({landData?.size || '500 sqm'})</td>
                        <td className="text-center">1</td>
                        <td className="text-right">₦{baseValue.toLocaleString()}</td>
                        <td className="text-right">₦{baseValue.toLocaleString()}</td>
                    </tr>
                    {/* Empty padding rows to preserve the aesthetics of the template */}
                    <tr>
                        <td className="text-center" style={{color: 'transparent'}}>2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="text-center" style={{color: 'transparent'}}>3</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>

                {/* Section 5: Base Grid Split (Payment Coordinates vs Calculations) */}
                <div className="footer-grid">
                    <div className="bank-details-box">
                        <div className="bank-title">Payment Details:</div>

                        <div className="bank-row">
                            <span className="bank-label">Acc Name:</span>
                            <span className="bank-value">Heaven Ark Properties</span>
                        </div>
                        <div className="bank-row">
                            <span className="bank-label">Acc No.:</span>
                            <span className="bank-value">1234567890</span>
                        </div>
                        <div className="bank-row">
                            <span className="bank-label">Bank:</span>
                            <span className="bank-value">Access Bank Plc</span>
                        </div>
                        <div className="bank-row">
                            <span className="bank-label">Branch:</span>
                            <span className="bank-value">Maitama Branch, Abuja</span>
                        </div>
                    </div>

                    <div className="totals-box">
                        <div className="totals-row">
                            <span>Sub Total:</span>
                            <span className="totals-value">₦{subTotal.toLocaleString()}.00</span>
                        </div>
                        <div className="totals-row">
                            <span>Tax:</span>
                            <span className="totals-value">₦{taxAmount.toLocaleString()}.00</span>
                        </div>
                        <div className="totals-row grand">
                            <span>Total:</span>
                            <span>₦{totalValue.toLocaleString()}.00</span>
                        </div>
                    </div>
                </div>

                {/* Section 6: Base Slogan Center Ribbon Bar */}
                <div className="thank-you-bar">
                    Thank you so much for your business
                </div>

            </div>

            {/* Live Interactive UI Preview Window */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-center space-y-4">
                <p className="text-sm text-slate-400">
                    The document rendering matrix is synced with your <span className="text-amber-400 font-bold">Access Bank template layout</span>.
                    Click the download button above to generate your corporate print-ready copy.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-xl">
                    <span>Target Invoice:</span>
                    <span className="text-emerald-400 font-bold">{receiptData?.serialNumber || 'ARK-PENDING'}</span>
                </div>
            </div>

        </div>
    )
}