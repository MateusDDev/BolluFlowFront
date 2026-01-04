import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateOrderItem,
    UpdateOrderItemDataType,
} from '@/features/orders/services/order.api'

export function useUpdateOrderItem() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            orderId,
            itemId,
            data,
        }: {
            orderId: number
            itemId: number
            data: UpdateOrderItemDataType
        }) => await updateOrderItem(orderId, itemId, data),

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['orderItems'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
