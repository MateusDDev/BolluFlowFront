import { apiClient } from '@/shared/api/client'

export type CreateProductProductionDataType = {
    quantity: number
    notes?: string
}

export type CreateProductStockAdjustmentDataType = {
    quantity: number
    direction: 'add' | 'remove'
    reason: string
}

export type InsufficientProductComponentModel = {
    componentId?: number
    componentName: string
    required: number
    available: number
    unit: string
}

export type ProductStockErrorModel = {
    code: string
    message: string
    insufficientComponents?: InsufficientProductComponentModel[]
}

export function createProductProduction(
    productId: number,
    data: CreateProductProductionDataType
) {
    return apiClient<null>(`/products/${productId}/productions`, 'POST', data)
}

export function createProductStockAdjustment(
    productId: number,
    data: CreateProductStockAdjustmentDataType
) {
    return apiClient<null>(
        `/products/${productId}/stock/adjustment`,
        'POST',
        data
    )
}
