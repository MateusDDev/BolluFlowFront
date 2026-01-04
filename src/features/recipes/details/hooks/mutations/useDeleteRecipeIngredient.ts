import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteRecipeIngredient } from '@/features/recipes/services/recipe.api'

export function useDeleteRecipeIngredient() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recipeId,
            ingredientId,
        }: {
            recipeId: number
            ingredientId: number
        }) => deleteRecipeIngredient(recipeId, ingredientId),

        onSuccess: async () =>
            client.invalidateQueries({ queryKey: ['recipeIngredients'] }),

        onError: (error) => console.error(error),
    })
}
