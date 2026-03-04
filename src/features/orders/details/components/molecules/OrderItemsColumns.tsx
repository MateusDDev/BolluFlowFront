import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { OrderItemModel } from '@/features/orders/services/order.model'
import { OrderItemsActions } from '@/features/orders/details/components/atoms/OrderItemsActions'

export const orderItemsColumns: ColumnDef<OrderItemModel>[] = [
    {
        accessorKey: 'product.name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Produto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'quantity',
        header: 'Quantidade',
    },
    {
        accessorKey: 'unitPrice',
        header: 'Preco Unitario',
        cell: ({ row }) => {
            const orderItem = row.original as OrderItemModel

            return <span>{formatCurrency(orderItem.unitPrice)}</span>
        },
    },
    {
        accessorKey: 'totalPrice',
        header: 'Total',
        cell: ({ row }) => {
            const orderItem = row.original as OrderItemModel

            return <span>{formatCurrency(orderItem.totalPrice)}</span>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <OrderItemsActions orderItem={row.original as OrderItemModel} />
        ),
    },
]
