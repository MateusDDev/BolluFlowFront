import { apiClient } from '@/shared/api/client'
import { SupplyConversionModel } from '@/features/supplies/services/supplyConversion.model'

export type UpsertSupplyConversionDataType = {
    name: string
    quantityInBaseUnit: number
}

export function getSupplyConversions(supplyId: number) {
    return apiClient<SupplyConversionModel[]>(
        `/supplies/${supplyId}/conversions`,
        'GET'
    )
}

export function createSupplyConversion(
    supplyId: number,
    data: UpsertSupplyConversionDataType
) {
    return apiClient<null>(`/supplies/${supplyId}/conversions`, 'POST', data)
}

export function updateSupplyConversion(
    supplyId: number,
    conversionId: number,
    data: UpsertSupplyConversionDataType
) {
    return apiClient<null>(
        `/supplies/${supplyId}/conversions/${conversionId}`,
        'PUT',
        data
    )
}

export function deleteSupplyConversion(supplyId: number, conversionId: number) {
    return apiClient<null>(
        `/supplies/${supplyId}/conversions/${conversionId}`,
        'DELETE'
    )
}
