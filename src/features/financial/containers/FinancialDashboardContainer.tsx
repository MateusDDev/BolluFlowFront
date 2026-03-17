'use client'

import { FormEvent, useMemo, useState } from 'react'
import { AlertCircle, Trash2 } from 'lucide-react'
import {
    CreateFinancialEntryInput,
    FinancialEntry,
    useGetFinancialOverview,
} from '@/features/financial/hooks/queries/useGetFinancialOverview'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { formatCurrency, formatDate } from '@/shared/helpers/formatHelper'

type FilterType = 'all' | 'income' | 'expense'

const defaultFormState: CreateFinancialEntryInput = {
    description: '',
    type: 'expense',
    category: 'Despesas gerais',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    status: 'paid',
    isFixed: false,
}

function entryBadge(entry: FinancialEntry) {
    if (entry.type === 'income') {
        return <Badge variant="default">Entrada</Badge>
    }

    if (entry.isFixed) {
        return <Badge variant="outline">Conta fixa</Badge>
    }

    return <Badge variant="secondary">Saída</Badge>
}

export function FinancialDashboardContainer() {
    const {
        isLoading,
        isError,
        data,
        createEntry,
        toggleEntryStatus,
        deleteEntry,
    } = useGetFinancialOverview()

    const [filter, setFilter] = useState<FilterType>('all')
    const [formState, setFormState] =
        useState<CreateFinancialEntryInput>(defaultFormState)

    const filteredEntries = useMemo(() => {
        if (filter === 'all') return data.entries

        return data.entries.filter((entry) => entry.type === filter)
    }, [data.entries, filter])

    const fixedAccounts = data.entries.filter(
        (entry) => entry.type === 'expense' && entry.isFixed
    )

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!formState.description.trim() || formState.amount <= 0) return

        createEntry(formState)

        setFormState({
            ...defaultFormState,
            date: formState.date,
            type: formState.type,
            category: formState.category,
        })
    }

    if (isLoading) {
        return (
            <section className="grid gap-4 py-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-36 w-full" />
                ))}
            </section>
        )
    }

    if (isError) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                    Não foi possível carregar o financeiro com os dados atuais.
                </AlertTitle>
            </Alert>
        )
    }

    return (
        <section className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Saldo atual em caixa</CardDescription>
                        <CardTitle className="text-2xl">
                            {formatCurrency(data.currentBalance)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>
                            Total de entradas pagas
                        </CardDescription>
                        <CardTitle className="text-2xl">
                            {formatCurrency(data.totalIncomes)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total de saídas pagas</CardDescription>
                        <CardTitle className="text-2xl">
                            {formatCurrency(data.totalExpenses)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Saldo projetado</CardDescription>
                        <CardTitle className="text-2xl">
                            {formatCurrency(data.forecastBalance)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Receber: {formatCurrency(data.pendingToReceive)} ·
                        Pagar: {formatCurrency(data.pendingToPay)}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Novo lançamento financeiro</CardTitle>
                    <CardDescription>
                        Cadastre entradas e saídas, incluindo contas fixas como
                        água, luz, gás, aluguel, internet etc.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={onSubmit}
                        className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <div className="space-y-1 lg:col-span-2">
                            <Label>Descrição</Label>
                            <Input
                                value={formState.description}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        description: event.target.value,
                                    }))
                                }
                                placeholder="Ex: Conta de luz"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Valor (R$)</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formState.amount || ''}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        amount: Number(event.target.value),
                                    }))
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Data</Label>
                            <Input
                                type="date"
                                value={formState.date}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        date: event.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Tipo</Label>
                            <select
                                className="border rounded-md h-9 px-3 w-full bg-transparent"
                                value={formState.type}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        type: event.target
                                            .value as CreateFinancialEntryInput['type'],
                                    }))
                                }
                            >
                                <option value="income">Entrada</option>
                                <option value="expense">Saída</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label>Status</Label>
                            <select
                                className="border rounded-md h-9 px-3 w-full bg-transparent"
                                value={formState.status}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        status: event.target
                                            .value as CreateFinancialEntryInput['status'],
                                    }))
                                }
                            >
                                <option value="paid">Pago/Recebido</option>
                                <option value="pending">Pendente</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label>Categoria</Label>
                            <Input
                                value={formState.category}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        category: event.target.value,
                                    }))
                                }
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm mt-6">
                            <input
                                type="checkbox"
                                checked={formState.isFixed}
                                onChange={(event) =>
                                    setFormState((current) => ({
                                        ...current,
                                        isFixed: event.target.checked,
                                    }))
                                }
                            />
                            É conta fixa?
                        </label>

                        <div className="lg:col-span-4">
                            <Button type="submit">Salvar lançamento</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Extrato financeiro</CardTitle>
                    <CardDescription>
                        Vendas entregues entram automaticamente como receita.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Tabs
                        value={filter}
                        onValueChange={(value) =>
                            setFilter(value as FilterType)
                        }
                    >
                        <TabsList>
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            <TabsTrigger value="income">Entradas</TabsTrigger>
                            <TabsTrigger value="expense">Saídas</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Valor
                                </TableHead>
                                <TableHead className="text-right">
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEntries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {entryBadge(entry)}
                                            <span>{entry.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(entry.date)}
                                    </TableCell>
                                    <TableCell>{entry.category}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                entry.status === 'paid'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {entry.status === 'paid'
                                                ? 'Pago/Recebido'
                                                : 'Pendente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {entry.type === 'expense' ? '-' : '+'}
                                        {formatCurrency(entry.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {entry.source === 'manual' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleEntryStatus(
                                                            entry.id
                                                        )
                                                    }
                                                >
                                                    Alternar status
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        deleteEntry(entry.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contas fixas</CardTitle>
                    <CardDescription>
                        Total do mês atual em contas fixas:{' '}
                        <strong>
                            {formatCurrency(data.fixedCostsInMonth)}
                        </strong>
                    </CardDescription>
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
                                    <TableRow key={`fixed-${entry.id}`}>
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
                                        Ainda não há contas fixas cadastradas.
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
