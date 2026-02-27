export interface IngredientModel {
    id: number
    name: string
    baseUnit: string
    unitPrice: number
    stockQuantity: number
    minimumStockQuantity?: number
}
