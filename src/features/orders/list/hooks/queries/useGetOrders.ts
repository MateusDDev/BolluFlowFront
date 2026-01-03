import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/features/orders/services/order.api'

export function useGetOrders() {
    return useQuery({
        queryKey: ['orders'],

        queryFn: async () => await getOrders(),
    })
}
