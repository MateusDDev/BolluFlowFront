import { ColumnDef } from '@tanstack/react-table'
import { Button } from 'ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from 'ui/badge'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import {
    OrderModel,
    isDirectSale,
    orderStatusLabelMap,
    orderStatusVariantMap,
} from '@/features/orders/services/order.model'
import { OrderActions } from '@/features/orders/list/components/atoms/OrderActions'

function formatDay(date: Date | string) {
    return new Date(date).toLocaleDateString('pt-BR')
}

export const orderColumns: ColumnDef<OrderModel>[] = [
    {
        accessorKey: 'number',
        header: 'Nº',
        cell: ({ row }) => `#${row.original.number}`,
    },
    {
        id: 'type',
        header: 'Tipo',
        cell: ({ row }) =>
            isDirectSale(row.original) ? (
                <Badge variant="outline">Venda rápida</Badge>
            ) : (
                <Badge variant="secondary">Encomenda</Badge>
            ),
    },
    {
        id: 'customer',
        accessorFn: (order) => order.customer?.name ?? 'Sem cliente',
        cell: ({ row }) =>
            row.original.customer ? (
                row.original.customer.name
            ) : (
                <span className="text-muted-foreground">Sem cliente</span>
            ),
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Cliente
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const order = row.original

            if (isDirectSale(order)) {
                return <span className="text-muted-foreground">—</span>
            }

            return (
                <Badge variant={orderStatusVariantMap[order.status]}>
                    {orderStatusLabelMap[order.status]}
                </Badge>
            )
        },
    },
    {
        id: 'date',
        header: 'Data',
        cell: ({ row }) => {
            const order = row.original

            if (isDirectSale(order)) {
                return order.deliveredAt ? (
                    <span>Vendido em {formatDay(order.deliveredAt)}</span>
                ) : null
            }

            return order.deliveryDate ? (
                <span>Entrega em {formatDay(order.deliveryDate)}</span>
            ) : (
                <span className="text-muted-foreground">Sem data</span>
            )
        },
    },
    {
        accessorKey: 'total',
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => (
            <div className="text-right tabular-nums">
                {formatCurrency(row.original.total)}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <OrderActions order={row.original} />,
    },
]
