import { ColumnDef } from '@tanstack/react-table'
import { Button } from 'ui/button'
import { ArrowUpDown } from 'lucide-react'
import { IngredientActions } from '@/features/ingredients/components/atoms/IngredientActions'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'

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
            const ingredient = row.original as IngredientModel

            return formatCurrency(ingredient.unitPrice)
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <IngredientActions ingredient={row.original as IngredientModel} />
        ),
    },
]
