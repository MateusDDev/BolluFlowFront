import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createProductProduction,
    CreateProductProductionDataType,
} from '@/features/products/services/productStock.api'

export function useCreateProductProduction() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            productId,
            data,
        }: {
            productId: number
            data: CreateProductProductionDataType
        }) => await createProductProduction(productId, data),
        onSuccess: async (_, variables) => {
            await client.invalidateQueries({ queryKey: ['products'] })
            await client.invalidateQueries({
                queryKey: ['products', variables.productId],
            })
            await client.invalidateQueries({ queryKey: ['ingredients'] })
            await client.invalidateQueries({ queryKey: ['recipes'] })
            await client.invalidateQueries({ queryKey: ['supplies'] })
        },
    })
}
