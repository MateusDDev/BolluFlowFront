import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSalesSummary } from '@/features/dashboard/services/dashboard.api'
import {
    DashboardPeriod,
    getPeriodRange,
} from '@/features/dashboard/helpers/periods'

export function useGetSalesSummary(period: DashboardPeriod, enabled = true) {
    const range = useMemo(() => getPeriodRange(period), [period])

    const query = useQuery({
        queryKey: ['dashboard', 'sales', period, range.from.toISOString()],
        queryFn: () => getSalesSummary(range),
        enabled,
    })

    return { ...query, range }
}
