'use client'

import { useMemo } from 'react'
import { useGetFinancialOverview } from '@/features/financial/hooks/queries/useGetFinancialOverview'
import { getMonthLabel } from '@/features/financial/lib/month'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table'
import { formatCurrency, formatDate } from '@/shared/helpers/formatHelper'

export function FinancialFixedCostsContainer({ month }: { month: string }) {
    const { data } = useGetFinancialOverview(month)

    const fixedAccounts = useMemo(
        () =>
            data.entries.filter(
                (entry) => entry.type === 'expense' && entry.isFixed
            ),
        [data.entries]
    )

    return (
        <section className="space-y-4 py-4">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Contas fixas de {getMonthLabel(month)}
                    </CardTitle>
                    <CardDescription>
                        Acompanhe água, luz, gás, aluguel e outros custos
                        recorrentes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                    Total do mês:{' '}
                    <strong>{formatCurrency(data.fixedCostsInMonth)}</strong>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de contas fixas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Valor
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fixedAccounts.length ? (
                                fixedAccounts.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {entry.description}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(entry.date)}
                                        </TableCell>
                                        <TableCell>
                                            {entry.status === 'paid'
                                                ? 'Pago'
                                                : 'Pendente'}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
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
                                        Nenhuma conta fixa cadastrada neste mês.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </section>
    )
}
