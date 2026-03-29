import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStockPurchase } from '@/features/stock/services/stockMovement.api'
import { CreateStockMovementDataType } from '@/features/stock/services/stockMovement.model'

export function useCreateStockPurchase() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateStockMovementDataType) =>
            createStockPurchase(data),
        onSuccess: async (_, variables) => {
            if (variables.itemType === 'supply') {
                await client.invalidateQueries({ queryKey: ['supplies'] })
            }

            if (variables.itemType === 'ingredient') {
                await client.invalidateQueries({ queryKey: ['ingredients'] })
            }
        },
    })
}
