import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createManualTransaction } from '@/features/finance/services/finance.api'

export function useCreateManualTransaction() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: createManualTransaction,
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['finance-overview'] })
            await client.invalidateQueries({
                queryKey: ['finance-transactions'],
            })
        },
    })
}
