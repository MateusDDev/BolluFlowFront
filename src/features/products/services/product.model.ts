export type ProductComponentType = 'Ingredient' | 'Recipe' | 'Supply'

export interface ProductModel {
    id: number
    name: string
    salePrice: number
    stockQuantity: number
    minimumStockQuantity?: number
    indirectCostPercentage: number
    markupPercentage: number
    finalPrice: number
    discountPercentage: number
    isActive: boolean
}

export interface ProductComponentModel {
    id: number
    productId: number
    componentType: ProductComponentType
    ingredientId?: number
    recipeId?: number
    supplyId?: number
    name: string
    baseUnit: string
    unitPrice: number
    stockQuantity: number
    quantityUsed: number
}
