'use client'

import { useEffect, useMemo } from 'react'
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { useGetSupplyConversions } from '@/features/supplies/hooks/queries/useGetSupplyConversions'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { useSupplyReferenceSelection } from '@/features/supplies/components/molecules/useSupplyReferenceSelection'

type Props = {
    supply: SupplyModel
}

export function SupplyReferenceSelectorCell({ supply }: Props) {
    const { data: conversions, isLoading } = useGetSupplyConversions(supply.id, true)

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
        useSupplyReferenceSelection(supply.id)

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
                    Base ({getMeasurementUnitLabel(supply.baseUnit)})
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
