export type ProductComponentType = 'Ingredient' | 'Recipe'

export interface ProductModel {
    id: number
    name: string
    isActive: boolean
    stockQuantity: number
    salePrice: number
}

export interface ProductComponentModel {
    id: number
    productId: number
    componentType: ProductComponentType
    ingredientId?: number
    recipeId?: number
    name: string
    baseUnit: string
    quantityUsed: number
    unitPrice: number
    stockQuantity: number
}
