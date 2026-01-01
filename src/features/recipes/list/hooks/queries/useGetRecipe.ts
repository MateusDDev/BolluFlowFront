import { useQuery } from '@tanstack/react-query'
import { getRecipeById } from '@/features/recipes/services/recipe.api'

export function useGetRecipe(recipeId: number) {
    return useQuery({
        queryKey: ['recipes', recipeId],

        queryFn: async ({ queryKey }) => {
            const [, recipeId] = queryKey as ['recipes', number]
            return await getRecipeById(recipeId)
        },
    })
}
