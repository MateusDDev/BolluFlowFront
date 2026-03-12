import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSupplyConversion } from '@/features/supplies/services/supplyConversion.api'

export function useDeleteSupplyConversion() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            supplyId,
            conversionId,
        }: {
            supplyId: number
            conversionId: number
        }) => deleteSupplyConversion(supplyId, conversionId),
        onSuccess: async (_, variables) => {
            await client.invalidateQueries({
                queryKey: ['supply-conversions', variables.supplyId],
            })
        },
    })
}
