'use client'

import { AlertCircle } from 'lucide-react'
import { useGetFinancialOverview } from '@/features/financial/hooks/queries/useGetFinancialOverview'
import { getMonthLabel } from '@/features/financial/lib/month'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatCurrency } from '@/shared/helpers/formatHelper'

export function FinancialSummaryContainer({ month }: { month: string }) {
    const { isLoading, isError, data } = useGetFinancialOverview(month)

    if (isLoading) {
        return (
            <section className="grid gap-4 py-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 w-full" />
                ))}
            </section>
        )
    }

    if (isError) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                    Não foi possível carregar o resumo financeiro.
                </AlertTitle>
            </Alert>
        )
    }

    return (
        <section className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
                Visão de {getMonthLabel(data.selectedMonth)}
            </p>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Saldo atual do mês</CardDescription>
                        <CardTitle>
                            {formatCurrency(data.currentBalance)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Entradas pagas</CardDescription>
                        <CardTitle>
                            {formatCurrency(data.totalIncomes)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Saídas pagas</CardDescription>
                        <CardTitle>
                            {formatCurrency(data.totalExpenses)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Saldo projetado</CardDescription>
                        <CardTitle>
                            {formatCurrency(data.forecastBalance)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        A receber: {formatCurrency(data.pendingToReceive)} · A
                        pagar: {formatCurrency(data.pendingToPay)}
                    </CardContent>
                </Card>
            </div>

            <Alert>
                <AlertTitle>
                    As vendas entram automaticamente por pedidos entregues e
                    compras lançadas nas entradas de estoque de ingredientes e
                    insumos já entram como despesa automática no financeiro.
                </AlertTitle>
            </Alert>
        </section>
    )
}
