import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { Ingredient } from '@/features/ingredients/domain/ingredient'

export function mapIngredientModel(model: IngredientModel): Ingredient {
    return {
        id: model.id,
        name: model.name,
        minimumStockQuantity: model.minimumStockQuantity,
        unit: model.unit,
        stockQuantity: model.stockQuantity,
        unitPrice: model.unitPrice,
    }
}
