'use client'

import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { StockItemsTableContainer } from '@/features/stockItems/containers/StockItemsTableContainer'
import { StockItemActions } from '@/features/stockItems/components/StockItemActions'
import { buildStockItemColumns } from '@/features/stockItems/components/stockItemColumns'
import { INGREDIENT_CONFIG } from '@/features/stockItems/services/stockItem.config'

const columns = buildStockItemColumns<IngredientModel>((ingredient) => (
    <StockItemActions config={INGREDIENT_CONFIG} item={ingredient} />
))

export function IngredientsTableContainer() {
    return (
        <StockItemsTableContainer
            config={INGREDIENT_CONFIG}
            columns={columns}
        />
    )
}
