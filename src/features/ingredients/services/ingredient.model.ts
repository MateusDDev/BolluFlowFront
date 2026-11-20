export interface IngredientModel {
    id: number
    name: string
    baseUnit: string | number
    unitCost: number
    stockQuantity: number
    trackStock: boolean
    minimumStockQuantity?: number
}
