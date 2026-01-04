import { useQuery } from '@tanstack/react-query'
import { getIngredients } from '@/features/ingredients/services/ingredient.api'

export function useGetIngredients() {
    return useQuery({
        queryKey: ['recipeIngredients'],

        queryFn: async () => await getIngredients(),
    })
}
