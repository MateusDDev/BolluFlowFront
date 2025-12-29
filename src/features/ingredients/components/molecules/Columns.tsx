import { ColumnDef } from '@tanstack/react-table'
import { Ingredient } from '@/features/ingredients/domain/ingredient'
import { Button } from 'ui/button'
import { ArrowUpDown } from 'lucide-react'
import { IngredientActions } from '@/features/ingredients/components/atoms/IngredientActions'
import { formatCurrency } from '@/shared/helpers/formatHelper'

export const ingredientsTableColumns: ColumnDef<Ingredient>[] = [
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
        accessorKey: 'unit',
        header: 'Unidade de medida',
    },
    {
        accessorKey: 'stockQuantity',
        header: 'Estoque disponível',
    },
    {
        accessorKey: 'minimumStockQuantity',
        header: 'Estoque mínimo',
    },
    {
        accessorKey: 'unitPrice',
        header: 'Preço',
        cell: ({ row }) => {
            const ingredient = row.original as Ingredient

            return formatCurrency(ingredient.unitPrice.toString())
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <IngredientActions ingredient={row.original as Ingredient} />
        ),
    },
]
