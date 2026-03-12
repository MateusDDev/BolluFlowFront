import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createSupplyConversion,
    UpsertSupplyConversionDataType,
} from '@/features/supplies/services/supplyConversion.api'

export function useCreateSupplyConversion() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            supplyId,
            data,
        }: {
            supplyId: number
            data: UpsertSupplyConversionDataType
        }) => createSupplyConversion(supplyId, data),
        onSuccess: async (_, variables) => {
            await client.invalidateQueries({
                queryKey: ['supply-conversions', variables.supplyId],
            })
        },
    })
}
