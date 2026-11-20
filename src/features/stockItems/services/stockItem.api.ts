import { apiClient } from '@/shared/api/client'
import { normalizeMeasurementUnit } from '@/features/ingredients/services/measurementUnits'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'

export type StockItemModel = {
    id: number
    name: string
    baseUnit: string | number
    unitCost: number
    stockQuantity: number
    minimumStockQuantity?: number | null
    trackStock: boolean
}

export type StockItemPackageModel = {
    id: number
    name: string
    quantityInBaseUnit: number
}

export type CreateStockItemData = {
    name: string
    baseUnit: string
    unitCost: number
    stockQuantity: number
    minimumStockQuantity?: number
}

export type UpdateStockItemData = {
    name: string
    baseUnit: string | number
    unitCost: number
    minimumStockQuantity?: number
    trackStock?: boolean
}

export function getStockItems(config: StockItemConfig) {
    return apiClient<StockItemModel[]>(config.apiPath, 'GET')
}

export function createStockItem(
    config: StockItemConfig,
    data: CreateStockItemData
) {
    return apiClient<{ id: number }>(config.apiPath, 'POST', {
        name: data.name,
        unit: normalizeMeasurementUnit(data.baseUnit),
        unitCost: data.unitCost,
        stockQuantity: data.stockQuantity,
        minimumStockQuantity: data.minimumStockQuantity,
    })
}

export function updateStockItem(
    config: StockItemConfig,
    id: number,
    data: UpdateStockItemData
) {
    return apiClient<StockItemModel>(`${config.apiPath}/${id}`, 'PUT', {
        name: data.name,
        unit: normalizeMeasurementUnit(data.baseUnit),
        unitCost: data.unitCost,
        minimumStockQuantity: data.minimumStockQuantity,
        trackStock: data.trackStock,
    })
}

export function getStockItemPackages(config: StockItemConfig, id: number) {
    return apiClient<StockItemPackageModel[]>(
        `${config.apiPath}/${id}/conversions`,
        'GET'
    )
}

export function createStockItemPackage(
    config: StockItemConfig,
    id: number,
    data: { name: string; quantityInBaseUnit: number }
) {
    return apiClient<null>(`${config.apiPath}/${id}/conversions`, 'POST', data)
}
