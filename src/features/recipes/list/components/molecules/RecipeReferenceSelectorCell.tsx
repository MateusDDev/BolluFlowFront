'use client'

import { useMemo } from 'react'
import { SearchableSelect } from 'components/SearchableSelect'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { useGetRecipeConversions } from '@/features/recipes/hooks/queries/useGetRecipeConversions'
import { useRecipeReferenceSelection } from '@/features/recipes/list/components/molecules/useRecipeReferenceSelection'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'

type Props = {
    recipe: RecipeModel
}

export function RecipeReferenceSelectorCell({ recipe }: Props) {
    const { data: conversions, isLoading } = useGetRecipeConversions(
        recipe.id,
        true
    )

    const options = useMemo(
        () =>
            (conversions ?? []).map((item) => ({
                value: String(item.id),
                label: item.name,
            })),
        [conversions]
    )

    const { selectedConversion, setSelectedConversion, BASE_OPTION_VALUE } =
        useRecipeReferenceSelection(recipe.id)

    return (
        <SearchableSelect
            options={[
                {
                    value: BASE_OPTION_VALUE,
                    label: `Base ${getMeasurementUnitLabel(recipe.baseUnit)}`,
                },
                ...options,
            ]}
            value={selectedConversion}
            onValueChange={setSelectedConversion}
            disabled={isLoading}
            className="h-8 min-w-[180px]"
            placeholder="Referência"
            searchPlaceholder="Buscar referência..."
            emptyMessage="Nenhuma referência encontrada."
        />
    )
}
