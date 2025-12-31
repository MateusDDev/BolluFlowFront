import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateIngredient,
    UpdateIngredientData,
} from '@/features/ingredients/services/ingredient.api'

export function useUpdateIngredient() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number
            data: UpdateIngredientData
        }) => await updateIngredient(id, data),

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['ingredients'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
