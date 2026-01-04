import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createIngredient,
    CreateIngredientDataType,
} from '@/features/ingredients/services/ingredient.api'

export function useCreateIngredient() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateIngredientDataType) =>
            await createIngredient(data),

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['ingredients'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
