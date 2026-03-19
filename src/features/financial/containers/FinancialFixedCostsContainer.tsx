'use client'

import { FormEvent, useState } from 'react'
import { Pencil } from 'lucide-react'
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
    FixedAccountTemplate,
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
import { formatCurrency } from '@/shared/helpers/formatHelper'

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

function mapFixedAccountToForm(
    account: FixedAccountTemplate
): CreateFinancialEntryInput {
    return {
        description: account.description,
        type: 'expense',
        category: account.category,
        amount: account.amount,
        date: `${account.startMonth}-01`,
        status: account.defaultStatus,
        isFixed: true,
    }
}

export function FinancialFixedCostsContainer({ month }: { month: string }) {
    const {
        data,
        fixedAccounts,
        createFixedAccount,
        updateFixedAccount,
        deleteFixedAccount,
    } = useGetFinancialOverview(month)

    const [editingAccountId, setEditingAccountId] = useState<string | null>(
        null
    )
    const [formState, setFormState] = useState<CreateFinancialEntryInput>(
        getDefaultFixedCostForm(month)
    )

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!formState.description.trim() || Number(formState.amount) <= 0) {
            return
        }

        if (editingAccountId) {
            updateFixedAccount(editingAccountId, {
                ...formState,
                amount: Number(formState.amount),
                type: 'expense',
                isFixed: true,
            })
        } else {
            createFixedAccount({
                ...formState,
                amount: Number(formState.amount),
                type: 'expense',
                isFixed: true,
            })
        }

        setEditingAccountId(null)
        setFormState(getDefaultFixedCostForm(month))
    }

    const startEdit = (account: FixedAccountTemplate) => {
        setEditingAccountId(account.id)
        setFormState(mapFixedAccountToForm(account))
    }

    const cancelEdit = () => {
        setEditingAccountId(null)
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
                        Custos recorrentes impactam o mês atual e todos os meses
                        seguintes até serem encerrados.
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
                        {editingAccountId
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
                            <Label>Mês inicial</Label>
                            <Input
                                type="month"
                                value={formState.date.slice(0, 7)}
                                onChange={({ target }) =>
                                    setFormState((current) => ({
                                        ...current,
                                        date: `${target.value}-01`,
                                    }))
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Status padrão do mês atual</Label>
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
                                {editingAccountId
                                    ? 'Salvar alterações'
                                    : 'Adicionar conta fixa'}
                            </Button>
                            {editingAccountId && (
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
                    <CardDescription>
                        A exclusão é controlada por intervalo para preservar a
                        linha do tempo financeira.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Início</TableHead>
                                <TableHead>Fim</TableHead>
                                <TableHead>Status padrão</TableHead>
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
                                fixedAccounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell>
                                            {account.description}
                                        </TableCell>
                                        <TableCell>
                                            {account.startMonth}
                                        </TableCell>
                                        <TableCell>
                                            {account.endMonth ?? 'Sem fim'}
                                        </TableCell>
                                        <TableCell>
                                            {account.defaultStatus === 'paid'
                                                ? 'Pago'
                                                : 'Pendente'}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency(account.amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        startEdit(account)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            Remover
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Como deseja
                                                                excluir esta
                                                                conta fixa?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Escolha se a
                                                                exclusão vale
                                                                apenas para o
                                                                histórico até
                                                                este mês, para
                                                                os meses futuros
                                                                ou para toda a
                                                                recorrência.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="sm:flex-col sm:items-stretch">
                                                            <AlertDialogCancel>
                                                                Cancelar
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    deleteFixedAccount(
                                                                        account.id,
                                                                        'until-month'
                                                                    )
                                                                }
                                                            >
                                                                Excluir apenas
                                                                até este mês
                                                            </AlertDialogAction>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    deleteFixedAccount(
                                                                        account.id,
                                                                        'from-month'
                                                                    )
                                                                }
                                                            >
                                                                Excluir a partir
                                                                deste mês
                                                            </AlertDialogAction>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    deleteFixedAccount(
                                                                        account.id,
                                                                        'all'
                                                                    )
                                                                }
                                                            >
                                                                Excluir
                                                                definitivamente
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        Nenhuma conta fixa cadastrada.
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
