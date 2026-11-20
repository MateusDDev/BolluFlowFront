import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteOrder } from '@/features/orders/services/order.api'

export function useDeleteDirectSale() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (orderId: number) => deleteOrder(orderId),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['orders'] }),
                queryClient.invalidateQueries({ queryKey: ['products'] }),
                queryClient.invalidateQueries({ queryKey: ['finance'] }),
                queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
            ])
        },
    })
}
