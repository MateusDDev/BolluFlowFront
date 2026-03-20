import { useQuery } from '@tanstack/react-query'
import { getFinanceTransactions } from '@/features/finance/services/finance.api'

export function useGetFinanceTransactions(month: string) {
    return useQuery({
        queryKey: ['finance-transactions', month],
        queryFn: () => getFinanceTransactions(month),
    })
}
