import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteIngredient } from '@/features/ingredients/services/ingredient.api'

export function useDeleteIngredient() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: deleteIngredient,
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['ingredients'] })
        },
    })
}
