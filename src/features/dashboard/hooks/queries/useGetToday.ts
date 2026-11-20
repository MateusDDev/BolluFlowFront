import { useQuery } from '@tanstack/react-query'
import { getToday } from '@/features/dashboard/services/dashboard.api'
import { startOfLocalDay } from '@/features/dashboard/helpers/periods'

export function useGetToday(enabled = true) {
    const dayStart = startOfLocalDay()

    return useQuery({
        queryKey: ['dashboard', 'today', dayStart.toISOString()],
        queryFn: () => getToday(dayStart),
        enabled,
    })
}
