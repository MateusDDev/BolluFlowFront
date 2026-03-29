'use client'

import { useMemo } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { useGetRecipeConversions } from '@/features/recipes/hooks/queries/useGetRecipeConversions'
import { useRecipeReferenceSelection } from '@/features/recipes/list/components/molecules/useRecipeReferenceSelection'

type Props = {
    recipe: RecipeModel
}

export function RecipeReferenceSelectorCell({ recipe }: Props) {
    const { data: conversions, isLoading } = useGetRecipeConversions(recipe.id, true)

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
        <Select
            value={selectedConversion}
            onValueChange={setSelectedConversion}
            disabled={isLoading}
        >
            <SelectTrigger className="h-8 min-w-[180px]">
                <SelectValue placeholder="Referência" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={BASE_OPTION_VALUE}>Base (un)</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
