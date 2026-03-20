import React, { useMemo, useState } from 'react'
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
import { useUpdateSupply } from '@/features/supplies/hooks/mutations/useUpdateSupply'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { createInventoryPurchase } from '@/features/finance/services/finance.api'

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
    const [totalCostInput, setTotalCostInput] = useState('')

    const { data: customConversions, isLoading } = useGetSupplyConversions(
        supply.id,
        open
    )
    const { mutateAsync, isPending, error } = useUpdateSupply()

    const availableConversions = useMemo(() => {
        return (customConversions ?? []).map((item) => ({
            value: String(item.id),
            label: item.name,
            quantityInBaseUnit: item.quantityInBaseUnit,
        }))
    }, [customConversions])

    const selectedOption = availableConversions.find(
        (option) => option.value === selectedConversion
    )
    const selectedFactor =
        selectedConversion === BASE_OPTION_VALUE
            ? 1
            : (selectedOption?.quantityInBaseUnit ?? 1)
    const selectedLabel =
        selectedConversion === BASE_OPTION_VALUE
            ? `Base unit (${getMeasurementUnitLabel(supply.baseUnit)})`
            : (selectedOption?.label ?? 'Custom conversion')

    const quantity = Number(quantityInput.replace(',', '.'))
    const totalCost = Number(totalCostInput.replace(',', '.'))
    const addedInBaseUnit =
        !isNaN(quantity) && quantity > 0 ? quantity * selectedFactor : 0

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isNaN(quantity) || quantity <= 0) return

        await mutateAsync({
            id: supply.id,
            data: {
                name: supply.name,
                baseUnit: supply.baseUnit,
                unitCost: supply.unitCost,
                stockQuantity: supply.stockQuantity + addedInBaseUnit,
                minimumStockQuantity: supply.minimumStockQuantity,
            },
        })

        if (!isNaN(totalCost) && totalCost > 0) {
            await createInventoryPurchase({
                itemType: 'supply',
                itemId: supply.id,
                itemName: supply.name,
                conversionName: selectedLabel,
                quantity,
                quantityInBaseUnit: addedInBaseUnit,
                totalCost,
                purchasedAt: new Date().toISOString().slice(0, 10),
                notes: 'Supply purchase created from stock replenishment.',
            })
        }

        setQuantityInput('')
        setTotalCostInput('')
        setSelectedConversion(BASE_OPTION_VALUE)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Compra de insumo</DialogTitle>
                    <DialogDescription>
                        Registre uma reposição de estoque usando a conversão
                        selecionada. Quando o custo total for informado, o
                        backend criará a despesa financeira automática.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Unidade de compra</Label>
                        <Select
                            value={selectedConversion}
                            onValueChange={setSelectedConversion}
                            disabled={isLoading || isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma unidade de compra" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={BASE_OPTION_VALUE}>
                                    Unidade base (
                                    {getMeasurementUnitLabel(supply.baseUnit)})
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

                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Quantidade comprada</Label>
                            <Input
                                inputMode="decimal"
                                placeholder="Ex.: 2"
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
                            <Label>Custo total da compra</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Opcional"
                                value={totalCostInput}
                                onChange={(e) =>
                                    setTotalCostInput(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        Reposição no estoque:{' '}
                        <strong>
                            {addedInBaseUnit.toLocaleString('pt-BR')}{' '}
                            {getMeasurementUnitLabel(supply.baseUnit)}
                        </strong>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={
                                isPending || isNaN(quantity) || quantity <= 0
                            }
                        >
                            {isPending
                                ? 'Salvando...'
                                : 'Salvar compra de insumo'}
                        </Button>
                    </DialogFooter>

                    {error && (
                        <p className="text-sm text-red-500">{error.message}</p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
