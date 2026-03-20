'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { MonthFilter } from '@/features/finance/components/MonthFilter'
import { FixedCostDialog } from '@/features/finance/components/FixedCostDialog'
import { useGetFixedCosts } from '@/features/finance/hooks/queries/useGetFixedCosts'
import { formatFinanceCurrency } from '@/features/finance/services/finance.utils'
import { FixedCostDeleteDialog } from '@/features/finance/components/FixedCostDeleteDialog'

export function FinanceFixedCostsContainer({
    month,
    onMonthChange,
}: {
    month: string
    onMonthChange: (value: string) => void
}) {
    const { data, isLoading, error } = useGetFixedCosts()

    return (
        <section className="space-y-6 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Contas fixas</h1>
                    <p className="text-muted-foreground">
                        Despesas recorrentes mensais que impactam
                        automaticamente os próximos meses.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <MonthFilter value={month} onChange={onMonthChange} />
                    <FixedCostDialog defaultMonth={month} />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recorrências cadastradas</CardTitle>
                    <CardDescription>
                        Cada conta fixa é expandida automaticamente pelo backend
                        para os meses aplicáveis.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && <p>Carregando contas fixas...</p>}
                    {error && <p>Não foi possível carregar as contas fixas.</p>}
                    <div className="space-y-3">
                        {data?.map((fixedCost) => (
                            <div
                                key={fixedCost.id}
                                className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto_auto] lg:items-center"
                            >
                                <div>
                                    <p className="font-medium">
                                        {fixedCost.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {fixedCost.notes || 'Sem observações.'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Mês inicial
                                    </p>
                                    <p>{fixedCost.startMonth}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Valor mensal
                                    </p>
                                    <p className="font-medium">
                                        {formatFinanceCurrency(
                                            fixedCost.amount
                                        )}
                                    </p>
                                </div>
                                <FixedCostDialog
                                    fixedCost={fixedCost}
                                    defaultMonth={month}
                                />
                                <FixedCostDeleteDialog
                                    fixedCost={fixedCost}
                                    month={month}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
