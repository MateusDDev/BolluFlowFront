import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createProductComponent,
    CreateProductComponentDataType,
} from '@/features/products/services/product.api'

export function useCreateProductComponent() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            productId,
            data,
        }: {
            productId: number
            data: CreateProductComponentDataType
        }) => createProductComponent(productId, data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['productComponents'] })
            await client.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (error) => console.error(error),
    })
}
