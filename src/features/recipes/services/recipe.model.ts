export interface RecipeModel {
    id: number
    name: string
    category: string
    baseUnit: string | number
    preparationTime: number
    finalPrice: number
    isActive: boolean
    stockQuantity: number
    minimumStockQuantity?: number | null
}
