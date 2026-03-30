import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFinancialEntry } from '@/features/finance/services/finance.api'
import { FinancialEntryOrigin } from '@/features/finance/services/finance.model'

type DeleteFinancialEntryParams = {
    id: number
    origin: FinancialEntryOrigin
    revertStock: boolean
}

export function useDeleteFinancialEntry() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: ({ id, revertStock }: DeleteFinancialEntryParams) =>
            deleteFinancialEntry(id, revertStock),
        onSuccess: async (_, variables) => {
            await Promise.all([
                client.invalidateQueries({ queryKey: ['finance', 'entries'] }),
                client.invalidateQueries({ queryKey: ['finance', 'balance'] }),
            ])

            if (!variables.revertStock) return

            if (variables.origin === 'ingredient_purchase') {
                await client.invalidateQueries({ queryKey: ['ingredients'] })
            }

            if (variables.origin === 'supply_purchase') {
                await client.invalidateQueries({ queryKey: ['supplies'] })
            }
        },
    })
}
