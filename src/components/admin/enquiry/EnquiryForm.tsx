import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, User, Phone, Mail, BookOpen, Globe, FileText, CheckCircle2 } from 'lucide-react'
import type { EnquiryFormData, Course } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EnquiryFormProps {
    formData: EnquiryFormData
    courses: Course[]
    onChange: (data: EnquiryFormData) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
    saving?: boolean
    mode?: 'create' | 'edit'
}

export function EnquiryForm({
    formData,
    courses,
    onChange,
    onSubmit,
    onCancel,
    saving,
    mode = 'create'
}: EnquiryFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        onChange({ ...formData, [name]: value })
    }

    const handleSelectChange = (name: string, value: string) => {
        onChange({ ...formData, [name]: value })
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Student Identity */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Student Identity</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="firstName"
                                placeholder="First Name *"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base"
                            />
                            <Input
                                name="lastName"
                                placeholder="Last Name *"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base"
                            />
                        </div>
                        <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <Input
                                name="mobile"
                                placeholder="Mobile Number *"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className="h-14 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold text-base"
                            />
                        </div>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email Address (Optional)"
                                value={formData.email}
                                onChange={handleChange}
                                className="h-14 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold text-base"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Academic Interest</Label>
                        <div className="space-y-4">
                            <Select
                                value={formData.courseId}
                                onValueChange={(val) => handleSelectChange('courseId', val)}
                            >
                                <SelectTrigger className="h-14 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border-none font-black uppercase tracking-widest text-[10px] px-6 text-indigo-600">
                                    <SelectValue placeholder="Interested Program" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                    <SelectItem value="none" className="rounded-xl py-3 font-bold uppercase tracking-widest text-[10px]">None / General</SelectItem>
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id} className="rounded-xl py-3 font-bold">{course.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={formData.source}
                                onValueChange={(val) => handleSelectChange('source', val)}
                            >
                                <SelectTrigger className="h-14 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border-none font-black uppercase tracking-widest text-[10px] px-6 text-indigo-600">
                                    <SelectValue placeholder="Lead Source" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                    <SelectItem value="web" className="rounded-xl py-3 font-bold">Website Portal</SelectItem>
                                    <SelectItem value="referral" className="rounded-xl py-3 font-bold">Referral</SelectItem>
                                    <SelectItem value="walk-in" className="rounded-xl py-3 font-bold">Walk-in Inquiry</SelectItem>
                                    <SelectItem value="social_media" className="rounded-xl py-3 font-bold">Social Media</SelectItem>
                                    <SelectItem value="other" className="rounded-xl py-3 font-bold">Other Channels</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Pipeline Management */}
                <div className="space-y-6">
                    {mode === 'edit' && (
                        <div className="space-y-4">
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Pipeline Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => handleSelectChange('status', val)}
                            >
                                <SelectTrigger className="h-14 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border-none font-black uppercase tracking-widest text-[10px] px-6 text-emerald-600">
                                    <SelectValue placeholder="Lead Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                    <SelectItem value="new" className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">New</SelectItem>
                                    <SelectItem value="contacted" className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">Contacted</SelectItem>
                                    <SelectItem value="interested" className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">Interested</SelectItem>
                                    <SelectItem value="admitted" className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">Admitted</SelectItem>
                                    <SelectItem value="lost" className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">Lost</SelectItem>
                                    <SelectItem value="dropped" className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">Dropped</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Follow-up Date</Label>
                        <Input
                            type="date"
                            name="followUpDate"
                            value={formData.followUpDate ? formData.followUpDate.split('T')[0] : ''}
                            onChange={handleChange}
                            className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Engagement Notes</Label>
                        <div className="relative group">
                            <FileText className="absolute left-5 top-5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <Textarea
                                name="description"
                                placeholder="Capture detailed enquiry notes, follow-up history, and student requirements..."
                                value={formData.description}
                                onChange={handleChange}
                                className="min-h-[220px] pl-14 pt-5 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border-none font-bold text-base resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-6 pt-10 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
                <Button 
                    type="submit" 
                    className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-100 dark:shadow-none border-none transition-all hover:scale-[1.02] active:scale-95"
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-3" />
                            Synchronizing...
                        </>
                    ) : (mode === 'create' ? 'Generate Lead' : 'Update Record')}
                </Button>
            </div>
        </form>
    )
}
