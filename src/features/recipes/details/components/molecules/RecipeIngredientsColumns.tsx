import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { RecipeIngredientModel } from '@/features/recipes/services/recipeIngredient.model'
import {
    formatCurrencyInput,
    formatQuantityDisplay,
} from '@/shared/helpers/formatHelper'
import { RecipeIngredientsActions } from '@/features/recipes/details/components/atoms/RecipeIngredientsActions'

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
        header: 'Em Estoque',
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
                    {formatCurrencyInput(recipeIngredient.unitPrice.toString())}
                </span>
            )
        },
    },
    {
        accessorKey: 'quantityUsed',
        header: 'Quantidade Usada',
        cell: ({ row }) => {
            const recipeIngredient = row.original as RecipeIngredientModel

            return (
                <span>
                    {formatQuantityDisplay(recipeIngredient.quantityUsed)}
                </span>
            )
        },
    },
    {
        accessorKey: 'totalPrice',
        header: 'Custo Total',
        cell: ({ row }) => {
            const recipeIngredient = row.original as RecipeIngredientModel

            const total =
                Number(recipeIngredient.quantityUsed) *
                Number(recipeIngredient.unitPrice)

            const rounded = total.toFixed(2)

            return <span>{formatCurrencyInput(rounded)}</span>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <RecipeIngredientsActions
                recipeIngredient={row.original as RecipeIngredientModel}
            />
        ),
    },
]
