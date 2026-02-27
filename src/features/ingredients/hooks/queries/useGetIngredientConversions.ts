import { useQuery } from '@tanstack/react-query'
import { getIngredientConversions } from '@/features/ingredients/services/ingredientConversion.api'

export function useGetIngredientConversions(ingredientId: number, enabled = true) {
    return useQuery({
        queryKey: ['ingredient-conversions', ingredientId],
        queryFn: async () => await getIngredientConversions(ingredientId),
        enabled: enabled && Number.isFinite(ingredientId),
    })
}
