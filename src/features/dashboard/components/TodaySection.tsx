'use client'

import Link from 'next/link'
import { Badge } from 'ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'ui/card'
import { Skeleton } from 'ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import {
    orderStatusLabelMap,
    orderStatusVariantMap,
} from '@/features/orders/services/order.model'
import { useGetToday } from '@/features/dashboard/hooks/queries/useGetToday'
import { TodayOrderModel } from '@/features/dashboard/services/dashboard.model'

type GroupProps = {
    title: string
    orders: TodayOrderModel[]
    tone?: 'danger' | 'default'
}

function TodayGroup({ title, orders, tone = 'default' }: GroupProps) {
    if (orders.length === 0) return null

    return (
        <div className="space-y-2">
            <p
                className={cn(
                    'text-sm font-medium',
                    tone === 'danger' && 'text-destructive'
                )}
            >
                {title} ({orders.length})
            </p>
            <ul className="space-y-1">
                {orders.map((order) => (
                    <li key={order.id}>
                        <Link
                            href={`/orders/${order.id}`}
                            className="hover:border-primary flex items-center justify-between gap-3 rounded-lg border p-2.5 text-sm transition-colors"
                        >
                            <span className="min-w-0 truncate">
                                <span className="font-medium">
                                    #{order.number}
                                </span>{' '}
                                {order.customerName ?? (
                                    <span className="text-muted-foreground">
                                        Sem cliente
                                    </span>
                                )}
                            </span>
                            <span className="flex shrink-0 items-center gap-2">
                                <span className="tabular-nums">
                                    {formatCurrency(order.total)}
                                </span>
                                <Badge
                                    variant={
                                        orderStatusVariantMap[order.status]
                                    }
                                >
                                    {orderStatusLabelMap[order.status]}
                                </Badge>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export function TodaySection() {
    const { data, isLoading } = useGetToday()

    const isEmpty =
        !!data &&
        data.overdue.length +
            data.dueToday.length +
            data.dueTomorrow.length +
            data.ready.length ===
            0

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hoje</CardTitle>
                <CardDescription>
                    O que precisa sair agora e o que vem a seguir.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <Skeleton className="h-24 w-full" />}

                {isEmpty && (
                    <p className="text-muted-foreground text-sm">
                        Nenhuma encomenda pendente para hoje ou amanhã.
                    </p>
                )}

                {data && !isEmpty && (
                    <div className="grid gap-5 md:grid-cols-2">
                        <TodayGroup
                            title="Atrasadas"
                            orders={data.overdue}
                            tone="danger"
                        />
                        <TodayGroup
                            title="Entregar hoje"
                            orders={data.dueToday}
                        />
                        <TodayGroup
                            title="Entregar amanhã"
                            orders={data.dueTomorrow}
                        />
                        <TodayGroup
                            title="Prontas, sem data"
                            orders={data.ready}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
