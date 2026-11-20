'use client'

import { Badge } from 'ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'ui/card'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { useGetDashboardStockAlerts } from '@/features/dashboard/hooks/queries/useGetDashboardStockAlerts'

const CATEGORY_LABELS: Record<string, string> = {
    Product: 'Produto',
    Ingredient: 'Ingrediente',
    Supply: 'Insumo',
}

export function StockAlertsCard() {
    const { data: alerts = [] } = useGetDashboardStockAlerts()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Estoque baixo</CardTitle>
                <CardDescription>
                    Itens perto ou abaixo do mínimo
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        Nenhum item precisa de atenção.
                    </p>
                )}
                {alerts.map((item) => {
                    const unit = getMeasurementUnitLabel(item.baseUnit)
                    const fillPercent = Math.max(
                        0,
                        Math.min(item.stockCoveragePercent, 100)
                    )
                    const isCritical = item.severity === 'Critical'

                    return (
                        <div
                            key={`${item.category}-${item.id}`}
                            className="space-y-1.5"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {item.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {CATEGORY_LABELS[item.category]} ·{' '}
                                        {item.stockQuantity.toLocaleString(
                                            'pt-BR'
                                        )}{' '}
                                        de{' '}
                                        {item.minimumStockQuantity.toLocaleString(
                                            'pt-BR'
                                        )}{' '}
                                        {unit}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        isCritical ? 'destructive' : 'secondary'
                                    }
                                >
                                    {isCritical ? 'Crítico' : 'Atenção'}
                                </Badge>
                            </div>
                            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                                <div
                                    className={
                                        isCritical
                                            ? 'bg-destructive h-full rounded-full'
                                            : 'h-full rounded-full bg-yellow-500'
                                    }
                                    style={{ width: `${fillPercent}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
