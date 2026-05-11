import { Button } from '@/components/ui/button'
import { Download, Trash2, X, IdCard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BulkActionBarProps {
    selectedCount: number
    onClearSelection: () => void
    onExport: () => void
    onDelete: () => void
    isExporting?: boolean
    isDeleting?: boolean
    onIdCard?: () => void
}

export function BulkActionBar({
    selectedCount,
    onClearSelection,
    onExport,
    onDelete,
    isExporting,
    isDeleting,
    onIdCard
}: BulkActionBarProps) {
    if (selectedCount === 0) return null

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-6 border border-gray-800 dark:border-gray-200">
                
                <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-black">
                        {selectedCount}
                    </span>
                    <span className="font-bold text-sm tracking-tight">Rows Selected</span>
                </div>

                <div className="w-px h-6 bg-gray-700 dark:bg-gray-200" />

                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onExport}
                        disabled={isExporting}
                        className="text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-black/5 rounded-xl font-bold"
                    >
                        <Download className={cn("h-4 w-4 mr-2", isExporting && "animate-bounce")} />
                        Export
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="text-rose-400 hover:text-rose-300 dark:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 rounded-xl font-bold"
                    >
                        <Trash2 className={cn("h-4 w-4 mr-2", isDeleting && "animate-pulse")} />
                        Delete
                    </Button>
                    {onIdCard && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onIdCard}
                            className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-600 dark:hover:text-indigo-500 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10 rounded-xl font-bold"
                        >
                            <IdCard className="h-4 w-4 mr-2" />
                            ID Cards
                        </Button>
                    )}
                </div>

                <div className="w-px h-6 bg-gray-700 dark:bg-gray-200" />

                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClearSelection}
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-900 hover:bg-white/10 dark:hover:bg-black/5"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
