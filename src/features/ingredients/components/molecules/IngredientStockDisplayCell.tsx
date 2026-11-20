'use client'

import { useMemo } from 'react'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { useGetIngredientConversions } from '@/features/ingredients/hooks/queries/useGetIngredientConversions'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { useIngredientReferenceSelection } from '@/features/ingredients/components/molecules/useIngredientReferenceSelection'

type Props = {
    ingredient: IngredientModel
    value: number
}

export function IngredientStockDisplayCell({ ingredient, value }: Props) {
    const { data: conversions } = useGetIngredientConversions(
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

    const { selectedConversion, BASE_OPTION_VALUE } =
        useIngredientReferenceSelection(ingredient.id)

    const factor =
        selectedConversion === BASE_OPTION_VALUE
            ? 1
            : (options.find((item) => item.value === selectedConversion)
                  ?.factor ?? 1)

    const label =
        selectedConversion === BASE_OPTION_VALUE
            ? getMeasurementUnitLabel(ingredient.baseUnit)
            : (options.find((item) => item.value === selectedConversion)
                  ?.label ?? getMeasurementUnitLabel(ingredient.baseUnit))

    const converted = value / factor

    return (
        <span>
            {converted.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}{' '}
            {label}
        </span>
    )
}
