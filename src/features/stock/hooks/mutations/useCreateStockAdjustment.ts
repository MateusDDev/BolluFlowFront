import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStockAdjustment } from '@/features/stock/services/stockMovement.api'
import { CreateStockAdjustmentDataType } from '@/features/stock/services/stockMovement.model'

export function useCreateStockAdjustment() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateStockAdjustmentDataType) =>
            createStockAdjustment(data),
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
