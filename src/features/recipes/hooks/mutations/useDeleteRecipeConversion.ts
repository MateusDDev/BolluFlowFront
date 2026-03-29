import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteRecipeConversion } from '@/features/recipes/services/recipeConversion.api'

export function useDeleteRecipeConversion() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recipeId,
            conversionId,
        }: {
            recipeId: number
            conversionId: number
        }) => await deleteRecipeConversion(recipeId, conversionId),
        onSuccess: async (_, variables) => {
            await client.invalidateQueries({
                queryKey: ['recipe-conversions', variables.recipeId],
            })
        },
    })
}
