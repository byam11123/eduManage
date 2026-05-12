import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Exports data to an Excel file (.xlsx)
 * @param data Array of objects to export
 * @param fileName Name of the file to save
 * @param sheetName Name of the sheet in the workbook
 */
export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Data') => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
        XLSX.writeFile(workbook, `${fileName}.xlsx`)
        return true
    } catch (error) {
        console.error('Excel Export Error:', error)
        return false
    }
}

/**
 * Exports data to a PDF file (.pdf)
 * @param data Array of objects to export
 * @param fileName Name of the file to save
 * @param title Title to display at the top of the PDF
 * @param columns Array of objects with header and dataKey properties
 */
export const exportToPDF = (
    data: any[], 
    fileName: string, 
    title: string, 
    columns: { header: string; dataKey: string }[]
) => {
    try {
        const doc = new jsPDF()
        
        // Add Title
        doc.setFontSize(18)
        doc.text(title, 14, 22)
        
        // Add Date
        doc.setFontSize(11)
        doc.setTextColor(100)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)
        
        // Add Table using the autoTable function directly
        autoTable(doc, {
            startY: 40,
            columns: columns,
            body: data,
            theme: 'striped',
            headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
            styles: { fontSize: 9, cellPadding: 3 },
        })
        
        doc.save(`${fileName}.pdf`)
        return true
    } catch (error) {
        console.error('PDF Export Error:', error)
        return false
    }
}
/**
 * Exports data to a CSV file (.csv)
 * @param fileName Name of the file to save
 * @param data Array of objects to export
 */
export const exportToCSV = (fileName: string, data: any[]) => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data)
        const csv = XLSX.utils.sheet_to_csv(worksheet)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return true
    } catch (error) {
        console.error('CSV Export Error:', error)
        return false
    }
}
