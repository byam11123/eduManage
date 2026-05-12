import { useState, useMemo } from 'react'

export interface ColumnDef {
    id: string
    label: string
    defaultVisible?: boolean
}

export function useTableFeatures<T extends { id: string }>(
    data: T[],
    columns: ColumnDef[]
) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    
    // Initialize visible columns with all defaultVisible columns (or all if not specified)
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
        const initial = new Set<string>()
        columns.forEach(col => {
            if (col.defaultVisible !== false) {
                initial.add(col.id)
            }
        })
        return initial
    })

    // Selection
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedIds(newSet)
    }

    const selectAll = () => {
        if (selectedIds.size === data.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(data.map(item => item.id)))
        }
    }

    const clearSelection = () => {
        setSelectedIds(new Set())
    }

    const isAllSelected = data.length > 0 && selectedIds.size === data.length
    const isSomeSelected = selectedIds.size > 0 && selectedIds.size < data.length

    // Column Visibility
    const toggleColumn = (id: string) => {
        const newSet = new Set(visibleColumns)
        if (newSet.has(id)) {
            // Prevent hiding the last column
            if (newSet.size > 1) {
                newSet.delete(id)
            }
        } else {
            newSet.add(id)
        }
        setVisibleColumns(newSet)
    }

    const isColumnVisible = (id: string) => visibleColumns.has(id)

    return {
        // Selection
        selectedIds,
        selectedArray: Array.from(selectedIds),
        toggleSelection,
        selectAll,
        clearSelection,
        isAllSelected,
        isSomeSelected,
        // Columns
        visibleColumns,
        toggleColumn,
        isColumnVisible,
        availableColumns: columns
    }
}
