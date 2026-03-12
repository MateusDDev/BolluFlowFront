import { useQuery } from '@tanstack/react-query'
import { getSupplies } from '@/features/supplies/services/supply.api'

export function useGetSupplies() {
    return useQuery({
        queryKey: ['supplies'],
        queryFn: async () => getSupplies(),
    })
}
