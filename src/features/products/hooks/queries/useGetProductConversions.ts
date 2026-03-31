import { useQuery } from '@tanstack/react-query'
import { getProductConversions } from '@/features/products/services/productConversion.api'

export function useGetProductConversions(productId: number, enabled = true) {
    return useQuery({
        queryKey: ['product-conversions', productId],
        queryFn: async ({ queryKey }) => {
            const [, id] = queryKey as ['product-conversions', number]
            return getProductConversions(id)
        },
        enabled,
    })
}
