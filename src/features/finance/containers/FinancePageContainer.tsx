'use client'

import { FormEvent, useState } from 'react'
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
import { Button } from 'ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import { useCreateFinancialEntry } from '@/features/finance/hooks/mutations/useCreateFinancialEntry'

type TypeFilter = FinancialEntryType | 'all'

const originLabelMap: Record<FinancialEntryOrigin, string> = {
    order: 'Pedido',
    supply_purchase: 'Compra de insumo',
    ingredient_purchase: 'Compra de ingrediente',
    manual: 'Manual',
}

export function FinancePageContainer() {
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [manualType, setManualType] = useState<FinancialEntryType>('expense')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')

    const queryType = typeFilter === 'all' ? undefined : typeFilter

    const { data: entries, isLoading: isLoadingEntries, error: entriesError } =
        useGetFinancialEntries(queryType)
    const { data: balance, isLoading: isLoadingBalance, error: balanceError } =
        useGetFinancialBalance()
    const { mutateAsync: createFinancialEntry, isPending: isSavingEntry } =
        useCreateFinancialEntry()

    if (isLoadingEntries || isLoadingBalance) {
        return <p>Carregando financeiro...</p>
    }

    if (entriesError || balanceError) {
        return <p>Não foi possível carregar os dados financeiros.</p>
    }

    const currentBalance = balance?.balance ?? 0

    const handleCreateManualEntry = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        const parsedAmount = Number(amount.replace(',', '.'))

        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) return

        await createFinancialEntry({
            type: manualType,
            amount: parsedAmount,
            description,
        })

        setAmount('')
        setDescription('')
        setManualType('expense')
        setIsDialogOpen(false)
    }

    return (
        <section className="container mx-auto py-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total de Entradas</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold text-green-600">
                        {formatCurrency(balance?.totalIncome ?? 0)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total de Saídas</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold text-red-600">
                        {formatCurrency(balance?.totalExpense ?? 0)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Saldo</CardTitle>
                    </CardHeader>
                    <CardContent
                        className={`text-2xl font-semibold ${
                            currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {formatCurrency(currentBalance)}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Lançamentos</CardTitle>

                    <div className="flex items-center gap-2">
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
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="income">Entrada</SelectItem>
                                    <SelectItem value="expense">Saída</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Novo lançamento manual</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Novo lançamento manual</DialogTitle>
                                    <DialogDescription>
                                        Use este formulário para despesas e receitas
                                        que não são geradas automaticamente pelo
                                        backend.
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    onSubmit={handleCreateManualEntry}
                                    className="space-y-4"
                                >
                                    <div className="grid gap-2">
                                        <Label>Tipo</Label>
                                        <Select
                                            value={manualType}
                                            onValueChange={(value) =>
                                                setManualType(
                                                    value as FinancialEntryType
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="income">
                                                    Entrada
                                                </SelectItem>
                                                <SelectItem value="expense">
                                                    Saída
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Valor</Label>
                                        <Input
                                            inputMode="decimal"
                                            value={amount}
                                            onChange={(event) =>
                                                setAmount(
                                                    event.target.value.replace(
                                                        /[^\d,.]/g,
                                                        ''
                                                    )
                                                )
                                            }
                                            placeholder="Ex: 150,00"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Descrição</Label>
                                        <Input
                                            value={description}
                                            onChange={(event) =>
                                                setDescription(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Ex: Conta de luz"
                                            required
                                        />
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" disabled={isSavingEntry}>
                                            {isSavingEntry
                                                ? 'Salvando...'
                                                : 'Salvar lançamento'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
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
                                                entry.type === 'income'
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
                                                        entry.type === 'income'
                                                            ? 'text-green-600 border-green-600 bg-green-50'
                                                            : 'text-red-600 border-red-600 bg-red-50'
                                                    }
                                                >
                                                    {entry.type === 'income'
                                                        ? 'Entrada'
                                                        : 'Saída'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{entry.description}</TableCell>
                                            <TableCell>
                                                {originLabelMap[entry.origin] ??
                                                    'Manual'}
                                            </TableCell>
                                            <TableCell
                                                className={`text-right font-medium ${
                                                    entry.type === 'income'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {formatCurrency(entry.amount)}
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
