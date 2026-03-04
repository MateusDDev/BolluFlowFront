import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/features/products/services/product.api'

export function useGetProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => getProducts(),
    })
}
