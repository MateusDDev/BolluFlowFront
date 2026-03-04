import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createIngredientConversion,
    UpsertIngredientConversionDataType,
} from '@/features/ingredients/services/ingredientConversion.api'

export function useCreateIngredientConversion() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            ingredientId,
            data,
        }: {
            ingredientId: number
            data: UpsertIngredientConversionDataType
        }) => await createIngredientConversion(ingredientId, data),

        onSuccess: async (_, variables) => {
            await client.invalidateQueries({
                queryKey: ['ingredient-conversions', variables.ingredientId],
            })
        },
    })
}
