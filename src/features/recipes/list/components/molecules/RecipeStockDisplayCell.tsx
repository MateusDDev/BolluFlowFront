'use client'

import { useMemo } from 'react'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { useGetRecipeConversions } from '@/features/recipes/hooks/queries/useGetRecipeConversions'
import { useRecipeReferenceSelection } from '@/features/recipes/list/components/molecules/useRecipeReferenceSelection'

type Props = {
    recipe: RecipeModel
    value: number
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
            : options.find((item) => item.value === selectedConversion)?.factor ?? 1

    const label =
        selectedConversion === BASE_OPTION_VALUE
            ? 'un'
            : options.find((item) => item.value === selectedConversion)?.label ?? 'un'

    const converted = value / factor

    return (
        <span>
            {converted.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {label}
        </span>
    )
}
