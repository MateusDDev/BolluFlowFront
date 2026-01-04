import { useQuery } from '@tanstack/react-query'
import { getOrderItems } from '@/features/orders/services/order.api'

export function useGetOrderItems(orderId: number) {
    return useQuery({
        queryKey: ['orderItems', orderId],
        queryFn: async ({ queryKey }) => {
            const [, orderId] = queryKey as ['orderItems', number]

            return await getOrderItems(orderId)
        },
    })
}
