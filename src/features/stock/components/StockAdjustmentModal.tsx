import { FormEvent, useMemo, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { useCreateStockAdjustment } from '@/features/stock/hooks/mutations/useCreateStockAdjustment'
import {
    StockAdjustmentDirection,
    StockMovementItemType,
} from '@/features/stock/services/stockMovement.model'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { ApiError } from '@/shared/api/client'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemType: StockMovementItemType
    itemId: number
    unitLabel: string
}

function getFriendlyErrorMessage(error: unknown) {
    const apiError = error as ApiError | { errors?: Record<string, string[]> }

    if ('message' in (apiError ?? {}) && apiError.message) {
        return apiError.message
    }

    if ('errors' in (apiError ?? {}) && apiError.errors) {
        const firstErrorKey = Object.keys(apiError.errors)[0]
        const firstError = firstErrorKey
            ? apiError.errors[firstErrorKey]?.[0]
            : null

        if (firstError) return firstError
    }

    return 'Não foi possível registrar a correção de estoque.'
}

export function StockAdjustmentModal({
    open,
    onOpenChange,
    itemType,
    itemId,
    unitLabel,
}: Props) {
    const [direction, setDirection] = useState<StockAdjustmentDirection>('add')
    const [quantityInput, setQuantityInput] = useState('')
    const [unitCostInput, setUnitCostInput] = useState('')
    const [reason, setReason] = useState('')
    const [formMessage, setFormMessage] = useState<string | null>(null)

    const { mutateAsync: createStockAdjustment, isPending } =
        useCreateStockAdjustment()

    const quantity = Number(quantityInput.replace(',', '.'))
    const unitCost = Number(unitCostInput.replace(',', '.'))

    const totalValue = useMemo(() => {
        if (Number.isNaN(quantity) || Number.isNaN(unitCost)) return 0
        return quantity * unitCost
    }, [quantity, unitCost])

    const isValidReason = reason.trim().length >= 3

    const previewMessage =
        direction === 'add'
            ? `Será adicionado ${quantity || 0} ${unitLabel} ao estoque e lançada uma despesa de ${formatCurrency(totalValue || 0)}.`
            : `Será removido ${quantity || 0} ${unitLabel} do estoque e lançado um estorno de ${formatCurrency(totalValue || 0)}.`

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormMessage(null)

        if (Number.isNaN(quantity) || quantity <= 0) return
        if (Number.isNaN(unitCost) || unitCost < 0) return
        if (!isValidReason) return

        try {
            await createStockAdjustment({
                itemType,
                itemId,
                quantity,
                direction,
                unitCost,
                reason: reason.trim(),
            })

            setDirection('add')
            setQuantityInput('')
            setUnitCostInput('')
            setReason('')
            setFormMessage('Correção de estoque registrada com sucesso!')
            onOpenChange(false)
        } catch (error) {
            setFormMessage(getFriendlyErrorMessage(error))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Corrigir estoque</DialogTitle>
                    <DialogDescription>
                        Use esta opção para corrigir lançamentos incorretos. O
                        ajuste será refletido no estoque e no financeiro
                        automaticamente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Tipo de ajuste</Label>
                        <Select
                            value={direction}
                            onValueChange={(value) =>
                                setDirection(value as StockAdjustmentDirection)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o ajuste" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="add">
                                    Adicionar estoque
                                </SelectItem>
                                <SelectItem value="remove">
                                    Remover estoque
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Quantidade</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 3"
                            value={quantityInput}
                            onChange={(event) =>
                                setQuantityInput(
                                    event.target.value.replace(/[^\d,.]/g, '')
                                )
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Custo unitário (R$)</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 5,50"
                            value={unitCostInput}
                            onChange={(event) =>
                                setUnitCostInput(
                                    event.target.value.replace(/[^\d,.]/g, '')
                                )
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Motivo da correção</Label>
                        <Input
                            placeholder="Ex: Correção de lançamento incorreto"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            required
                        />
                    </div>

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        {previewMessage}
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                Number.isNaN(quantity) ||
                                quantity <= 0 ||
                                Number.isNaN(unitCost) ||
                                unitCost < 0 ||
                                !isValidReason
                            }
                        >
                            {isPending ? 'Salvando...' : 'Confirmar correção'}
                        </Button>
                    </DialogFooter>

                    {formMessage && (
                        <p className="text-sm text-muted-foreground">
                            {formMessage}
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
