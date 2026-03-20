import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFixedCost } from '@/features/finance/services/finance.api'

export function useCreateFixedCost() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: createFixedCost,
        onSuccess: async () => {
            await client.invalidateQueries({
                queryKey: ['finance-fixed-costs'],
            })
            await client.invalidateQueries({ queryKey: ['finance-overview'] })
            await client.invalidateQueries({
                queryKey: ['finance-transactions'],
            })
        },
    })
}
