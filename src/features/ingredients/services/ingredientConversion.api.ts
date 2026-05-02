import { apiClient } from '@/shared/api/client'
import { IngredientConversionModel } from '@/features/ingredients/services/ingredientConversion.model'

export type UpsertIngredientConversionDataType = {
    name: string
    quantityInBaseUnit: number
}

export function getIngredientConversions(ingredientId: number) {
    return apiClient<IngredientConversionModel[]>(
        `/ingredients/${ingredientId}/conversions`,
        'GET'
    )
}

export function createIngredientConversion(
    ingredientId: number,
    data: UpsertIngredientConversionDataType
) {
    return apiClient<null>(
        `/ingredients/${ingredientId}/conversions`,
        'POST',
        data
    )
}

export function updateIngredientConversion(
    ingredientId: number,
    conversionId: number,
    data: UpsertIngredientConversionDataType
) {
    return apiClient<null>(
        `/ingredients/${ingredientId}/conversions/${conversionId}`,
        'PUT',
        data
    )
}

export function deleteIngredientConversion(
    ingredientId: number,
    conversionId: number
) {
    return apiClient<null>(
        `/ingredients/${ingredientId}/conversions/${conversionId}`,
        'DELETE'
    )
}
