'use client'

import { useMemo } from 'react'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { useGetRecipeConversions } from '@/features/recipes/hooks/queries/useGetRecipeConversions'
import { useRecipeReferenceSelection } from '@/features/recipes/list/components/molecules/useRecipeReferenceSelection'
import { normalizeMeasurementUnit } from '@/features/ingredients/services/measurementUnits'

type Props = {
    recipe: RecipeModel
    value: number
}

const getBaseUnitShortLabel = (baseUnit: string | number) => {
    const normalized = normalizeMeasurementUnit(baseUnit)

    if (normalized === 'Gram') return 'g'
    if (normalized === 'Milliliter') return 'ml'
    return 'un'
}

export function RecipeStockDisplayCell({ recipe, value }: Props) {
    const { data: conversions } = useGetRecipeConversions(recipe.id, true)

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
        useRecipeReferenceSelection(recipe.id)

    const factor =
        selectedConversion === BASE_OPTION_VALUE
            ? 1
            : (options.find((item) => item.value === selectedConversion)
                  ?.factor ?? 1)

    const label =
        selectedConversion === BASE_OPTION_VALUE
            ? getBaseUnitShortLabel(recipe.baseUnit)
            : (options.find((item) => item.value === selectedConversion)
                  ?.label ?? getBaseUnitShortLabel(recipe.baseUnit))

    const converted = value / factor

    return (
        <span>
            {converted.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}{' '}
            {label}
        </span>
    )
}
