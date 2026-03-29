import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createRecipeConversion,
} from '@/features/recipes/services/recipeConversion.api'
import { UpsertRecipeConversionDataType } from '@/features/recipes/services/recipeConversion.model'

export function useCreateRecipeConversion() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recipeId,
            data,
        }: {
            recipeId: number
            data: UpsertRecipeConversionDataType
        }) => await createRecipeConversion(recipeId, data),
        onSuccess: async (_, variables) => {
            await client.invalidateQueries({
                queryKey: ['recipe-conversions', variables.recipeId],
            })
        },
    })
}
