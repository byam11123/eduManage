'use client'

import { useState, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    FileSpreadsheet,
    Upload,
    Download,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Info
} from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { cn } from '@/lib/utils'

interface BulkUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    courses: any[]
    branches: any[]
    onUpload: (data: { students: any[]; branchId: string; courseId: string; batchId?: string }) => Promise<boolean>
    loading: boolean
}

export function BulkUploadDialog({
    open,
    onOpenChange,
    courses,
    branches,
    onUpload,
    loading
}: BulkUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<any[]>([])
    const [selectedBranch, setSelectedBranch] = useState('')
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedBatch, setSelectedBatch] = useState('')
    const [validating, setValidating] = useState(false)
    const [validationResults, setValidationResults] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
                toast.error('Please upload an Excel or CSV file')
                return
            }
            setFile(selectedFile)
            parseFile(selectedFile)
        }
    }

    const parseFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
            const data = e.target?.result
            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(sheet)
            setPreviewData(json)
            await validateData(json)
        }
        reader.readAsBinaryString(file)
    }

    const validateData = async (data: any[]) => {
        setValidating(true)
        try {
            const res = await fetch('/api/students/bulk/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ students: data, branchId: selectedBranch })
            })
            const result = await res.json()
            if (result.success) {
                setValidationResults(result)
            }
        } catch (error) {
            console.error('Validation error:', error)
        } finally {
            setValidating(false)
        }
    }

    const downloadTemplate = () => {
        const template = [
            {
                // Identity
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '9876543210',
                dateOfBirth: '2000-01-01',
                gender: 'male',
                aadhaarNumber: '123456789012',
                category: 'general',
                maritalStatus: 'single',
                alternatePhone: '9876543211',
                
                // Family
                fathersName: 'Robert Doe',
                fathersPhone: '9876543212',
                mothersName: 'Mary Doe',
                
                // Address
                addressLine1: '123 Main Street',
                addressLine2: 'Apt 4B',
                city: 'Metropolis',
                district: 'Central',
                state: 'NY',
                country: 'USA',
                zipCode: '10001',
                
                // Academic (Highest)
                highestQualification: '12th',
                
                // 10th Details
                hsSchoolName: 'Metropolis High',
                hsBoard: 'State Board',
                hsPassingYear: '2016',
                hsPercentage: '85',
                
                // 12th Details
                hssSchoolName: 'Metropolis High',
                hssBoard: 'State Board',
                hssStream: 'Science',
                hssPassingYear: '2018',
                hssPercentage: '88',
                
                // Graduation Details
                gradCollegeName: '',
                gradUniversity: '',
                gradDegree: '',
                gradPassingYear: '',
                gradPercentage: '',
                
                // Post Graduation Details
                pgCollegeName: '',
                pgUniversity: '',
                pgDegree: '',
                pgPassingYear: '',
                pgPercentage: '',
                
                // Financial
                totalFee: 15000
            }
        ]

        const ws = XLSX.utils.json_to_sheet(template)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Template')
        XLSX.writeFile(wb, 'Student_Bulk_Upload_Template.xlsx')
    }

    const handleSubmit = async () => {
        if (!selectedBranch || !selectedCourse || previewData.length === 0) {
            toast.error('Please select Branch, Course and upload a valid file')
            return
        }

        const success = await onUpload({
            students: previewData,
            branchId: selectedBranch,
            courseId: selectedCourse,
            batchId: selectedBatch || undefined
        })

        if (success) {
            toast.success(`Successfully uploaded ${previewData.length} students`)
            onOpenChange(false)
            reset()
        } else {
            toast.error('Failed to upload students. Please check your data.')
        }
    }

    const reset = () => {
        setFile(null)
        setPreviewData([])
        setValidationResults(null)
        setSelectedBranch('')
        setSelectedCourse('')
        setSelectedBatch('')
    }

    const filteredBatches = courses.find(c => c.id === selectedCourse)?.batches || []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none rounded-3xl bg-white dark:bg-gray-950 shadow-2xl">
                <DialogHeader className="p-8 pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                <Upload className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight">Bulk Student Onboarding</DialogTitle>
                                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                                    Import multiple student records via XLSX/CSV
                                </DialogDescription>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl h-10 w-10 text-gray-400"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="p-8 space-y-6">
                    {/* Step 1: Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Target Branch</label>
                            <select 
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border-none bg-white dark:bg-gray-800 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Target Program</label>
                            <select 
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border-none bg-white dark:bg-gray-800 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            >
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Target Batch</label>
                            <select 
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                disabled={!selectedCourse || filteredBatches.length === 0}
                                className="w-full h-12 px-4 rounded-xl border-none bg-white dark:bg-gray-800 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none disabled:opacity-50"
                            >
                                <option value="">Select Batch (Optional)</option>
                                {filteredBatches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Step 2: File Upload */}
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all group"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept=".xlsx,.xls,.csv"
                            />
                            <div className="h-16 w-16 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all">
                                <FileSpreadsheet className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black text-gray-900 dark:text-white">Click to upload or drag and drop</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Excel or CSV files only (Max 5MB)</p>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
                                className="mt-2 rounded-xl h-10 border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest gap-2"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Download Template
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-indigo-600 shadow-sm">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-indigo-900 dark:text-indigo-100">{file.name}</p>
                                        <p className="text-[10px] font-bold text-indigo-500/70 uppercase tracking-widest">
                                            {previewData.length} records detected
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={reset}
                                    className="h-10 w-10 rounded-xl text-rose-500 hover:bg-rose-50"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="max-h-[200px] overflow-auto rounded-2xl border border-gray-100 dark:border-gray-800">
                                <table className="w-full text-[11px] text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                                        <tr>
                                            <th className="p-3 font-black uppercase tracking-widest text-gray-400">First Name</th>
                                            <th className="p-3 font-black uppercase tracking-widest text-gray-400">Last Name</th>
                                            <th className="p-3 font-black uppercase tracking-widest text-gray-400">Email</th>
                                            <th className="p-3 font-black uppercase tracking-widest text-gray-400">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {previewData.slice(0, 5).map((row, i) => {
                                            const rowValidation = validationResults?.results?.[i]
                                            const hasErrors = rowValidation?.errors?.length > 0
                                            const hasWarnings = rowValidation?.warnings?.length > 0
                                            
                                            return (
                                                <tr key={i} className={cn(
                                                    hasErrors ? "bg-rose-50/50 dark:bg-rose-950/20" : hasWarnings ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                                                )}>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            {hasErrors && <AlertCircle className="h-3 w-3 text-rose-500" title={rowValidation.errors.join(', ')} />}
                                                            {hasWarnings && !hasErrors && <AlertCircle className="h-3 w-3 text-amber-500" title={rowValidation.warnings.join(', ')} />}
                                                            <span className={cn("font-bold", hasErrors && "text-rose-600 dark:text-rose-400")}>{row.firstName || '—'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 font-bold">{row.lastName}</td>
                                                    <td className="p-3 text-gray-500">{row.email}</td>
                                                    <td className="p-3 text-gray-500">{row.phone || '—'}</td>
                                                </tr>
                                            )
                                        })}
                                        {previewData.length > 5 && (
                                            <tr>
                                                <td colSpan={4} className="p-3 text-center text-gray-400 italic">
                                                    And {previewData.length - 5} more records...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100/50 dark:border-amber-800/30 text-amber-600">
                        <Info className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold leading-relaxed">
                                Ensure your data follows the template structure. Empty rows will be skipped. Students will be marked as "Active" by default and assigned to the selected Branch & Course.
                            </p>
                            {validationResults?.summary && (
                                <div className="mt-2 text-[10px] font-black tracking-widest flex items-center gap-4">
                                    <span className={cn(validationResults.summary.totalErrors > 0 ? "text-rose-600" : "text-emerald-600")}>
                                        {validationResults.summary.totalErrors} ERRORS
                                    </span>
                                    <span className={cn(validationResults.summary.totalWarnings > 0 ? "text-amber-600" : "text-emerald-600")}>
                                        {validationResults.summary.totalWarnings} DB MATCHES
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-end gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px]"
                    >
                        Cancel
                    </Button>
                    <Button 
                        disabled={!file || !selectedBranch || !selectedCourse || loading || validating || validationResults?.summary?.totalErrors > 0}
                        onClick={handleSubmit}
                        className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
                    >
                        {loading || validating ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                                {validating ? 'Validating...' : `Uploading ${previewData.length} Records...`}
                            </>
                        ) : validationResults?.summary?.totalErrors > 0 ? (
                            <>
                                <AlertCircle className="h-3.5 w-3.5 mr-2" />
                                Fix Errors to Import
                            </>
                        ) : (
                            <>
                                <Upload className="h-3.5 w-3.5 mr-2" />
                                Finalize & Import Data
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
