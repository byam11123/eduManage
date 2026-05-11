import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2 } from 'lucide-react'
import type { ColumnDef } from '@/hooks/useTableFeatures'

interface TableToolbarProps {
    columns: ColumnDef[]
    visibleColumns: Set<string>
    onToggleColumn: (id: string) => void
    children?: React.ReactNode // For passing in Search bars or extra filters
}

export function TableToolbar({ columns, visibleColumns, onToggleColumn, children }: TableToolbarProps) {
    return (
        <div className={cn("flex items-center gap-4", children ? "justify-between w-full" : "justify-end")}>
            {children && (
                <div className="flex-1 flex items-center gap-4">
                    {children}
                </div>
            )}
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl font-bold bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <Settings2 className="h-4 w-4 mr-2 text-gray-500" />
                        View
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] rounded-2xl shadow-xl border-gray-100 dark:border-gray-800 p-2">
                    <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-gray-500 px-2 py-1.5">
                        Toggle Columns
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800 my-1" />
                    {columns.map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={visibleColumns.has(column.id)}
                            onCheckedChange={() => onToggleColumn(column.id)}
                            className="rounded-xl font-bold py-2.5 cursor-pointer"
                        >
                            {column.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
