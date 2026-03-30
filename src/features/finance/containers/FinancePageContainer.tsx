'use client'

import { FormEvent, useMemo, useState } from 'react'
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
    FinancialEntryModel,
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
import { useDeleteFinancialEntry } from '@/features/finance/hooks/mutations/useDeleteFinancialEntry'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from 'ui/alert-dialog'
import { Checkbox } from 'ui/checkbox'

type TypeFilter = FinancialEntryType | 'all'

const originLabelMap: Record<FinancialEntryOrigin, string> = {
    order: 'Pedido',
    supply_purchase: 'Compra de insumo',
    ingredient_purchase: 'Compra de ingrediente',
    manual: 'Manual',
}

const monthLabels = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
]

function getMonthYearLabel(month: number, year: number) {
    return `${monthLabels[month - 1]} ${year}`
}

function getYearOptions(currentYear: number) {
    return Array.from({ length: 11 }, (_, index) => currentYear - 5 + index)
}

function isStockPurchaseOrigin(origin: FinancialEntryOrigin) {
    return origin === 'ingredient_purchase' || origin === 'supply_purchase'
}

function getFinancialActionLabel(origin: FinancialEntryOrigin) {
    return isStockPurchaseOrigin(origin) ? 'Desfazer' : 'Excluir'
}

export function FinancePageContainer() {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [manualType, setManualType] = useState<FinancialEntryType>('expense')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedEntry, setSelectedEntry] =
        useState<FinancialEntryModel | null>(null)
    const [shouldRevertStock, setShouldRevertStock] = useState(false)

    const queryType = typeFilter === 'all' ? undefined : typeFilter

    const {
        data: entries,
        isLoading: isLoadingEntries,
        error: entriesError,
    } = useGetFinancialEntries(selectedMonth, selectedYear, queryType)
    const {
        data: balance,
        isLoading: isLoadingBalance,
        error: balanceError,
    } = useGetFinancialBalance(selectedMonth, selectedYear)
    const { mutateAsync: createFinancialEntry, isPending: isSavingEntry } =
        useCreateFinancialEntry()
    const { mutateAsync: deleteFinancialEntry, isPending: isDeletingEntry } =
        useDeleteFinancialEntry()

    const monthYearLabel = getMonthYearLabel(selectedMonth, selectedYear)

    const yearOptions = useMemo(
        () => getYearOptions(currentYear),
        [currentYear]
    )

    const goToPreviousMonth = () => {
        setSelectedMonth((previousMonth) => {
            if (previousMonth === 1) {
                setSelectedYear((previousYear) => previousYear - 1)
                return 12
            }

            return previousMonth - 1
        })
    }

    const goToNextMonth = () => {
        setSelectedMonth((previousMonth) => {
            if (previousMonth === 12) {
                setSelectedYear((previousYear) => previousYear + 1)
                return 1
            }

            return previousMonth + 1
        })
    }

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

    const handleOpenDeleteDialog = (entry: FinancialEntryModel) => {
        setSelectedEntry(entry)
        setShouldRevertStock(false)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteDialogChange = (open: boolean) => {
        setIsDeleteDialogOpen(open)

        if (!open) {
            setSelectedEntry(null)
            setShouldRevertStock(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedEntry) return

        const shouldUseRevertStock =
            isStockPurchaseOrigin(selectedEntry.origin) && shouldRevertStock

        await deleteFinancialEntry({
            id: selectedEntry.id,
            origin: selectedEntry.origin,
            revertStock: shouldUseRevertStock,
        })

        handleDeleteDialogChange(false)
    }

    const dialogActionLabel = selectedEntry
        ? selectedEntry.origin === 'order'
            ? 'Excluir lançamento'
            : getFinancialActionLabel(selectedEntry.origin)
        : 'Excluir'

    return (
        <section className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousMonth}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="min-w-48">
                            {monthYearLabel}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 space-y-3">
                        <div className="grid gap-2">
                            <Label>Mês</Label>
                            <Select
                                value={String(selectedMonth)}
                                onValueChange={(value) =>
                                    setSelectedMonth(Number(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o mês" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthLabels.map((label, index) => (
                                        <SelectItem
                                            key={label}
                                            value={String(index + 1)}
                                        >
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Ano</Label>
                            <Select
                                value={String(selectedYear)}
                                onValueChange={(value) =>
                                    setSelectedYear(Number(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o ano" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={String(year)}
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Entradas do mês</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-2xl font-semibold text-green-600">
                            {formatCurrency(balance?.monthIncome ?? 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Entradas em {monthYearLabel}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Saídas do mês</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-2xl font-semibold text-red-600">
                            {formatCurrency(balance?.monthExpenses ?? 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Saídas em {monthYearLabel}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Saldo acumulado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p
                            className={`text-2xl font-semibold ${
                                currentBalance >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}
                        >
                            {formatCurrency(currentBalance)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Saldo até {monthYearLabel}
                        </p>
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
                                    <SelectItem value="income">
                                        Entrada
                                    </SelectItem>
                                    <SelectItem value="expense">
                                        Saída
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>Novo lançamento manual</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Novo lançamento manual
                                    </DialogTitle>
                                    <DialogDescription>
                                        Use este formulário para despesas e
                                        receitas que não são geradas
                                        automaticamente pelo backend.
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
                                        <Button
                                            type="submit"
                                            disabled={isSavingEntry}
                                        >
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
                                    <TableHead className="text-right">
                                        Valor
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Ações
                                    </TableHead>
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
                                            <TableCell>
                                                {entry.description}
                                            </TableCell>
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
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        handleOpenDeleteDialog(
                                                            entry
                                                        )
                                                    }
                                                >
                                                    {getFinancialActionLabel(
                                                        entry.origin
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            Nenhum lançamento encontrado em{' '}
                                            {monthYearLabel}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={handleDeleteDialogChange}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedEntry &&
                            isStockPurchaseOrigin(selectedEntry.origin)
                                ? 'Desfazer lançamento'
                                : 'Excluir lançamento'}
                        </AlertDialogTitle>

                        <AlertDialogDescription asChild>
                            <div className="space-y-4">
                                {selectedEntry?.origin === 'manual' && (
                                    <div className="space-y-1">
                                        <p>
                                            Tem certeza que deseja excluir este
                                            lançamento?
                                        </p>
                                        <p>Esta ação não pode ser desfeita.</p>
                                    </div>
                                )}

                                {selectedEntry?.origin === 'order' && (
                                    <p>
                                        Este lançamento foi gerado
                                        automaticamente pela confirmação de um
                                        pedido. Excluir remove apenas o registro
                                        financeiro — o pedido não será alterado.
                                    </p>
                                )}

                                {selectedEntry &&
                                    isStockPurchaseOrigin(
                                        selectedEntry.origin
                                    ) && (
                                        <div className="space-y-3">
                                            <p>
                                                Este lançamento foi gerado
                                                automaticamente por uma compra
                                                de estoque.
                                            </p>

                                            <div className="flex items-start gap-2">
                                                <Checkbox
                                                    id="revert-stock"
                                                    checked={shouldRevertStock}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        setShouldRevertStock(
                                                            checked === true
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor="revert-stock"
                                                    className="text-sm font-normal leading-relaxed"
                                                >
                                                    Reverter também o estoque
                                                    <span className="block text-muted-foreground">
                                                        (remove as unidades
                                                        adicionadas por essa
                                                        compra)
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeletingEntry || !selectedEntry}
                            className="bg-destructive text-destructive-foreground"
                        >
                            {isDeletingEntry
                                ? 'Processando...'
                                : dialogActionLabel}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    )
}
