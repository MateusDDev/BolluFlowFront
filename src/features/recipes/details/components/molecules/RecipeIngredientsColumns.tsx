import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { RecipeIngredientModel } from '@/features/recipes/services/recipeIngredient.model'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { RecipeIngredientsActions } from '@/features/recipes/details/components/atoms/RecipeIngredientsActions'
import {
    formatStockQuantity,
    formatUnitCost,
} from '@/features/stockItems/services/stockItemUnits'

export const recipeIngredientsColumns: ColumnDef<RecipeIngredientModel>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Ingrediente
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'quantityUsed',
        header: 'Quantidade',
        cell: ({ row }) =>
            formatStockQuantity(row.original.quantityUsed, row.original.unit),
    },
    {
        accessorKey: 'unitPrice',
        header: 'Custo do ingrediente',
        cell: ({ row }) =>
            formatUnitCost(row.original.unitPrice, row.original.unit),
    },
    {
        id: 'totalPrice',
        header: 'Custo na receita',
        cell: ({ row }) => (
            <span className="font-medium tabular-nums">
                {formatCurrency(
                    row.original.quantityUsed * row.original.unitPrice
                )}
            </span>
        ),
    },
    {
        accessorKey: 'stockQuantity',
        header: 'Em estoque',
        meta: { module: 'stock' },
        cell: ({ row }) =>
            formatStockQuantity(row.original.stockQuantity, row.original.unit),
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <RecipeIngredientsActions recipeIngredient={row.original} />
        ),
    },
]
