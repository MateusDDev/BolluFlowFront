'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
    CreateFinancialEntryInput,
    FinancialEntry,
    useGetFinancialOverview,
} from '@/features/financial/hooks/queries/useGetFinancialOverview'
import { getMonthLabel } from '@/features/financial/lib/month'
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

function getDefaultFormState(month: string): CreateFinancialEntryInput {
    return {
        description: '',
        type: 'expense',
        category: 'Despesas gerais',
        amount: 0,
        date: `${month}-01`,
        status: 'paid',
        isFixed: false,
    }
}

function entryBadge(entry: FinancialEntry) {
    if (entry.type === 'income') return <Badge variant="default">Entrada</Badge>
    if (entry.isFixed) return <Badge variant="outline">Conta fixa</Badge>

    return <Badge variant="secondary">Saída</Badge>
}

export function FinancialEntriesContainer({ month }: { month: string }) {
    const { data, createEntry, deleteEntry, toggleEntryStatus } =
        useGetFinancialOverview(month)

    const [filter, setFilter] = useState<FilterType>('all')
    const [formState, setFormState] = useState<CreateFinancialEntryInput>(
        getDefaultFormState(month)
    )

    const filteredEntries = useMemo(() => {
        if (filter === 'all') return data.entries

        return data.entries.filter((entry) => entry.type === filter)
    }, [data.entries, filter])

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const amount = Number(formState.amount)

        if (!formState.description.trim() || !formState.date || amount <= 0)
            return

        createEntry({
            ...formState,
            amount,
        })

        setFormState((current) => ({
            ...getDefaultFormState(month),
            type: current.type,
            status: current.status,
            category: current.category,
            date: current.date,
        }))
    }

    return (
        <section className="space-y-4 py-4">
            <Card>
                <CardHeader>
                    <CardTitle>Lançamentos de {getMonthLabel(month)}</CardTitle>
                    <CardDescription>
                        Cadastro simples de entradas e saídas com status
                        pago/pendente.
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
                                onChange={({ target }) =>
                                    setFormState((current) => ({
                                        ...current,
                                        description: target.value,
                                    }))
                                }
                                placeholder="Ex: Compra de açúcar"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Valor (R$)</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formState.amount || ''}
                                onChange={({ target }) =>
                                    setFormState((current) => ({
                                        ...current,
                                        amount: Number(target.value),
                                    }))
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Data</Label>
                            <Input
                                type="date"
                                value={formState.date}
                                onChange={({ target }) =>
                                    setFormState((current) => ({
                                        ...current,
                                        date: target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Tipo</Label>
                            <select
                                className="border rounded-md h-9 px-3 w-full bg-transparent"
                                value={formState.type}
                                onChange={({ target }) =>
                                    setFormState((current) => ({
                                        ...current,
                                        type: target.value as CreateFinancialEntryInput['type'],
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
                                onChange={({ target }) =>
                                    setFormState((current) => ({
                                        ...current,
                                        status: target.value as CreateFinancialEntryInput['status'],
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
                                onChange={({ target }) =>
                                    setFormState((current) => ({
                                        ...current,
                                        category: target.value,
                                    }))
                                }
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm mt-6">
                            <input
                                type="checkbox"
                                checked={formState.isFixed}
                                onChange={({ target }) =>
                                    setFormState((current) => ({
                                        ...current,
                                        isFixed: target.checked,
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
                    <CardTitle>Extrato do mês</CardTitle>
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
                                                    type="button"
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
                                                    type="button"
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
        </section>
    )
}
