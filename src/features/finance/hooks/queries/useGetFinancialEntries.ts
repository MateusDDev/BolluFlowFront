import { useQuery } from '@tanstack/react-query'
import { getFinancialEntries } from '@/features/finance/services/finance.api'
import { FinancialEntryType } from '@/features/finance/services/finance.model'

export function useGetFinancialEntries(type?: FinancialEntryType) {
    return useQuery({
        queryKey: ['finance', 'entries', type ?? 'all'],
        queryFn: () => getFinancialEntries(type),
    })
}
