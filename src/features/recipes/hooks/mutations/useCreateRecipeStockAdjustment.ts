import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createRecipeStockAdjustment,
    CreateRecipeStockAdjustmentDataType,
} from '@/features/recipes/services/recipeStock.api'

export function useCreateRecipeStockAdjustment() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recipeId,
            data,
        }: {
            recipeId: number
            data: CreateRecipeStockAdjustmentDataType
        }) => await createRecipeStockAdjustment(recipeId, data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['recipes'] })
        },
    })
}
