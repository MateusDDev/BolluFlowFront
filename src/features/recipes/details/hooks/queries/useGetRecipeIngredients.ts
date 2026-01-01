import { useQuery } from '@tanstack/react-query'
import { getRecipeIngredients } from '@/features/recipes/services/recipe.api'

export function useGetRecipeIngredients(recipeId: number) {
    return useQuery({
        queryKey: ['recipeIngredients', recipeId],
        queryFn: async ({ queryKey }) => {
            const [, recipeId] = queryKey as ['recipeIngredients', number]
            return await getRecipeIngredients(recipeId)
        },
    })
}
