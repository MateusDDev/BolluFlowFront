import { useQuery } from '@tanstack/react-query'
import { getProductById } from '@/features/products/services/product.api'

export function useGetProduct(productId: number) {
    return useQuery({
        queryKey: ['products', productId],
        queryFn: async ({ queryKey }) => {
            const [, productId] = queryKey as ['products', number]
            return getProductById(productId)
        },
    })
}
