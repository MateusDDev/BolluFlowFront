import { useMutation, useQueryClient } from '@tanstack/react-query'

type OrderAction = (id: number) => Promise<unknown>

export function useOrderAction(action: OrderAction) {
    const client = useQueryClient()

    return useMutation({
        mutationFn: action,

        onSuccess: async (_, orderId) => {
            await client.invalidateQueries({ queryKey: ['orders'] })
            await client.invalidateQueries({ queryKey: ['order', orderId] })
        },
    })
}
