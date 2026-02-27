export interface IngredientModel {
    id: number
    name: string
    baseUnit: string
    unitCost: number
    stockQuantity: number
    minimumStockQuantity?: number
    unit?: string
}
