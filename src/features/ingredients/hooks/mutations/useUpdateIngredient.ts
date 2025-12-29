import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateIngredient,
    UpdateIngredientData,
} from '@/features/ingredients/services/ingredient.api'
import { mapIngredientModel } from '@/features/ingredients/domain/ingredient.mapper'

export function useUpdateIngredient() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number
            data: UpdateIngredientData
        }) => {
            const ingredient = await updateIngredient(id, data)
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
