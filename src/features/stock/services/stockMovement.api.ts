import { apiClient } from '@/shared/api/client'
import {
    CreateStockMovementDataType,
    StockMovementModel,
} from '@/features/stock/services/stockMovement.model'

export function createStockPurchase(data: CreateStockMovementDataType) {
    return apiClient<StockMovementModel>('/stock/movements', 'POST', data)
}
