'use client'

import { useMemo } from 'react'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { useGetIngredientConversions } from '@/features/ingredients/hooks/queries/useGetIngredientConversions'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useIngredientReferenceSelection } from '@/features/ingredients/components/molecules/useIngredientReferenceSelection'

type Props = {
    ingredient: IngredientModel
}

export function IngredientCostDisplayCell({ ingredient }: Props) {
    const { data: conversions } = useGetIngredientConversions(ingredient.id, true)

    const options = useMemo(
        () =>
            (conversions ?? []).map((item) => ({
                value: String(item.id),
                factor: item.quantityInBaseUnit,
            })),
        [conversions]
    )

    const { selectedConversion, BASE_OPTION_VALUE } =
        useIngredientReferenceSelection(ingredient.id)

    const factor =
        selectedConversion === BASE_OPTION_VALUE
            ? 1
            : options.find((item) => item.value === selectedConversion)?.factor ?? 1

    return <span>{formatCurrency(ingredient.unitCost * factor)}</span>
}
