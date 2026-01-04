import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createOrderItem,
    CreateOrderItemDataType,
} from '@/features/orders/services/order.api'

export function useCreateOrderItem() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            orderId,
            data,
        }: {
            orderId: number
            data: CreateOrderItemDataType[]
        }) => await createOrderItem(orderId, data),

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['orderItems'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
