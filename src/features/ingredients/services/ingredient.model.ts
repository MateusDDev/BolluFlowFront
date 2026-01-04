export interface IngredientModel {
    id: number
    name: string
    unit: string
    unitPrice: number
    stockQuantity: number
    minimumStockQuantity?: number
}
