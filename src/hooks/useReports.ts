import { useState, useEffect, useCallback } from 'react'
import { reportService, ReportData, ReportFilters } from '@/lib/services/report.service'

export function useReports(initialFilters: ReportFilters = {}) {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ReportFilters>({
    range: '30d',
    branchId: 'all',
    type: 'all',
    ...initialFilters,
  })

  const fetchReports = useCallback(async (customFilters?: ReportFilters) => {
    try {
      setLoading(true)
      setError(null)
      const activeFilters = customFilters || filters
      const response = await reportService.getReports(activeFilters)

      if (response.success && response.data) {
        setData(response.data)
      } else {
        setError(response.error || 'Failed to load reports')
      }
    } catch (err: any) {
      setError(err?.message || 'Network error while fetching reports')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const updateFilters = (newFilters: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchReports,
  }
}
