import { useQuery } from '@tanstack/react-query'
import { getRecipeComponentCatalog } from '@/features/recipes/services/recipe.api'

export function useGetIngredients(recipeId: number) {
    return useQuery({
        queryKey: ['recipeComponentsCatalog', recipeId],
        queryFn: async () => getRecipeComponentCatalog(recipeId),
    })
}
