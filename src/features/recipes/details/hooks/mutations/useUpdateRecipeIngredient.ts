import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateRecipeIngredient } from '@/features/recipes/services/recipe.api'

export function useUpdateRecipeIngredient() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recipeId,
            ingredientId,
            data,
        }: {
            recipeId: number
            ingredientId: number
            data: {
                quantityUsed: number
            }
        }) => updateRecipeIngredient(recipeId, ingredientId, data),

        onSuccess: async () =>
            client.invalidateQueries({ queryKey: ['recipeIngredients'] }),

        onError: (error) => console.error(error),
    })
}
