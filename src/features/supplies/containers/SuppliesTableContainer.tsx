'use client'

import { SupplyModel } from '@/features/supplies/services/supply.model'
import { StockItemsTableContainer } from '@/features/stockItems/containers/StockItemsTableContainer'
import { StockItemActions } from '@/features/stockItems/components/StockItemActions'
import { buildStockItemColumns } from '@/features/stockItems/components/stockItemColumns'
import { SUPPLY_CONFIG } from '@/features/stockItems/services/stockItem.config'

const columns = buildStockItemColumns<SupplyModel>((supply) => (
    <StockItemActions config={SUPPLY_CONFIG} item={supply} />
))

export function SuppliesTableContainer() {
    return <StockItemsTableContainer config={SUPPLY_CONFIG} columns={columns} />
}
