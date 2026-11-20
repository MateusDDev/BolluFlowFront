'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from 'ui/chart'
import { Skeleton } from 'ui/skeleton'
import { ChipGroup, ChipOption } from 'components/ChipGroup'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useModules } from '@/shared/modules/useModules'
import { useGetSalesSummary } from '@/features/dashboard/hooks/queries/useGetSalesSummary'
import {
    DASHBOARD_PERIOD_LABELS,
    DashboardPeriod,
} from '@/features/dashboard/helpers/periods'

const MINIMUM_SALES_FOR_COMPARISON = 5

const PERIOD_OPTIONS: ChipOption<DashboardPeriod>[] = (
    Object.keys(DASHBOARD_PERIOD_LABELS) as DashboardPeriod[]
).map((value) => ({ value, label: DASHBOARD_PERIOD_LABELS[value] }))

const chartConfig = {
    revenue: { label: 'Faturamento', color: 'var(--primary)' },
} satisfies ChartConfig

function percentChange(current: number, previous: number) {
    if (previous <= 0) return null
    return ((current - previous) / previous) * 100
}

type MetricCardProps = {
    label: string
    value: string
    hint?: string
    change?: number | null
    comparisonLabel?: string
}

function MetricCard({
    label,
    value,
    hint,
    change,
    comparisonLabel,
}: MetricCardProps) {
    return (
        <Card className="gap-2 py-4">
            <CardHeader className="px-4">
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground px-4 text-xs">
                {change != null ? (
                    <span
                        className={cn(
                            'font-medium',
                            change >= 0
                                ? 'text-emerald-600'
                                : 'text-destructive'
                        )}
                    >
                        {change >= 0 ? '+' : ''}
                        {change.toFixed(0)}% vs {comparisonLabel}
                    </span>
                ) : (
                    hint
                )}
            </CardContent>
        </Card>
    )
}

export function SalesSection() {
    const [period, setPeriod] = useState<DashboardPeriod>('month')
    const { hasModule } = useModules()
    const { data, isLoading, range } = useGetSalesSummary(period)

    const usesRecipes = hasModule('recipes')

    const header = (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 className="text-lg font-semibold">Vendas</h2>
                <p className="text-muted-foreground text-sm">
                    Pedidos entregues e vendas diretas.
                </p>
            </div>
            <ChipGroup
                ariaLabel="Período"
                options={PERIOD_OPTIONS}
                value={period}
                onChange={(value) => value && setPeriod(value)}
            />
        </div>
    )

    if (isLoading || !data) {
        return (
            <section className="space-y-4">
                {header}
                <Skeleton className="h-28 w-full" />
            </section>
        )
    }

    const { current, previous } = data
    const canCompare = current.salesCount >= MINIMUM_SALES_FOR_COMPARISON
    const comparison = (now: number, before: number) =>
        canCompare ? percentChange(now, before) : null

    const chartData = data.monthly.map((month) => ({
        ...month,
        label: new Date(month.year, month.month - 1, 1)
            .toLocaleDateString('pt-BR', { month: 'short' })
            .replace('.', ''),
    }))

    const maxTopQuantity = Math.max(
        1,
        ...data.topProducts.map((product) => product.quantity)
    )

    return (
        <section className="space-y-4">
            {header}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Faturamento"
                    value={formatCurrency(current.revenue)}
                    change={comparison(current.revenue, previous.revenue)}
                    comparisonLabel={range.comparisonLabel}
                    hint={`${formatCurrency(previous.revenue)} no período anterior`}
                />
                <MetricCard
                    label="Vendas"
                    value={current.salesCount.toLocaleString('pt-BR')}
                    change={comparison(current.salesCount, previous.salesCount)}
                    comparisonLabel={range.comparisonLabel}
                    hint={`${previous.salesCount} no período anterior`}
                />
                <MetricCard
                    label="Ticket médio"
                    value={formatCurrency(current.averageTicket)}
                    hint="Valor médio por venda"
                />
                {usesRecipes && (
                    <MetricCard
                        label="Lucro bruto"
                        value={
                            data.hasCostData
                                ? formatCurrency(current.grossProfit)
                                : '—'
                        }
                        hint={
                            data.hasCostData
                                ? `Margem de ${current.margin?.toFixed(0) ?? 0}% sobre as vendas`
                                : 'Monte as fichas técnicas para ver o lucro'
                        }
                    />
                )}
            </div>

            {!canCompare && current.salesCount > 0 && (
                <p className="text-muted-foreground text-xs">
                    Com menos de {MINIMUM_SALES_FOR_COMPARISON} vendas no
                    período, as comparações ainda não dizem muito e ficam
                    ocultas.
                </p>
            )}

            <div className="grid gap-4 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Evolução mensal</CardTitle>
                        <CardDescription>
                            Faturamento dos últimos 12 meses
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[240px]">
                        <ChartContainer
                            config={chartConfig}
                            className="h-full w-full"
                        >
                            <BarChart data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(
                                                _value,
                                                _name,
                                                item
                                            ) => (
                                                <div className="flex w-full justify-between gap-3">
                                                    <span className="text-muted-foreground">
                                                        {
                                                            item.payload
                                                                .salesCount
                                                        }{' '}
                                                        vendas
                                                    </span>
                                                    <span className="font-semibold">
                                                        {formatCurrency(
                                                            item.payload.revenue
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        />
                                    }
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="var(--color-revenue)"
                                    radius={6}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Mais vendidos</CardTitle>
                        <CardDescription>
                            {DASHBOARD_PERIOD_LABELS[period]}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.topProducts.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                Nenhuma venda no período.
                            </p>
                        )}
                        {data.topProducts.map((product) => (
                            <div key={product.productId} className="space-y-1">
                                <div className="flex justify-between gap-2 text-sm">
                                    <span className="truncate">
                                        {product.name}
                                    </span>
                                    <span className="text-muted-foreground shrink-0 tabular-nums">
                                        {product.quantity} un ·{' '}
                                        {formatCurrency(product.revenue)}
                                    </span>
                                </div>
                                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                                    <div
                                        className="bg-primary h-full rounded-full"
                                        style={{
                                            width: `${(product.quantity / maxTopQuantity) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
