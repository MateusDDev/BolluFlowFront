import { ColumnDef } from '@tanstack/react-table'
import { Button } from 'ui/button'
import { ArrowUpDown, EyeIcon } from 'lucide-react'
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
    {
        id: 'actions',
        cell: ({ row }) => {
            const order = row.original as OrderModel

            return (
                <div className="flex gap-2">
                    <Link href={`/orders/${order.id}`}>
                        <EyeIcon className="text-primary" />
                    </Link>
                </div>
            )
        },
    },
]
