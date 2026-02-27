import { ColumnDef } from '@tanstack/react-table'
import { Button } from 'ui/button'
import { ArrowUpDown } from 'lucide-react'
import { IngredientActions } from '@/features/ingredients/components/atoms/IngredientActions'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { IngredientReferenceSelectorCell } from '@/features/ingredients/components/molecules/IngredientReferenceSelectorCell'
import { IngredientStockDisplayCell } from '@/features/ingredients/components/molecules/IngredientStockDisplayCell'
import { IngredientCostDisplayCell } from '@/features/ingredients/components/molecules/IngredientCostDisplayCell'

export const ingredientsTableColumns: ColumnDef<IngredientModel>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'baseUnit',
        header: 'Unidade / referência',
        cell: ({ row }) => (
            <IngredientReferenceSelectorCell
                ingredient={row.original as IngredientModel}
            />
        ),
    },
    {
        accessorKey: 'stockQuantity',
        header: 'Estoque disponível',
        cell: ({ row }) => (
            <IngredientStockDisplayCell
                ingredient={row.original as IngredientModel}
                value={row.original.stockQuantity}
            />
        ),
    },
    {
        accessorKey: 'minimumStockQuantity',
        header: 'Estoque mínimo',
        cell: ({ row }) => (
            <IngredientStockDisplayCell
                ingredient={row.original as IngredientModel}
                value={row.original.minimumStockQuantity ?? 0}
            />
        ),
    },
    {
        accessorKey: 'unitCost',
        header: 'Custo',
        cell: ({ row }) => (
            <IngredientCostDisplayCell
                ingredient={row.original as IngredientModel}
            />
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <IngredientActions ingredient={row.original as IngredientModel} />
        ),
    },
]
