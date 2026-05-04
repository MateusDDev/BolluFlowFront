export type ProductComponentType = 'Ingredient' | 'Recipe' | 'Supply'

export interface ProductModel {
    id: number
    name: string
    description?: string | null
    category?: string | null
    salePrice: number
    stockQuantity: number
    minimumStockQuantity?: number
    indirectCostPercentage: number | null
    markupPercentage: number
    finalPrice: number
    discountPercentage: number
    isActive: boolean
    imageUrl: string | null
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
    costPerBaseUnit?: number | null
    stockQuantity: number
    quantityUsed: number
}
