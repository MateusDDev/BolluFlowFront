'use client'

import { IngredientActions } from '@/features/ingredients/components/atoms/IngredientActions'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { StockItemsTableContainer } from '@/features/stockItems/containers/StockItemsTableContainer'
import { buildStockItemColumns } from '@/features/stockItems/components/stockItemColumns'
import { INGREDIENT_CONFIG } from '@/features/stockItems/services/stockItem.config'

const columns = buildStockItemColumns<IngredientModel>((ingredient) => (
    <IngredientActions ingredient={ingredient} />
))

export function IngredientsTableContainer() {
    return (
        <StockItemsTableContainer
            config={INGREDIENT_CONFIG}
            columns={columns}
        />
    )
}
