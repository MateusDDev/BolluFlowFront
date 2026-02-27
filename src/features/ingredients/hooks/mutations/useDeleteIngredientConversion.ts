import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteIngredientConversion } from '@/features/ingredients/services/ingredientConversion.api'

export function useDeleteIngredientConversion() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({ ingredientId, conversionId }: { ingredientId: number; conversionId: number }) =>
            await deleteIngredientConversion(ingredientId, conversionId),

        onSuccess: async (_, variables) => {
            await client.invalidateQueries({
                queryKey: ['ingredient-conversions', variables.ingredientId],
            })
        },
    })
}
