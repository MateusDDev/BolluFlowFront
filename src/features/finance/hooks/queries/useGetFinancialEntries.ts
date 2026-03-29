import { useQuery } from '@tanstack/react-query'
import { getFinancialEntries } from '@/features/finance/services/finance.api'
import { FinancialEntryType } from '@/features/finance/services/finance.model'

export function useGetFinancialEntries(
    month: number,
    year: number,
    type?: FinancialEntryType
) {
    return useQuery({
        queryKey: ['finance', 'entries', month, year, type ?? 'all'],
        queryFn: () => getFinancialEntries(month, year, type),
    })
}
