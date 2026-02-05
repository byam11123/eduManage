import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
        return <div className="p-8 text-center text-gray-500">Loading attendance data...</div>
    }

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800">
                        <TableHead className="w-[80px]">
                            {type === 'student' ? 'ENROLL NO' : 'ID'}
                        </TableHead>
                        <TableHead>NAME</TableHead>
                        <TableHead>{type === 'student' ? 'MOBILE NUMBER' : 'DESIGNATION'}</TableHead>
                        <TableHead className="text-right pr-12">ATTENDANCE</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 bg-gray-100 text-gray-500">
                                            <AvatarFallback>{record.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs">
                                            {type === 'student' ? record.rollNo : record.entityId}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{record.name}</TableCell>
                                <TableCell>
                                    {type === 'student' ? '9876543210' : record.designation}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-6">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => onStatusChange(record.id, 'present')}
                                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${record.status === 'present' ? 'border-green-500' : 'border-gray-300'
                                                    }`}
                                            >
                                                {record.status === 'present' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                                            </button>
                                            <span className="text-sm text-gray-600">Present</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => onStatusChange(record.id, 'absent')}
                                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${record.status === 'absent' ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            >
                                                {record.status === 'absent' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                                            </button>
                                            <span className="text-sm text-gray-600">Absent</span>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
