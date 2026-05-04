import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProductImage } from '@/features/products/services/product.api'

export function useUpdateProductImage(productId: number) {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (imageUrl: string | null) =>
            updateProductImage(productId, imageUrl),
        onSuccess: async () => {
            await Promise.all([
                client.invalidateQueries({ queryKey: ['products'] }),
                client.invalidateQueries({ queryKey: ['products', productId] }),
            ])
        },
        onError: (error) => console.error(error),
    })
}
