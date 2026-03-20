import { useQuery } from '@tanstack/react-query'
import { getFixedCosts } from '@/features/finance/services/finance.api'

export function useGetFixedCosts() {
    return useQuery({
        queryKey: ['finance-fixed-costs'],
        queryFn: getFixedCosts,
    })
}
