import { Button } from "@/components/ui/button"
import { List, Kanban, Plus } from "lucide-react"

interface LeadHeaderProps {
    view: 'list' | 'kanban'
    onViewChange: (view: 'list' | 'kanban') => void
    onAddClick: () => void
}

export function LeadHeader({ view, onViewChange, onAddClick }: LeadHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-gray-500 flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-indigo-600">Admin</span>
                    <span>›</span>
                    <span>Leads</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => onViewChange('list')}
                        className={`p-2 rounded-md transition-all ${view === 'list'
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewChange('kanban')}
                        className={`p-2 rounded-md transition-all ${view === 'kanban'
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Kanban className="h-4 w-4" />
                    </button>
                </div>

                <Button onClick={onAddClick} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Lead
                </Button>
            </div>
        </div>
    )
}
