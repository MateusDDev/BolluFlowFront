import { useQuery } from '@tanstack/react-query'
import { getOrderItems } from '@/features/orders/services/order.api'

export function useGetOrderItems(orderId: number, enabled: boolean = true) {
    return useQuery({
        queryKey: ['orderItems', orderId],
        enabled,
        queryFn: async ({ queryKey }) => {
            const [, orderId] = queryKey as ['orderItems', number]

            return await getOrderItems(orderId)
        },
    })
}
