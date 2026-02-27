import React, { useEffect, useMemo, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Label } from 'ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { useGetIngredientConversions } from '@/features/ingredients/hooks/queries/useGetIngredientConversions'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { formatCurrency } from '@/shared/helpers/formatHelper'

type Props = {
    ingredient: IngredientModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

const BASE_OPTION_VALUE = '__base__'

export function IngredientStockViewModal({ ingredient, open, onOpenChange }: Props) {
    const [selectedConversion, setSelectedConversion] = useState(BASE_OPTION_VALUE)

    const { data: customConversions, isLoading } = useGetIngredientConversions(
        ingredient.id,
        open
    )

    const availableConversions = useMemo(() => {
        return (customConversions ?? []).map((item) => ({
            value: String(item.id),
            label: item.name,
            quantityInBaseUnit: item.quantityInBaseUnit,
        }))
    }, [customConversions])

    useEffect(() => {
        if (!open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedConversion(BASE_OPTION_VALUE)
            return
        }

        if (availableConversions.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedConversion((current) => {
                if (
                    current !== BASE_OPTION_VALUE &&
                    availableConversions.some(
                        (conversion) => conversion.value === current
                    )
                )
                    return current

                return availableConversions[0].value
            })
        }
    }, [open, availableConversions])

    const selectedFactor = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE) return 1

        const selected = availableConversions.find(
            (conversion) => conversion.value === selectedConversion
        )

        return selected?.quantityInBaseUnit ?? 1
    }, [availableConversions, selectedConversion])

    const selectedLabel = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE)
            return getMeasurementUnitLabel(ingredient.baseUnit)

        const selected = availableConversions.find(
            (conversion) => conversion.value === selectedConversion
        )

        return selected?.label ?? getMeasurementUnitLabel(ingredient.baseUnit)
    }, [availableConversions, ingredient.baseUnit, selectedConversion])

    const convertedAvailable = ingredient.stockQuantity / selectedFactor
    const convertedMinimum = (ingredient.minimumStockQuantity ?? 0) / selectedFactor
    const convertedReferencePrice = ingredient.unitPrice * selectedFactor

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Visualizar estoque e preço de referência</DialogTitle>
                    <DialogDescription>
                        Quando houver conversão personalizada, ela pode ser usada
                        como referência visual de estoque e precificação.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Conversão de referência</Label>
                        <Select
                            value={selectedConversion}
                            onValueChange={setSelectedConversion}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma conversão" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={BASE_OPTION_VALUE}>
                                    Unidade base ({getMeasurementUnitLabel(ingredient.baseUnit)})
                                </SelectItem>

                                {availableConversions.map((conversion) => (
                                    <SelectItem
                                        key={conversion.value}
                                        value={conversion.value}
                                    >
                                        {conversion.label} = {conversion.quantityInBaseUnit}{' '}
                                        {getMeasurementUnitLabel(ingredient.baseUnit)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded border p-3 grid gap-2 text-sm">
                        <p>
                            <span className="text-muted-foreground">
                                Estoque disponível:{' '}
                            </span>
                            <strong>
                                {convertedAvailable.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                })}{' '}
                                {selectedLabel}
                            </strong>
                        </p>
                        <p>
                            <span className="text-muted-foreground">Estoque mínimo: </span>
                            <strong>
                                {convertedMinimum.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 2,
                                })}{' '}
                                {selectedLabel}
                            </strong>
                        </p>
                    </div>

                    <div className="rounded border p-3 grid gap-1 text-sm">
                        <p className="text-muted-foreground">Preço de referência</p>
                        <p>
                            <strong>
                                {formatCurrency(convertedReferencePrice)} por {selectedLabel}
                            </strong>
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Base oficial: {formatCurrency(ingredient.unitPrice)} por{' '}
                            {getMeasurementUnitLabel(ingredient.baseUnit)}.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
