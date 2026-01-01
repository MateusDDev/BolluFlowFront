import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteRecipe } from '@/features/recipes/services/recipe.api'

export function useDeleteRecipe() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => await deleteRecipe(id),

        onSuccess: async () =>
            await client.invalidateQueries({ queryKey: ['recipes'] }),

        onError: (error) => console.error(error),
    })
}
