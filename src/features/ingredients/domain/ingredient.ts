export interface Ingredient {
    id: number
    name: string
    unit: string
    unitPrice: number
    stockQuantity: number
    minimumStockQuantity?: number
}
