'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { MonthFilter } from '@/features/finance/components/MonthFilter'
import { useGetFinanceTransactions } from '@/features/finance/hooks/queries/useGetFinanceTransactions'
import { ManualTransactionDialog } from '@/features/finance/components/ManualTransactionDialog'
import {
    formatFinanceCurrency,
    getSourceLabel,
} from '@/features/finance/services/finance.utils'
import { Badge } from '@/shared/components/ui/badge'
import { TransactionDeleteDialog } from '@/features/finance/components/TransactionDeleteDialog'

export function FinanceTransactionsContainer({
    month,
    onMonthChange,
}: {
    month: string
    onMonthChange: (value: string) => void
}) {
    const { data, isLoading, error } = useGetFinanceTransactions(month)

    return (
        <section className="space-y-6 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Transactions</h1>
                    <p className="text-muted-foreground">
                        Track income and expenses with source traceability.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <MonthFilter value={month} onChange={onMonthChange} />
                    <ManualTransactionDialog defaultMonth={month} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction list</CardTitle>
                    <CardDescription>
                        Manual, sales and purchase-driven financial activity.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Loading transactions...</p>}
                    {error && <p>Unable to load transactions.</p>}
                    <div className="space-y-3">
                        {data?.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="grid gap-3 rounded-xl border p-4 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr_auto] lg:items-center"
                            >
                                <div>
                                    <p className="font-medium">
                                        {transaction.description}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {transaction.eventDate}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        transaction.type === 'income'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {transaction.type}
                                </Badge>
                                <span className="text-sm">
                                    {getSourceLabel(transaction.sourceType)}
                                </span>
                                <div>
                                    <div className="font-medium">
                                        {formatFinanceCurrency(
                                            transaction.amount
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {transaction.isAutomatic
                                            ? 'Automatic'
                                            : 'Manual'}
                                    </div>
                                </div>
                                <TransactionDeleteDialog
                                    transaction={transaction}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
