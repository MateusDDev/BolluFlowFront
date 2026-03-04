import { useQuery } from '@tanstack/react-query'
import { getProductComponentCatalog } from '@/features/products/services/product.api'

export function useGetProductComponentCatalog(productId: number) {
    return useQuery({
        queryKey: ['productComponentsCatalog', productId],
        queryFn: async ({ queryKey }) => {
            const [, productId] = queryKey as [
                'productComponentsCatalog',
                number,
            ]
            return getProductComponentCatalog(productId)
        },
    })
}
