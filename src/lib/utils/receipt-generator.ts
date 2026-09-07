'use client'

// ============================================
// FEE RECEIPT GENERATOR
// Generates a printable A5 PDF receipt for fee payments
// Uses jsPDF (already installed as jspdf@4.2.1)
// ============================================

import { jsPDF } from 'jspdf'

export interface ReceiptOptions {
    receiptNo: string
    date: Date
    studentName: string
    studentId: string
    courseName: string
    installmentNo: number
    amount: number
    mode: string
    transactionId?: string
    remarks?: string
    organizationName: string
    branchName?: string
}

function formatMode(mode: string): string {
    const modeMap: Record<string, string> = {
        cash: 'Cash',
        online: 'Online / UPI',
        cheque: 'Cheque',
        bank_transfer: 'Bank Transfer'
    }
    return modeMap[mode?.toLowerCase()] || mode || 'N/A'
}

function formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Generates a payment receipt PDF and triggers browser download.
 */
export function generateFeeReceipt(options: ReceiptOptions): void {
    const {
        receiptNo,
        date,
        studentName,
        studentId,
        courseName,
        installmentNo,
        amount,
        mode,
        transactionId,
        remarks,
        organizationName,
        branchName
    } = options

    // A5 portrait dimensions: 148mm × 210mm
    const doc = new jsPDF({ format: 'a5', orientation: 'portrait', unit: 'mm' })

    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const margin = 10
    const contentW = pageW - margin * 2

    // ──────────────────────────────────────────
    // HEADER BAND
    // ──────────────────────────────────────────
    doc.setFillColor(79, 70, 229) // indigo-600
    doc.rect(0, 0, pageW, 38, 'F')

    // Organization Name
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(organizationName.toUpperCase(), pageW / 2, 14, { align: 'center' })

    if (branchName) {
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(branchName, pageW / 2, 20, { align: 'center' })
    }

    // PAYMENT RECEIPT label
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(200, 200, 255)
    doc.text('PAYMENT RECEIPT', pageW / 2, 32, { align: 'center' })

    // ──────────────────────────────────────────
    // RECEIPT META (Receipt # and Date)
    // ──────────────────────────────────────────
    let y = 46

    doc.setTextColor(30, 30, 30)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('Receipt No:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(receiptNo, margin + 26, y)

    const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    doc.setFont('helvetica', 'bold')
    doc.text('Date:', pageW - margin - 50, y)
    doc.setFont('helvetica', 'normal')
    doc.text(dateStr, pageW - margin - 38, y)

    // Divider
    y += 5
    doc.setDrawColor(220, 220, 230)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageW - margin, y)

    // ──────────────────────────────────────────
    // STUDENT DETAILS SECTION
    // ──────────────────────────────────────────
    y += 8
    doc.setFontSize(7.5)
    doc.setTextColor(100, 100, 120)
    doc.setFont('helvetica', 'bold')
    doc.text('STUDENT DETAILS', margin, y)

    y += 6
    const detailRows: [string, string][] = [
        ['Student Name', studentName],
        ['Student ID',   studentId || 'N/A'],
        ['Course',       courseName],
        ['Installment',  `#${installmentNo}`],
    ]

    doc.setFontSize(8.5)
    for (const [label, value] of detailRows) {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60, 60, 70)
        doc.text(label + ':', margin, y)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(20, 20, 30)
        doc.text(value, margin + 36, y)
        y += 6.5
    }

    // ──────────────────────────────────────────
    // PAYMENT DETAILS SECTION
    // ──────────────────────────────────────────
    y += 3
    doc.setDrawColor(220, 220, 230)
    doc.line(margin, y, pageW - margin, y)
    y += 6

    doc.setFontSize(7.5)
    doc.setTextColor(100, 100, 120)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT DETAILS', margin, y)
    y += 6

    const paymentRows: [string, string][] = [
        ['Amount Paid',    formatCurrency(amount)],
        ['Payment Mode',   formatMode(mode)],
        ['Reference / TxnID', transactionId || '—'],
    ]
    if (remarks) paymentRows.push(['Remarks', remarks])

    doc.setFontSize(8.5)
    for (const [label, value] of paymentRows) {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60, 60, 70)
        doc.text(label + ':', margin, y)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(20, 20, 30)
        doc.text(value, margin + 44, y)
        y += 6.5
    }

    // ──────────────────────────────────────────
    // AMOUNT BOX — prominent display
    // ──────────────────────────────────────────
    y += 4
    doc.setFillColor(240, 240, 255)
    doc.setDrawColor(79, 70, 229)
    doc.setLineWidth(0.5)
    doc.roundedRect(margin, y, contentW, 18, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(79, 70, 229)
    doc.text('Total Amount Received', margin + 5, y + 7)

    doc.setFontSize(14)
    doc.text(formatCurrency(amount), pageW - margin - 5, y + 10, { align: 'right' })

    // ──────────────────────────────────────────
    // FOOTER
    // ──────────────────────────────────────────
    const footerY = pageH - 14
    doc.setDrawColor(220, 220, 230)
    doc.line(margin, footerY - 4, pageW - margin, footerY - 4)

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 160)
    doc.text('This is a computer-generated receipt and does not require a physical signature.', pageW / 2, footerY, { align: 'center' })
    doc.text(`Generated on ${new Date().toLocaleString('en-IN')} • ${organizationName}`, pageW / 2, footerY + 5, { align: 'center' })

    // ──────────────────────────────────────────
    // DOWNLOAD
    // ──────────────────────────────────────────
    const fileName = `Receipt_${receiptNo.replace(/\//g, '-')}_${studentName.replace(/\s+/g, '_')}.pdf`
    doc.save(fileName)
}
