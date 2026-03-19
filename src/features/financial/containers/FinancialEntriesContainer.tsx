'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'
import { useGetFinancialOverview } from '@/features/financial/hooks/queries/useGetFinancialOverview'
import {
    CreateFinancialEntryInput,
    FinancialEntry,
} from '@/features/financial/lib/types'
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
    if (entry.source === 'auto-stock') {
        return <Badge variant="outline">Compra de estoque</Badge>
    }

    if (entry.source === 'auto-order') {
        return <Badge variant="default">Venda automática</Badge>
    }

    if (entry.type === 'income') return <Badge variant="default">Entrada</Badge>
    if (entry.isFixed) return <Badge variant="outline">Conta fixa</Badge>

    return <Badge variant="secondary">Despesa manual</Badge>
}

function canDeleteEntry(entry: FinancialEntry) {
    return entry.source === 'manual' || entry.source === 'auto-stock'
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
                        Cadastro simples de entradas e despesas do mês, com
                        origem rastreável quando o lançamento é automático.
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
                                placeholder="Ex: Reposição de caixa de brigadeiro"
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
                                <option value="expense">Despesa</option>
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
                            Impacta como conta fixa recorrente?
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
                    <div className="flex flex-wrap gap-2">
                        {(
                            [
                                { value: 'all', label: 'Todos' },
                                { value: 'income', label: 'Entradas' },
                                { value: 'expense', label: 'Despesas' },
                            ] as const
                        ).map((option) => (
                            <Button
                                key={option.value}
                                type="button"
                                variant={
                                    filter === option.value
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => setFilter(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>

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
                                        <div className="flex justify-end gap-2">
                                            {entry.source === 'manual' && (
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
                                            )}

                                            {canDeleteEntry(entry) && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Excluir
                                                                lançamento?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {entry.source ===
                                                                'auto-stock'
                                                                    ? 'Essa ação remove apenas o lançamento financeiro automático da compra de estoque, preservando a movimentação de estoque.'
                                                                    : 'Essa ação remove o lançamento manual do extrato financeiro.'}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancelar
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    deleteEntry(
                                                                        entry.id
                                                                    )
                                                                }
                                                            >
                                                                Confirmar
                                                                exclusão
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
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
