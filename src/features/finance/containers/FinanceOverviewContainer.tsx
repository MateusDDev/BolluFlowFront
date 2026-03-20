'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { useGetFinanceOverview } from '@/features/finance/hooks/queries/useGetFinanceOverview'
import { MonthFilter } from '@/features/finance/components/MonthFilter'
import {
    formatFinanceCurrency,
    formatMonthLabel,
    getSourceLabel,
    getTransactionTypeLabel,
} from '@/features/finance/services/finance.utils'

export function FinanceOverviewContainer({
    month,
    onMonthChange,
}: {
    month: string
    onMonthChange: (value: string) => void
}) {
    const { data, isLoading, error } = useGetFinanceOverview(month)

    return (
        <section className="space-y-6 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">
                        Resumo financeiro
                    </h1>
                    <p className="text-muted-foreground">
                        Visão mensal de {formatMonthLabel(month)}.
                    </p>
                </div>
                <MonthFilter value={month} onChange={onMonthChange} />
            </div>

            {isLoading && <p>Carregando resumo financeiro...</p>}
            {error && <p>Não foi possível carregar o resumo financeiro.</p>}

            {data && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        <Card>
                            <CardHeader>
                                <CardDescription>
                                    Total de entradas
                                </CardDescription>
                                <CardTitle>
                                    {formatFinanceCurrency(data.incomeTotal)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>
                                    Total de despesas
                                </CardDescription>
                                <CardTitle>
                                    {formatFinanceCurrency(data.expenseTotal)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Saldo do mês</CardDescription>
                                <CardTitle>
                                    {formatFinanceCurrency(data.monthBalance)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card className="xl:col-span-2">
                            <CardHeader>
                                <CardDescription>
                                    Saldo projetado acumulado
                                </CardDescription>
                                <CardTitle>
                                    {formatFinanceCurrency(
                                        data.projectedBalance
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                O saldo projetado é acumulado, então os meses
                                anteriores impactam o mês selecionado.
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Lançamentos recentes</CardTitle>
                            <CardDescription>
                                Atividade mais recente do mês selecionado.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {transaction.description}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {transaction.eventDate} ·{' '}
                                            {getSourceLabel(
                                                transaction.sourceType
                                            )}{' '}
                                            ·{' '}
                                            {getTransactionTypeLabel(
                                                transaction.type
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-right font-medium">
                                        {formatFinanceCurrency(
                                            transaction.amount
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </>
            )}
        </section>
    )
}
