import React, { useMemo, useState } from 'react'
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
import {
    getDefaultConversionsForBaseUnit,
    getMeasurementUnitLabel,
} from '@/features/ingredients/services/measurementUnits'

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
        if (customConversions?.length) {
            return customConversions.map((item) => ({
                value: String(item.id),
                label: item.name,
                quantityInBaseUnit: item.quantityInBaseUnit,
            }))
        }

        return getDefaultConversionsForBaseUnit(ingredient.baseUnit).map((item) => ({
            value: `default-${item.name}`,
            label: item.name,
            quantityInBaseUnit: item.quantityInBaseUnit,
        }))
    }, [customConversions, ingredient.baseUnit])

    const selectedFactor = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE) return 1

        const selected = availableConversions.find(
            (conversion) => conversion.value === selectedConversion
        )

        return selected?.quantityInBaseUnit ?? 1
    }, [availableConversions, selectedConversion])

    const selectedLabel = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE) {
            return getMeasurementUnitLabel(ingredient.baseUnit)
        }

        const selected = availableConversions.find(
            (conversion) => conversion.value === selectedConversion
        )

        return selected?.label ?? getMeasurementUnitLabel(ingredient.baseUnit)
    }, [availableConversions, ingredient.baseUnit, selectedConversion])

    const convertedAvailable = ingredient.stockQuantity / selectedFactor
    const convertedMinimum = (ingredient.minimumStockQuantity ?? 0) / selectedFactor

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Visualizar estoque em conversão</DialogTitle>
                    <DialogDescription>
                        Visualize o estoque em unidade base ou em uma conversão
                        para facilitar leitura operacional.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Conversão para visualização</Label>
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
                            <span className="text-muted-foreground">Estoque disponível: </span>
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

                    <p className="text-xs text-muted-foreground">
                        Obs.: os valores oficiais continuam salvos na unidade base,
                        esta visão é apenas uma conversão de leitura.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
