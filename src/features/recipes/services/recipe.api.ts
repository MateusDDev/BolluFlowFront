import { apiClient } from '@/shared/api/client'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import {
    RecipeComponentType,
    RecipeIngredientModel,
} from '@/features/recipes/services/recipeIngredient.model'

export type RecipeComponentCatalogItem = {
    id: number
    name: string
    baseUnit: string
    sourceType: RecipeComponentType
}

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

export function getRecipeComponentCatalog(recipeId: number) {
    // BACKEND: create endpoint to return a unified component catalog for recipe composition.
    // It must include raw ingredients and intermediate recipes.
    // Suggested route: GET /recipes/{recipeId}/components/catalog
    return apiClient<RecipeComponentCatalogItem[]>(
        `/recipes/${recipeId}/components/catalog`,
        'GET'
    )
}

export type CreateRecipeDataType = {
    name: string
    category: string
    preparationTime?: number
}

export function createRecipe(data: CreateRecipeDataType) {
    return apiClient<RecipeModel>('/recipes', 'POST', data)
}

export type CreateRecipeIngredientDataType = {
    ingredientId?: number
    quantityUsed: number
    componentType?: RecipeComponentType
    componentRecipeId?: number
}

export function createRecipeIngredient(
    recipeId: number,
    data: CreateRecipeIngredientDataType
) {
    // BACKEND: current endpoint supports only ingredientId.
    // To support recipe-as-component, accept componentType + componentRecipeId in payload.
    return apiClient<RecipeIngredientModel>(
        `/recipes/${recipeId}/ingredients`,
        'POST',
        data
    )
}

export type UpdateRecipeDataType = {
    name?: string
    category?: string
    preparationTime?: number
    isActive?: boolean
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
    // BACKEND: delete route currently uses ingredientId.
    // For mixed components, expose pivot id and migrate to /components/{componentId}.
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
    // BACKEND: allow componentType/componentRecipeId in PUT for full edit support.
    return apiClient<RecipeIngredientModel>(
        `/recipes/${recipeId}/ingredients/${ingredientId}`,
        'PUT',
        data
    )
}
