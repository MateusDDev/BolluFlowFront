import { useQuery } from '@tanstack/react-query'
import { getDashboardStockAlerts } from '@/features/dashboard/services/dashboard.api'

export function useGetDashboardStockAlerts() {
    return useQuery({
        queryKey: ['dashboard', 'stock-alerts'],
        queryFn: async () => getDashboardStockAlerts(),
    })
}
