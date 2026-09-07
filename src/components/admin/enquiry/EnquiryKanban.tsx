import { DragEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical, Phone, Mail, Building2, Calendar, Target, DollarSign, BookOpen } from "lucide-react"
import type { Enquiry } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EnquiryKanbanProps {
    enquiries: Enquiry[]
    loading: boolean
    onStageChange: (id: string, stage: string) => void
    onEdit: (enquiry: Enquiry) => void
}

const STAGES: { id: string; label: string; color: string; dot: string }[] = [
    { id: 'new', label: 'New', color: 'bg-blue-50 text-blue-600 border-blue-100', dot: 'bg-blue-500' },
    { id: 'contacted', label: 'Contacted', color: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-500' },
    { id: 'interested', label: 'Interested', color: 'bg-violet-50 text-violet-600 border-violet-100', dot: 'bg-violet-500' },
    { id: 'admitted', label: 'Admitted', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500' },
    { id: 'lost', label: 'Lost', color: 'bg-rose-50 text-rose-600 border-rose-100', dot: 'bg-rose-500' },
    { id: 'dropped', label: 'Dropped', color: 'bg-gray-50 text-gray-600 border-gray-100', dot: 'bg-gray-500' },
]

export function EnquiryKanban({ enquiries, loading, onStageChange, onEdit }: EnquiryKanbanProps) {

    const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
        e.dataTransfer.setData('enquiryId', id)
        e.currentTarget.classList.add('opacity-50')
    }

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50')
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>, stage: string) => {
        e.preventDefault()
        const enquiryId = e.dataTransfer.getData('enquiryId')
        if (enquiryId) {
            onStageChange(enquiryId, stage)
        }
    }

    const getEnquiriesByStage = (stage: string) => {
        return enquiries.filter(enquiry => enquiry.status === stage)
    }

    if (loading) return null // Handled by parent

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-320px)] scrollbar-hide">
            {STAGES.map(stage => {
                const stageEnquiries = getEnquiriesByStage(stage.id)

                return (
                    <div
                        key={stage.id}
                        className="min-w-[340px] flex flex-col bg-gray-50/30 dark:bg-gray-900/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage.id)}
                    >
                        {/* Stage Header */}
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-3 sticky top-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl z-10 rounded-t-[2rem]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className={cn("h-2 w-2 rounded-full", stage.dot)} />
                                    <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-gray-900 dark:text-white">{stage.label}</h3>
                                </div>
                                <Badge variant="secondary" className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-none font-black text-[10px] px-2.5 rounded-lg">
                                    {stageEnquiries.length}
                                </Badge>
                            </div>
                        </div>

                        {/* Enquiries Container */}
                        <div className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-hide max-h-[calc(100vh-420px)]">
                            {stageEnquiries.map(enquiry => (
                                <div
                                    key={enquiry.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, enquiry.id)}
                                    onDragEnd={handleDragEnd}
                                    className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-none hover:-translate-y-1 cursor-grab active:cursor-grabbing transition-all group"
                                    onClick={() => onEdit(enquiry)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                {enquiry.firstName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                                    {enquiry.firstName} {enquiry.lastName}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                                                    <BookOpen className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">{enquiry.course?.name || 'General Inquiry'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                                            {enquiry.mobile}
                                        </div>
                                        {enquiry.email && (
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 truncate">
                                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                {enquiry.email}
                                            </div>
                                        )}
                                        {enquiry.followUpDate && (
                                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 w-fit px-2 py-1 rounded-md mt-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Follow up: {new Date(enquiry.followUpDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
