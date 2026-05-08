'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useStudents, useAuth } from '@/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    ArrowLeft,
    Search,
    Printer,
    IdCard,
    Users,
    CheckSquare,
    LayoutTemplate,
    Eye,
    Download,
    X,
    ChevronLeft,
    ChevronRight,
    Upload,
    Trash2,
    Image as ImageIcon
} from 'lucide-react'
import { cn, getUserInitials } from '@/lib/utils'
import type { Student } from '@/lib/types'
import { ClassicCard } from '@/components/admin/id-cards/ClassicCard'
import { ModernCard } from '@/components/admin/id-cards/ModernCard'
import { MinimalCard } from '@/components/admin/id-cards/MinimalCard'
import { ClassicPortraitCard } from '@/components/admin/id-cards/ClassicPortraitCard'
import { ModernPortraitCard } from '@/components/admin/id-cards/ModernPortraitCard'
import { GlassCard } from '@/components/admin/id-cards/GlassCard'
import { GlassPortraitCard } from '@/components/admin/id-cards/GlassPortraitCard'
import { CustomCard } from '@/components/admin/id-cards/CustomCard'
import { CustomPortraitCard } from '@/components/admin/id-cards/CustomPortraitCard'

type TemplateId = 'classic' | 'modern' | 'minimal' | 'classic-p' | 'modern-p' | 'glass' | 'glass-p' | 'custom' | 'custom-p'

const TEMPLATES: { id: TemplateId; label: string; desc: string; color: string; isPortrait?: boolean }[] = [
    { id: 'classic', label: 'Classic (L)', desc: 'Traditional landscape look', color: 'bg-blue-600' },
    { id: 'modern', label: 'Modern (L)', desc: 'Dark landscape premium', color: 'bg-gray-900' },
    { id: 'minimal', label: 'Minimal (L)', desc: 'Clean white landscape', color: 'bg-white' },
    { id: 'glass', label: 'Glass (L)', desc: 'Futuristic glass landscape', color: 'bg-purple-600' },
    { id: 'classic-p', label: 'Classic (P)', desc: 'Traditional portrait look', color: 'bg-blue-500', isPortrait: true },
    { id: 'modern-p', label: 'Modern (P)', desc: 'Dark portrait premium', color: 'bg-gray-800', isPortrait: true },
    { id: 'glass-p', label: 'Glass (P)', desc: 'Futuristic glass portrait', color: 'bg-purple-500', isPortrait: true },
    { id: 'custom', label: 'Custom (L)', desc: 'Upload your landscape design', color: 'bg-emerald-600' },
    { id: 'custom-p', label: 'Custom (P)', desc: 'Upload your portrait design', color: 'bg-emerald-500', isPortrait: true },
]

export interface CardFields {
    showPhoto: boolean
    showDOB: boolean
    showPhone: boolean
    showAddress: boolean
    showCourse: boolean
    showBatch: boolean
    showBloodGroup: boolean
    showQR: boolean
}

