import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateProductPricing,
    UpdateProductPricingDataType,
} from '@/features/products/services/product.api'

export function useUpdateProductPricing() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            productId,
            data,
        }: {
            productId: number
            data: UpdateProductPricingDataType
        }) => updateProductPricing(productId, data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => console.error(error),
    })
}
