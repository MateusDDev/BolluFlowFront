import { useQuery } from '@tanstack/react-query'
import { getFinancialBalance } from '@/features/finance/services/finance.api'

export function useGetFinancialBalance(month: number, year: number) {
    return useQuery({
        queryKey: ['finance', 'balance', month, year],
        queryFn: () => getFinancialBalance(month, year),
    })
}
