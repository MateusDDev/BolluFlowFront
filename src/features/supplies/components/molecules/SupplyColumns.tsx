import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { SupplyActions } from '@/features/supplies/components/atoms/SupplyActions'
import { SupplyReferenceSelectorCell } from '@/features/supplies/components/molecules/SupplyReferenceSelectorCell'
import { SupplyStockDisplayCell } from '@/features/supplies/components/molecules/SupplyStockDisplayCell'
import { SupplyCostDisplayCell } from '@/features/supplies/components/molecules/SupplyCostDisplayCell'
import { TrackedStock } from '@/shared/modules/stock'

export const supplyColumns: ColumnDef<SupplyModel>[] = [
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
        accessorKey: 'baseUnit',
        header: 'Unidade / referência',
        cell: ({ row }) => (
            <SupplyReferenceSelectorCell supply={row.original} />
        ),
    },
    {
        accessorKey: 'stockQuantity',
        header: 'Estoque disponível',
        cell: ({ row }) => (
            <TrackedStock trackStock={row.original.trackStock}>
                <SupplyStockDisplayCell
                    supply={row.original}
                    value={row.original.stockQuantity}
                />
            </TrackedStock>
        ),
    },
    {
        accessorKey: 'minimumStockQuantity',
        header: 'Estoque mínimo',
        cell: ({ row }) => (
            <SupplyStockDisplayCell
                supply={row.original}
                value={row.original.minimumStockQuantity ?? 0}
            />
        ),
    },
    {
        accessorKey: 'unitCost',
        header: 'Custo',
        cell: ({ row }) => <SupplyCostDisplayCell supply={row.original} />,
    },
    {
        id: 'actions',
        cell: ({ row }) => <SupplyActions supply={row.original} />,
    },
]
