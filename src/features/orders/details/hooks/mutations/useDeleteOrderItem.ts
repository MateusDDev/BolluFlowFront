import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteOrderItem } from '@/features/orders/services/order.api'

export function useDeleteOrderItem() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            orderId,
            itemId,
        }: {
            orderId: number
            itemId: number
        }) => await deleteOrderItem(orderId, itemId),

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['orderItems'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
