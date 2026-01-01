import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateRecipe,
    UpdateRecipeDataType,
} from '@/features/recipes/services/recipe.api'

export function useUpdateRecipe() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number
            data: UpdateRecipeDataType
        }) => await updateRecipe(id, data),

        onSuccess: async () =>
            await client.invalidateQueries({ queryKey: ['recipes'] }),

        onError: (error) => {
            console.error(error)
        },
    })
}
