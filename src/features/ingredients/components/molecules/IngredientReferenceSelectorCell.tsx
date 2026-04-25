'use client'

import { useEffect, useMemo } from 'react'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { useGetIngredientConversions } from '@/features/ingredients/hooks/queries/useGetIngredientConversions'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { useIngredientReferenceSelection } from '@/features/ingredients/components/molecules/useIngredientReferenceSelection'

type Props = {
    ingredient: IngredientModel
}

export function IngredientReferenceSelectorCell({ ingredient }: Props) {
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

    const { selectedConversion, setSelectedConversion, BASE_OPTION_VALUE } =
        useIngredientReferenceSelection(ingredient.id)

    const isSelectedOptionAvailable =
        selectedConversion === BASE_OPTION_VALUE ||
        options.some((option) => option.value === selectedConversion)

    const resolvedSelectedConversion = isSelectedOptionAvailable
        ? selectedConversion
        : BASE_OPTION_VALUE

    useEffect(() => {
        if (!isSelectedOptionAvailable) {
            setSelectedConversion(BASE_OPTION_VALUE)
        }
    }, [BASE_OPTION_VALUE, isSelectedOptionAvailable, setSelectedConversion])

    return (
        <Select
            value={resolvedSelectedConversion}
            onValueChange={setSelectedConversion}
            disabled={isLoading}
        >
            <SelectTrigger className="h-8 min-w-[180px]">
                <SelectValue placeholder="Referência" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={BASE_OPTION_VALUE}>
                    Base {getMeasurementUnitLabel(ingredient.baseUnit)}
                </SelectItem>

                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
