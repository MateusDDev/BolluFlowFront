import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFixedCost } from '@/features/finance/services/finance.api'

export function useUpdateFixedCost() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: Parameters<typeof updateFixedCost>[1]
        }) => updateFixedCost(id, data),
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
