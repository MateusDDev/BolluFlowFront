import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { SupplyActions } from '@/features/supplies/components/atoms/SupplyActions'

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
        header: 'Unidade',
        cell: ({ row }) => {
            const supply = row.original
            return <span>{getMeasurementUnitLabel(supply.baseUnit)}</span>
        },
    },
    {
        accessorKey: 'stockQuantity',
        header: 'Estoque',
    },
    {
        accessorKey: 'minimumStockQuantity',
        header: 'Estoque minimo',
        cell: ({ row }) => (
            <span>{row.original.minimumStockQuantity ?? 0}</span>
        ),
    },
    {
        accessorKey: 'unitCost',
        header: 'Custo',
        cell: ({ row }) => <span>{formatCurrency(row.original.unitCost)}</span>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <SupplyActions supply={row.original} />,
    },
]
