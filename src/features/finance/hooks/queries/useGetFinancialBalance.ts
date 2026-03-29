import { useQuery } from '@tanstack/react-query'
import { getFinancialBalance } from '@/features/finance/services/finance.api'

export function useGetFinancialBalance() {
    return useQuery({
        queryKey: ['finance', 'balance'],
        queryFn: getFinancialBalance,
    })
}
