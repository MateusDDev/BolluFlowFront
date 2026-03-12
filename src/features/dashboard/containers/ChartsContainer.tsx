'use client'

import {
    AlertCircle,
    Boxes,
    ClipboardList,
    PackageSearch,
    TrendingUp,
} from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'
import { useGetProducts } from '@/features/products/list/hooks/queries/useGetProducts'
import { useGetIngredients } from '@/features/ingredients/hooks/queries/useGetIngredients'
import { useGetSupplies } from '@/features/supplies/hooks/queries/useGetSupplies'
import { useGetOrders } from '@/features/orders/list/hooks/queries/useGetOrders'
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

type StockAlertItem = {
    id: number
    name: string
    category: 'Produto' | 'Ingrediente' | 'Insumo'
    stockQuantity: number
    minimumStockQuantity: number
    ratio: number
}

const STATUS_COLORS: Record<OrderStatus, string> = {
    Pending: '#3b82f6',
    InProduction: '#f59e0b',
    Ready: '#10b981',
    Delivered: '#14b8a6',
    Canceled: '#ef4444',
}

const STATUS_KEYS: OrderStatus[] = [
    'Pending',
    'InProduction',
    'Ready',
    'Delivered',
    'Canceled',
]

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

function toStockAlert<
    T extends {
        id: number
        name: string
        stockQuantity: number
        minimumStockQuantity?: number
    },
>(items: T[], category: StockAlertItem['category']): StockAlertItem[] {
    return items
        .filter((item) => {
            const minimum = item.minimumStockQuantity ?? 0
            return minimum > 0 && item.stockQuantity <= minimum * 1.2
        })
        .map((item) => {
            const minimum = item.minimumStockQuantity ?? 0
            return {
                id: item.id,
                name: item.name,
                category,
                stockQuantity: item.stockQuantity,
                minimumStockQuantity: minimum,
                ratio: minimum > 0 ? item.stockQuantity / minimum : 1,
            }
        })
}

const ChartsContainer = () => {
    const productsQuery = useGetProducts()
    const ingredientsQuery = useGetIngredients()
    const suppliesQuery = useGetSupplies()
    const ordersQuery = useGetOrders()

    const isLoading =
        productsQuery.isLoading ||
        ingredientsQuery.isLoading ||
        suppliesQuery.isLoading ||
        ordersQuery.isLoading

    const isError =
        productsQuery.isError ||
        ingredientsQuery.isError ||
        suppliesQuery.isError ||
        ordersQuery.isError

    const products = productsQuery.data ?? []
    const ingredients = ingredientsQuery.data ?? []
    const supplies = suppliesQuery.data ?? []
    const orders = ordersQuery.data ?? []

    const stockAlerts = [
        ...toStockAlert(products, 'Produto'),
        ...toStockAlert(ingredients, 'Ingrediente'),
        ...toStockAlert(supplies, 'Insumo'),
    ]
        .sort((a, b) => a.ratio - b.ratio)
        .slice(0, 8)

    const countByStatus = orders.reduce<Record<OrderStatus, number>>(
        (acc, order) => {
            acc[order.status] += 1
            return acc
        },
        {
            Pending: 0,
            InProduction: 0,
            Ready: 0,
            Delivered: 0,
            Canceled: 0,
        }
    )

    const statusChartData = STATUS_KEYS.map((status) => ({
        status,
        label: orderStatusLabelMap[status],
        value: countByStatus[status],
        fill: STATUS_COLORS[status],
    }))

    const totalInventoryValue =
        ingredients.reduce(
            (acc, item) => acc + item.stockQuantity * item.unitCost,
            0
        ) +
        supplies.reduce(
            (acc, item) => acc + item.stockQuantity * item.unitCost,
            0
        )

    const inProgressOrders = orders.filter(
        (order) =>
            order.status === 'Pending' ||
            order.status === 'InProduction' ||
            order.status === 'Ready'
    )

    const activeProducts = products.filter((product) => product.isActive)

    const latestOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5)

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
                        Verifique sua conexão com a API e tente novamente.
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
                        <CardDescription>Produtos ativos</CardDescription>
                        <CardTitle className="text-3xl">
                            {activeProducts.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Boxes className="h-4 w-4" />
                        {products.length} produtos cadastrados
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Alertas de estoque</CardDescription>
                        <CardTitle className="text-3xl">
                            {stockAlerts.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                        <PackageSearch className="h-4 w-4" />
                        Itens próximos do mínimo
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pedidos em andamento</CardDescription>
                        <CardTitle className="text-3xl">
                            {inProgressOrders.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                        <ClipboardList className="h-4 w-4" />
                        Pendentes, em preparo e prontos
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Valor em estoque</CardDescription>
                        <CardTitle className="text-3xl">
                            {formatCurrency(totalInventoryValue)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Ingredientes + insumos
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
                        <CardTitle>Estoque crítico e atenção</CardTitle>
                        <CardDescription>
                            Itens com estoque menor ou igual a 120% do mínimo
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stockAlerts.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                Nenhum item precisa de atenção no momento.
                            </p>
                        )}
                        {stockAlerts.map((item) => {
                            const isCritical =
                                item.stockQuantity <= item.minimumStockQuantity
                            return (
                                <div
                                    key={`${item.category}-${item.id}`}
                                    className="bg-muted/40 flex items-center justify-between rounded-lg p-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {item.name}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            {item.category} · Atual:{' '}
                                            {item.stockQuantity} · Mínimo:{' '}
                                            {item.minimumStockQuantity}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            isCritical
                                                ? 'destructive'
                                                : 'secondary'
                                        }
                                    >
                                        {isCritical ? 'Crítico' : 'Atenção'}
                                    </Badge>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Últimos pedidos</CardTitle>
                    <CardDescription>
                        Visão rápida dos pedidos mais recentes
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {latestOrders.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                            Ainda não existem pedidos cadastrados.
                        </p>
                    )}
                    {latestOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <p className="font-medium">
                                    Pedido #{order.number}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {order.customer?.name ??
                                        'Cliente não informado'}{' '}
                                    · Criado em {formatDate(order.createdAt)}
                                </p>
                            </div>
                            <Badge
                                variant={orderStatusVariantMap[order.status]}
                            >
                                {orderStatusLabelMap[order.status]}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    )
}

export default ChartsContainer
