import { useQuery } from '@tanstack/react-query'
import { getIngredients } from '@/features/ingredients/services/ingredient.api'
import { mapIngredientModel } from '@/features/ingredients/domain/ingredient.mapper'

export function useGetIngredients() {
    return useQuery({
        queryKey: ['ingredients'],

        queryFn: async () => {
            const ingredients = await getIngredients()
            return ingredients.map(mapIngredientModel)
        },
    })
}
