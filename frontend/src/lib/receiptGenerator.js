import { jsPDF } from 'jspdf'

/**
 * Heaven Ark Properties - Official Receipt PDF
 * Matches ReceiptTemplate design exactly
 * - Imported logo from /logo.png
 * - Watermark in table
 * - NO blue decorative corner
 */
export async function generateReceiptPDF(payment) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20

    const receiptNumber = payment.receiptNumber || `HAP-RCPT-${Date.now()}`
    const paymentDate = payment.verifiedAt || payment.submittedAt || new Date().toISOString()
    const formattedDate = new Date(paymentDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
    const amount = Number(payment.amountPaid || payment.amount || 0)

    const NAVY = [30, 58, 95]
    const GOLD = [200, 169, 81]
    const WHITE = [255, 255, 255]
    const DARK = [30, 30, 30]
    const GRAY = [100, 100, 100]

    // Load logo
    let logoDataUrl = null
    try { logoDataUrl = await loadImageAsDataUrl('/logo.png') } catch (err) {}

    let y = margin

    // ==================== HEADER: LOGO + COMPANY INFO ====================
    const logoSize = 22

    // Logo
    if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', margin + 18, y, logoSize, logoSize)
    } else {
        // Fallback circle with HA
        doc.setFillColor(...NAVY)
        doc.setDrawColor(...GOLD)
        doc.setLineWidth(2)
        doc.roundedRect(margin + 18, y, logoSize, logoSize, 4, 4, 'FD')
        doc.setFontSize(16)
        doc.setFont('times', 'bold')
        doc.setTextColor(...GOLD)
        doc.text('HA', margin + 18 + logoSize / 2, y + logoSize / 2 + 5, { align: 'center' })
    }

    // Company Name
    const nameX = margin + logoSize + 30
    doc.setFontSize(16)
    doc.setFont('times', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('HEAVEN ARK', nameX, y + 8)

    doc.setFontSize(10)
    doc.setTextColor(...GOLD)
    doc.text('PROPERTIES', nameX, y + 15)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.text('📞 +234 800 000 0000', nameX, y + 22)
    doc.text('✉️ info@heavenark.com', nameX, y + 28)

    // ==================== META BOXES (RIGHT) ====================
    const metaX = pageWidth - margin - 70
    let metaY = y

    doc.setDrawColor(...NAVY)
    doc.setLineWidth(1)

    const metaFields = [
        { label: 'Date:', value: formattedDate },
        { label: 'Inv No.:', value: receiptNumber },
        { label: 'P.O. No.:', value: (payment.transactionReference || 'N/A').substring(0, 12) },
    ]

    metaFields.forEach((field) => {
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...NAVY)
        doc.text(field.label, metaX, metaY + 4)
        doc.rect(metaX + 22, metaY + 1, 45, 6, 'S')
        doc.setFont('helvetica', 'normal')
        doc.text(field.value, metaX + 24, metaY + 5)
        metaY += 10
    })

    // ==================== TITLE BANNER ====================
    y = margin + logoSize + 12
    const bannerW = 90

    // Angled banner (polygon effect)
    doc.setFillColor(...NAVY)
    doc.triangle(margin, y, margin + bannerW, y, margin + bannerW, y + 14, 'F')
    doc.rect(margin, y, bannerW - 10, 14, 'F')

    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    doc.setTextColor(...WHITE)
    doc.text('OFFICIAL RECEIPT', margin + 10, y + 9)

    // Gold line under banner
    y += 14
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(1)
    doc.line(margin, y, pageWidth - margin, y)

    // ==================== CLIENT INFORMATION ====================
    y += 10
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('CLIENT INFORMATION:', margin, y)

    y += 6
    doc.setDrawColor(...NAVY)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageWidth - margin, y)
    y += 3
    doc.line(margin, y, pageWidth - margin, y)

    y += 6
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('Name: ', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(42, 80, 128)
    doc.text(payment.buyerName || payment.senderName || 'N/A', margin + 20, y)

    y += 6
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('Email: ', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(42, 80, 128)
    doc.text(payment.buyerEmail || 'N/A', margin + 22, y)

    // ==================== MAIN TABLE ====================
    y += 10
    const tableTop = y
    const tableLeft = margin
    const tableRight = pageWidth - margin
    const tableWidth = tableRight - tableLeft
    const colWidths = [tableWidth * 0.08, tableWidth * 0.42, tableWidth * 0.15, tableWidth * 0.15, tableWidth * 0.20]

    // Table border
    doc.setDrawColor(...NAVY)
    doc.setLineWidth(0.5)
    doc.rect(tableLeft, tableTop, tableWidth, 60, 'S')

    // Column dividers
    let colX = tableLeft
    colWidths.slice(0, -1).forEach(w => {
        colX += w
        doc.line(colX, tableTop, colX, tableTop + 60)
    })

    // Header
    doc.setFillColor(...NAVY)
    doc.rect(tableLeft, tableTop, tableWidth, 10, 'F')

    const headers = ['No.', 'Item Description', 'Units', 'Price', 'Amount']
    colX = tableLeft
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    headers.forEach((h, i) => {
        const align = i >= 2 ? 'right' : 'left'
        const x = i === 0 ? colX + 4 : i === 1 ? colX + 4 : colX + colWidths[i] - 4
        doc.text(h, x, tableTop + 7, { align })
        colX += colWidths[i]
    })

    // Data Row
    const rowY = tableTop + 15
    colX = tableLeft
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...NAVY)
    doc.text('1', colX + 4, rowY)
    colX += colWidths[0]
    doc.text(`${payment.propertyTitle || 'Property'} (${payment.paymentMode || 'installment'})`, colX + 4, rowY)
    colX += colWidths[1]
    doc.text('1', colX + colWidths[2] - 4, rowY, { align: 'right' })
    colX += colWidths[2]
    doc.text(`₦${amount.toLocaleString()}`, colX + colWidths[3] - 4, rowY, { align: 'right' })
    colX += colWidths[3]
    doc.setFont('helvetica', 'bold')
    doc.text(`₦${amount.toLocaleString()}`, colX + colWidths[4] - 4, rowY, { align: 'right' })

    // Empty row lines
    for (let i = 1; i <= 5; i++) {
        doc.setDrawColor(...NAVY)
        doc.setLineWidth(0.1)
        doc.line(tableLeft, tableTop + 15 + (i * 7), tableRight, tableTop + 15 + (i * 7))
    }

    // ==================== WATERMARK ====================
    if (logoDataUrl) {
        const wmSize = 40
        doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - wmSize, tableTop + 10, wmSize * 2, wmSize * 2, undefined, 'FAST', 0.04)
    } else {
        doc.setFontSize(50)
        doc.setFont('times', 'bold')
        doc.setTextColor(...[...NAVY, 0.04])
        doc.text('HA', pageWidth / 2, tableTop + 35, { align: 'center' })
    }

    doc.setTextColor(...DARK)

    // ==================== PAYMENT DETAILS + TOTALS ====================
    y = tableTop + 68

    // Payment Details (Left)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('PAYMENT DETAILS:', margin, y)

    y += 8
    const bankRows = [
        { icon: '👤', label: 'Acc Name', value: 'Heaven Ark Properties' },
        { icon: '💳', label: 'Acc No', value: '1234567890' },
        { icon: '🏦', label: 'Bank', value: payment.bankName || 'Access Bank Plc' },
        { icon: '📍', label: 'Branch', value: 'Maitama Branch, Abuja' },
    ]

    bankRows.forEach((row) => {
        doc.setFontSize(7)
        doc.setTextColor(...GOLD)
        doc.text(row.icon, margin, y)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...NAVY)
        doc.text(row.label, margin + 8, y + 1)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(42, 80, 128)
        doc.text(`→ ${row.value}`, margin + 28, y + 1)
        y += 7
    })

    // Totals (Right)
    const totalsX = pageWidth - margin - 55
    let totalsY = tableTop + 66

    doc.setDrawColor(...NAVY)
    doc.setLineWidth(0.5)
    doc.rect(totalsX, totalsY, 55, 28, 'S')

    const totalsRows = [
        { label: 'Sub Total:', value: `₦${amount.toLocaleString()}`, bold: false },
        { label: 'Tax:', value: '₦0.00', bold: false },
        { label: 'Total:', value: `₦${amount.toLocaleString()}`, bold: true },
    ]

    totalsRows.forEach((row) => {
        if (row.bold) {
            doc.setFillColor(...NAVY)
            doc.rect(totalsX, totalsY, 55, 9, 'F')
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(...WHITE)
        } else {
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(...NAVY)
        }
        doc.setFontSize(8)
        doc.text(row.label, totalsX + 3, totalsY + 6)
        doc.text(row.value, totalsX + 50, totalsY + 6, { align: 'right' })
        totalsY += 9
    })

    // ==================== COMPANY STAMP ====================
    y = totalsY + 8
    const stampX = pageWidth - margin - 18
    const stampY = y + 8

    doc.setDrawColor(...GOLD)
    doc.setLineWidth(3)
    doc.circle(stampX, stampY, 16)
    doc.setLineWidth(0.5)
    doc.setDrawColor(...NAVY)
    doc.circle(stampX, stampY, 14)

    doc.setFontSize(6)
    doc.setFont('times', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('HEAVEN ARK', stampX, stampY - 3, { align: 'center' })
    doc.text('PROPERTIES', stampX, stampY + 1, { align: 'center' })
    doc.setFontSize(5)
    doc.setTextColor(...GOLD)
    doc.text('LTD.', stampX, stampY + 5, { align: 'center' })
    doc.text('CERTIFIED', stampX, stampY + 9, { align: 'center' })

    // ==================== FOOTER BANNER ====================
    y = pageHeight - 28

    doc.setFillColor(...NAVY)
    doc.rect(0, y, pageWidth, 28, 'F')

    // Gold top line
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(2)
    doc.line(0, y, pageWidth, y)

    // Gold dots
    doc.setFillColor(...GOLD)
    for (let i = 0; i < 15; i++) {
        doc.circle(15 + (i * 13), y + 4, 0.5, 'F')
        doc.circle(15 + (i * 13), y + 22, 0.5, 'F')
    }

    // Thank you text
    y += 10
    doc.setFontSize(8)
    doc.setFont('times', 'italic')
    doc.setTextColor(...GOLD)
    doc.text('✦', pageWidth / 2 - 50, y + 2, { align: 'center' })
    doc.text('✦', pageWidth / 2 + 50, y + 2, { align: 'center' })
    doc.setTextColor(...WHITE)
    doc.text('Thank you so much for your business', pageWidth / 2, y + 2, { align: 'center' })

    return doc.output('blob')
}

/**
 * Load image from public folder
 */
function loadImageAsDataUrl(path) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => reject(new Error(`Failed to load: ${path}`))
        img.src = path
    })
}

/**
 * Download receipt as PDF
 */
export async function downloadReceipt(payment) {
    const blob = await generateReceiptPDF(payment)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Receipt-${payment.receiptNumber || 'HAP-RCPT'}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}