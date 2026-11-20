import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { Badge } from 'ui/badge'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { ProductModel } from '@/features/products/services/product.model'
import { ProductActions } from '@/features/products/list/components/atoms/ProductActions'
import { TrackedStock } from '@/shared/modules/stock'

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
        meta: { module: 'stock' },
        header: 'Estoque',
        cell: ({ row }) => (
            <TrackedStock trackStock={row.original.trackStock}>
                {row.original.stockQuantity.toLocaleString('pt-BR')}
            </TrackedStock>
        ),
    },
    {
        accessorKey: 'finalPrice',
        header: 'Preço de venda',
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
            return <ProductActions product={product} />
        },
    },
]
