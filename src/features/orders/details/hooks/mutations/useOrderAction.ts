import { useMutation, useQueryClient } from '@tanstack/react-query'

type OrderAction = (id: number) => Promise<unknown>

type Props = {
    action: OrderAction
    onSuccess?: (orderId: number) => Promise<void> | void
}

export function useOrderAction({ action, onSuccess }: Props) {
    const client = useQueryClient()

    return useMutation({
        mutationFn: action,

        onSuccess: async (_, orderId) => {
            await client.invalidateQueries({ queryKey: ['orders'] })
            await client.invalidateQueries({ queryKey: ['order', orderId] })
            await client.invalidateQueries({ queryKey: ['orders', orderId] })

            await onSuccess?.(orderId)
        },
    })
}
