export interface RecipeModel {
    id: number
    name: string
    category: string
    baseUnit: string | number
    preparationTime: number
    finalPrice: number
    yield?: number | null
    costPerBaseUnit?: number | null
    isActive: boolean
    stockQuantity: number
    trackStock: boolean
    minimumStockQuantity?: number | null
}