export default function IdCardsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { filteredStudents, fetchStudents, loading } = useStudents()
    const { user } = useAuth()

    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [template, setTemplate] = useState<TemplateId>('classic')
    const [previewStudent, setPreviewStudent] = useState<Student | null>(null)
    const [previewIndex, setPreviewIndex] = useState(0)
    const [fields, setFields] = useState<CardFields>({
        showPhoto: true,
        showDOB: true,
        showPhone: true,
        showAddress: false,
        showCourse: true,
        showBatch: true,
        showBloodGroup: false,
        showQR: true,
    })
    const [customBg, setCustomBg] = useState<string | null>(null)

    const printRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { fetchStudents() }, [fetchStudents])

    // Pre-select from URL params
    useEffect(() => {
        const sid = searchParams.get('studentId')
        const ids = searchParams.get('ids')
        if (sid) setSelected(new Set([sid]))
        else if (ids) setSelected(new Set(ids.split(',')))
    }, [searchParams])

    // Set preview student when selection changes
    useEffect(() => {
        const arr = selectedStudents
        if (arr.length > 0) {
            setPreviewStudent(arr[previewIndex] ?? arr[0])
        }
    }, [selected, filteredStudents, previewIndex])

    const filtered = filteredStudents.filter(s =>
        `${s.firstName} ${s.lastName} ${s.enrollmentNo} ${s.phone || ''}`.toLowerCase().includes(search.toLowerCase())
    )

    const selectedStudents = filteredStudents.filter(s => selected.has(s.id))

    const toggleStudent = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
        setPreviewIndex(0)
    }

    const selectAll = () => {
        if (selected.size === filtered.length) setSelected(new Set())
        else setSelected(new Set(filtered.map(s => s.id)))
    }

    const handlePrint = () => {
        window.print()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setCustomBg(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const orgName = user?.organization?.name || 'EduManage Institute'
    const CardComponent = 
        template === 'classic' ? ClassicCard : 
        template === 'modern' ? ModernCard : 
        template === 'minimal' ? MinimalCard :
        template === 'glass' ? GlassCard :
        template === 'custom' ? CustomCard :
        template === 'classic-p' ? ClassicPortraitCard :
        template === 'modern-p' ? ModernPortraitCard : 
        template === 'glass-p' ? GlassPortraitCard : CustomPortraitCard

    const isPortrait = TEMPLATES.find(t => t.id === template)?.isPortrait
    const isCustom = template.startsWith('custom')

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950">
            {/* Print Styles */}
            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #print-area, #print-area * { visibility: visible !important; }
                    #print-area {
                        position: fixed !important;
                        top: 0; left: 0;
                        width: 100vw; height: 100vh;
                        display: flex !important;
                        flex-wrap: wrap;
                        gap: 16px;
                        padding: 24px;
                        align-content: flex-start;
                        background: white;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}
                        className="h-10 w-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                            <IdCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">ID Card Generator</h1>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">Select students · Choose template · Print</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {selected.size > 0 && (
                        <Badge className="bg-indigo-600 text-white font-black text-xs px-4 py-2 rounded-xl">
                            {selected.size} Selected
                        </Badge>
                    )}
                    <Button
                        onClick={handlePrint}
                        disabled={selected.size === 0}
                        className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 dark:shadow-none gap-2 disabled:opacity-40"
                    >
                        <Printer className="h-4 w-4" />
                        Print {selected.size > 0 ? `(${selected.size})` : 'Cards'}
                    </Button>
                </div>
            </div>

            <div className="p-8 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">

                {/* LEFT — Student Selector */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <CardContent className="p-0">
                            {/* Search */}
                            <div className="p-4 border-b border-gray-50 dark:border-gray-800">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search students..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9 h-10 border-none bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium focus-visible:ring-indigo-500/20"
                                    />
                                </div>
                            </div>

                            {/* Select All */}
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                <button
                                    onClick={selectAll}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 transition-colors"
                                >
                                    <CheckSquare className="h-3.5 w-3.5" />
                                    {selected.size === filtered.length && filtered.length > 0 ? 'Deselect All' : 'Select All'}
                                </button>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {filtered.length} Students
                                </span>
                            </div>

                            {/* Student List */}
                            <div className="max-h-[calc(100vh-320px)] overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                                {loading ? (
                                    <div className="p-8 text-center">
                                        <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                    </div>
                                ) : filtered.map(student => {
                                    const isSelected = selected.has(student.id)
                                    const isPreview = previewStudent?.id === student.id
                                    return (
                                        <div
                                            key={student.id}
                                            className={cn(
                                                'flex items-center gap-3 px-4 py-3 cursor-pointer transition-all',
                                                isSelected ? 'bg-indigo-50/60 dark:bg-indigo-900/20' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30',
                                                isPreview && 'ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700'
                                            )}
                                            onClick={() => { toggleStudent(student.id); setPreviewStudent(student); setPreviewIndex(selectedStudents.indexOf(student)) }}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleStudent(student.id)}
                                                onClick={e => e.stopPropagation()}
                                                className="shrink-0"
                                            />
                                            <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black text-sm shrink-0">
                                                {student.imageUrl
                                                    ? <img src={student.imageUrl} alt="" className="h-9 w-9 rounded-xl object-cover" />
                                                    : getUserInitials(`${student.firstName} ${student.lastName}`)
                                                }
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                                                    {student.firstName} {student.lastName}
                                                </p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mt-0.5 truncate">
                                                    {student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CENTER — Live Preview */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                    {/* Template Picker */}
                    <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-3">
                            <LayoutTemplate className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2 shrink-0">Template</span>
                            <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-1 custom-scrollbar no-scrollbar">
                                {TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTemplate(t.id)}
                                        className={cn(
                                            'flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap min-w-fit',
                                            template === t.id
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent hover:border-indigo-200'
                                        )}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card Preview */}
                    <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <CardContent className="p-8">
                            {previewStudent ? (
                                <div className="space-y-6">
                                    {/* Preview navigation */}
                                    {selectedStudents.length > 1 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                Preview {previewIndex + 1} of {selectedStudents.length}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon"
                                                    className="h-8 w-8 rounded-xl"
                                                    disabled={previewIndex === 0}
                                                    onClick={() => { setPreviewIndex(i => i - 1); setPreviewStudent(selectedStudents[previewIndex - 1]) }}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon"
                                                    className="h-8 w-8 rounded-xl"
                                                    disabled={previewIndex === selectedStudents.length - 1}
                                                    onClick={() => { setPreviewIndex(i => i + 1); setPreviewStudent(selectedStudents[previewIndex + 1]) }}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card render */}
                                    <div className="flex items-center justify-center py-4">
                                        <CardComponent student={previewStudent} orgName={orgName} fields={fields} customBg={customBg || undefined} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 gap-4">
                                    <div className="h-20 w-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center">
                                        <IdCard className="h-10 w-10 text-gray-200" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-sm uppercase tracking-widest text-gray-400">No Student Selected</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Select students from the left panel to preview</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* All selected preview */}
                    {selectedStudents.length > 1 && (
                        <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                            <CardContent className="p-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <Eye className="h-3.5 w-3.5" /> All Cards ({selectedStudents.length})
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center max-h-80 overflow-y-auto py-2">
                                    {selectedStudents.map((s, i) => (
                                        <button
                                            key={s.id}
                                            onClick={() => { setPreviewStudent(s); setPreviewIndex(i) }}
                                            className={cn(
                                                'transition-all hover:scale-[1.05]',
                                                isPortrait ? 'scale-[0.22] origin-top-left' : 'scale-[0.35] origin-top-left',
                                                previewStudent?.id === s.id && 'ring-4 ring-indigo-500 rounded-2xl'
                                            )}
                                            style={{ 
                                                width: isPortrait ? 220 : 320, 
                                                height: isPortrait ? 340 : 200, 
                                                margin: isPortrait ? (i % 3 === 0 ? '-130px -85px 0 0' : '-130px -85px 0 0') : '-62px -97px 0 0' 
                                            }}
                                        >
                                            <CardComponent student={s} orgName={orgName} fields={fields} customBg={customBg || undefined} />
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* RIGHT — Field Controls */}
                <div className="col-span-12 lg:col-span-3 space-y-4 lg:sticky lg:top-8 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
                    {/* Custom Background Upload */}
                    {isCustom && (
                        <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden ring-2 ring-emerald-500/20">
                            <CardContent className="p-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
                                    <Upload className="h-3.5 w-3.5" /> Design Assets
                                </p>
                                
                                {customBg ? (
                                    <div className="relative group">
                                        <div className="aspect-[1.6/1] rounded-2xl overflow-hidden border-2 border-emerald-100 bg-gray-50">
                                            <img src={customBg} alt="Custom Background" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-2xl">
                                            <Button size="icon" variant="destructive" className="h-9 w-9 rounded-xl" onClick={() => setCustomBg(null)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl" onClick={() => fileInputRef.current?.click()}>
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full aspect-[1.6/1] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            <ImageIcon className="h-5 w-5 text-gray-400 group-hover:text-emerald-600" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-emerald-600">Upload Background</span>
                                    </button>
                                )}
                                
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                
                                <p className="mt-4 text-[9px] text-gray-400 font-bold leading-relaxed">
                                    Recommended: 340x210px (L) or 220x340px (P). JPG or PNG.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <CardContent className="p-6 space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Visible Fields</p>
                            {([
                                ['showPhoto', 'Student Photo'],
                                ['showDOB', 'Date of Birth'],
                                ['showPhone', 'Phone Number'],
                                ['showAddress', 'Address'],
                                ['showCourse', 'Course Name'],
                                ['showBatch', 'Batch Name'],
                                ['showBloodGroup', 'Blood Group'],
                                ['showQR', 'QR Code'],
                            ] as [keyof CardFields, string][]).map(([key, label]) => (
                                <div key={key} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                    <Label className="text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer" htmlFor={key}>
                                        {label}
                                    </Label>
                                    <Switch
                                        id={key}
                                        checked={fields[key]}
                                        onCheckedChange={v => setFields(f => ({ ...f, [key]: v }))}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Print summary */}
                    {selected.size > 0 && (
                        <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-indigo-600 rounded-3xl overflow-hidden">
                            <CardContent className="p-6 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="h-5 w-5 opacity-70" />
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Ready to Print</p>
                                </div>
                                <p className="text-3xl font-black tracking-tight mb-1">{selected.size}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                    {selected.size === 1 ? 'ID Card' : 'ID Cards'}
                                </p>
                                <Button
                                    onClick={handlePrint}
                                    className="w-full mt-6 bg-white text-indigo-600 hover:bg-gray-50 font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl gap-2 shadow-xl shadow-indigo-800/30"
                                >
                                    <Printer className="h-4 w-4" />
                                    Print Now
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Hidden Print Area */}
            <div id="print-area" className="hidden print:flex flex-wrap gap-6 p-8">
                {selectedStudents.map(s => (
                    <CardComponent key={s.id} student={s} orgName={orgName} fields={fields} customBg={customBg || undefined} />
                ))}
            </div>
        </div>
    )
}
