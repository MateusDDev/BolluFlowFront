import { useQuery } from '@tanstack/react-query'
import { getDashboardInventoryValueByType } from '@/features/dashboard/services/dashboard.api'

export function useGetDashboardInventoryValueByType(enabled = true) {
    return useQuery({
        enabled,
        queryKey: ['dashboard', 'inventory-value-by-type'],
        queryFn: async () => getDashboardInventoryValueByType(),
    })
}
