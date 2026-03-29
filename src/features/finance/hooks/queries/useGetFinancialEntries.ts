import { useQuery } from '@tanstack/react-query'
import { getFinancialEntries } from '@/features/finance/services/finance.api'

export function useGetFinancialEntries() {
    return useQuery({
        queryKey: ['finance', 'entries'],
        queryFn: getFinancialEntries,
    })
}
