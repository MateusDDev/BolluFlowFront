'use client'

import Link from 'next/link'
import {
    AlertCircle,
    ClipboardList,
    PackageSearch,
    TrendingUp,
} from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'
import { useGetDashboardStockAlerts } from '@/features/dashboard/hooks/queries/useGetDashboardStockAlerts'
import { useGetDashboardOrdersByStatus } from '@/features/dashboard/hooks/queries/useGetDashboardOrdersByStatus'
import { useGetDashboardInventoryValueByType } from '@/features/dashboard/hooks/queries/useGetDashboardInventoryValueByType'
import { useGetDashboardRecentOrders } from '@/features/dashboard/hooks/queries/useGetDashboardRecentOrders'
import {
    orderStatusLabelMap,
    orderStatusVariantMap,
    OrderStatus,
} from '@/features/orders/services/order.model'
import { Badge } from '@/shared/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/shared/components/ui/chart'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatCurrency, formatDate } from '@/shared/helpers/formatHelper'

const STATUS_COLORS: Record<OrderStatus, string> = {
    Pending: '#3b82f6',
    InProduction: '#f59e0b',
    Ready: '#10b981',
    Delivered: '#14b8a6',
    Canceled: '#ef4444',
}

const chartConfig = {
    Pending: {
        label: orderStatusLabelMap.Pending,
        color: STATUS_COLORS.Pending,
    },
    InProduction: {
        label: orderStatusLabelMap.InProduction,
        color: STATUS_COLORS.InProduction,
    },
    Ready: { label: orderStatusLabelMap.Ready, color: STATUS_COLORS.Ready },
    Delivered: {
        label: orderStatusLabelMap.Delivered,
        color: STATUS_COLORS.Delivered,
    },
    Canceled: {
        label: orderStatusLabelMap.Canceled,
        color: STATUS_COLORS.Canceled,
    },
} satisfies ChartConfig

const inventoryTypeLabelMap: Record<string, string> = {
    Products: 'Produtos',
    Ingredients: 'Ingredientes',
    Supplies: 'Insumos',
}

const categoryLabelMap: Record<string, string> = {
    Product: 'Produto',
    Ingredient: 'Ingrediente',
    Supply: 'Insumo',
}

const ChartsContainer = () => {
    const stockAlertsQuery = useGetDashboardStockAlerts()
    const ordersByStatusQuery = useGetDashboardOrdersByStatus()
    const inventoryValueByTypeQuery = useGetDashboardInventoryValueByType()
    const recentOrdersQuery = useGetDashboardRecentOrders()

    const isLoading =
        stockAlertsQuery.isLoading ||
        ordersByStatusQuery.isLoading ||
        inventoryValueByTypeQuery.isLoading ||
        recentOrdersQuery.isLoading

    const isError =
        stockAlertsQuery.isError ||
        ordersByStatusQuery.isError ||
        inventoryValueByTypeQuery.isError ||
        recentOrdersQuery.isError

    const stockAlerts = stockAlertsQuery.data ?? []
    const ordersByStatus = ordersByStatusQuery.data ?? []
    const inventoryValueByType = inventoryValueByTypeQuery.data ?? []
    const recentOrders = recentOrdersQuery.data ?? []

    const inProgressOrders = ordersByStatus
        .filter(
            (item) =>
                item.status === 'Pending' ||
                item.status === 'InProduction' ||
                item.status === 'Ready'
        )
        .reduce((acc, item) => acc + item.total, 0)

    const totalInventoryValue = inventoryValueByType.reduce(
        (acc, item) => acc + item.totalValue,
        0
    )

    const statusChartData = ordersByStatus.map((item) => ({
        status: item.status,
        label: orderStatusLabelMap[item.status],
        value: item.total,
        fill: STATUS_COLORS[item.status],
    }))

    if (isLoading) {
        return (
            <section className="grid gap-4 py-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-36 w-full" />
                ))}
            </section>
        )
    }

    if (isError) {
        return (
            <section className="py-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                        Não foi possível carregar o dashboard
                    </AlertTitle>
                    <AlertDescription>
                        Algum endpoint de dashboard falhou. Verifique se o
                        backend já implementou os contratos necessários.
                    </AlertDescription>
                </Alert>
            </section>
        )
    }

    return (
        <section className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Alertas de estoque</CardDescription>
                        <CardTitle className="text-3xl">
                            {stockAlerts.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                        <PackageSearch className="h-4 w-4" />
                        Itens próximos/abaixo do mínimo
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pedidos em andamento</CardDescription>
                        <CardTitle className="text-3xl">
                            {inProgressOrders}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                        <ClipboardList className="h-4 w-4" />
                        Pendentes, em preparo e prontos
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardDescription>
                            Valor total em estoque
                        </CardDescription>
                        <CardTitle className="text-3xl">
                            {formatCurrency(totalInventoryValue)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Consolidado por tipo de estoque
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pedidos por status</CardTitle>
                        <CardDescription>
                            Distribuição atual dos pedidos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                        <ChartContainer
                            config={chartConfig}
                            className="h-full w-full"
                        >
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    dataKey="value"
                                    nameKey="label"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={3}
                                >
                                    {statusChartData.map((entry) => (
                                        <Cell
                                            key={entry.status}
                                            fill={entry.fill}
                                        />
                                    ))}
                                </Pie>
                                <ChartTooltip
                                    content={<ChartTooltipContent hideLabel />}
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Valor em estoque por tipo</CardTitle>
                        <CardDescription>
                            Valores entregues pelo backend por categoria
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {inventoryValueByType.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                Sem dados de valor por tipo.
                            </p>
                        )}
                        {inventoryValueByType.map((item) => (
                            <div
                                key={item.type}
                                className="bg-muted/40 flex items-center justify-between rounded-lg p-3"
                            >
                                <p className="text-sm font-medium">
                                    {inventoryTypeLabelMap[item.type] ??
                                        item.type}
                                </p>
                                <p className="text-sm font-semibold">
                                    {formatCurrency(item.totalValue)}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Estoque crítico e atenção</CardTitle>
                        <CardDescription>
                            Itens próximos do mínimo com priorização do backend
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stockAlerts.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                Nenhum item precisa de atenção no momento.
                            </p>
                        )}
                        {stockAlerts.map((item) => (
                            <div
                                key={`${item.category}-${item.id}`}
                                className="bg-muted/40 flex items-center justify-between rounded-lg p-3"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {item.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {categoryLabelMap[item.category] ??
                                            item.category}{' '}
                                        · Atual: {item.stockQuantity} · Mínimo:{' '}
                                        {item.minimumStockQuantity}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        item.severity === 'Critical'
                                            ? 'destructive'
                                            : 'secondary'
                                    }
                                >
                                    {item.severity === 'Critical'
                                        ? 'Crítico'
                                        : 'Atenção'}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Últimos pedidos</CardTitle>
                        <CardDescription>
                            Clique em um pedido para abrir os detalhes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOrders.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                Ainda não existem pedidos cadastrados.
                            </p>
                        )}
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="hover:border-primary block rounded-lg border p-3 transition-colors"
                            >
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Pedido #{order.number}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {order.customerName} · Criado em{' '}
                                            {formatDate(order.createdAt)} ·
                                            Itens: {order.totalItems}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold">
                                            {formatCurrency(order.totalValue)}
                                        </p>
                                        <Badge
                                            variant={
                                                orderStatusVariantMap[
                                                    order.status
                                                ]
                                            }
                                        >
                                            {orderStatusLabelMap[order.status]}
                                        </Badge>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default ChartsContainer
