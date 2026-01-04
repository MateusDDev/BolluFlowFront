import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '@/features/orders/services/order.api'

export function useGetOrder(orderId: number) {
    return useQuery({
        queryKey: ['orders', orderId],
        queryFn: async ({ queryKey }) => {
            const [, orderId] = queryKey as ['orders', number]
            return await getOrderById(orderId)
        },
    })
}
