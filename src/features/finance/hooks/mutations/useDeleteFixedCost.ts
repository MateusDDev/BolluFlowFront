import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFixedCost } from '@/features/finance/services/finance.api'

export function useDeleteFixedCost() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            mode,
            month,
        }: {
            id: string
            mode: string
            month: string
        }) => deleteFixedCost(id, mode, month),
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
