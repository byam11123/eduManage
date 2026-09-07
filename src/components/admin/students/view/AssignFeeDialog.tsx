'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { PlusCircle, Landmark, Calendar } from 'lucide-react'

interface AssignFeeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: string
    onSuccess: () => void
}

export function AssignFeeDialog({
    open,
    onOpenChange,
    studentId,
    onSuccess
}: AssignFeeDialogProps) {
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [feeType, setFeeType] = useState('exam')
    const [amount, setAmount] = useState('')
    const [dueDate, setDueDate] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !amount || !feeType) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            setLoading(true)
            const res = await fetch(`/api/students/${studentId}/fees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    feeType,
                    amount: parseFloat(amount),
                    dueDate
                })
            })

            const data = await res.json()
            if (data.success) {
                toast.success('Fee assigned successfully')
                onSuccess()
                onOpenChange(false)
                setTitle('')
                setAmount('')
                setDueDate('')
                setFeeType('exam')
            } else {
                toast.error(data.error || 'Failed to assign fee')
            }
        } catch (error) {
            console.error('Error assigning fee:', error)
            toast.error('Internal server error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-3xl overflow-hidden p-0">
                <div className="bg-indigo-600 p-8 text-white relative">
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <PlusCircle className="h-5 w-5 text-white" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-white">Assign Fee</DialogTitle>
                        </div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Add a miscellaneous or additional fee</p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white dark:bg-gray-900">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fee Title</Label>
                        <Input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                            placeholder="e.g. Term 1 Exam Fee"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</Label>
                        <Select value={feeType} onValueChange={setFeeType}>
                            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-indigo-500/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                <SelectItem value="exam" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Exam Fee</SelectItem>
                                <SelectItem value="id_card" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">ID Card Fee</SelectItem>
                                <SelectItem value="project" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Project Fee</SelectItem>
                                <SelectItem value="tour" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Tour/Trip Fee</SelectItem>
                                <SelectItem value="fine" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Late Fine</SelectItem>
                                <SelectItem value="other" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</Label>
                            <div className="relative">
                                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="number"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-11 h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                    placeholder="Amount"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Due Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="pl-11 h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 dark:shadow-none min-w-[140px]"
                        >
                            {loading ? 'Processing…' : 'Assign Fee'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
