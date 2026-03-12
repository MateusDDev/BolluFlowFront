import { useQuery } from '@tanstack/react-query'
import { getDashboardRecentOrders } from '@/features/dashboard/services/dashboard.api'

export function useGetDashboardRecentOrders() {
    return useQuery({
        queryKey: ['dashboard', 'recent-orders'],
        queryFn: async () => getDashboardRecentOrders(),
    })
}
