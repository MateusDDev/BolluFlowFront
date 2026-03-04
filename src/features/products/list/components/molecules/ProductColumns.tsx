import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, EyeIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from 'ui/button'
import { Badge } from 'ui/badge'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { ProductModel } from '@/features/products/services/product.model'

export const productColumns: ColumnDef<ProductModel>[] = [
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
        accessorKey: 'stockQuantity',
        header: 'Estoque',
    },
    {
        accessorKey: 'finalPrice',
        header: 'Preco de venda',
        cell: ({ row }) => {
            const product = row.original as ProductModel
            return <span>{formatCurrency(product.finalPrice)}</span>
        },
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
            const product = row.original as ProductModel
            return (
                <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const product = row.original as ProductModel

            return (
                <Link href={`/products/${product.id}`}>
                    <EyeIcon className="text-primary h-5 w-5 cursor-pointer hover:text-secondary" />
                </Link>
            )
        },
    },
]
