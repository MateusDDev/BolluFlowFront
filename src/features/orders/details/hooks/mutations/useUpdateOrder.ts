import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateOrder,
    UpdateOrderDataType,
} from '@/features/orders/services/order.api'

export function useUpdateOrder() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            orderId,
            data,
        }: {
            orderId: number
            data: UpdateOrderDataType
        }) => await updateOrder(orderId, data),

        onSuccess: async (_, variables) => {
            await client.invalidateQueries({ queryKey: ['orders'] })
            await client.invalidateQueries({
                queryKey: ['orders', variables.orderId],
            })
        },
    })
}
