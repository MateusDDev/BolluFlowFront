import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { Badge } from 'ui/badge'
import { RecipeActions } from '@/features/recipes/list/components/atoms/RecipeActions'
import { RecipeReferenceSelectorCell } from '@/features/recipes/list/components/molecules/RecipeReferenceSelectorCell'
import { RecipeStockDisplayCell } from '@/features/recipes/list/components/molecules/RecipeStockDisplayCell'
import { TrackedStock } from '@/shared/modules/stock'

export const recipeColumns: ColumnDef<RecipeModel>[] = [
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
        accessorKey: 'category',
        header: 'Categoria',
    },
    {
        accessorKey: 'baseUnit',
        header: 'Unidade / referência',
        cell: ({ row }) => (
            <div onClick={(event) => event.stopPropagation()}>
                <RecipeReferenceSelectorCell recipe={row.original} />
            </div>
        ),
    },
    {
        accessorKey: 'stockQuantity',
        meta: { module: 'stock' },
        header: 'Estoque disponível',
        cell: ({ row }) => (
            <TrackedStock trackStock={row.original.trackStock}>
                <RecipeStockDisplayCell
                    recipe={row.original}
                    value={row.original.stockQuantity}
                />
            </TrackedStock>
        ),
    },
    {
        accessorKey: 'minimumStockQuantity',
        meta: { module: 'stock' },
        header: 'Estoque mínimo',
        cell: ({ row }) => (
            <RecipeStockDisplayCell
                recipe={row.original}
                value={row.original.minimumStockQuantity ?? 0}
            />
        ),
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
            const recipe = row.original as RecipeModel
            return (
                <Badge variant={recipe.isActive ? 'default' : 'secondary'}>
                    {recipe.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <div onClick={(event) => event.stopPropagation()}>
                <RecipeActions recipe={row.original} />
            </div>
        ),
    },
]
