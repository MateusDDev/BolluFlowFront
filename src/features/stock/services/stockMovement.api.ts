import { apiClient } from '@/shared/api/client'
import {
    CreateStockMovementDataType,
    StockMovementModel,
} from '@/features/stock/services/stockMovement.model'

export function createStockPurchase(data: CreateStockMovementDataType) {
    return apiClient<StockMovementModel>('/stock/movements', 'POST', {
        ItemType: data.itemType,
        ItemId: data.itemId,
        MovementType: data.movementType,
        Quantity: data.quantity,
        UnitCost: data.unitCost,
        Notes: data.notes,
    })
}
