export type StockMovementItemType = 'supply' | 'ingredient'

export type StockMovementType = 'purchase' | 'adjustment' | 'consumption'

export interface CreateStockMovementDataType {
    itemType: StockMovementItemType
    itemId: number
    movementType: StockMovementType
    quantity: number
    unitCost: number
    notes?: string
}

export interface StockMovementModel {
    id: number
    itemType: StockMovementItemType
    itemId: number
    movementType: StockMovementType
    quantity: number
    unitCost: number
    totalValue: number
    notes?: string | null
    eventKey?: string | null
    createdAt: string
}
