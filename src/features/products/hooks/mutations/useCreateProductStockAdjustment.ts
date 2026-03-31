import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createProductStockAdjustment,
    CreateProductStockAdjustmentDataType,
} from '@/features/products/services/productStock.api'

export function useCreateProductStockAdjustment() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            productId,
            data,
        }: {
            productId: number
            data: CreateProductStockAdjustmentDataType
        }) => await createProductStockAdjustment(productId, data),
        onSuccess: async (_, variables) => {
            await client.invalidateQueries({ queryKey: ['products'] })
            await client.invalidateQueries({
                queryKey: ['products', variables.productId],
            })
        },
    })
}
