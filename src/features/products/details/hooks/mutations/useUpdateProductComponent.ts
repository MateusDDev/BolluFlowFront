import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProductComponent } from '@/features/products/services/product.api'

export function useUpdateProductComponent() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            productId,
            componentId,
            data,
        }: {
            productId: number
            componentId: number
            data: { quantityUsed: number }
        }) => updateProductComponent(productId, componentId, data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['productComponents'] })
            await client.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => console.error(error),
    })
}
