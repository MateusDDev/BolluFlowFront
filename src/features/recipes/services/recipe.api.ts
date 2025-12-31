import { apiClient } from '@/shared/api/client'
import { RecipeModel } from '@/features/recipes/services/recipe.model'

export function getRecipes() {
    return apiClient<RecipeModel>('/recipes', 'GET')
}
