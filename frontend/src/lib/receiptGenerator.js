import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Download receipt as PDF by capturing the HTML receipt template
 * @param {string} elementId - ID of the receipt container element
 * @param {string} filename - Download filename
 */
export async function downloadReceiptAsPDF(elementId, filename) {
    const element = document.getElementById(elementId)
    if (!element) {
        console.error('Receipt element not found')
        return
    }

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
    }

    pdf.save(filename || 'receipt.pdf')
}

/**
 * Generate simple PDF receipt using jsPDF (fallback/quick version)
 * @param {Object} payment - Payment data
 * @returns {Blob}
 */
export function generateReceiptPDF(payment) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    // Header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(30, 58, 95)
    doc.text('HEAVEN ARK PROPERTIES LTD.', pageWidth / 2, y, { align: 'center' })

    y += 7
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text('RC: 1234567 | +234 800 000 0000 | info@heavenark.com', pageWidth / 2, y, { align: 'center' })

    y += 8
    doc.setDrawColor(200, 169, 81)
    doc.setLineWidth(1.5)
    doc.line(20, y, pageWidth - 20, y)

    y += 10
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 58, 95)
    doc.text('OFFICIAL PAYMENT RECEIPT', pageWidth / 2, y, { align: 'center' })

    y += 8
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text(`Receipt No: ${payment.receiptNumber || 'HAP-RCPT-' + Date.now()}`, pageWidth / 2, y, { align: 'center' })
    y += 5
    doc.text(`Date: ${new Date(payment.verifiedAt || Date.now()).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, y, { align: 'center' })

    y += 8
    doc.setDrawColor(200, 200, 200)
    doc.line(25, y, pageWidth - 25, y)

    y += 10
    doc.setFontSize(10)
    const details = [
        ['Property:', payment.propertyTitle || 'N/A'],
        ['Buyer:', payment.buyerName || payment.senderName || 'N/A'],
        ['Email:', payment.buyerEmail || 'N/A'],
        ['Payment Mode:', payment.paymentMode === 'full' ? 'Full Payment' : 'Installment'],
        ['Amount Paid:', `₦${Number(payment.amountPaid || payment.amount || 0).toLocaleString()}`],
        ['Reference:', payment.transactionReference || 'N/A'],
        ['Bank:', payment.bankName || 'N/A'],
        ['Status:', 'VERIFIED ✅'],
    ]

    details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 25, y)
        doc.setFont('helvetica', 'normal')
        doc.text(value, 70, y)
        y += 7
    })

    y += 5
    doc.setDrawColor(200, 200, 200)
    doc.line(25, y, pageWidth - 25, y)

    y += 10
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 58, 95)
    doc.text(`TOTAL: ₦${Number(payment.amountPaid || payment.amount || 0).toLocaleString()}`, pageWidth / 2, y, { align: 'center' })

    // Stamp
    y += 15
    doc.setDrawColor(200, 169, 81)
    doc.setLineWidth(1.5)
    doc.circle(pageWidth - 45, y + 12, 15)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 58, 95)
    doc.text('HEAVEN ARK', pageWidth - 45, y + 9, { align: 'center' })
    doc.text('PROPERTIES', pageWidth - 45, y + 13, { align: 'center' })
    doc.text('LTD.', pageWidth - 45, y + 17, { align: 'center' })
    doc.text('CERTIFIED', pageWidth - 45, y + 21, { align: 'center' })

    y += 30
    doc.setDrawColor(200, 169, 81)
    doc.line(20, y, pageWidth - 20, y)
    y += 6
    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    doc.text('This is a computer-generated receipt. No signature required.', pageWidth / 2, y, { align: 'center' })
    y += 4
    doc.text('Thank you for your business!', pageWidth / 2, y, { align: 'center' })

    return doc.output('blob')
}

/**
 * Download receipt as PDF
 */
export function downloadReceipt(payment) {
    const blob = generateReceiptPDF(payment)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Receipt-${payment.receiptNumber || 'HAP-RCPT'}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}