import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateSupplyConversion,
    UpsertSupplyConversionDataType,
} from '@/features/supplies/services/supplyConversion.api'

export function useUpdateSupplyConversion() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            supplyId,
            conversionId,
            data,
        }: {
            supplyId: number
            conversionId: number
            data: UpsertSupplyConversionDataType
        }) => updateSupplyConversion(supplyId, conversionId, data),
        onSuccess: async (_, variables) => {
            await client.invalidateQueries({
                queryKey: ['supply-conversions', variables.supplyId],
            })
        },
    })
}
