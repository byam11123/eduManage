import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ReportData } from '@/lib/services/report.service'
import { formatCurrency } from '@/lib/utils'

export function exportReportsToExcel(data: ReportData, organizationName: string = 'EduManage') {
  const wb = XLSX.utils.book_new()

  // 1. KPI Summary Sheet
  const kpiData = [
    { Metric: 'Organization', Value: organizationName },
    { Metric: 'Total Revenue Collected', Value: data.kpis.totalRevenue },
    { Metric: 'Total Pending Dues', Value: data.kpis.totalPending },
    { Metric: 'Overdue Dues', Value: data.kpis.overduePending },
    { Metric: 'Collection Efficiency (%)', Value: `${data.kpis.collectionEfficiency}%` },
    { Metric: 'Total Students', Value: data.kpis.totalStudents },
    { Metric: 'Active Students', Value: data.kpis.activeStudents },
    { Metric: 'Total Enquiries', Value: data.kpis.totalEnquiries },
    { Metric: 'Enquiry Conversion Rate (%)', Value: `${data.kpis.conversionRate}%` },
    { Metric: 'Overall Attendance Rate (%)', Value: `${data.kpis.overallAttendanceRate}%` },
  ]
  const kpiSheet = XLSX.utils.json_to_sheet(kpiData)
  XLSX.utils.book_append_sheet(wb, kpiSheet, 'Summary_KPIs')

  // 2. Collections Sheet
  if (data.registers.feeCollections.length > 0) {
    const collectionsData = data.registers.feeCollections.map((c) => ({
      'Student ID': c.studentId,
      'Student Name': c.studentName,
      Course: c.course,
      Branch: c.branch,
      'Installment #': c.installmentNo,
      'Paid Amount': c.paidAmount,
      Mode: c.paymentMode,
      'Payment Date': c.paidDate ? new Date(c.paidDate).toLocaleDateString() : 'N/A',
      Status: c.status,
    }))
    const collectionsSheet = XLSX.utils.json_to_sheet(collectionsData)
    XLSX.utils.book_append_sheet(wb, collectionsSheet, 'Fee_Collections')
  }

  // 3. Pending Dues Sheet
  if (data.registers.pendingDues.length > 0) {
    const duesData = data.registers.pendingDues.map((d) => ({
      'Student ID': d.studentId,
      'Student Name': d.studentName,
      Phone: d.phone,
      Branch: d.branch,
      Course: d.course,
      'Installment #': d.installmentNo,
      'Total Amount': d.totalAmount,
      'Paid Amount': d.paidAmount,
      'Due Amount': d.dueAmount,
      'Due Date': d.dueDate ? new Date(d.dueDate).toLocaleDateString() : 'N/A',
      Overdue: d.isOverdue ? 'YES' : 'NO',
    }))
    const duesSheet = XLSX.utils.json_to_sheet(duesData)
    XLSX.utils.book_append_sheet(wb, duesSheet, 'Pending_Dues')
  }

  // 4. Student Roster Sheet
  if (data.registers.students.length > 0) {
    const studentData = data.registers.students.map((s) => ({
      'Student ID': s.studentId,
      Name: s.name,
      Phone: s.phone,
      Email: s.email,
      Branch: s.branch,
      Courses: s.courses,
      Status: s.status,
      'Enrollment Date': s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString() : 'N/A',
    }))
    const studentSheet = XLSX.utils.json_to_sheet(studentData)
    XLSX.utils.book_append_sheet(wb, studentSheet, 'Students_Roster')
  }

  // 5. Enquiries Sheet
  if (data.registers.enquiries.length > 0) {
    const enquiryData = data.registers.enquiries.map((e) => ({
      Name: e.name,
      Phone: e.phone,
      Email: e.email,
      Branch: e.branch,
      Source: e.source,
      Status: e.status,
      Date: e.date ? new Date(e.date).toLocaleDateString() : 'N/A',
    }))
    const enquirySheet = XLSX.utils.json_to_sheet(enquiryData)
    XLSX.utils.book_append_sheet(wb, enquirySheet, 'Enquiries')
  }

  const fileName = `EduManage_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(wb, fileName)
}

export function exportReportsToPDF(data: ReportData, organizationName: string = 'EduManage') {
  const doc = new jsPDF()
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // Header Banner
  doc.setFillColor(30, 41, 59)
  doc.rect(0, 0, 210, 32, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(organizationName.toUpperCase(), 14, 15)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Institutional Performance & Financial Report', 14, 23)

  doc.setFontSize(9)
  doc.text(`Generated: ${dateStr}`, 160, 23)

  // KPI Overview Section
  doc.setTextColor(33, 43, 54)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', 14, 42)

  const summaryHead = [['Total Revenue', 'Pending Dues', 'Collection Rate', 'Total Students', 'Conversion Rate']]
  const summaryBody = [[
    formatCurrency(data.kpis.totalRevenue),
    formatCurrency(data.kpis.totalPending),
    `${data.kpis.collectionEfficiency}%`,
    data.kpis.totalStudents.toString(),
    `${data.kpis.conversionRate}%`,
  ]]

  autoTable(doc, {
    startY: 46,
    head: summaryHead,
    body: summaryBody,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, halign: 'center' },
  })

  let currentY = (doc as any).lastAutoTable.finalY + 12

  // Collections Register Section
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Recent Fee Collections', 14, currentY)

  const collectionsHead = [['Student ID', 'Student Name', 'Course', 'Branch', 'Amount', 'Mode', 'Date']]
  const collectionsBody = data.registers.feeCollections.slice(0, 20).map((c) => [
    c.studentId,
    c.studentName,
    c.course,
    c.branch,
    formatCurrency(c.paidAmount),
    c.paymentMode.toUpperCase(),
    c.paidDate ? new Date(c.paidDate).toLocaleDateString() : 'N/A',
  ])

  autoTable(doc, {
    startY: currentY + 4,
    head: collectionsHead,
    body: collectionsBody.length > 0 ? collectionsBody : [['No fee collections found', '', '', '', '', '', '']],
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8 },
  })

  currentY = (doc as any).lastAutoTable.finalY + 12

  // Check page overflow before pending dues
  if (currentY > 230) {
    doc.addPage()
    currentY = 20
  }

  // Pending Dues Section
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Pending & Overdue Installments', 14, currentY)

  const duesHead = [['Student ID', 'Student Name', 'Phone', 'Course', 'Due Amount', 'Due Date', 'Status']]
  const duesBody = data.registers.pendingDues.slice(0, 20).map((d) => [
    d.studentId,
    d.studentName,
    d.phone,
    d.course,
    formatCurrency(d.dueAmount),
    d.dueDate ? new Date(d.dueDate).toLocaleDateString() : 'N/A',
    d.isOverdue ? 'OVERDUE' : 'PENDING',
  ])

  autoTable(doc, {
    startY: currentY + 4,
    head: duesHead,
    body: duesBody.length > 0 ? duesBody : [['No pending dues found', '', '', '', '', '', '']],
    theme: 'striped',
    headStyles: { fillColor: [225, 29, 72], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8 },
  })

  doc.save(`EduManage_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
}
