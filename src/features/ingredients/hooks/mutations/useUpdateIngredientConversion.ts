import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateIngredientConversion,
    UpsertIngredientConversionDataType,
} from '@/features/ingredients/services/ingredientConversion.api'

export function useUpdateIngredientConversion() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            ingredientId,
            conversionId,
            data,
        }: {
            ingredientId: number
            conversionId: number
            data: UpsertIngredientConversionDataType
        }) => await updateIngredientConversion(ingredientId, conversionId, data),

        onSuccess: async (_, variables) => {
            await client.invalidateQueries({
                queryKey: ['ingredient-conversions', variables.ingredientId],
            })
        },
    })
}
