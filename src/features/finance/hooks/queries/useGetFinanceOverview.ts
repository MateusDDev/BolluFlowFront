import { useQuery } from '@tanstack/react-query'
import { getFinanceOverview } from '@/features/finance/services/finance.api'

export function useGetFinanceOverview(month: string) {
    return useQuery({
        queryKey: ['finance-overview', month],
        queryFn: () => getFinanceOverview(month),
    })
}
