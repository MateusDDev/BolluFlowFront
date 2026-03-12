import { useQuery } from '@tanstack/react-query'
import { getDashboardOrdersByStatus } from '@/features/dashboard/services/dashboard.api'

export function useGetDashboardOrdersByStatus() {
    return useQuery({
        queryKey: ['dashboard', 'orders-by-status'],
        queryFn: async () => getDashboardOrdersByStatus(),
    })
}
