import { useQuery } from '@tanstack/react-query'
import { getDashboardInventoryValueByType } from '@/features/dashboard/services/dashboard.api'

export function useGetDashboardInventoryValueByType() {
    return useQuery({
        queryKey: ['dashboard', 'inventory-value-by-type'],
        queryFn: async () => getDashboardInventoryValueByType(),
    })
}
