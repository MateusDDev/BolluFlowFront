import { apiClient } from '@/shared/api/client'

export type CreateRecipeProductionDataType = {
    quantity: number
    notes?: string
}

export type CreateRecipeStockAdjustmentDataType = {
    quantity: number
    direction: 'add' | 'remove'
    reason: string
}

export type InsufficientIngredientModel = {
    ingredientId: number
    ingredientName: string
    required: number
    available: number
    unit: string
}

export type RecipeStockErrorModel = {
    code: string
    message: string
    insufficientIngredients?: InsufficientIngredientModel[]
}

export function createRecipeProduction(
    recipeId: number,
    data: CreateRecipeProductionDataType
) {
    return apiClient<null>(`/recipes/${recipeId}/productions`, 'POST', data)
}

export function createRecipeStockAdjustment(
    recipeId: number,
    data: CreateRecipeStockAdjustmentDataType
) {
    return apiClient<null>(`/recipes/${recipeId}/stock/adjustment`, 'POST', data)
}
