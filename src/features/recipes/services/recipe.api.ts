import { apiClient } from '@/shared/api/client'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { RecipeIngredientModel } from '@/features/recipes/services/recipeIngredient.model'

export function getRecipes() {
    return apiClient<RecipeModel[]>('/recipes', 'GET')
}

export function getRecipeById(id: number) {
    return apiClient<RecipeModel>(`/recipes/${id}`, 'GET')
}

export function getRecipeIngredients(id: number) {
    return apiClient<RecipeIngredientModel[]>(
        `/recipes/${id}/ingredients`,
        'GET'
    )
}

export type CreateRecipeDataType = {
    name: string
    category: string
    baseUnit: string
    yield?: number | null
    preparationTime?: number
    minimumStockQuantity?: number
}

export function createRecipe(data: CreateRecipeDataType) {
    return apiClient<RecipeModel>('/recipes', 'POST', data)
}

export type CreateRecipeIngredientDataType = {
    ingredientId: number
    quantityUsed: number
}

export function createRecipeIngredient(
    recipeId: number,
    data: CreateRecipeIngredientDataType
) {
    return apiClient<RecipeIngredientModel>(
        `/recipes/${recipeId}/ingredients`,
        'POST',
        data
    )
}

export type UpdateRecipeDataType = {
    name?: string
    category?: string
    baseUnit?: string
    yield?: number | null
    preparationTime?: number
    isActive?: boolean
    finalPrice?: number
}

export function updateRecipe(id: number, data: UpdateRecipeDataType) {
    return apiClient<RecipeModel>(`/recipes/${id}`, 'PATCH', data)
}

export type UpdateRecipePricingDataType = {
    indirectCostPercentage: number
    markupPercentage: number
    finalPrice: number
    discountPercentage?: number
}

export function updateRecipePricing(
    id: number,
    data: UpdateRecipePricingDataType
) {
    return apiClient<RecipeModel>(`/recipes/${id}/pricing`, 'PATCH', data)
}

export function deleteRecipe(id: number) {
    return apiClient<null>(`/recipes/${id}`, 'DELETE')
}

export function deleteRecipeIngredient(recipeId: number, ingredientId: number) {
    return apiClient<null>(
        `/recipes/${recipeId}/ingredients/${ingredientId}`,
        'DELETE'
    )
}

export function updateRecipeIngredient(
    recipeId: number,
    ingredientId: number,
    data: { quantityUsed: number }
) {
    return apiClient<RecipeIngredientModel>(
        `/recipes/${recipeId}/ingredients/${ingredientId}`,
        'PUT',
        data
    )
}
