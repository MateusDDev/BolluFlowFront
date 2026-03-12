import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createProduct,
    CreateProductDataType,
} from '@/features/products/services/product.api'

export function useCreateProduct() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateProductDataType) => createProduct(data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => {
            console.error(error)
        },
    })
}
