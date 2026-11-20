import { useQuery } from '@tanstack/react-query'
import { getProductMargins } from '@/features/dashboard/services/dashboard.api'

export function useGetProductMargins(enabled = true) {
    return useQuery({
        queryKey: ['dashboard', 'product-margins'],
        queryFn: getProductMargins,
        enabled,
    })
}
