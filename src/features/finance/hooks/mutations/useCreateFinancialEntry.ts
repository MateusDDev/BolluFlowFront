import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFinancialEntry } from '@/features/finance/services/finance.api'

export function useCreateFinancialEntry() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: createFinancialEntry,
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['finance'] })
        },
    })
}
