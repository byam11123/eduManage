'use client'

import { useRef, useState } from 'react'
import { ShieldAlert, FolderLock, Image as ImageIcon, FileText, Download, Eye, Plus, UploadCloud, ShieldCheck, X, LayoutGrid, List } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ImagePreviewModal from '@/components/ui/image-preview-modal'
import type { Student } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { studentService } from '@/lib/services/student.service'

interface DocumentsTabProps {
    student: Student
}

export function DocumentsTab({ student }: DocumentsTabProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [activeUpload, setActiveUpload] = useState<string | null>(null)
    const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({})
    const [preview, setPreview] = useState<{ url: string, title: string } | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

    const handleUpload = (docId: string) => {
        setActiveUpload(docId)
        fileInputRef.current?.click()
    }

    const fieldMap: Record<string, string> = {
        'aadhaar': 'aadhaarCardUrl',
        '10th': 'hsMarksheetUrl',
        '12th': 'hssMarksheetUrl',
        'graduation': 'gradDegreeUrl',
        'pg': 'pgDegreeUrl',
        'admission': 'admissionFormUrl',
        'photo': 'imageUrl'
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && activeUpload) {
            try {
                setIsSyncing(true)
                const reader = new FileReader()
                reader.onloadend = async () => {
                    const url = reader.result as string
                    
                    // Persist to DB via API
                    const field = fieldMap[activeUpload]
                    if (field) {
                        const response = await studentService.update(student.id, { [field]: url })
                        if (response.success) {
                            setUploadedDocs(prev => ({ ...prev, [activeUpload]: url }))
                            const doc = documents.find(d => d.id === activeUpload)
                            toast.success(`${file.name} permanently synchronized to ${doc?.name}`)
                        } else {
                            toast.error("Failed to persist document")
                        }
                    }
                }
                reader.readAsDataURL(file)
            } catch (error) {
                console.error("Upload error:", error)
                toast.error("Error during synchronization")
            } finally {
                setIsSyncing(false)
                setActiveUpload(null)
                if (e.target) e.target.value = ''
            }
        }
    }

    const documents = [
        { id: 'aadhaar', name: 'Aadhaar Card', type: 'ID Proof', icon: FileText, exists: !!student.aadhaarCardUrl || !!uploadedDocs['aadhaar'], url: uploadedDocs['aadhaar'] || student.aadhaarCardUrl },
        { id: '10th', name: '10th Marksheet', type: 'Academic', icon: ImageIcon, exists: !!student.hsMarksheetUrl || !!uploadedDocs['10th'], url: uploadedDocs['10th'] || student.hsMarksheetUrl },
        { id: '12th', name: '12th Marksheet', type: 'Academic', icon: ImageIcon, exists: !!student.hssMarksheetUrl || !!uploadedDocs['12th'], url: uploadedDocs['12th'] || student.hssMarksheetUrl },
        { 
            id: 'graduation', 
            name: 'Graduation Degree', 
            type: 'Academic', 
            icon: ImageIcon, 
            exists: !!student.gradDegreeUrl || !!uploadedDocs['graduation'],
            url: uploadedDocs['graduation'] || student.gradDegreeUrl,
            visible: ['graduation', 'post_graduation'].includes(student.highestQualification || '')
        },
        { 
            id: 'pg', 
            name: 'Post Graduation Degree', 
            type: 'Academic', 
            icon: ImageIcon, 
            exists: !!student.pgDegreeUrl || !!uploadedDocs['pg'],
            url: uploadedDocs['pg'] || student.pgDegreeUrl,
            visible: student.highestQualification === 'post_graduation'
        },
        { id: 'photo', name: 'Student Photo', type: 'Photo', icon: ImageIcon, exists: !!student.imageUrl || !!uploadedDocs['photo'], url: uploadedDocs['photo'] || student.imageUrl },
        { id: 'admission', name: 'Admission Form', type: 'Internal', icon: FileText, exists: !!student.admissionFormUrl || !!uploadedDocs['admission'], url: uploadedDocs['admission'] || student.admissionFormUrl },
    ].filter(d => d.visible !== false)

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*"
            />

            {/* Image Preview Modal */}
            <ImagePreviewModal 
                isOpen={!!preview}
                onClose={() => setPreview(null)}
                imageUrl={preview?.url || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                title={preview?.title || ''}
            />

            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                <CardContent className="p-10">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                            <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-gray-400">Document List</h4>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-1 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "h-9 w-9 rounded-xl transition-all",
                                        viewMode === 'grid' ? "bg-white dark:bg-gray-700 shadow-md text-indigo-600" : "text-gray-400"
                                    )}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "h-9 w-9 rounded-xl transition-all",
                                        viewMode === 'list' ? "bg-white dark:bg-gray-700 shadow-md text-indigo-600" : "text-gray-400"
                                    )}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/30 px-4 py-1.5 rounded-full">
                                {documents.filter(d => d.exists).length} / {documents.length} Files Uploaded
                            </p>
                        </div>
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc) => (
                                <div 
                                    key={doc.id}
                                    className={cn(
                                        "group relative rounded-[2.5rem] border transition-all duration-700 h-[280px] overflow-hidden",
                                        doc.exists 
                                            ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-1" 
                                            : "bg-gray-50/50 dark:bg-gray-900/50 border-dashed border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    {/* Full Container Background Image for Uploaded Docs */}
                                    {doc.exists && doc.url && (
                                        <div className="absolute inset-0 z-0">
                                            <img 
                                                src={doc.url} 
                                                alt={doc.name} 
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                        </div>
                                    )}

                                    <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                                        <div className="flex items-start justify-between">
                                            {/* Icon - Only show when NOT uploaded */}
                                            {!doc.exists ? (
                                                <div className="h-16 w-16 rounded-[1.5rem] bg-white dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-lg">
                                                    <doc.icon className="h-8 w-8" />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                            )}
                                            
                                            <div className="flex gap-2">
                                                {doc.exists ? (
                                                    <>
                                                        <Button 
                                                            onClick={() => doc.url && setPreview({ url: doc.url, title: doc.name })}
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-indigo-600 transition-all shadow-xl"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handleUpload(doc.id)}
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-indigo-600 transition-all shadow-xl"
                                                            title="Update"
                                                        >
                                                            <UploadCloud className="h-5 w-5" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button 
                                                        onClick={() => handleUpload(doc.id)}
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-14 w-14 rounded-[1.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all"
                                                    >
                                                        <UploadCloud className="h-7 w-7" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <p className={cn(
                                                "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                                                doc.exists ? "text-white/60" : "text-indigo-600"
                                            )}>
                                                {doc.type}
                                            </p>
                                            <h5 className={cn(
                                                "text-lg font-black uppercase tracking-tight",
                                                doc.exists ? "text-white" : "text-gray-900 dark:text-white"
                                            )}>
                                                {doc.name}
                                            </h5>
                                            
                                            {!doc.exists ? (
                                                <div 
                                                    onClick={() => handleUpload(doc.id)}
                                                    className="mt-6 cursor-pointer flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all group-hover:shadow-md"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Upload
                                                </div>
                                            ) : (
                                                <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    Uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {documents.map((doc) => (
                                <div 
                                    key={doc.id}
                                    className={cn(
                                        "group flex items-center justify-between p-4 rounded-3xl border transition-all duration-500",
                                        doc.exists 
                                            ? "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 dark:hover:border-indigo-900/30" 
                                            : "bg-gray-50/50 dark:bg-gray-900/50 border-dashed border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden",
                                            doc.exists ? "bg-indigo-50 dark:bg-indigo-950/30" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                                        )}>
                                            {doc.exists && doc.url ? (
                                                <img src={doc.url} alt={doc.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                            ) : (
                                                <doc.icon className="h-6 w-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h5 className="text-base font-black uppercase tracking-tight text-gray-900 dark:text-white">{doc.name}</h5>
                                                {doc.exists && (
                                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md">{doc.type}</p>
                                                {doc.exists ? (
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                                        Ready
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pending</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {doc.exists ? (
                                            <>
                                                <Button 
                                                    onClick={() => doc.url && setPreview({ url: doc.url, title: doc.name })}
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all font-black uppercase tracking-widest text-[9px] gap-2 px-4"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    View
                                                </Button>
                                                <Button 
                                                    onClick={() => handleUpload(doc.id)}
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-amber-600 hover:text-white transition-all"
                                                    title="Update"
                                                >
                                                    <UploadCloud className="h-4 w-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <Button 
                                                onClick={() => handleUpload(doc.id)}
                                                className="h-10 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all font-black uppercase tracking-widest text-[9px] gap-2 px-6"
                                            >
                                                <UploadCloud className="h-3.5 w-3.5" />
                                                Upload Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {documents.length === 0 && (
                        <div className="py-20 flex flex-col items-center text-center">
                            <FolderLock className="h-16 w-16 text-gray-100 mb-6" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Documents Required</p>
                            <p className="text-[10px] text-gray-300 font-bold mt-2 uppercase tracking-tight">Student records are not required based on the current profile setup.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
