'use client'

import { SupplyActions } from '@/features/supplies/components/atoms/SupplyActions'
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { StockItemsTableContainer } from '@/features/stockItems/containers/StockItemsTableContainer'
import { buildStockItemColumns } from '@/features/stockItems/components/stockItemColumns'
import { SUPPLY_CONFIG } from '@/features/stockItems/services/stockItem.config'

const columns = buildStockItemColumns<SupplyModel>((supply) => (
    <SupplyActions supply={supply} />
))

export function SuppliesTableContainer() {
    return <StockItemsTableContainer config={SUPPLY_CONFIG} columns={columns} />
}
