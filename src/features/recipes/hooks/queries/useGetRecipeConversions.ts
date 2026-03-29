import { useQuery } from '@tanstack/react-query'
import { getRecipeConversions } from '@/features/recipes/services/recipeConversion.api'

export function useGetRecipeConversions(recipeId: number, enabled = true) {
    return useQuery({
        queryKey: ['recipe-conversions', recipeId],
        queryFn: async () => await getRecipeConversions(recipeId),
        enabled: enabled && Number.isFinite(recipeId),
    })
}
