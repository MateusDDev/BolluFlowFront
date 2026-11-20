import { ReactNode } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { cn } from '@/shared/lib/utils'
import { TrackedStock } from '@/shared/modules/stock'
import { StockItemModel } from '@/features/stockItems/services/stockItem.api'
import {
    formatStockQuantity,
    formatUnitCost,
} from '@/features/stockItems/services/stockItemUnits'

export function buildStockItemColumns<TItem extends StockItemModel>(
    renderActions: (item: TItem) => ReactNode
): ColumnDef<TItem>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'unitCost',
            header: 'Custo',
            cell: ({ row }) => (
                <span className="tabular-nums">
                    {formatUnitCost(
                        row.original.unitCost,
                        row.original.baseUnit
                    )}
                </span>
            ),
        },
        {
            accessorKey: 'stockQuantity',
            meta: { module: 'stock' },
            header: 'Estoque',
            cell: ({ row }) => {
                const item = row.original
                const minimum = item.minimumStockQuantity ?? 0
                const isLow = minimum > 0 && item.stockQuantity <= minimum

                return (
                    <TrackedStock trackStock={item.trackStock}>
                        <span className="tabular-nums">
                            <span
                                className={cn(
                                    isLow && 'text-destructive font-medium'
                                )}
                            >
                                {formatStockQuantity(
                                    item.stockQuantity,
                                    item.baseUnit
                                )}
                            </span>
                            {minimum > 0 && (
                                <span className="text-muted-foreground">
                                    {' '}
                                    · mín.{' '}
                                    {formatStockQuantity(
                                        minimum,
                                        item.baseUnit
                                    )}
                                </span>
                            )}
                        </span>
                    </TrackedStock>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="text-right">{renderActions(row.original)}</div>
            ),
        },
    ]
}
