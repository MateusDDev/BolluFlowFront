import React, { useMemo, useState } from 'react'
import { useModules } from '@/shared/modules/useModules'
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
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { useGetSupplyConversions } from '@/features/supplies/hooks/queries/useGetSupplyConversions'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { useCreateStockPurchase } from '@/features/stock/hooks/mutations/useCreateStockPurchase'

type Props = {
    supply: SupplyModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

const BASE_OPTION_VALUE = '__base__'

export function SupplyStockEntryModal({ supply, open, onOpenChange }: Props) {
    const [selectedConversion, setSelectedConversion] =
        useState(BASE_OPTION_VALUE)
    const [quantityInput, setQuantityInput] = useState('')
    const [unitCostInput, setUnitCostInput] = useState('')
    const [notes, setNotes] = useState('')
    const [formMessage, setFormMessage] = useState<string | null>(null)
    const { hasModule } = useModules()
    const hasStock = hasModule('stock')

    const { data: customConversions, isLoading } = useGetSupplyConversions(
        supply.id,
        open
    )

    const { mutateAsync: createStockPurchase, isPending } =
        useCreateStockPurchase()

    const availableConversions = useMemo(() => {
        return (customConversions ?? []).map((item) => ({
            value: String(item.id),
            label: item.name,
            quantityInBaseUnit: item.quantityInBaseUnit,
        }))
    }, [customConversions])

    const selectedFactor = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE) return 1

        const conversion = availableConversions.find(
            (option) => option.value === selectedConversion
        )

        return conversion?.quantityInBaseUnit ?? 1
    }, [selectedConversion, availableConversions])

    const quantity = Number(quantityInput.replace(',', '.'))
    const unitCost = Number(unitCostInput.replace(',', '.'))
    const quantityInBaseUnit =
        !Number.isNaN(quantity) && quantity > 0 ? quantity * selectedFactor : 0
    const totalCostPreview =
        !Number.isNaN(quantity) &&
        quantity > 0 &&
        !Number.isNaN(unitCost) &&
        unitCost > 0
            ? quantity * unitCost
            : 0

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormMessage(null)

        if (Number.isNaN(quantity) || quantity <= 0) return
        if (Number.isNaN(unitCost) || unitCost <= 0) return

        const unitCostNormalized =
            selectedConversion === BASE_OPTION_VALUE
                ? unitCost
                : unitCost / selectedFactor

        try {
            await createStockPurchase({
                itemType: 'supply',
                itemId: supply.id,
                movementType: 'purchase',
                quantity: quantityInBaseUnit,
                unitCost: unitCostNormalized,
                notes: notes.trim() || undefined,
            })

            setQuantityInput('')
            setUnitCostInput('')
            setNotes('')
            setSelectedConversion(BASE_OPTION_VALUE)
            setFormMessage('Compra registrada com sucesso!')
            onOpenChange(false)
        } catch {
            setFormMessage(
                'Não foi possível registrar a compra. Tente novamente.'
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Compra de insumo</DialogTitle>
                    <DialogDescription>
                        {hasStock
                            ? 'Registre uma compra para atualizar o estoque.'
                            : 'Registre uma compra. O valor entra como despesa no financeiro.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Compra</Label>
                        <Select
                            value={selectedConversion}
                            onValueChange={setSelectedConversion}
                            disabled={isLoading || isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma compra" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={BASE_OPTION_VALUE}>
                                    Unidade base{' '}
                                    {getMeasurementUnitLabel(supply.baseUnit)}
                                </SelectItem>
                                {availableConversions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label} ={' '}
                                        {option.quantityInBaseUnit}{' '}
                                        {getMeasurementUnitLabel(
                                            supply.baseUnit
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Quantidade</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 2"
                            value={quantityInput}
                            onChange={(e) =>
                                setQuantityInput(
                                    e.target.value.replace(/[^\d,.]/g, '')
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
                            onChange={(e) =>
                                setUnitCostInput(
                                    e.target.value.replace(/[^\d,.]/g, '')
                                )
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Observações</Label>
                        <Input
                            placeholder="Ex: Compra mensal"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        {hasStock && (
                            <p>
                                Será adicionado ao estoque:{' '}
                                <strong>
                                    {quantityInBaseUnit.toLocaleString('pt-BR')}{' '}
                                    {getMeasurementUnitLabel(supply.baseUnit)}
                                </strong>
                            </p>
                        )}
                        <p>
                            Custo total da compra:{' '}
                            <strong>
                                {totalCostPreview.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}
                            </strong>
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                Number.isNaN(quantity) ||
                                quantity <= 0 ||
                                Number.isNaN(unitCost) ||
                                unitCost <= 0
                            }
                        >
                            {isPending ? 'Salvando...' : 'Registrar compra'}
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
