import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProductComponent } from '@/features/products/services/product.api'

export function useDeleteProductComponent() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            productId,
            componentId,
        }: {
            productId: number
            componentId: number
        }) => deleteProductComponent(productId, componentId),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['productComponents'] })
            await client.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => console.error(error),
    })
}
