export interface RecipeModel {
    id: number
    name: string
    category: string
    preparationTime: number
    indirectCostPercentage: number
    markupPercentage: number
    finalPrice: number
    discountPercentage: number
    isActive: boolean
}
