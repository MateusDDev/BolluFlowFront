import { apiClient } from '@/shared/api/client'
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { normalizeMeasurementUnit } from '@/features/ingredients/services/measurementUnits'

export function getSupplies() {
    // BACKEND: criar entidade de insumos separada de ingredientes.
    return apiClient<SupplyModel[]>('/supplies', 'GET')
}

export function getSupplyById(id: number) {
    return apiClient<SupplyModel>(`/supplies/${id}`, 'GET')
}

export type CreateSupplyDataType = {
    name: string
    baseUnit: string | number
    unitCost: number
    stockQuantity: number
    minimumStockQuantity?: number
}

export function createSupply(data: CreateSupplyDataType) {
    const normalizedUnit = normalizeMeasurementUnit(data.baseUnit)

    return apiClient<SupplyModel>('/supplies', 'POST', {
        name: data.name,
        unit: normalizedUnit,
        unitCost: data.unitCost,
        stockQuantity: data.stockQuantity,
        minimumStockQuantity: data.minimumStockQuantity,
    })
}

export type UpdateSupplyDataType = Partial<Omit<SupplyModel, 'id'>>

export function updateSupply(id: number, data: UpdateSupplyDataType) {
    return apiClient<SupplyModel>(`/supplies/${id}`, 'PUT', {
        ...data,
        ...(data.baseUnit !== undefined
            ? { unit: normalizeMeasurementUnit(data.baseUnit) }
            : {}),
        baseUnit: undefined,
    })
}

export function deleteSupply(id: number) {
    return apiClient<null>(`/supplies/${id}`, 'DELETE')
}
