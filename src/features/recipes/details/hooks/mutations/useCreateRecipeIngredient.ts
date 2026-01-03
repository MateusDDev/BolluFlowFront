import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createRecipeIngredient,
    CreateRecipeIngredientDataType,
} from '@/features/recipes/services/recipe.api'

export function useCreateRecipeIngredient() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recipeId,
            data,
        }: {
            recipeId: number
            data: CreateRecipeIngredientDataType
        }) => {
            return await createRecipeIngredient(recipeId, data)
        },

        onSuccess: async () =>
            client.invalidateQueries({ queryKey: ['recipeIngredients'] }),

        onError: (error) => console.error(error),
    })
}
