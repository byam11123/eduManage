'use client'

import { ShieldAlert, FolderLock, Image as ImageIcon, FileText, Download, Eye, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Student } from '@/lib/types'
import { cn } from '@/lib/utils'

interface DocumentsTabProps {
    student: Student
}

export function DocumentsTab({ student }: DocumentsTabProps) {
    const documents = [
        { id: 'aadhaar', name: 'Aadhaar Card', type: 'ID Proof', icon: FileText, exists: !!student.aadhaarNumber },
        { id: '10th', name: '10th Marksheet', type: 'Academic', icon: ImageIcon, exists: !!student.hsSchoolName },
        { id: '12th', name: '12th Marksheet', type: 'Academic', icon: ImageIcon, exists: !!student.hssSchoolName },
        { id: 'photo', name: 'Student Photo', type: 'Photo', icon: ImageIcon, exists: !!student.imageUrl, url: student.imageUrl },
        { id: 'admission', name: 'Admission Form', type: 'Internal', icon: FileText, exists: true },
    ]

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                <CardContent className="p-10">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                            Digital Vault
                        </h4>
                        <Button variant="outline" size="sm" className="rounded-xl border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest gap-2">
                            <Plus className="h-3 w-3" />
                            UPLOAD
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <div 
                                key={doc.id}
                                className={cn(
                                    "group relative p-6 rounded-[2.5rem] border transition-all duration-500",
                                    doc.exists 
                                        ? "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-none hover:-translate-y-1" 
                                        : "bg-gray-50/50 dark:bg-gray-900/50 border-dashed border-gray-200 dark:border-gray-800 opacity-60"
                                )}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                        doc.exists ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                    )}>
                                        <doc.icon className="h-6 w-6" />
                                    </div>
                                    {doc.exists && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-gray-400 hover:text-indigo-600">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-gray-400 hover:text-indigo-600">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{doc.type}</p>
                                    <h5 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{doc.name}</h5>
                                </div>

                                {!doc.exists && (
                                    <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                                        <ShieldAlert className="h-3 w-3" />
                                        MISSING
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {!documents.some(d => d.exists) && (
                        <div className="py-20 flex flex-col items-center text-center">
                            <FolderLock className="h-12 w-12 text-gray-200 mb-4" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No documents found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
