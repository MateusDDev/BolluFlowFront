import { apiClient } from '@/shared/api/client'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { getBaseUnitEnumValue } from '@/features/ingredients/services/measurementUnits'

export function getIngredients() {
    return apiClient<IngredientModel[]>('/ingredients', 'GET')
}

export function getIngredientById(id: number) {
    return apiClient<IngredientModel>(`/ingredients/${id}`, 'GET')
}

export type CreateIngredientDataType = {
    name: string
    baseUnit: string | number
    unitCost: number
    stockQuantity: number
    minimumStockQuantity?: number
}

export function createIngredient(data: CreateIngredientDataType) {
    return apiClient<IngredientModel>('/ingredients', 'POST', {
        ...data,
        baseUnit: getBaseUnitEnumValue(data.baseUnit),
    })
}

export type UpdateIngredientDataType = Partial<Omit<IngredientModel, 'id'>>

export function updateIngredient(id: number, data: UpdateIngredientDataType) {
    return apiClient<IngredientModel>(`/ingredients/${id}`, 'PUT', {
        ...data,
        ...(data.baseUnit !== undefined
            ? { baseUnit: getBaseUnitEnumValue(data.baseUnit) }
            : {}),
    })
}

export function deleteIngredient(id: number) {
    return apiClient<null>(`/ingredients/${id}`, 'DELETE')
}
