import { ColumnDef } from '@tanstack/react-table'
import { Button } from 'ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from 'ui/badge'
import Link from 'next/link'
import {
    OrderModel,
    orderStatusLabelMap,
    orderStatusVariantMap,
} from '@/features/orders/services/order.model'

export const orderColumns: ColumnDef<OrderModel>[] = [
    {
        accessorKey: 'number',
        header: 'Nº do Pedido',
        cell: ({ row }) => {
            const order = row.original as OrderModel
            return (
                <Link href={`/orders/${order.id}`}>
                    <span className="text-primary">{order.number}</span>
                </Link>
            )
        },
    },
    {
        accessorKey: 'customer.name',
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

            return (
                <Badge variant={orderStatusVariantMap[order.status]}>
                    {orderStatusLabelMap[order.status]}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'deliveryDate',
        header: 'Data de entrega',
        cell: ({ row }) => {
            const order = row.original as OrderModel

            return order.deliveryDate ? (
                <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
            ) : (
                <span>Sem data de entrega definida</span>
            )
        },
    },
]
