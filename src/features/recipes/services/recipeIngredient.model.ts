export type RecipeComponentType = 'Ingredient' | 'Recipe'

export type RecipeIngredientModel = {
    recipeId: number
    ingredientId: number
    componentType?: RecipeComponentType
    componentRecipeId?: number
    name: string
    baseUnit: string
    unit?: string
    unitPrice: number
    stockQuantity: number
    minimumStockQuantity?: number
    quantityUsed: number
}
