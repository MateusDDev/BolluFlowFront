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
import { useCreateFinancialEntry } from '@/features/finance/hooks/mutations/useCreateFinancialEntry'

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

    const { data: customConversions, isLoading } = useGetSupplyConversions(
        supply.id,
        open
    )

    const { mutateAsync, isPending, error } = useUpdateSupply()

    const { mutateAsync: createFinancialEntry } = useCreateFinancialEntry()

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

        await createFinancialEntry({
            tipo: 'entrada',
            valor: addedInBaseUnit * supply.unitCost,
            descricao: `Entrada automática de compra de insumo: ${supply.name}`,
            origem: 'insumo',
            origem_id: supply.id,
        })

        setQuantityInput('')
        setSelectedConversion(BASE_OPTION_VALUE)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Entrada de estoque</DialogTitle>
                    <DialogDescription>
                        Lance compras por conversao para atualizar o estoque na
                        unidade base.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Conversao</Label>
                        <Select
                            value={selectedConversion}
                            onValueChange={setSelectedConversion}
                            disabled={isLoading || isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma conversao" />
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

                    {!isLoading && availableConversions.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                            Nenhuma conversao personalizada cadastrada.
                        </p>
                    )}

                    <div className="grid gap-2">
                        <Label>Quantidade comprada</Label>
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

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        Sera adicionado ao estoque:{' '}
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
                            {isPending ? 'Salvando...' : 'Adicionar ao estoque'}
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
