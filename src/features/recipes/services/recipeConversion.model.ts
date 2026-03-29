export interface RecipeConversionModel {
    id: number
    recipeId: number
    name: string
    quantityInBaseUnit: number
}

export type UpsertRecipeConversionDataType = {
    name: string
    quantityInBaseUnit: number
}
