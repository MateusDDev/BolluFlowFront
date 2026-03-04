export type RecipeIngredientModel = {
    recipeId: number
    ingredientId: number
    name: string
    baseUnit: string
    unit?: string
    unitPrice: number
    stockQuantity: number
    minimumStockQuantity?: number
    quantityUsed: number
}
