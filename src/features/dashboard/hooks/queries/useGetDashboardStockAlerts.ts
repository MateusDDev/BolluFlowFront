import { useQuery } from '@tanstack/react-query'
import { getDashboardStockAlerts } from '@/features/dashboard/services/dashboard.api'

export function useGetDashboardStockAlerts(enabled = true) {
    return useQuery({
        enabled,
        queryKey: ['dashboard', 'stock-alerts'],
        queryFn: async () => getDashboardStockAlerts(),
    })
}
