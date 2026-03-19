'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useGetFinancialOverview } from '@/features/financial/hooks/queries/useGetFinancialOverview'
import {
    CreateFinancialEntryInput,
    FinancialEntry,
} from '@/features/financial/lib/types'
import { getMonthLabel } from '@/features/financial/lib/month'
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

function getDefaultFixedCostForm(month: string): CreateFinancialEntryInput {
    return {
        description: '',
        type: 'expense',
        category: 'Contas fixas',
        amount: 0,
        date: `${month}-01`,
        status: 'pending',
        isFixed: true,
    }
}

function mapEntryToForm(entry: FinancialEntry): CreateFinancialEntryInput {
    return {
        description: entry.description,
        type: 'expense',
        category: entry.category,
        amount: entry.amount,
        date: entry.date.toISOString().slice(0, 10),
        status: entry.status,
        isFixed: true,
    }
}

export function FinancialFixedCostsContainer({ month }: { month: string }) {
    const { data, createEntry, updateEntry, deleteEntry } =
        useGetFinancialOverview(month)

    const fixedAccounts = useMemo(
        () =>
            data.entries.filter(
                (entry) =>
                    entry.type === 'expense' &&
                    entry.isFixed &&
                    entry.source === 'manual'
            ),
        [data.entries]
    )

    const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
    const [formState, setFormState] = useState<CreateFinancialEntryInput>(
        getDefaultFixedCostForm(month)
    )

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!formState.description.trim() || Number(formState.amount) <= 0)
            return

        if (editingEntryId) {
            updateEntry(editingEntryId, {
                ...formState,
                amount: Number(formState.amount),
                type: 'expense',
                isFixed: true,
            })
        } else {
            createEntry({
                ...formState,
                amount: Number(formState.amount),
                type: 'expense',
                isFixed: true,
            })
        }

        setEditingEntryId(null)
        setFormState(getDefaultFixedCostForm(month))
    }

    const startEdit = (entry: FinancialEntry) => {
        setEditingEntryId(entry.id)
        setFormState(mapEntryToForm(entry))
    }

    const cancelEdit = () => {
        setEditingEntryId(null)
        setFormState(getDefaultFixedCostForm(month))
    }

    return (
        <section className="space-y-4 py-4">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Contas fixas de {getMonthLabel(month)}
                    </CardTitle>
                    <CardDescription>
                        Cadastre, edite e remova custos recorrentes como água,
                        luz, gás, aluguel e internet.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                    Impacto mensal atual:{' '}
                    <strong>{formatCurrency(data.fixedCostsInMonth)}</strong>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {editingEntryId
                            ? 'Editar conta fixa'
                            : 'Nova conta fixa'}
                    </CardTitle>
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
                                <option value="pending">Pendente</option>
                                <option value="paid">Pago</option>
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

                        <div className="lg:col-span-4 flex gap-2">
                            <Button type="submit">
                                {editingEntryId
                                    ? 'Salvar alterações'
                                    : 'Adicionar conta fixa'}
                            </Button>
                            {editingEntryId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelEdit}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>
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
                                <TableHead className="text-right">
                                    Ações
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
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        startEdit(entry)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
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
