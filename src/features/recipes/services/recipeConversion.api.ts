import { apiClient } from '@/shared/api/client'
import {
    RecipeConversionModel,
    UpsertRecipeConversionDataType,
} from '@/features/recipes/services/recipeConversion.model'

export function getRecipeConversions(recipeId: number) {
    return apiClient<RecipeConversionModel[]>(`/recipes/${recipeId}/conversions`, 'GET')
}

export function createRecipeConversion(
    recipeId: number,
    data: UpsertRecipeConversionDataType
) {
    return apiClient<null>(`/recipes/${recipeId}/conversions`, 'POST', data)
}

export function deleteRecipeConversion(recipeId: number, conversionId: number) {
    return apiClient<null>(`/recipes/${recipeId}/conversions/${conversionId}`, 'DELETE')
}
