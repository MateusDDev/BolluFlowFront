import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { RecipeIngredientModel } from '@/features/recipes/services/recipeIngredient.model'
import { formatCurrency } from '@/shared/helpers/formatHelper'

export const recipeIngredientsColumns: ColumnDef<RecipeIngredientModel>[] = [
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
                    Ingrediente
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'stockQuantity',
        header: 'Quantidade',
        cell: ({ row }) => {
            const recipeIngredient = row.original as RecipeIngredientModel

            return (
                <span>
                    {recipeIngredient.stockQuantity} {recipeIngredient.unit}
                </span>
            )
        },
    },
    {
        accessorKey: 'unitPrice',
        header: 'Custo Unitário',
        cell: ({ row }) => {
            const recipeIngredient = row.original as RecipeIngredientModel

            return (
                <span>
                    {formatCurrency(recipeIngredient.unitPrice.toString())}
                </span>
            )
        },
    },
    {
        accessorKey: 'quantityUsed',
        header: 'Quantidade Usada',
    },
    {
        accessorKey: 'totalPrice',
        header: 'Custo Total',
        cell: ({ row }) => {
            const recipeIngredient = row.original as RecipeIngredientModel

            return (
                <span>
                    {recipeIngredient.quantityUsed * recipeIngredient.unitPrice}
                </span>
            )
        },
    },
]
