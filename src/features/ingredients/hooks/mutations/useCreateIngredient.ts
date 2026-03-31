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

        onSuccess: async (createdIngredient) => {
            await client.invalidateQueries({ queryKey: ['ingredients'] })
            await client.invalidateQueries({
                queryKey: ['ingredient-conversions', createdIngredient.id],
            })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
