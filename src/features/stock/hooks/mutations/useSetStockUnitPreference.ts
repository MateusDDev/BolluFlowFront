import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    setStockUnitPreference,
    StockUnitPreferenceItemType,
} from '@/features/stock/services/stockUnitPreference.api'

type SetStockUnitPreferenceInput = {
    itemType: StockUnitPreferenceItemType
    itemId: number
    conversionId: number | null
}

export function useSetStockUnitPreference() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: SetStockUnitPreferenceInput) =>
            setStockUnitPreference(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: [
                    'stock-unit-preference',
                    variables.itemType,
                    variables.itemId,
                ],
            })
        },
    })
}
