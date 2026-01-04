import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createOrder,
    CreateOrderDataType,
} from '@/features/orders/services/order.api'

export function useCreateOrder() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateOrderDataType) =>
            await createOrder(data),

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['orders'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
