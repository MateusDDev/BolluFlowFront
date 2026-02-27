import { apiClient } from '@/shared/api/client'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'

export function getIngredients() {
    return apiClient<IngredientModel[]>('/ingredients', 'GET')
}

export function getIngredientById(id: number) {
    return apiClient<IngredientModel>(`/ingredients/${id}`, 'GET')
}

export type CreateIngredientDataType = {
    name: string
    baseUnit: string
    unitCost: number
    stockQuantity: number
    minimumStockQuantity?: number
}

export function createIngredient(data: CreateIngredientDataType) {
    return apiClient<IngredientModel>('/ingredients', 'POST', data)
}

export type UpdateIngredientDataType = Partial<Omit<IngredientModel, 'id' | 'unit'>>

export function updateIngredient(id: number, data: UpdateIngredientDataType) {
    return apiClient<IngredientModel>(`/ingredients/${id}`, 'PUT', data)
}

export function deleteIngredient(id: number) {
    return apiClient<null>(`/ingredients/${id}`, 'DELETE')
}
