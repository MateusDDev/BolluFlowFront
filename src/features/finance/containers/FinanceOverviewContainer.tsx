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
                    <h1 className="text-3xl font-semibold">Finance overview</h1>
                    <p className="text-muted-foreground">
                        Monthly view for {formatMonthLabel(month)}.
                    </p>
                </div>
                <MonthFilter value={month} onChange={onMonthChange} />
            </div>

            {isLoading && <p>Loading finance overview...</p>}
            {error && <p>Unable to load finance overview.</p>}

            {data && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        <Card>
                            <CardHeader>
                                <CardDescription>Total income</CardDescription>
                                <CardTitle>
                                    {formatFinanceCurrency(data.incomeTotal)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>
                                    Total expenses
                                </CardDescription>
                                <CardTitle>
                                    {formatFinanceCurrency(data.expenseTotal)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Month balance</CardDescription>
                                <CardTitle>
                                    {formatFinanceCurrency(data.monthBalance)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card className="xl:col-span-2">
                            <CardHeader>
                                <CardDescription>
                                    Projected cumulative balance
                                </CardDescription>
                                <CardTitle>
                                    {formatFinanceCurrency(
                                        data.projectedBalance
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                The projected balance is cumulative, so previous
                                months impact the selected month.
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent transactions</CardTitle>
                            <CardDescription>
                                Latest activity for the selected month.
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
                                            · {transaction.type}
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
