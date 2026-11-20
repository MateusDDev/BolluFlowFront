import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createOrder,
    CreateOrderDataType,
} from '@/features/orders/services/order.api'
import { showTipOnce } from '@/shared/onboarding/tips'

export function useCreateOrder() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateOrderDataType) =>
            await createOrder(data),

        onSuccess: async (_data, variables) => {
            showTipOnce(
                variables.deliverNow ? 'first-sale' : 'first-custom-order'
            )
            await client.invalidateQueries({ queryKey: ['orders'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
