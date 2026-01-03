import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateRecipePricing,
    UpdateRecipePricingDataType,
} from '@/features/recipes/services/recipe.api'

export function useUpdateRecipePricing() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recipeId,
            data,
        }: {
            recipeId: number
            data: UpdateRecipePricingDataType
        }) => updateRecipePricing(recipeId, data),

        onSuccess: async () =>
            client.invalidateQueries({ queryKey: ['recipes'] }),

        onError: (error) => console.error(error),
    })
}
