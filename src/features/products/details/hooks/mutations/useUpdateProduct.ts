import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateProduct,
    UpdateProductDataType,
} from '@/features/products/services/product.api'

export function useUpdateProduct() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number
            data: UpdateProductDataType
        }) => updateProduct(id, data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => console.error(error),
    })
}
