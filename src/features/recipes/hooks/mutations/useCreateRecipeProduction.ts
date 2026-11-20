import { showTipOnce } from '@/shared/onboarding/tips'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createRecipeProduction,
    CreateRecipeProductionDataType,
} from '@/features/recipes/services/recipeStock.api'

export function useCreateRecipeProduction() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recipeId,
            data,
        }: {
            recipeId: number
            data: CreateRecipeProductionDataType
        }) => await createRecipeProduction(recipeId, data),
        onSuccess: async () => {
            showTipOnce('first-production')
            await client.invalidateQueries({ queryKey: ['recipes'] })
            await client.invalidateQueries({ queryKey: ['ingredients'] })
        },
    })
}
