import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '@/features/recipes/services/recipe.api'

export function useGetRecipes() {
    return useQuery({
        queryKey: ['recipes'],

        queryFn: async () => await getRecipes(),
    })
}
