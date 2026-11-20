import { ColumnDef } from '@tanstack/react-table'
import { Button } from 'ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from 'ui/badge'
import {
    OrderModel,
    orderStatusLabelMap,
    orderStatusVariantMap,
} from '@/features/orders/services/order.model'
import { OrderActions } from '@/features/orders/list/components/atoms/OrderActions'

export const orderColumns: ColumnDef<OrderModel>[] = [
    {
        accessorKey: 'number',
        header: 'Nº do Pedido',
    },
    {
        id: 'customer',
        accessorFn: (order) => order.customer?.name ?? 'Balcão',
        cell: ({ row }) =>
            row.original.customer ? (
                row.original.customer.name
            ) : (
                <span className="text-muted-foreground">Balcão</span>
            ),
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Cliente
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const order = row.original as OrderModel

            if (order.isQuickSale) {
                return <Badge variant="outline">Venda rápida</Badge>
            }

            return (
                <Badge variant={orderStatusVariantMap[order.status]}>
                    {orderStatusLabelMap[order.status]}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'deliveryDate',
        header: 'Entrega',
        cell: ({ row }) => {
            const order = row.original as OrderModel
            const date = order.isQuickSale
                ? order.deliveredAt
                : order.deliveryDate

            return date ? (
                <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
            ) : (
                <span className="text-muted-foreground">—</span>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const order = row.original as OrderModel

            return <OrderActions order={order} />
        },
    },
]
