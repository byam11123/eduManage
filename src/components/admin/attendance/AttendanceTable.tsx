import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AttendanceRecord, AttendanceType } from "@/lib/types"

interface AttendanceTableProps {
    records: AttendanceRecord[]
    loading: boolean
    type: AttendanceType
    onStatusChange: (recordId: string, status: string) => void
}

export function AttendanceTable({
    records,
    loading,
    type,
    onStatusChange
}: AttendanceTableProps) {
    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center animate-pulse bg-gray-50/50 dark:bg-gray-900/50">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-4" />
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
        )
    }

    if (records.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4 text-gray-200">
                    <ClipboardCheck className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-gray-400 uppercase">Registry Empty</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">No matching student records found</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-widest text-gray-400 py-5 pl-8">Identity</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-5">Full Name</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-5 text-center">Contact/Role</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-5 text-right pr-8">Status Toggle</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.map((record) => (
                    <TableRow key={record.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800 transition-colors">
                        <TableCell className="pl-8">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold shadow-sm transition-all group-hover:scale-110">
                                    <AvatarFallback className="rounded-xl">{record.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                    {type === 'student' ? record.rollNo : record.entityId}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="font-black text-gray-900 dark:text-white tracking-tight">
                                {record.name}
                            </span>
                        </TableCell>
                        <TableCell className="text-center">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                {type === 'student' ? '9876543210' : record.designation}
                            </span>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                            <div className="flex justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onStatusChange(record.id, 'present')}
                                    className={cn(
                                        "h-9 px-4 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] border-none transition-all active:scale-95",
                                        record.status === 'present'
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                    )}
                                >
                                    Present
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onStatusChange(record.id, 'absent')}
                                    className={cn(
                                        "h-9 px-4 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] border-none transition-all active:scale-95",
                                        record.status === 'absent'
                                            ? "bg-rose-500 text-white shadow-lg shadow-rose-100"
                                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                    )}
                                >
                                    Absent
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
