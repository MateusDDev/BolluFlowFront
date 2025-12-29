import { apiClient } from '@/shared/api/client'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'

export function getIngredients() {
    return apiClient<IngredientModel[]>('/ingredients', 'GET')
}

export function getIngredientById(id: number) {
    return apiClient<IngredientModel>(`/ingredients/${id}`, 'GET')
}

export type CreateIngredientData = {
    name: string
    unit: string
    unitPrice: number
    stockQuantity: number
    minimumStockQuantity?: number
}

export function createIngredient(data: CreateIngredientData) {
    return apiClient<IngredientModel>('/ingredients', 'POST', data)
}

export type UpdateIngredientData = Partial<Omit<IngredientModel, 'id'>>

export function updateIngredient(id: number, data: UpdateIngredientData) {
    return apiClient<IngredientModel>(`/ingredients/${id}`, 'PUT', data)
}

export function deleteIngredient(id: number) {
    return apiClient<null>(`/ingredients/${id}`, 'DELETE')
}
