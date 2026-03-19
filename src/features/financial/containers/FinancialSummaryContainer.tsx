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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table'
import { formatCurrency, formatDate } from '@/shared/helpers/formatHelper'

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

    const recentEntries = data.entries.slice(0, 5)

    return (
        <section className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
                Visão de {getMonthLabel(data.selectedMonth)}
            </p>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total de entradas</CardDescription>
                        <CardTitle>
                            {formatCurrency(data.totalIncomes)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total de despesas</CardDescription>
                        <CardTitle>
                            {formatCurrency(data.totalExpenses)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Saldo do mês</CardDescription>
                        <CardTitle>
                            {formatCurrency(data.currentBalance)}
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

            <Card>
                <CardHeader>
                    <CardTitle>Movimentações recentes</CardTitle>
                    <CardDescription>
                        Últimos lançamentos do mês selecionado.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">
                                    Valor
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentEntries.length ? (
                                recentEntries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {entry.description}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(entry.date)}
                                        </TableCell>
                                        <TableCell>
                                            {entry.type === 'income'
                                                ? 'Entrada'
                                                : 'Despesa'}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {entry.type === 'expense'
                                                ? '-'
                                                : '+'}
                                            {formatCurrency(entry.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground"
                                    >
                                        Nenhuma movimentação encontrada neste
                                        mês.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
