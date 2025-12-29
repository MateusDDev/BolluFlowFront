import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createIngredient,
    CreateIngredientData,
} from '@/features/ingredients/services/ingredient.api'
import { mapIngredientModel } from '@/features/ingredients/domain/ingredient.mapper'

export function useCreateIngredient() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateIngredientData) => {
            const ingredient = await createIngredient(data)
            return mapIngredientModel(ingredient)
        },

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['ingredients'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
