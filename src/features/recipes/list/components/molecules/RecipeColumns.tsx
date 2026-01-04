import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, EyeIcon } from 'lucide-react'
import { Button } from 'ui/button'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { Badge } from 'ui/badge'
import Link from 'next/link'

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
        cell: ({ row }) => {
            const recipe = row.original as RecipeModel

            return (
                <Link href={`/recipes/${recipe.id}`}>
                    <EyeIcon className="text-primary h-5 w-5 cursor-pointer hover:text-secondary" />
                </Link>
            )
        },
    },
]
