import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createRecipe,
    CreateRecipeDataType,
} from '@/features/recipes/services/recipe.api'

export function useCreateRecipe() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateRecipeDataType) =>
            await createRecipe(data),

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['recipes'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
