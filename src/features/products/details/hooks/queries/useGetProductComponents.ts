import { useQuery } from '@tanstack/react-query'
import { getProductComponents } from '@/features/products/services/product.api'

export function useGetProductComponents(productId: number) {
    return useQuery({
        queryKey: ['productComponents', productId],
        queryFn: async ({ queryKey }) => {
            const [, productId] = queryKey as ['productComponents', number]
            return getProductComponents(productId)
        },
    })
}
