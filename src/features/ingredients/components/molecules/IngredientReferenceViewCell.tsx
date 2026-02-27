'use client'

import { useEffect, useMemo, useState } from 'react'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { useGetIngredientConversions } from '@/features/ingredients/hooks/queries/useGetIngredientConversions'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'

const BASE_OPTION_VALUE = '__base__'

type Props = {
    ingredient: IngredientModel
}

export function IngredientReferenceViewCell({ ingredient }: Props) {
    const [selectedConversion, setSelectedConversion] = useState(BASE_OPTION_VALUE)

    const { data: conversions, isLoading } = useGetIngredientConversions(
        ingredient.id,
        true
    )

    const options = useMemo(
        () =>
            (conversions ?? []).map((item) => ({
                value: String(item.id),
                label: item.name,
                factor: item.quantityInBaseUnit,
            })),
        [conversions]
    )

    useEffect(() => {
        if (!options.length) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedConversion(BASE_OPTION_VALUE)
            return
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedConversion((current) => {
            if (
                current !== BASE_OPTION_VALUE &&
                options.some((item) => item.value === current)
            )
                return current

            return options[0].value
        })
    }, [options])

    const selectedFactor = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE) return 1

        return options.find((item) => item.value === selectedConversion)?.factor ?? 1
    }, [options, selectedConversion])

    const selectedLabel = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE)
            return getMeasurementUnitLabel(ingredient.baseUnit)

        return (
            options.find((item) => item.value === selectedConversion)?.label ??
            getMeasurementUnitLabel(ingredient.baseUnit)
        )
    }, [options, selectedConversion, ingredient.baseUnit])

    const convertedStock = ingredient.stockQuantity / selectedFactor
    const convertedCost = ingredient.unitCost * selectedFactor

    return (
        <div className="grid gap-2 min-w-[220px]">
            <Select
                value={selectedConversion}
                onValueChange={setSelectedConversion}
                disabled={isLoading}
            >
                <SelectTrigger className="h-8">
                    <SelectValue placeholder="Referência" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={BASE_OPTION_VALUE}>
                        Base ({getMeasurementUnitLabel(ingredient.baseUnit)})
                    </SelectItem>

                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="text-xs">
                <p>
                    Estoque: <strong>{convertedStock.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {selectedLabel}</strong>
                </p>
                <p>
                    Custo ref.: <strong>{formatCurrency(convertedCost)}/{selectedLabel}</strong>
                </p>
            </div>
        </div>
    )
}
