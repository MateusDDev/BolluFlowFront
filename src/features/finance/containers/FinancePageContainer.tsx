'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { Badge } from 'ui/badge'
import { formatCurrency, formatDate } from '@/shared/helpers/formatHelper'
import { useGetFinancialEntries } from '@/features/finance/hooks/queries/useGetFinancialEntries'
import { useGetFinancialBalance } from '@/features/finance/hooks/queries/useGetFinancialBalance'
import {
    FinancialEntryOrigin,
    FinancialEntryType,
} from '@/features/finance/services/finance.model'

type TypeFilter = FinancialEntryType | 'todos'

const originLabelMap: Record<FinancialEntryOrigin, string> = {
    pedido: 'Pedido',
    insumo: 'Insumo',
    ingrediente: 'Ingrediente',
}

export function FinancePageContainer() {
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('todos')

    const queryType = typeFilter === 'todos' ? undefined : typeFilter

    const { data: entries, isLoading: isLoadingEntries, error: entriesError } =
        useGetFinancialEntries(queryType)
    const { data: balance, isLoading: isLoadingBalance, error: balanceError } =
        useGetFinancialBalance()

    if (isLoadingEntries || isLoadingBalance) {
        return <p>Carregando financeiro...</p>
    }

    if (entriesError || balanceError) {
        return <p>Não foi possível carregar os dados financeiros.</p>
    }

    const saldo = balance?.saldo ?? 0

    return (
        <section className="container mx-auto py-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Entradas</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold text-green-600">
                        {formatCurrency(balance?.totalEntradas ?? 0)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Saídas</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold text-red-600">
                        {formatCurrency(balance?.totalSaidas ?? 0)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Saldo</CardTitle>
                    </CardHeader>
                    <CardContent
                        className={`text-2xl font-semibold ${
                            saldo >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {formatCurrency(saldo)}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Lançamentos</CardTitle>
                    <div className="w-44">
                        <Select
                            value={typeFilter}
                            onValueChange={(value) =>
                                setTypeFilter(value as TypeFilter)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="entrada">Entradas</SelectItem>
                                <SelectItem value="saida">Saídas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Origem</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries?.length ? (
                                    entries.map((entry) => (
                                        <TableRow
                                            key={entry.id}
                                            className={
                                                entry.tipo === 'entrada'
                                                    ? 'bg-green-50/40'
                                                    : 'bg-red-50/40'
                                            }
                                        >
                                            <TableCell>
                                                {formatDate(entry.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        entry.tipo === 'entrada'
                                                            ? 'text-green-600 border-green-600 bg-green-50'
                                                            : 'text-red-600 border-red-600 bg-red-50'
                                                    }
                                                >
                                                    {entry.tipo === 'entrada'
                                                        ? 'Entrada'
                                                        : 'Saída'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{entry.descricao}</TableCell>
                                            <TableCell>
                                                {originLabelMap[entry.origem]}
                                            </TableCell>
                                            <TableCell
                                                className={`text-right font-medium ${
                                                    entry.tipo === 'entrada'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {formatCurrency(entry.valor)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center"
                                        >
                                            Nenhum lançamento encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
