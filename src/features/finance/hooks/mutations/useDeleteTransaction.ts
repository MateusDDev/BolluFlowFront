import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTransaction } from '@/features/finance/services/finance.api'

export function useDeleteTransaction() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['finance-overview'] })
            await client.invalidateQueries({
                queryKey: ['finance-transactions'],
            })
        },
    })
}
